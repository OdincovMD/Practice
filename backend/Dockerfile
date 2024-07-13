FROM debian:12

WORKDIR /app/

# all copy
COPY . .

# preconfiguration environment
RUN apt-get update && \
  apt-get install build-essential -y && \
  apt-get install libssl-dev -y && \

# cd to cmake sources directory
WORKDIR /app/cmake

# build cmake with default configuration
RUN ./bootstrap && make . && make install 

# cd to build backend directory
WORKDIR /app/build

# build backend project 
RUN cmake -DCMAKE_PREFIX_PATH="/app/boost_1_83_0/" -DMICROHTTPD_LIB_PATH=/app/libmicrohttpd .. && \ 
  make .

EXPOSE 8888

# run backend
CMD ["./main"]