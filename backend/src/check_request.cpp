#include <sys/types.h>

#include <sys/select.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <fcntl.h>


#include <string.h>
#include <microhttpd.h>
#include <stdio.h>

#include <iostream>
#include <string>

#define PORT 8888

const char* NOT_FOUND = "NOT FOUND";
const char* ERROR_PAGE = "ERROR_PAGE";

enum MHD_Result SendPage(
  struct MHD_Connection *connection, uint16_t http_status_code,
  std::string page, enum MHD_ResponseMemoryMode MemoryMODE = MHD_RESPMEM_PERSISTENT)
{
  enum MHD_Result ret;
  struct MHD_Response *response;

  std::string page_name = HTML_SRC_PATH;
  if (page.compare("/") == 0)
  {
    page_name.append("index.html");
    // send default response in server
  } else
  {
    page_name.append(page);
  }

  struct stat file_buf;
  int file_desc;
  if( (file_desc = open(page_name.c_str(), O_RDONLY)) != -1 &&
    fstat(file_desc, &file_buf) == 0)
  {
    response = MHD_create_response_from_fd(file_buf.st_size, file_desc);

    if (response == NULL)
    {
      std::cerr << "SendPage(): Failed to create response!";
      close(file_desc);
      return MHD_NO;
    }

  } else 
  { 
    if (errno == ENOENT) // no such file or directory
    {
      // std::cerr << page_name << ": no such file or directory!\n";
      response = MHD_create_response_from_buffer(strlen(NOT_FOUND),
        (void*) NOT_FOUND, MHD_RESPMEM_PERSISTENT);

      if (response == NULL)
      {
        std::cerr << "SendPage(): Failed to create response!";
        return MHD_NO;
      }

      http_status_code = MHD_HTTP_NOT_FOUND;

    } else 
    {

      perror("SendPage(): Internal error");

      response = MHD_create_response_from_buffer(strlen(ERROR_PAGE),
        (void*) ERROR_PAGE, MHD_RESPMEM_PERSISTENT);

      if (response == NULL)
      {
        std::cerr << "SendPage(): Failed to create response!";
        return MHD_NO;
      }

      http_status_code = MHD_HTTP_INTERNAL_SERVER_ERROR;

    }
  }
  // AddHeaderCookie(session, response);

  ret = MHD_queue_response (connection, http_status_code, response);

  MHD_destroy_response (response);
  
  return ret;
};

static enum MHD_Result
answer_to_connection (void *cls, struct MHD_Connection *connection,
                      const char *url, const char *method,
                      const char *version, const char *upload_data,
                      size_t *upload_data_size, void **con_cls)
{
  // const char *page = "<html><body>Hello, browser!</body></html>";
  struct MHD_Response *response;
  enum MHD_Result ret;
  (void) cls;               /* Unused. Silent compiler warning. */
  (void) url;               /* Unused. Silent compiler warning. */
  (void) method;            /* Unused. Silent compiler warning. */
  (void) version;           /* Unused. Silent compiler warning. */
  (void) upload_data;       /* Unused. Silent compiler warning. */
  (void) upload_data_size;  /* Unused. Silent compiler warning. */
  (void) con_cls;           /* Unused. Silent compiler warning. */

  std::cout << url << '\n';

  return SendPage(connection, 200, "index.html");

}

int main (void)
{
  struct MHD_Daemon *daemon;

  daemon = MHD_start_daemon (MHD_USE_AUTO | MHD_USE_INTERNAL_POLLING_THREAD,
                             PORT, NULL, NULL,
                             &answer_to_connection, NULL, MHD_OPTION_END);
  if (NULL == daemon)
    return 1;

  (void) getchar ();

  MHD_stop_daemon (daemon);
  return 0;
}