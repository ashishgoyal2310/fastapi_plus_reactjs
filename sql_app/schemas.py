from typing import Union
from typing import List, Optional

from pydantic import BaseModel


class ItemBase(BaseModel):
    title: str
    description: Optional[str] = None


class ItemCreate(ItemBase):
    pass


class Item(ItemBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    email: str
    first_name: str
    last_name: Union[str, None] = ""


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_active: bool
    items: List[Item] = []

    class Config:
        orm_mode = True


class LoginUser(BaseModel):
    username: str
    password: str
    grant_type: str = ""


class UserToken(BaseModel):
    id: int
    api_key: str
    user_id: int
    token_type: str = 'bearer'

    class Config:
        orm_mode = True
