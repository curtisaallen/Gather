from fastapi import FastAPI, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

import models


from database import get_db
from routers import events, users


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events.router)
app.include_router(users.router)


@app.get("/")
def home():
    return {"message": "Welcome to Gather"}


@app.get("/about")
def about():
    return {"message": "This is the About page of Gather."}


@app.get("/search")
def search(
    query: str = "",
    db: Session = Depends(get_db)
):
    pattern = f"%{query}%"

    events = db.scalars(
        select(models.Event)
        .where(
            models.Event.name.ilike(pattern)
            | models.Event.description.ilike(pattern)
            | models.Event.location.ilike(pattern)
        )
    ).all()

    return {"events": events}