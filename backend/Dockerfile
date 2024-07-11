FROM debian:12

COPY . .

# preconfiguration
RUN apt-get update && \
	apt-get install build-essential libssl-dev -y

RUN wget https://github.com/Kitware/CMake/releases/download/v3.28.1/cmake-3.28.1.tar.gz && \
	tar -xvzf cmake-3.28.1.tar.gz && \
	rm cmake-3.28.1.tar.gz

# boost
RUN apt-get install libboost-all-dev

WORKDIR ./cmake-3.28.1

RUN ./bootstrap && \
	make && \
	make install

WORKDIR ..

RUN wget https://gitlab.com/libmicrohttpd/libmicrohttpd/-/archive/master/libmicrohttpd-master.tar.gz && \
	tar -xvzf libmicrohttpd-master.tar.gz && \
	rm libmicrohttpd-master.tar.gz

# build libmicrohttpd
WORKDIR ./libmicrohttpd-master

RUN ./bootstrap && \
	make && \
	make install

WORKDIR ../build

RUN cmake ..

CMD ["./main"]