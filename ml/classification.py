import socket
import torch
from torchvision import transforms
import numpy as np
from PIL import Image
import io

from image import adjust_contrast_my, calculate_contrast, convert, NumpyImageDataset
from model import CustomNeuralNetResNet

model = CustomNeuralNetResNet(3)
model.load_state_dict(torch.load('best_model.pth', map_location=torch.device('cpu')))
model.eval()

test_transform = transforms.Compose([
    transforms.Lambda(lambda x: adjust_contrast_my(x, 1.3 if calculate_contrast(x) < 55 else 1)),
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

class_names = ['Бактериальная пневмония', 'Нет пневмонии', 'Вирусная пневмония']

def process_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))
    image = image.convert('RGB')  # Ensure the image is in RGB format
    img = np.array(image)
    
    dataset = NumpyImageDataset([img], test_transform)
    dataloader = torch.utils.data.DataLoader(dataset=dataset, batch_size=1, shuffle=False)

    iter_obj = iter(dataloader)
    inputs, labels, paths = next(iter_obj)

    with torch.no_grad():
        preds = model(inputs)

    pred = torch.nn.functional.softmax(preds[0], dim=0).cpu().numpy()
    predicted_class = np.argmax(pred)
    
    return {"result": class_names[predicted_class], "probability": float(pred[predicted_class])}


HOST = "127.0.0.1"  # Standard loopback interface address (localhost)
PORT = 9000  

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen()
    conn, addr = s.accept()
    with conn:
        while True:
            data = conn.recv(4096) 
            if not data:
                continue
            result = process_image(data)
            response = f"Result: {result['result']}, Probability: {round(result['probability'], 2)}"
            conn.sendall(response.encode('utf-8'))
            data = None

