import re
import base64
import numpy as np
from io import BytesIO
from PIL import Image
from torch.utils.data import Dataset
from torchvision.transforms.functional import adjust_contrast
import cv2

def convert(data):
    img = base64_to_image(data)
    return img

def base64_to_image(data):
    b64_img = re.sub('^data:image/png;base64,', '', data)
    decoded_img = base64.b64decode(b64_img)
    pil_img = Image.open(BytesIO(decoded_img))
    return pil_img

def adjust_contrast_my(image, factor):
    return adjust_contrast(image, factor)

def calculate_contrast(image): 
    image = np.array(image)
    if len(image.shape) == 3:
        image_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        image_gray = image

    contrast = np.std(image_gray)
    return contrast 


class NumpyImageDataset(Dataset):

    def __init__(self, image_array, transform) -> None:
        self.image_array = image_array
        self.transform = transform

    def __len__(self) -> int:
        return len(self.image_array)

    def __getitem__(self, idx: int):
        image = self.image_array[idx]
        if self.transform:
            image = self.transform(image)
        return image