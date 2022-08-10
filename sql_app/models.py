from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, func
from sqlalchemy.orm import backref
from sqlalchemy.orm import relationship
from hashers import make_password, check_password
from datetime import datetime, timedelta

from sql_app.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String, default="")
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    # one-to-many collection User.items
    items = relationship("Item", back_populates="owner")
    # # one-to-one User.token
    # user_token = relationship("UserToken", back_populates="user", uselist=False)

    def set_password(self, raw_password):
        self.hashed_password = make_password(raw_password)
        self._hashed_password = raw_password

    def check_password(self, raw_password):
        """
        Return a boolean of whether the raw_password was correct.
        Handles hashing formats behind the scenes.
        """
        return check_password(raw_password, self.hashed_password)


class UserToken(Base):
    __tablename__ = "usertokens"

    id = Column(Integer, primary_key=True, index=True)
    api_key = Column(String, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    created_at = Column(DateTime, default=func.now())
    modified_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # one-to-one UserToken.user
    user = relationship("User", backref=backref("user_token", uselist=False))

    def is_expired(self):
        is_expired = self.created_at < (datetime.now() - timedelta(minutes=10))
        return is_expired


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    # many-to-one scalar Item.owner
    owner = relationship("User", back_populates="items")