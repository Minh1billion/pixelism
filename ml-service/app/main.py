from fastapi import FastAPI, HTTPException
from app.schemas import ClassifyRequest, ClassifyResponse
from app.model import classify_image, get_model
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Pixel Art Classifier")

@app.on_event("startup")
def startup():
    get_model()
    logger.info("Model loaded and ready")

@app.post("/classify", response_model=ClassifyResponse)
def classify(req: ClassifyRequest):
    try:
        is_pixelart, confidence = classify_image(req.image_url)
        logger.info(f"[{req.sprite_id}] is_pixelart={is_pixelart} confidence={confidence}")
        return ClassifyResponse(
            sprite_id=req.sprite_id,
            is_pixelart=is_pixelart,
            confidence=confidence,
        )
    except Exception as e:
        logger.error(f"Classify failed for {req.sprite_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    return {"status": "ok"}