from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from tortoise import Tortoise

from src.models.register import registerTortoise
from src.models.config import TORTOISE_ORM

Tortoise.init_models(["src.models.users"], "models")

app = FastAPI()

from src.routes import users

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)


registerTortoise(app, config=TORTOISE_ORM, generate_schemas=False)