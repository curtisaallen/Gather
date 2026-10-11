from pydantic import BaseModel, Field


class EventCreate(BaseModel):
    name: str = Field(min_length=3)
    location: str = Field(min_length=3)
    price: float = Field(ge=0)
    description: str = Field(min_length=10)
    capacity: int = Field(gt=0)
    image_url: str | None = None
    

class EventUpdate(BaseModel):
    name: str | None = None
    location: str | None = None
    price: float | None = None
    description: str | None = None
    capacity: int | None = None
    image_url: str | None = None

class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: str
    password: str = Field(min_length=8)

class UserLogin(BaseModel):
    email: str
    password: str