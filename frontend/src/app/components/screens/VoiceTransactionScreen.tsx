/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, RotateCcw, Check, Edit3, X, Zap, ArrowRight, Save } from "lucide-react";
import { ScreenHeader } from "../shared/ScreenHeader";
import { transcribeVoice, extractVoiceTransaction, createTransaction } from "../../lib/api";

interface Props {
  navigate: (screen: string) => void;
}

type RecordState = "idle" | "starting" | "recording" | "transcribing" | "review_transcript" | "extracting" | "confirming" | "saved";

export function VoiceTransactionScreen({ navigate }: Props) {
  const [state, setState] = useState<RecordState>("idle");
  const [timer, setTimer] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const [transcript, setTranscript] = useState("");
  const [formData, setFormData] = useState({
    type: "Sale",
    product: "",
    quantity: 1,
    unit: "kg",
    amount: 0,
    payment_mode: "Cash",
  });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (state === "recording") {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [state]);

  const startRecording = async () => {
    try {
      setErrorMsg("");
      setState("starting");
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser does not support audio recording.");
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const mimeType = mediaRecorderRef.current?.mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioBlob.size === 0) {
          setErrorMsg("Failed to capture audio. The recording was empty.");
          setState("idle");
          return;
        }
        await uploadAudio(audioBlob);
      };

      mediaRecorder.start();
      setState("recording");
      setTimer(0);
    } catch (err: any) {
      setErrorMsg(`Mic Error: ${err.message || "Permission denied."}`);
      setState("idle");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
      setState("transcribing");
    }
  };

  const uploadAudio = async (audioBlob: Blob) => {
    const token = localStorage.getItem("authToken");
    if (!token) return navigate("login");

    try {
      const resp = await transcribeVoice(token, audioBlob);
      if (resp.error || !resp.data) {
        setErrorMsg(resp.error || "Failed to transcribe audio.");
        setState("idle");
        return;
      }
      setTranscript(resp.data.transcript);
      setState("review_transcript");
    } catch (e) {
      setErrorMsg("An error occurred during transcription.");
      setState("idle");
    }
  };

  const handleExtract = async () => {
    setState("extracting");
    const token = localStorage.getItem("authToken");
    if (!token) return navigate("login");

    try {
      const resp = await extractVoiceTransaction(token, transcript);
      if (resp.error || !resp.data) {
        setErrorMsg(resp.error || "We couldn't understand the transaction clearly.");
        setState("review_transcript");
        return;
      }
      const data = (resp.data as any).extracted;
      setFormData({
        type: data.type || "Sale",
        product: data.product || "",
        quantity: data.quantity !== null && data.quantity !== undefined ? data.quantity : "",
        unit: data.unit || "",
        amount: data.amount !== null && data.amount !== undefined ? data.amount : "",
        payment_mode: data.payment_mode || "Cash",
      });
      setState("confirming");
    } catch (e) {
      setErrorMsg("Failed to extract details. Please edit transcript and try again.");
      setState("review_transcript");
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const payload = {
        type: formData.type,
        amount: Number(formData.amount) || 0,
        transaction_date: new Date().toISOString().split('T')[0],
        payment_mode: formData.payment_mode,
        category: formData.product || "General",
        notes: `Voice Transcript: ${transcript}`,
        quantity: Number(formData.quantity) || 1
      };
      await createTransaction(token, payload);
      setState("saved");
      setTimeout(() => navigate("dashboard"), 1500);
    } catch (err) {
      setErrorMsg("Failed to save transaction.");
    }
  };

  const handleMicPress = () => {
    if (state === "idle") startRecording();
    else if (state === "recording") stopRecording();
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="flex flex-col min-h-full bg-background relative overflow-y-auto">
      <ScreenHeader
        title="Voice Entry"
        subtitle="Speak your transaction"
        onBack={() => navigate("dashboard")}
      />

      <div className="flex-1 flex flex-col items-center px-6 py-4 gap-4">
        
        {/* Error message */}
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm w-full text-center">
            {errorMsg}
          </div>
        )}

        {/* Phase 1: Record */}
        {(state === "idle" || state === "starting" || state === "recording" || state === "transcribing") && (
          <div className="w-full flex flex-col items-center flex-1">
            
            {/* Guided Instructions */}
            {state === "idle" && (
              <div className="w-full bg-card border border-border rounded-2xl p-5 mb-8 shadow-sm">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Mic size={18} className="text-primary" />
                  Speak one transaction at a time.
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-green-600 uppercase tracking-wider bg-green-50 px-2 py-1 rounded">Sale</span>
                    <p className="text-sm italic text-muted-foreground mt-1">"बेचा टमाटर 2 किलो 150 रुपये UPI"</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">Purchase</span>
                    <p className="text-sm italic text-muted-foreground mt-1">"खरीदा प्याज 10 किलो 500 रुपये"</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-1 rounded">Expense</span>
                    <p className="text-sm italic text-muted-foreground mt-1">"खर्च पेट्रोल 300 रुपये"</p>
                  </div>
                </div>
              </div>
            )}

            {/* Mic Button Area */}
            <div className="flex flex-col items-center gap-4 py-8 flex-1 justify-center">
              <div className="relative flex items-center justify-center">
                {state === "recording" && (
                  <>
                    <div className="absolute w-40 h-40 rounded-full border-2 border-primary/20 animate-ping pointer-events-none" />
                    <div className="absolute w-32 h-32 rounded-full border-2 border-primary/30 animate-pulse pointer-events-none" />
                  </>
                )}
                {(state === "transcribing") && (
                  <>
                    <div className="absolute w-40 h-40 rounded-full border-2 border-accent/20 animate-spin pointer-events-none" style={{ animationDuration: "3s" }} />
                    <div className="absolute w-32 h-32 rounded-full border-2 border-accent/40 animate-pulse pointer-events-none" />
                  </>
                )}
                
                <button
                  id="mic-button"
                  onClick={handleMicPress}
                  disabled={state === "starting" || state === "transcribing"}
                  className={`w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 ${
                    state === "recording"
                      ? "bg-red-500 shadow-red-200"
                      : state === "transcribing" || state === "starting"
                      ? "bg-accent shadow-amber-200"
                      : "bg-primary shadow-primary/30"
                  }`}
                >
                  {state === "transcribing" || state === "starting" ? (
                    <Zap size={40} className="text-white animate-pulse" />
                  ) : state === "recording" ? (
                    <MicOff size={40} className="text-white" />
                  ) : (
                    <Mic size={40} className="text-white" />
                  )}
                </button>
              </div>

              {/* Status text */}
              <div className="text-center mt-4">
                {state === "idle" && (
                  <p style={{ fontSize: "1.1rem", fontWeight: 700 }}>Tap to Record</p>
                )}
                {state === "recording" && (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 justify-center mb-1">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <p className="text-red-500 font-bold" style={{ fontSize: "1.1rem" }}>🎤 Listening...</p>
                    </div>
                    <p className="text-foreground font-mono font-bold tracking-widest mt-1" style={{ fontSize: "2.5rem" }}>
                      {formatTime(timer)}
                    </p>
                    <button 
                      onClick={stopRecording}
                      className="mt-6 px-8 py-3.5 bg-red-600 text-white rounded-full font-bold shadow-lg shadow-red-500/50 active:scale-95 transition-all w-full max-w-[200px]"
                    >
                      STOP RECORDING
                    </button>
                  </div>
                )}
                {state === "transcribing" && (
                  <p className="text-accent font-bold" style={{ fontSize: "1.1rem" }}>📝 Transcribing...</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Phase 2: Review Transcript */}
        {(state === "review_transcript" || state === "extracting") && (
          <div className="w-full flex flex-col flex-1 animate-in slide-in-from-right-4">
            <h3 className="font-bold text-foreground mb-4">You said:</h3>
            <textarea
              className="w-full p-4 bg-card border border-border rounded-xl min-h-[150px] text-foreground resize-none focus:outline-none focus:border-primary transition-colors text-lg shadow-sm"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              disabled={state === "extracting"}
            />
            
            <div className="mt-auto pt-6 flex flex-col gap-3">
              {state === "extracting" ? (
                <div className="flex items-center justify-center gap-3 p-4 bg-accent/10 rounded-xl border border-accent/20">
                  <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                  <span className="text-accent font-bold">🤖 Understanding Transaction...</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleExtract}
                    className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    Continue
                    <ArrowRight size={20} />
                  </button>
                  <button
                    onClick={() => { setState("idle"); setTimer(0); }}
                    className="w-full py-4 rounded-xl border border-border text-muted-foreground font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <RotateCcw size={20} />
                    Record Again
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Phase 3: Confirm Fields */}
        {state === "confirming" && (
          <div className="w-full flex flex-col flex-1 pb-6 animate-in slide-in-from-right-4">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">✓</span>
              <h3 className="font-bold text-foreground text-lg">Ready for Confirmation</h3>
            </div>

            <div className="space-y-4 bg-card p-5 rounded-2xl border border-border shadow-sm mb-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</label>
                  <select 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full mt-1 p-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="Sale">Sale</option>
                    <option value="Purchase">Purchase</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Mode</label>
                  <select 
                    value={formData.payment_mode} 
                    onChange={e => setFormData({...formData, payment_mode: e.target.value})}
                    className="w-full mt-1 p-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Product / Item</label>
                <input 
                  type="text"
                  value={formData.product} 
                  onChange={e => setFormData({...formData, product: e.target.value})}
                  className="w-full mt-1 p-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary text-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quantity</label>
                  <input 
                    type="number"
                    value={formData.quantity ?? ""} 
                    onChange={e => setFormData({...formData, quantity: e.target.value === "" ? "" : parseFloat(e.target.value)})}
                    className="w-full mt-1 p-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary text-lg font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Unit</label>
                  <input 
                    type="text"
                    value={formData.unit} 
                    onChange={e => setFormData({...formData, unit: e.target.value})}
                    className="w-full mt-1 p-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Amount (₹)</label>
                <input 
                  type="number"
                  value={formData.amount ?? ""} 
                  onChange={e => setFormData({...formData, amount: e.target.value === "" ? "" : parseFloat(e.target.value)})}
                  className="w-full mt-1 p-3 bg-background border-2 border-primary/50 rounded-lg text-foreground focus:outline-none focus:border-primary text-2xl font-bold font-mono"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-auto">
              <button
                onClick={() => { setState("idle"); setTimer(0); }}
                className="flex-1 py-4 rounded-xl border border-border text-muted-foreground font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-[2] py-4 rounded-xl bg-green-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-600/30 active:scale-95 transition-all"
              >
                <Save size={20} />
                Save Transaction
              </button>
            </div>
          </div>
        )}

        {state === "saved" && (
          <div className="absolute inset-0 bg-green-50 flex flex-col items-center justify-center gap-4 z-30">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <Check size={40} className="text-green-600" />
            </div>
            <p className="font-bold text-green-800 text-xl">Saved Successfully!</p>
          </div>
        )}

      </div>
    </div>
  );
}
