import os

DATABASE_USER = os.getenv("DATABASE_USER")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
DATABASE_NAME = os.getenv("DATABASE_NAME")
DATABASE_HOST = os.getenv("DATABASE_HOST")


TORTOISE_ORM = {
    "connections": {
        "default": f"postgres://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:5432/{DATABASE_NAME}"
    },
    "apps": {
        "models": {
            "models": ["src.models.users", "aerich.models"],
            "default_connection": "default",
        }
    },
}