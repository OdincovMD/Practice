import torch
from torchvision import models


class CustomNeuralNetResNet(torch.nn.Module):
    def __init__(self,outputs_number):
        super(CustomNeuralNetResNet, self).__init__()
        self.net = models.resnet50(pretrained=True)
        
        for param in self.net.parameters():
            param.requires_grad = False

        fc_inputs = self.net.fc.in_features
        self.net.fc = torch.nn.Sequential(
            torch.nn.Linear(fc_inputs, 256),
            torch.nn.ReLU(),
            torch.nn.Linear(256, 128),
            torch.nn.Sigmoid(),
            torch.nn.Linear(128, 3),
        )
        

    def forward(self, x):
        x = self.net(x)
        return x