FROM pytorch/pytorch

RUN apt-get update && apt-get install libgl1 -y

COPY ./programm/ ./programm/
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

EXPOSE 9000
WORKDIR ./programm
CMD ["uvicorn", "classification:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "9000"]