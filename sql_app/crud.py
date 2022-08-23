import uuid
from datetime import datetime

from sqlalchemy.orm import Session

from sql_app import models, schemas
from sql_app.models import (User, UserToken, ForgotPassword)


def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email.lower()).first()


def get_usertoken_by_token(db: Session, token: str):
    db_user_token =  db.query(UserToken).filter(UserToken.api_key == token).first()
    return db_user_token


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()


def create_user_token(db: Session, user_id: int):
    qs = db.query(UserToken).filter(UserToken.user_id==user_id)
    for obj in qs:
        db.delete(obj)
    db.commit()

    api_key = UserToken.generate_token()
    db_user_token = UserToken(user_id=user_id, api_key=api_key)
    db_user_token.created_at = datetime.now()
    db.add(db_user_token)
    db.commit()
    db.refresh(db_user_token)
    return db_user_token


def get_forgotpassword_by_userid(db: Session, user_id: int):
    db_forgot_pwd =  db.query(ForgotPassword).filter(ForgotPassword.user_id == user_id).first()
    return db_forgot_pwd


def create_forgot_password(db: Session, db_user: User):
    db_forgot_pwd = get_forgotpassword_by_userid(db=db, user_id=db_user.id)
    if not db_forgot_pwd:
        db_forgot_pwd = ForgotPassword(user_id=db_user.id)
    
    db_forgot_pwd.token = ForgotPassword.generate_token()
    db_forgot_pwd.created_at = datetime.now()
    db.add(db_forgot_pwd)
    db.commit()
    db.refresh(db_forgot_pwd)
    return db_forgot_pwd


def reset_forgot_password(db: Session, db_user: User, password: str):
    db_user.set_password(password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_user(db: Session, user: schemas.UserCreate):
    db_user = User(email=user.email.lower(), first_name=user.first_name, last_name=user.last_name)
    db_user.set_password(user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# def get_items(db: Session, skip: int = 0, limit: int = 100):
#     return db.query(Item).offset(skip).limit(limit).all()


# def create_user_item(db: Session, item: schemas.ItemCreate, user_id: int):
#     db_item = Item(**item.dict(), owner_id=user_id)
#     db.add(db_item)
#     db.commit()
#     db.refresh(db_item)
#     return db_item
