cmake_minimum_required(VERSION 3.21)

project(backend)

set (SOURCES 
	src/main.cpp
	)

set(CMAKE_CXX_STANDARD 17 REQUIRED)

# set_source_files_properties(${MAIN_CPP_FILE} PROPERTIES COMPILE_OPTIONS -g)

set(THREADS_PREFER_PTHREAD_FLAG ON)
find_package(Threads REQUIRED)

find_package(Boost 1.83 REQUIRED COMPONENTS json)

include_directories(${CMAKE_PROJECT_DIR}/include/)

add_executable(main ${SOURCES})

target_link_libraries(main PRIVATE Threads::Threads)

target_link_libraries(main PRIVATE Boost::json)
target_include_directories(main PRIVATE ${Boost_LIBRARIES})

# add httpserver library

if (${MICROHTTPD_LIB_PATH})
	message("Explicit set MICROHTTPD library path: ${MICROHTTPD_LIB_PATH}")
	target_link_directories(main PRIVATE ${MICROHTTPD_LIB_PATH}/lib/)
	target_include_directories(main PRIVATE ${MICROHTTPD_LIB_PATH}/include/)
else()
	target_link_libraries(main PRIVATE libmicrohttpd.so)
	target_include_directories(main PRIVATE microhttpd.h)
endif()

