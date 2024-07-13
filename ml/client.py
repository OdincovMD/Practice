# import socket
# import os
# os.chdir(os.path.dirname(__file__))

# client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# client.connect(('localhost', 9000))

# file_path = 'IM-0001-0001.jpeg'
# with open(file_path, 'rb') as file:
#     data = file.read(2048)
#     while data:
#         client.send(data)
#         data = file.read(2048)

# client.shutdown(socket.SHUT_WR)

# response = b''
# while True:
#     part = client.recv(2048)
#     if not part:
#         break
#     response += part

# print(response.decode())

# client.close()

import requests

def send_image(file_path):
    url = "http://localhost:9000/upload"
    with open(file_path, 'rb') as file:
        files = {'file': file}
        response = requests.post(url, files=files)
        print(response.json())

if __name__ == "__main__":
    send_image(r'C:\Users\hardb\Desktop\model\ml\IM-0001-0001.jpeg')
