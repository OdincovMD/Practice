FROM debian:12

COPY . .

# preconfiguration
RUN apt-get update && \
	apt-get install build-essential libssl-dev -y

RUN wget https://github.com/Kitware/CMake/releases/download/v3.28.1/cmake-3.28.1.tar.gz && \
	tar -xzf cmake-3.28.1.tar.gz -y && \
	rm cmake-3.28.1.tar.gz

# boost
RUN apt-get install libboost-all-dev

RUN ./cmake-3.28.1

RUN ./bootstrap && \
	make && \
	make install

WORKDIR ..

RUN wget https://gitlab.com/libmicrohttpd/libmicrohttpd/-/archive/master/libmicrohttpd-master.tar.gz && \
	tar -xzf libmicrohttpd-master.tar.gz -y && \
	rm libmicrohttpd-master.tar.gz

# cd libmicrohttpd directory
RUN cd ./libmicrohttpd-master

RUN ./bootstrap && \
	make && \
	make install

WORKDIR ../build

RUN cmake .. && make .

EXPOSE 8888

CMD ["./main"]
