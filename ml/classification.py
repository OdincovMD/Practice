import socket
import torch
from torchvision import transforms
import numpy as np
import os
from image import convert_to_PIL, adjust_contrast_my, calculate_contrast, NumpyImageDataset
from model import CustomNeuralNetResNet

os.chdir(os.path.dirname(__file__))

model = CustomNeuralNetResNet(3)
model.load_state_dict(torch.load(
    'best_model.pth', map_location=torch.device('cpu')))
model.eval()

transform = transforms.Compose([
    transforms.Lambda(lambda x: adjust_contrast_my(
        x, 1.3 if calculate_contrast(x) < 55 else 1)),
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

class_names = ['Бактериальная пневмония',
               'Нет пневмонии', 'Вирусная пневмония']


def process_image(image_bytes):
    img = convert_to_PIL(image_bytes)

    dataset = NumpyImageDataset([img], transform)
    dataloader = torch.utils.data.DataLoader(
        dataset=dataset, batch_size=1, shuffle=False)

    for inputs in dataloader:
        with torch.set_grad_enabled(False):
            preds = model(inputs)
        pred = torch.nn.functional.softmax(preds[0], dim=0).data.cpu().numpy()
    predicted_class = np.argmax(pred)

    return f'result: {class_names[predicted_class]}, probability: {round(float(pred[predicted_class]), 2)}'


HOST = "localhost"
PORT = 9000

while True:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((HOST, PORT))
        s.listen()
        conn, addr = s.accept()
        with conn:
            with open('image.jpg', 'wb') as file:
                while True:
                    data = conn.recv(2048)
                    if not data:
                        break
                    file.write(data)

            with open('image.jpg', 'rb') as image_file:
                image_data = image_file.read()
                result = process_image(image_data)
            conn.sendall(result.encode())