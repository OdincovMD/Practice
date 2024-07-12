FROM debian:12

# loaded boost library explicit copy to root directory
COPY ./boost_1_83_0/ /

ENV APP_PATH = /app

WORKDIR ${APP_PATH}
COPY . .

# preconfiguration environment
RUN apt-get update && \
	apt-get install build-essential libssl-dev -y && \
	apt-get install -y wget

# download cmake with github sources
RUN wget https://github.com/Kitware/CMake/releases/download/v3.28.1/cmake-3.28.1.tar.gz && \
	tar -xzf cmake-3.28.1.tar.gz && \
	rm cmake-3.28.1.tar.gz

# cd to cmake origin directory
WORKDIR ${APP_PATH}/cmake-3.28.1

# build cmake from sources
RUN ./bootstrap && \
	make && \
	make install

WORKDIR ${APP_PATH}

# preconfiguration for libmicrohttpd library
RUN wget https://gitlab.com/libmicrohttpd/libmicrohttpd/-/archive/master/libmicrohttpd-master.tar.gz && \
	tar -xzf libmicrohttpd-master.tar.gz && \
	rm libmicrohttpd-master.tar.gz
 
RUN apt-get install perl  -y && \
	apt-get install m4 -y && \
	apt-get install autoconf -y && \
	apt-get install automake -y

# cd to libmicrohttpd origin directory
WORKDIR ${APP_PATH}/libmicrohttpd-master

# build libmicrohttpd from sources
# default configuration
RUN ./bootstrap && \
	make && \
	make install

# cd to build backend directory
WORKDIR ${APP_PATH}/build

# build backend project 
RUN cmake -DCMAKE_PREFIX_PATH=/boost_1_83_0/ .. && make .

EXPOSE 8888

# run backend
CMD ["./main"]
