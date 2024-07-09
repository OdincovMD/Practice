from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import torch
from torchvision import transforms
import torchvision
import numpy as np
import os
os.chdir(os.path.dirname(__file__))



from image import adjust_contrast_my, calculate_contrast, convert, NumpyImageDataset
from model import CustomNeuralNetResNet


app = FastAPI()


model = CustomNeuralNetResNet(3)
model.load_state_dict(torch.load('top1acc84.pth', map_location=torch.device('cpu')))
model.eval()

test_transform = transforms.Compose([
        transforms.Lambda(lambda x: adjust_contrast_my(x, 1.3 if calculate_contrast(x) < 55 else 1)),
        transforms.Resize((224,224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])])

class_names = ['Бактериальная пневмония', 'Нормально', 'Вирусная пневмония']

# CORS settings
origins = ["http://localhost:8080"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post('/image')
async def image_post_request(img):
    img = convert(Request.json['image'])
    dataset = NumpyImageDataset([img], test_transform)
    dataloader = torchvision.datasets.DataLoader(dataset=dataset, batch_size=1, shuffle=False)

    iter_obj = iter(dataloader)
    inputs, labels, paths = next(iter_obj)
    
    with torch.set_grad_enabled(False):
        preds = model(inputs)

    for _, (_, pred) in enumerate(zip(inputs, preds)):
        pred = torch.nn.functional.softmax(pred, dim=0).cpu().numpy()
        
        predicted_class = np.argmax(pred)
    
    return {"result": class_names[predicted_class], "probability" : pred[predicted_class]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=5000)
