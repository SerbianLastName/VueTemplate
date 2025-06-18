import os
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta


from src.models.users import Users, UserInSchema

pwdContext = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2Scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = os.environ.get("SECRET_KEY")
SALT_KEY = os.environ.get("SALT_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 120


async def makeUser(user: UserInSchema):
    if user.password == "" or user.password == None:
        return {"success": False, "error": "No password"}
    try:
        user.password = pwdContext.encrypt(f"{user.password}{SALT_KEY}")
        await Users.create(**user.dict(exclude_unset=True))
        newUser = await Users.get(username=user.username).first().values()
        token = createToken({"username": user.username, "id": str(newUser["id"])})
        return {
            "success": True,
            "resp": {
                "token": token["resp"]["token"],
                "user": user.username,
                "id": str(newUser["id"]),
            },
        }
    except Exception as e:
        return {"success": False, "error": format(e)}


async def updateUser(user: UserInSchema, username: str):
    try:
        oldUser = await Users.get(username=username).first().values()
        if user.password == "":
            pwd = oldUser["password"]
        else:
            pwd = pwdContext.encrypt(f"{user.password}{SALT_KEY}")
        user.password = pwd
        await Users.filter(id=oldUser["id"]).update(**user.dict(exclude_unset=True))
        token = createToken({"username": user.username, "id": str(oldUser["id"])})
        return {
            "success": True,
            "resp": {
                "token": token["resp"]["token"],
                "user": user.username,
                "id": str(oldUser["id"]),
            },
        }
    except Exception as e:
        return {"success": False, "error": format(e)}


async def login(user: OAuth2PasswordRequestForm = Depends()):
    try:
        dbUser = await Users.get(username=user.username).first().values()
    except Exception as e:
        return {"success": False, "error": format(e)}
    try:
        passed = verifyPassword(f"{user.password}{SALT_KEY}", dbUser["password"])
        if passed:
            token = createToken({"username": user.username, "id": str(dbUser["id"])})
            return {
                "success": True,
                "resp": {
                    "token": token["resp"]["token"],
                    "user": user.username,
                    "id": str(dbUser["id"]),
                },
            }

        return {"success": False, "error": "Wrong password"}
    except Exception as e:
        return {"success": False, "error": format(e)}


def createToken(data: dict):
    try:
        toEncode = data.copy()
        expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
        toEncode.update({"exp": expire})
        token = jwt.encode(toEncode, SECRET_KEY, algorithm=ALGORITHM)
        return {"success": True, "resp": {"token": token}}
    except Exception as e:
        return {"success": False, "error": format(e)}


def verifyPassword(plainPassword: str, hashedPassword: str):
    return pwdContext.verify(plainPassword, hashedPassword)