FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ARG HF_TOKEN
ARG HF_REPO_ID
RUN python -c "\
from huggingface_hub import hf_hub_download; \
hf_hub_download( \
    repo_id='${HF_REPO_ID}', \
    filename='best_model.pth', \
    local_dir='/app', \
    token='${HF_TOKEN}' \
)"

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]