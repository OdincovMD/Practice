import socket
import os
os.chdir(os.path.dirname(__file__))

send_port = 9000
receive_port = 9001
host = 'localhost'


def send_data(file_path):
    client_send = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_send.connect((host, send_port))

    with open(file_path, 'rb') as file:
        data = file.read(2048)
        while data:
            client_send.send(data)
            data = file.read(2048)

    client_send.shutdown(socket.SHUT_WR)
    client_send.close()


def receive_data():
    client_receive = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_receive.connect((host, receive_port))

    response = b''
    while True:
        part = client_receive.recv(2048)
        if not part:
            break
        response += part

    print(response.decode())
    client_receive.close()


file_path = 'IM-0001-0001.jpeg'
send_data(file_path)
receive_data()
