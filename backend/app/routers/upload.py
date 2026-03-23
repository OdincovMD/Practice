import httpx
from fastapi import APIRouter, File, HTTPException, UploadFile

from config import ML_UPLOAD_URL

router = APIRouter()


@router.post("/upload")
async def proxy_upload(file: UploadFile = File(...)):
    content = await file.read()
    filename = file.filename or "image"
    content_type = file.content_type or "application/octet-stream"

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                ML_UPLOAD_URL,
                files={"file": (filename, content, content_type)},
            )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"ML service unreachable: {exc}",
        ) from exc

    if response.status_code >= 400:
        raise HTTPException(
            status_code=502,
            detail=f"ML service error: {response.text}",
        )

    return response.json()
