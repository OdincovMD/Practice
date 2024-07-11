FROM debian:12

ENV INIT_PATH = /app

WORKDIR = ${INIT_PATH}

COPY . .

# preconfiguration
RUN apt-get update -y && \
	apt-get install build-essential libssl-dev -y && \
	apt-get install -y wget

RUN wget https://github.com/Kitware/CMake/releases/download/v3.28.1/cmake-3.28.1.tar.gz && \
	tar -xvzf cmake-3.28.1.tar.gz && \
	rm cmake-3.28.1.tar.gz

# boost
RUN apt-get install libboost-json-dev -y

WORKDIR ${INIT_PATH}/cmake-3.28.1

RUN ./bootstrap && \
	make && \
	make install

WORKDIR ${INIT_PATH}

RUN wget https://gitlab.com/libmicrohttpd/libmicrohttpd/-/archive/master/libmicrohttpd-master.tar.gz && \
	tar -xvzf libmicrohttpd-master.tar.gz && \
	rm libmicrohttpd-master.tar.gz

# build libmicrohttpd
WORKDIR ${INIT_PATH}/libmicrohttpd-master

RUN ./bootstrap && \
	make && \
	make install

WORKDIR ${INIT_PATH}/build

RUN cmake ..

EXPOSE 8888

CMD ["./main"]
