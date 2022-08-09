import uuid

from sqlalchemy.orm import Session

from sql_app import models, schemas


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(email=user.email)
    db_user.set_password(user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_user_token(db: Session, user_id: int):
    qs = db.query(models.UserToken).filter(models.UserToken.user_id==user_id)
    for obj in qs:
        db.delete(obj)
    db.commit()

    api_key = uuid.uuid1().hex
    db_user_token = models.UserToken(user_id=user_id, api_key=api_key)
    db.add(db_user_token)
    db.commit()
    db.refresh(db_user_token)
    return db_user_token


def get_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Item).offset(skip).limit(limit).all()


def create_user_item(db: Session, item: schemas.ItemCreate, user_id: int):
    db_item = models.Item(**item.dict(), owner_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
