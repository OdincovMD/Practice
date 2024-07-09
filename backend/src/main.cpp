#include <sys/types.h>
#include <sys/select.h>
#include <sys/socket.h>
#include <string.h>
#include <stdlib.h>

#include <microhttpd.h>

#include <functional>
#include <cassert>
#include <string_view>
#include <algorithm>

#include <boost/json/stream_parser.hpp>

using boost::json;

#define PORT            8888
#define POSTBUFFERSIZE  512
#define MAXNAMESIZE     20
#define MAXANSWERSIZE   512

enum {
	GET,
	POST,
	HEAD
};

enum{
	LOGIN,
	REGISTER,
	FILE
}

struct ParticipantInfo
{
	std::string name;
	std::string surname;
	std::string login;
	std::string passw;
};

struct connection_info_struct
{
	int operation_type = -1;	
	ParticipantInfo* client = nullptr;

	std::function<MHD_Result(const char*, size_t, ParticipantInfo&)> PostProcess;
	bool isCompleted() const
	{
		if ((operation_type == REGISTER && (name.empty() || surname.empty())) ||
				login.empty() || passw.empty())
		{
			return false;
		}

		return true;
	};

	static stream_parser json_parser;
};
stream_parser connection_info_struct::json_parser;

bool CheckJsonSyntax(std::string_view str_needed_check)
{	
	static const char available_chars[] = "abcdefghijklmnopqrstuvwxyz
		ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890\"\'\\/\b\r\n\t\b\u\f{}[]";
	static const size_t len = strlen(available_chars);

	return std::find_first_of(str_needed_check.begin(), str_needed_check.end(),
		available_chars, available_chars + len) == str_needed_check.end() ? true : false;
};

MHD_Result ReceiveFile(const char* data, size_t data_size, ParticipantInfo& client)
{
	if (data_size > 0)
	{
		if (!CheckJsonSyntax(data))
		{
			return MHD_NO;
		}
	}

	return MHD_YES;
};

MHD_Result LoginProcess(const char* data, size_t data_size, ParticipantInfo& client)
{
	if (data_size > 0)
	{
		if (!CheckJsonSyntax(data))
		{
			return MHD_NO;
		}
	}
	return MHD_YES;
};

MHD_Result RegisterProcess(const char* data, size_t data_size, ParticipantInfo& client)
{
	if (data_size > 0)
	{
		if (!CheckJsonSyntax(data))
		{
			return MHD_NO;
		}
	}

	return MHD_YES;
};

// get second parameter of function

template <typename HTTP_CODE_T>
MHD_Result SendBadRequest(HTTP_CODE_T http_code)
{
	response =
		MHD_create_response_from_buffer (strlen (""), (void *)"",
									 MHD_RESPMEM_PERSISTENT);
  	if (!response)
  	{
		return MHD_NO;
  	}

	ret = MHD_queue_response (connection, MHD_HTTP_BAD_REQUEST, response);
	
	MHD_destroy_response (response);	
	return ret;
};

MHD_Result
SendPage (struct MHD_Connection *connection, const char *page, .. code)
{
  enum MHD_Result ret;
  struct MHD_Response *response;


  response =
	MHD_create_response_from_buffer (strlen (page), (void *) page,
									 MHD_RESPMEM_PERSISTENT);
  if (!response)
	return MHD_NO;

  ret = MHD_queue_response (connection, MHD_HTTP_OK, response);
  MHD_destroy_response (response);

  return ret;
}


// MHD_Result iterate_post (void *coninfo_cls, enum MHD_ValueKind kind, const char *key,
// 			  const char *filename, const char *content_type,
// 			  const char *transfer_encoding, const char *data, uint64_t off,
// 			  size_t size)
// {
// 	struct connection_info_struct *con_info = coninfo_cls;
// 	(void) kind;               /* Unused. Silent compiler warning. */
// 	(void) filename;           /* Unused. Silent compiler warning. */
// 	(void) content_type;       /* Unused. Silent compiler warning. */
// 	(void) transfer_encoding;  /* Unused. Silent compiler warning. */
// 	(void) off;                /* Unused. Silent compiler warning. */

// 	if (0 == strcmp (key, "name"))
// 	{
// 		if ((size > 0) && (size <= MAXNAMESIZE))
// 		{
// 		  char *answerstring;
// 		  answerstring = malloc (MAXANSWERSIZE);
// 		  if (!answerstring)
// 			return MHD_NO;

// 		  snprintf (answerstring, MAXANSWERSIZE, greetingpage, data);
// 		  con_info->answerstring = answerstring;
// 		}
// 		else
// 		  con_info->answerstring = NULL;

// 		return MHD_NO;
// 	}

// 	return MHD_YES;
// }

static void
request_completed (void *cls, struct MHD_Connection *connection,
				   void **con_cls, enum MHD_RequestTerminationCode toe)
{
	struct connection_info_struct* con_info = *con_cls;
	(void) cls;         /* Unused. Silent compiler warning. */
	(void) connection;  /* Unused. Silent compiler warning. */
	(void) toe;         /* Unused. Silent compiler warning. */

	if (NULL == con_info)
	{
		return;
	}

	if (con_info->client)
	{
		delete client;
	}

	delete con_info;
	*con_cls = NULL;
}

MHD_Result answer_to_connection (void *cls, struct MHD_Connection *connection,
					  const char *url, const char *method,
					  const char *version, const char *upload_data,
					  size_t *upload_data_size, void **con_cls)
{
	(void) cls;               /* Unused. Silent compiler warning. */
	(void) url;               /* Unused. Silent compiler warning. */
	(void) version;           /* Unused. Silent compiler warning. */

	if (NULL == *con_cls)
	{
		struct connection_info_struct* con_info = new struct connection_info_struct;
		if (NULL == con_info)
		{
			return MHD_NO;
		}

		if (0 == strcmp (method, "POST"))
		{
			con_info->connectiontype = POST;
		} else
		{
		  con_info->connectiontype = GET;
		}

		*con_cls = (void *) con_info;

		return MHD_YES;
	}

	if (0 == strcmp (method, "POST"))
	{
		struct MHD_Connection* con_info = *con_cls;

		const char* c_op_typ = MHD_lookup_connection_value(connection, 
			MHD_HEADER_KING, "type");
		if (!c_op_type) // NULL
		{
			return SendPage("HEADER <type> is needed!", MHD_HTTP_BAD_REQUEST);
		}

		std::string_view op_type(c_op_type);
		if (op_type)

		if (op_type.compare("login"))
		{
			con_info->PostProcess = &LoginProcess;
		} else if (op_type.compare("register"))
		{
			con_info->PostProcess = &RegisterProcess;
		} else if (op_type.compare("file"))
		{
			con_info->PostProcess = &ReceiveFile;
		} else 
		{
			return SendBadRequest(connection);
		}

		if (*upload_data_size != 0)
		{
			con_info->PostProcess(upload_data, *upload_data_size, *con_info->client);
			*upload_data_size = 0;

			return MHD_YES;
		} 

		// data were process
		if (!con_info->client->isCompleted())
		{
			return MHD_NO;
		}
		connection_info_struct::json_parser.reset();
	}

	return MHD_YES;
}

MHD_Daemon StartWebserver(unsigned int flags, unsigned short port, 
	MHD_AcceptPolicyCallback apc, void *apc_cls, 
	MHD_AccessHandlerCallback dh, void *dh_cls, ...)
{
	if (flags & MHD_USE_THREAD_PER_CONNECTION)
	{
		assert("Program use static variable to connection!");
	}

	return MHD_start_daemon(flags,
							port, apc, apc_cls,
							dh, dh_cls, ...);
}

int main ()
{
	struct MHD_Daemon *daemon;

	daemon = StartWebserver(MHD_USE_AUTO | MHD_USE_INTERNAL_POLLING_THREAD,
							 PORT, NULL, NULL,
							 &answer_to_connection, NULL,
							 MHD_OPTION_NOTIFY_COMPLETED, request_completed,
							 NULL, MHD_OPTION_END);
	if (NULL == daemon)
	return 1;

	(void) getchar ();

	MHD_stop_daemon (daemon);

	return 0;
}