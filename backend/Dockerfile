# FROM debian:12

# ENV INIT_PATH = /app

# WORKDIR = ${INIT_PATH}

# COPY . .

# # preconfiguration
# RUN apt-get update -y && \
# 	apt-get install build-essential libssl-dev -y && \
# 	apt-get install -y wget

# RUN wget https://github.com/Kitware/CMake/releases/download/v3.28.1/cmake-3.28.1.tar.gz && \
# 	tar -xfz cmake-3.28.1.tar.gz && \
# 	rm cmake-3.28.1.tar.gz

# # boost
# RUN apt-get install libboost-all-dev -y

# WORKDIR ${INIT_PATH}/cmake-3.28.1

# RUN pwd
# RUN ls

# RUN bash ./bootstrap && \
# 	make && \
# 	make install

# WORKDIR ${INIT_PATH}

# RUN wget https://gitlab.com/libmicrohttpd/libmicrohttpd/-/archive/master/libmicrohttpd-master.tar.gz && \
# 	tar -xfz libmicrohttpd-master.tar.gz && \
# 	rm libmicrohttpd-master.tar.gz

# # build libmicrohttpd
# WORKDIR ${INIT_PATH}/libmicrohttpd-master

# RUN pwd
# RUN ls

# RUN bash ./bootstrap && \
# 	make && \
# 	make install

# WORKDIR ${INIT_PATH}/build

# RUN cmake ..

# EXPOSE 8888

# CMD ["./main"]

FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

COPY app/main.py /app
COPY requirements.txt requirements.txt
EXPOSE 8000
ENV IS_IN_DOCKER=true

RUN pip3 install -r requirements.txt

CMD ["uvicorn", "main:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "8000"]