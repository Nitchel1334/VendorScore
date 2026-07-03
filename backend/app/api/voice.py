import os
import json
import tempfile
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_vendor
from app.models.all_models import Vendor

class ExtractRequest(BaseModel):
    transcript: str

router = APIRouter()

# --- Lazy loaded ML models to speed up initial FastAPI startup ---
whisper_model = None
llm = None

def get_whisper():
    global whisper_model
    if whisper_model is None:
        try:
            from faster_whisper import WhisperModel
            print("Loading faster-whisper small model...")
            # Use small model for better multilingual/Hindi accuracy
            whisper_model = WhisperModel("small", device="cpu", compute_type="int8")
            print("Whisper loaded.")
        except Exception as e:
            print(f"Failed to load whisper: {e}")
    return whisper_model

def get_llm():
    global llm
    if llm is None:
        try:
            from llama_cpp import Llama
            import huggingface_hub
            
            # Download a tiny quantized Qwen2.5 0.5B model for extremely fast CPU JSON extraction
            print("Downloading/Loading Qwen2.5-0.5B-Instruct-GGUF...")
            model_path = huggingface_hub.hf_hub_download(
                repo_id="Qwen/Qwen2.5-0.5B-Instruct-GGUF",
                filename="qwen2.5-0.5b-instruct-q4_k_m.gguf"
            )
            llm = Llama(
                model_path=model_path,
                n_ctx=2048, # Context window large enough for instructions
                verbose=False
            )
            print("LLM loaded.")
        except Exception as e:
            print(f"Failed to load LLM: {e}")
    return llm

@router.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_vendor: Vendor = Depends(get_current_vendor)
):
    """
    Receives raw audio via Web MediaRecorder, transcribes using faster-whisper,
    and returns the raw transcript for manual review.
    """
    import logging
    logging.info("Stage 3 - /transcribe endpoint hit.")
    
    # Map vendor's preferred language to Whisper codes (optional)
    lang_map = {
        "Hindi": "hi",
        "Telugu": "te",
        "English": "en",
        "हिंदी": "hi"
    }
    target_lang = lang_map.get(current_vendor.preferred_language, None)
    
    # 1. Save uploaded file to a temporary file
    logging.info(f"Stage 3 - Receiving audio file: {audio.filename}, Content-Type: {audio.content_type}")
    file_ext = ".webm"
    if audio.filename and "." in audio.filename:
        file_ext = "." + audio.filename.split(".")[-1]
        
    with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_audio:
        content = await audio.read()
        temp_audio.write(content)
        temp_audio_path = temp_audio.name
        
    try:
        # 2. Speech-to-Text
        logging.info("Stage 4 - Starting Speech-to-Text")
        stt = get_whisper()
        if not stt:
            raise HTTPException(status_code=500, detail="Speech-to-Text model failed to load locally.")
            
        logging.info("Stage 4 - Transcribing audio...")
        try:
            # Tuning params for Indian context: prompt biases terms and numbers.
            initial_prompt = "Sale, Purchase, Expense. 10 50 100 500 rupees kg pcs UPI Cash. बेचा, खरीदा, खर्च."
            
            kwargs = {
                "beam_size": 5,
                "initial_prompt": initial_prompt,
                "condition_on_previous_text": False
            }
            if target_lang:
                kwargs["language"] = target_lang
                
            segments, info = stt.transcribe(temp_audio_path, **kwargs)
            transcript = " ".join([segment.text for segment in segments]).strip()
        except Exception as e:
            logging.error(f"Stage 4 Error - Transcribe exception: {e}")
            raise HTTPException(status_code=400, detail="Audio file format not supported or corrupted.")
            
        logging.info(f"Stage 4 Success - Transcribed Text:\n↓\n{transcript}\n↓")
        
        if not transcript:
             raise HTTPException(status_code=400, detail="Could not hear anything. Please try again.")

        return {
            "status": "success",
            "transcript": transcript
        }
        
    finally:
        if os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)


@router.post("/extract")
async def extract_transaction(
    req: ExtractRequest,
    db: Session = Depends(get_db),
    current_vendor: Vendor = Depends(get_current_vendor)
):
    """
    Receives a manually verified transcript, runs the Qwen local LLM, 
    and extracts the transaction details as JSON.
    """
    import logging
    transcript = req.transcript
    if not transcript:
        raise HTTPException(status_code=400, detail="Transcript is empty.")
        
    logging.info("Stage 5 - Starting LLM JSON Extraction")
    local_llm = get_llm()
    if not local_llm:
        raise HTTPException(status_code=500, detail="Local LLM failed to load.")
        
    prompt = f"""<|im_start|>system
You are a transaction extraction assistant for Indian street vendors. 
Extract the transaction details from the given text and output ONLY valid JSON. 
Do not guess missing values. If quantity or unit is not explicitly mentioned, you MUST use null. Do NOT copy the amount into the quantity field.

Rules for transaction type:
- "Sale": Vendor sells goods to a customer (money IN). Keywords: sold, sale, received, बेचा, అమ్మాను.
- "Purchase": Vendor buys inventory/stock for resale (money OUT). Keywords: bought, purchased, खरीदा, కొనుగోలు.
- "Expense": Operational spending (transport, fuel, rent, food). Keywords: spent, expense, transport, rent, पेट्रोल, खर्च, ఖర్చు.

Schema:
{{
  "type": "Sale" | "Expense" | "Purchase" | null,
  "product": string | null,
  "quantity": number | null,
  "unit": string | null,
  "amount": number | null,
  "payment_mode": "Cash" | "UPI" | null
}}

Examples:
Text: "Sold 100 rupees of samosas through UPI."
{{"type":"Sale","product":"samosas","quantity":null,"unit":null,"amount":100,"payment_mode":"UPI"}}
Text: "Bought onions for 500 rupees."
{{"type":"Purchase","product":"onions","quantity":null,"unit":null,"amount":500,"payment_mode":null}}
Text: "Spent 300 rupees on transport."
{{"type":"Expense","product":"transport","quantity":null,"unit":null,"amount":300,"payment_mode":null}}
Text: "Sold 2 kg tomatoes for 150 rupees."
{{"type":"Sale","product":"tomatoes","quantity":2,"unit":"kg","amount":150,"payment_mode":null}}
Text: "Sold 5 samosas for 100 rupees."
{{"type":"Sale","product":"samosas","quantity":5,"unit":"pcs","amount":100,"payment_mode":null}}
Text: "बेचा टमाटर 150 रुपये UPI."
{{"type":"Sale","product":"टमाटर","quantity":null,"unit":null,"amount":150,"payment_mode":"UPI"}}
Text: "खरीदा प्याज 500 रुपये."
{{"type":"Purchase","product":"प्याज","quantity":null,"unit":null,"amount":500,"payment_mode":null}}
Text: "ఖర్చు 300 రూపాయలు పెట్రోల్."
{{"type":"Expense","product":"పెట్రోల్","quantity":null,"unit":null,"amount":300,"payment_mode":null}}

Do not include markdown blocks. Output ONLY JSON.<|im_end|>
<|im_start|>user
Text: {transcript}<|im_end|>
<|im_start|>assistant
"""
    
    logging.info("Stage 5 - Running LLM inference...")
    output = local_llm(
        prompt,
        max_tokens=150,
        stop=["<|im_end|>"],
        temperature=0.1
    )
    
    raw_json_str = output["choices"][0]["text"].strip()
    logging.info(f"Stage 5 - Raw LLM Output:\n↓\n{raw_json_str}\n↓")
    
    # Clean up any markdown blocks if the LLM hallucinated them
    if raw_json_str.startswith("```json"):
        raw_json_str = raw_json_str[7:]
    if raw_json_str.startswith("```"):
        raw_json_str = raw_json_str[3:]
    if raw_json_str.endswith("```"):
        raw_json_str = raw_json_str[:-3]
        
    try:
        extracted_data = json.loads(raw_json_str)
        
        # Validation layer: correct obvious transaction type misclassifications based on keywords
        t_lower = transcript.lower()
        sale_keywords = ["sold", "sale", "customer bought", "received", "बेचा", "అమ్మాను"]
        purchase_keywords = ["bought", "purchased", "bought stock", "खरीदा", "కొనుగోలు"]
        expense_keywords = ["spent", "expense", "transport", "rent", "पेट्रोल", "खर्च", "ఖర్చు"]
        
        if any(kw in t_lower for kw in sale_keywords):
            extracted_data["type"] = "Sale"
        elif any(kw in t_lower for kw in purchase_keywords):
            extracted_data["type"] = "Purchase"
        elif any(kw in t_lower for kw in expense_keywords):
            extracted_data["type"] = "Expense"
            
        logging.info(f"Stage 5 Success - Parsed JSON:\n↓\n{json.dumps(extracted_data, indent=2)}\n↓")
    except Exception as e:
        logging.error(f"Stage 5 Error - JSON Parse Error: {e} - Raw output: {raw_json_str}")
        raise HTTPException(status_code=400, detail="Failed to understand the transaction clearly.")
        
    return {
        "status": "success",
        "extracted": extracted_data
    }
