from fastapi import FastAPI, HTTPException, Body, status
from pydantic import BaseModel
from fastapi.responses import JSONResponse

# from api.api_v1.api import apirouter
# from core.config import settings
# from fastapi.openapi.utils import get_openapi
# from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    # title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION, debug=settings.DEBUG
)

class Settings():
    # empty


# In-memory database (for demonstration purposes)
items = []

# Pydantic model for item data
class type(BaseModel):
    id: str

# Create an item
@app.post("/")
async def GeneralPostReq(op_type: type, json_body = Body()) -> JSONResponse:
    # json_body = json.dumps(body)
    # conv_json_body = json.loads(json_body)
    if op_type.id == "login":
        # login
        # password
        # request to db
    elif op_type.id == "register":

    elif op_type.id == "image":
        
    else:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST)
        # bad requst

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        headers={
            "Content-Type": "application/json"},
        content={"username": "Heisenberg", "surname": "White"})

# origins = [
#     "http://localhost:3000",
#     "http://localhost",
# ]


# def messenger_openapi():
#     if app.openapi_schema:
#         return app.openapi_schema
#     openapi_schema = get_openapi(
#         title="Web Messenger API",
#         version="1.0.0",
#         description="First app version",
#         routes=app.routes,
#     )
#     openapi_schema["info"]["x-logo"] = {
#         "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
#     }
#     app.openapi_schema = openapi_schema
#     return app.openapi_schema


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins="*",
#     allow_credentials=True,
#     allow_methods=["GET", "POST", "DELETE"],
#     allow_headers=["Cookie"],
# )

# app.openapi = messenger_openapi
# app.include_router(apirouter, prefix=settings.API_V1_STR)
