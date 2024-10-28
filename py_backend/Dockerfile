FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9
RUN apt-get update -y

COPY /app /app
COPY requirements.txt requirements.txt
EXPOSE 8000

RUN apt-get update -y
RUN pip3 install -r requirements.txt

VOLUME ["/app/img"]

CMD ["uvicorn", "main:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "8000"]