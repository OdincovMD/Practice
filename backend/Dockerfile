FROM debian:12

COPY . .

# preconfiguration
RUN apt-get update && \
	apt-get install build-essential libssl-dev -y && \
	apt-get install -y wget

RUN apt-get install perl  -y && \
	apt-get install m4 -y && \
	apt-get install autoconf -y && \
	apt-get install automake -y

WORKDIR /app/

RUN wget https://github.com/Kitware/CMake/releases/download/v3.28.1/cmake-3.28.1.tar.gz && \
	tar -xzf cmake-3.28.1.tar.gz && \
	rm cmake-3.28.1.tar.gz

# boost
RUN apt-get install libboost-all-dev -y

WORKDIR /app/cmake-3.28.1

RUN ./bootstrap && \
	make && \
	make install

WORKDIR /app/

RUN wget https://gitlab.com/libmicrohttpd/libmicrohttpd/-/archive/master/libmicrohttpd-master.tar.gz && \
	tar -xzf libmicrohttpd-master.tar.gz && \
	rm libmicrohttpd-master.tar.gz

# cd libmicrohttpd directory
WORKDIR /app/libmicrohttpd-master

RUN ./bootstrap && \
	make && \
	make install

WORKDIR /app/build

RUN cmake .. && make .

EXPOSE 8888

CMD ["./main"]
