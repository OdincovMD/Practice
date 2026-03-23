FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

COPY requirements.txt .
RUN pip3 install -r requirements.txt

COPY app/ /app/
EXPOSE 8000

CMD ["uvicorn", "main:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "8000"]