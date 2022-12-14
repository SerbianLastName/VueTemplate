from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator


class Users(models.Model):
    id = fields.UUIDField(pk=True)
    username = fields.CharField(max_length=32, unique=True)
    email = fields.CharField(max_length=50, null=True)
    password = fields.CharField(max_length=128)
    createdAt = fields.DatetimeField(auto_now_add=True)


UserInSchema = pydantic_model_creator(
    Users, name="UserIn", exclude=["created_at"], exclude_readonly=True
)
