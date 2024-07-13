FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

COPY app/main.py /app
COPY requirements.txt requirements.txt
EXPOSE 8000

RUN pip3 install -r requirements.txt

CMD ["uvicorn", "main:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "8000"]