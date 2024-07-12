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
#include <fstream>
#include <memory>

#include <boost/json/stream_parser.hpp>

using namespace boost;

#define PORT            8888
#define POSTBUFFERSIZE  512
#define MAXNAMESIZE     20
#define MAXANSWERSIZE   512

enum {
	GET,
	POST,
	HEAD
};

template<typename>
struct second_arg;

template<typename Ret, typename f_type, typename s_type, typename... Args>
struct second_arg<Ret(f_type, s_type, Args...)>
{
	typedef s_type type;
};

using HTTP_CODE_T = second_arg<decltype(MHD_queue_response)>::type;

enum{
	LOGIN = 0,
	REGISTER,
	FILE_LOAD
};

using namespace std::placeholders;

struct ParticipantInfo
{
	std::string name;
	std::string surname;
	std::string login;
	std::string passw;

	bool isCompleted(int op) const
	{
		if (op != FILE_LOAD && (op == REGISTER && (name.empty() || surname.empty())) ||
				login.empty() || passw.empty())
		{
			return false;
		}

		return true;
	};
};

struct connection_info_struct
{
private:
	class PostProcessorDeleter
	{
	public:
		void operator()(MHD_PostProcessor* pp) const noexcept
		{
			if (pp)
			{
				MHD_destroy_post_processor(pp);
			}
		}
	};

public:
	int operation_type = -1;	
	std::unique_ptr<ParticipantInfo> client = nullptr;

	std::function<MHD_Result(const char*, size_t)> PostProcess;

	std::unique_ptr<MHD_PostProcessor, PostProcessorDeleter> processor = nullptr;
	static json::stream_parser json_parser;

	std::ofstream file;
	std::string filename;

	int ExecuteComm()
	{
		assert(false && "bad");
	};

	static std::string GenerateFileName(std::string_view filename) noexcept
	{
		return "";
	};
private:

	// add coroutine to execute command!
	int SendRequestToAIwebserver();
	int SendRequestToDBwebserver();
	int SendRequestToFrontend();
};
json::stream_parser connection_info_struct::json_parser;

bool CheckJsonSyntax(std::string_view str_needed_check)
{	
	static const char available_chars[] = "abcdefghijklmnopqrstuvwxyz\
	 ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890\"\'\\/\b\r\n\t\b\f{}[]";
	static const size_t len = strlen(available_chars);

	return std::find_first_of(str_needed_check.begin(), str_needed_check.end(),
		available_chars, available_chars + len) == str_needed_check.end() ? true : false;
};

MHD_Result LoginProcess(const char* data, size_t data_size, ParticipantInfo& client)
{
	if (data_size > 0)
	{
		if (!CheckJsonSyntax(data))
		{
			return MHD_NO;
		}
		connection_info_struct::json_parser.write(data);
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
		connection_info_struct::json_parser.write(data);
	}

	return MHD_YES;
};

// get second parameter of function
MHD_Result SendBadRequest(MHD_Connection* connection, HTTP_CODE_T code)
{
	MHD_Response* response =
		MHD_create_response_from_buffer (strlen (""), (void *)"",
									 MHD_RESPMEM_PERSISTENT);
  	if (!response)
  	{
		return MHD_NO;
  	}

	MHD_Result ret = MHD_queue_response (connection, code, response);
	
	MHD_destroy_response (response);	
	return ret;
};

MHD_Result SendPage (struct MHD_Connection *connection, const char *page, HTTP_CODE_T code)
{
	enum MHD_Result ret;
	struct MHD_Response *response;

	response =
		MHD_create_response_from_buffer (strlen (page), (void *) page,
									 MHD_RESPMEM_PERSISTENT);
	if (!response)
	return MHD_NO;

	ret = MHD_queue_response (connection, code, response);
	MHD_destroy_response (response);

	return ret;
}


MHD_Result IteratePost(void *coninfo_cls, enum MHD_ValueKind kind, const char *key,
			  const char *filename, const char *content_type,
			  const char *transfer_encoding, const char *data, uint64_t off,
			  size_t size)
{
	struct connection_info_struct *con_info = reinterpret_cast<connection_info_struct*>(coninfo_cls);
	(void) kind;               /* Unused. Silent compiler warning. */
	(void) content_type;       /* Unused. Silent compiler warning. */
	(void) transfer_encoding;  /* Unused. Silent compiler warning. */
	(void) off;                /* Unused. Silent compiler warning. */

	if (!con_info->file.is_open())
	{
		con_info->filename = connection_info_struct::GenerateFileName(filename);
		
		con_info->file.open(filename);

		if (!con_info->file.is_open())
		{
			return MHD_NO;
		}
	}

	con_info->file.write(data, size);
	return MHD_YES;
}

// dont sure it is needed
static void
request_completed (void *cls, struct MHD_Connection *connection,
				   void **con_cls, enum MHD_RequestTerminationCode toe)
{
	struct connection_info_struct* con_info = reinterpret_cast<struct connection_info_struct*>(*con_cls);
	(void) cls;         /* Unused. Silent compiler warning. */
	(void) connection;  /* Unused. Silent compiler warning. */
	(void) toe;         /* Unused. Silent compiler warning. */

	if (!con_info)
	{
		return;
	}

	delete con_info;
	*con_cls = NULL;
}

MHD_Result HandleFirstConn(MHD_Connection* connection, const char* method, 
	connection_info_struct* con_info)
{
	if (0 != strcmp (method, "POST"))
	{
		SendBadRequest(connection, MHD_HTTP_BAD_REQUEST);
		return MHD_NO;
	}

	con_info = new struct connection_info_struct;
	
	const char* c_op_type = MHD_lookup_connection_value(connection, MHD_HEADER_KIND, "type");
	if (!c_op_type) // NULL
	{
		return SendPage(connection, "HEADER <type> is needed!", MHD_HTTP_BAD_REQUEST);
	}
	std::string_view op_type(c_op_type);

	const char* c_content_type = MHD_lookup_connection_value(connection, MHD_HEADER_KIND, "Content-Type");
	if (!c_content_type)
	{
		return SendPage(connection, "HEADER <Content-Type> is needed!", MHD_HTTP_BAD_REQUEST);
	}
	std::string_view content_type(c_content_type);
	con_info->client.reset(new ParticipantInfo);

	if (op_type.compare("login") && content_type.compare("application/json"))
	{
		con_info->operation_type = LOGIN;
		con_info->PostProcess = std::bind(LoginProcess, _1, _2, *con_info->client);
	} else if (op_type.compare("register") && content_type.compare("application/json"))
	{
		con_info->operation_type = REGISTER;
		con_info->PostProcess = std::bind(RegisterProcess, _1, _2, *con_info->client);;
	} else if (op_type.compare("file") && content_type.compare("image/jpeg"))
	{
		con_info->operation_type = FILE_LOAD;
		con_info->processor.reset(MHD_create_post_processor(connection, 256 * 2, &IteratePost, con_info));
		con_info->PostProcess = std::bind(MHD_post_process, con_info->processor.get(), _1, _2);
	} else 
	{
		// more information about error!
		SendBadRequest(connection, MHD_HTTP_BAD_REQUEST);
		return MHD_NO;
	}

	return MHD_YES;
};

MHD_Result HandleNextConn(MHD_Connection* connection, const char* upload_data, 
	size_t* upload_data_size, connection_info_struct* con_info)
{
	if (*upload_data_size > 0)
	{
		con_info->PostProcess(upload_data, *upload_data_size);
		*upload_data_size = 0;

		return MHD_YES;
	}

	// data were process
	if (!con_info->client->isCompleted(con_info->operation_type))
	{
		return MHD_NO;
	}

	con_info->ExecuteComm();

	// free resource bound to connection
	connection_info_struct::json_parser.reset();
	return MHD_YES;
};

MHD_Result answer_to_connection (void *cls, struct MHD_Connection *connection,
					  const char *url, const char *method,
					  const char *version, const char *upload_data,
					  size_t *upload_data_size, void **con_cls)
{
	(void) cls;               /* Unused. Silent compiler warning. */
	(void) url;               /* Unused. Silent compiler warning. */
	(void) version;           /* Unused. Silent compiler warning. */

	if (*con_cls == NULL)
	{
		*con_cls = new connection_info_struct;
		if (HandleFirstConn(connection, method, reinterpret_cast<connection_info_struct*>(*con_cls)) != MHD_YES)
		{
			return MHD_NO;
		}

		*con_cls = (void*)con_cls;
		return MHD_YES;
	}
	// only post method

	return HandleNextConn(connection, upload_data, upload_data_size, 
		reinterpret_cast<connection_info_struct*>(*con_cls));
}

template <typename... Args>
MHD_Daemon* StartWebserver(unsigned int flags, unsigned short port, 
	MHD_AcceptPolicyCallback apc, void *apc_cls, 
	MHD_AccessHandlerCallback dh, void *dh_cls, Args&&... options)
{
	if (flags & MHD_USE_THREAD_PER_CONNECTION)
	{
		assert("Program use static variable to connection!");
	}

	return MHD_start_daemon(flags,
							port, apc, apc_cls,
							dh, dh_cls, std::forward<Args>(options)...);
}

int main ()
{
	// seed(NULL);

	struct MHD_Daemon *daemon;

	daemon = StartWebserver(MHD_USE_AUTO | MHD_USE_INTERNAL_POLLING_THREAD,
							 PORT, NULL, NULL,
							 &answer_to_connection, NULL,
							 MHD_OPTION_NOTIFY_COMPLETED, request_completed,
							 NULL, MHD_OPTION_END);
	if (NULL == daemon)
	{
		return 1;
	}

	(void) getchar ();

	MHD_stop_daemon (daemon);

	return 0;
}