FROM debian:12

ENV APP_PATH = /app/
ENV BOOST_PATH = ${APP_PATH}boost_1_83_0/
ENV CMAKE_PATH = ${APP_PATH}cmake-3.28.1/bin/
ENV MICROHTTPD_LIB_PATH = ${APP_PATH}libmicrohttpd

WORKDIR ${APP_PATH}

# all copy
COPY . .

# preconfiguration environment
RUN apt-get update && \
	apt-get install build-essential libssl-dev -y

# cd to build backend directory
WORKDIR ${APP_PATH}/build

# build backend project 
RUN ${CMAKE_PATH}cmake -DCMAKE_PREFIX_PATH="${BOOST_PATH}" -DMICROHTTPD_LIB_PATH=${MICROHTTPD_LIB_PATH} .. && \ 
	make .

EXPOSE 8888

# run backend
CMD ["./main"]
