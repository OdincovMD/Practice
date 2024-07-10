cmake_minimum_required(VERSION 3.21)

project(backend)

set (SOURCES 
	src/main.cpp
	# src/check/request.cpp
	)

set(CMAKE_CXX_STANDARD 17 REQUIRED)

# set_source_files_properties(${MAIN_CPP_FILE} PROPERTIES COMPILE_OPTIONS -g)

set(THREADS_PREFER_PTHREAD_FLAG ON)
find_package(Threads REQUIRED)

find_package(Boost 1.83 REQUIRED COMPONENTS json)

set(LIBHTTPSERVER_PATH /home/pasha/libhttpserver/build)

# add httpserver header
add_compile_definitions(HTML_SRC_PATH="${CMAKE_SOURCE_DIR}/../frontend/build/")

include_directories(${CMAKE_PROJECT_DIR}/include/)

add_executable(main ${SOURCES})

target_link_libraries(main PRIVATE Threads::Threads)
target_link_libraries(main PRIVATE microhttpd)

target_link_libraries(main PRIVATE Boost::json)
target_include_directories(main PRIVATE ${Boost_LIBRARIES})
# add httpserver library
# target_link_libraries(main PRIVATE ${LIBHTTPSERVER_PATH}/lib/libhttpserver.so)
# target_include_directories(main PRIVATE ${LIBHTTPSERVER_PATH}/include/)

