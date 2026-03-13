from pydantic import BaseModel

class ClassifyRequest(BaseModel):
    image_url: str
    sprite_id: str

class ClassifyResponse(BaseModel):
    sprite_id: str
    is_pixelart: bool
    confidence: float