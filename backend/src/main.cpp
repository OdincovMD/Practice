#include <stdio.h>

#include <functional>
#include <cassert>

#include <httpserver.hpp>

using namespace httpserver;

class main_html_page : public http_resource {
public:
    std::shared_ptr<http_response> render(const http_request&) {
        return std::shared_ptr<http_response>(new file_response("main.html", 200));
    }
};

class general_not_found : public http_resource {
public: 
    std::shared_ptr<http_response> render(const http_request&) {
        return std::shared_ptr<http_response>(new file_response("not_found.html", 200));
    }
};

int main(int argc, char** argv) {
    general_not_found not_found ;
    webserver ws = create_webserver(8080).
        not_found_resource(std::bind(&general_not_found::render, &not_found, std::placeholders::_1));

    main_html_page hwr;
    assert(ws.register_resource("/", &hwr));
    assert(ws.register_resource("/main.html", &hwr));
    ws.start(true);

    // std::getchar();

    ws.stop();
    
    return 0;
}