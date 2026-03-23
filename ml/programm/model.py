import torch
from torchvision import models
from torchvision.models import ResNet50_Weights


class CustomNeuralNetResNet(torch.nn.Module):
    def __init__(self, outputs_number):
        super().__init__()
        self.net = models.resnet50(weights=ResNet50_Weights.DEFAULT)
        
        for param in self.net.parameters():
            param.requires_grad = False

        TransferModelOutputs = self.net.fc.in_features
        self.net.fc = torch.nn.Sequential(
            torch.nn.Linear(TransferModelOutputs, outputs_number)
        )

    def forward(self, x):
        return self.net(x)