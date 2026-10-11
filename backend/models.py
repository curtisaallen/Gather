from sqlalchemy import String, Float, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from database import Base

class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    location: Mapped[str] = mapped_column(String(100), nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)

    image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

class EventAttendee(Base):
    __tablename__ = "event_attendees"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    event_id: Mapped[int] = mapped_column(
        ForeignKey("events.id"),
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "event_id",
            name="uq_event_attendee"
        ),
    )