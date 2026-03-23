import os


DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@host.docker.internal:5432/pneumonia")
ML_UPLOAD_URL = os.getenv("ML_UPLOAD_URL", "http://ml:9000/upload")
