FROM python:3.11-slim

WORKDIR /app

# Install system dependencies required for faster-whisper, llama-cpp-python, and psycopg2
RUN apt-get update && apt-get install -y \
    build-essential \
    ffmpeg \
    libsm6 \
    libxext6 \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir faster-whisper llama-cpp-python python-multipart pydub huggingface_hub

COPY backend/ .

EXPOSE 8000

# Download models on build to cache them in the Docker image
RUN python -c "from faster_whisper import WhisperModel; WhisperModel('base', device='cpu', compute_type='int8')"
RUN python -c "import huggingface_hub; huggingface_hub.hf_hub_download(repo_id='Qwen/Qwen2.5-0.5B-Instruct-GGUF', filename='qwen2.5-0.5b-instruct-q4_k_m.gguf')"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
