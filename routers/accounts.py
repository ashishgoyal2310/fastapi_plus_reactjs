import secrets
from fastapi import APIRouter
from typing import List

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from sql_app import db, models, schemas, crud

get_db = db.get_db
router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/accounts/token")


def get_request_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    db_user_token = crud.get_usertoken_by_token(db, token=token)
    if not db_user_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif db_user_token.is_expired():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Expired authentication credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    db_user = db_user_token.user
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user authentication credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return db_user


def get_active_request_user(request_user: schemas.User = Depends(get_request_user)):
    if not request_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return request_user


@router.post("/token")
def login_user_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=form_data.username)
    if db_user and db_user.check_password(form_data.password):
        db_user_token = crud.create_user_token(db, user_id=db_user.id)
        return {"access_token": db_user_token.api_key, "token_type": "bearer"}
    raise HTTPException(status_code=400, detail="Invalid credentials.")


@router.post("/login", response_model=schemas.UserToken)
def login_user(data: schemas.LoginUser, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=data.username)
    if db_user and db_user.check_password(data.password):
        db_user_token = crud.create_user_token(db, user_id=db_user.id)
        return db_user_token
    raise HTTPException(status_code=400, detail="Invalid credentials.")


@router.post("/password-forgot", response_model=schemas.EmptySchema)
def user_password_forgot(data: schemas.UserForgotPassword, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=data.email)
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email.")
    db_forgot_pwd = crud.create_forgot_password(db=db, db_user=db_user)
    return {"message": "success"}


@router.post("/password-reset", response_model=schemas.EmptySchema)
def user_password_forgot(data: schemas.UserResetPassword, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=data.email)
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email.")
    
    db_forgot_pwd = db_user.forgot_password
    if not db_forgot_pwd or db_forgot_pwd.token != data.token:
        raise HTTPException(status_code=400, detail="Invalid token.")
    elif db_forgot_pwd.is_expired():
        raise HTTPException(status_code=400, detail="Expired token.")
    db_user = crud.reset_forgot_password(db, db_user=db_user, password=data.password)
    return {"message": "success"}


@router.post("/register", response_model=schemas.User)
def register_user(data: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=data.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=data)


@router.get("/users/", response_model=List[schemas.User])
def read_users(request_user: schemas.User = Depends(get_request_user), db: Session = Depends(get_db), skip: int = 0, limit: int = 100):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@router.get("/users/me", response_model=schemas.User)
def me_user(request_user: schemas.User = Depends(get_request_user), db: Session = Depends(get_db)):
    return request_user


@router.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, request_user: schemas.User = Depends(get_request_user), db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
