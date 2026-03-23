# CPU-only PyTorch (~650 MB), без скачивания wheel'ов с download-r2.pytorch.org
FROM inom/pytorch-cpu:python3.12.4-pytorch2.3.1-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY programm/ ./programm/
WORKDIR /app/programm

EXPOSE 9000
CMD ["uvicorn", "classification:app", "--host", "0.0.0.0", "--port", "9000", "--proxy-headers"]
