import io
import torch
import torch.nn as nn
import requests
from PIL import Image
from torchvision import transforms, models
from pathlib import Path

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_PATH = Path(__file__).parent.parent / "best_model.pth"
IMG_SIZE = 224
CLASSES = ["non-pixelart", "pixelart"]

def _build_model(num_classes: int) -> nn.Module:
    model = models.efficientnet_b0(weights=None)
    in_f = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.3, inplace=True),
        nn.Linear(in_f, 128),
        nn.ReLU(),
        nn.Dropout(p=0.2),
        nn.Linear(128, num_classes),
    )
    return model

def load_model() -> nn.Module:
    ckpt = torch.load(MODEL_PATH, map_location=DEVICE)
    model = _build_model(num_classes=2)
    model.load_state_dict(ckpt["model_state"])
    model.to(DEVICE)
    model.eval()
    return model

_model: nn.Module | None = None

def get_model() -> nn.Module:
    global _model
    if _model is None:
        _model = load_model()
    return _model

_transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE),
                      interpolation=transforms.InterpolationMode.NEAREST),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225]),
])

def classify_image(image_url: str) -> tuple[bool, float]:
    response = requests.get(image_url, timeout=10)
    response.raise_for_status()
    img = Image.open(io.BytesIO(response.content)).convert("RGB")

    tensor = _transform(img).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        logits = get_model()(tensor)
        probs = torch.softmax(logits, dim=1)[0]

    pixelart_prob = probs[CLASSES.index("pixelart")].item()
    is_pixelart = pixelart_prob >= 0.5

    return is_pixelart, round(pixelart_prob, 4)