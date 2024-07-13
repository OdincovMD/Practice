FROM debian:12

WORKDIR /app/

# all copy
COPY . .

# preconfiguration environment
RUN apt-get update && \
  apt-get install build-essential -y && \
  apt-get install libssl1.1 -y 

# cd to build backend directory
WORKDIR /app/build

# build backend project 
RUN LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu/

RUN cmake -DCMAKE_PREFIX_PATH="/app/boost_1_83_0/" -DMICROHTTPD_LIB_PATH=/app/libmicrohttpd .. && \ 
  make .

EXPOSE 8888

# run backend
CMD ["./main"]
