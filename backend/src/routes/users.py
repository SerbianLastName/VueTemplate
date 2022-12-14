from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt


from src.auth.jwt import makeUser, updateUser, login, createToken, SECRET_KEY
from src.models.users import UserInSchema, Users

oauth2Scheme = OAuth2PasswordBearer(tokenUrl="token")
router = APIRouter()


@router.get("/getuser")
async def get(token: str = Depends(oauth2Scheme)):
    try:
        id = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])["id"]
        user = await Users.get(id=id).first().values()
        username = user["username"]
        email = user["email"]

        return {
            "success": True,
            "resp": {"username": username, "email": email, "id": str(id)},
        }
    except Exception as e:
        return {"success": False, "error": format(e)}


@router.patch("/updateuser")
async def update(user: UserInSchema, token: str = Depends(oauth2Scheme)):
    username = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])["username"]
    return await updateUser(user, username)


@router.post("/register")
async def register(user: UserInSchema):
    return await makeUser(user)


@router.post("/login")
async def signIn(user: OAuth2PasswordRequestForm = Depends()):
    return await login(user)


@router.get("/refresh")
def refresh(token: str = Depends(oauth2Scheme)):
    try:
        username = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])["username"]
        return createToken({"username": username})
    except Exception as e:
        return {"success": False, "error": format(e)}
