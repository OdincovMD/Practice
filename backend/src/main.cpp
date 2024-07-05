#include <stdio.h>

#include <httpserver.hpp>

using namespace httpserver;

class hello_world_resource : public http_resource {
public:
    std::shared_ptr<http_response> render(const http_request&) {
        return std::shared_ptr<http_response>(new string_response("<html><body>Hello, World!</body></html>"));
    }
};

int main(int argc, char** argv) {
    webserver ws = create_webserver(8080);

    hello_world_resource hwr;
    ws.register_resource("/", &hwr);
    ws.start(true);
    
    return 0;
}