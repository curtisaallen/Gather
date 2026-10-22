from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func 
from sqlalchemy.orm import Session

import auth
import models
import schemas
from database import get_db


router = APIRouter(
    prefix="/events",
    tags=["events"]
)


@router.get("/")
def get_events(db: Session = Depends(get_db)):
    events = db.scalars(
        select(models.Event)
    ).all()

    return {"events": events}


@router.post("/", status_code=201)
def create_event(
    event: schemas.EventCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    new_event = models.Event(
        name=event.name,
        location=event.location,
        price=event.price,
        description=event.description,
        capacity=event.capacity,
        image_url=event.image_url,
        user_id=current_user.id
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event

@router.get("/{event_id}")
def get_event(
    event_id: int,
    db: Session = Depends(get_db)
):
    event = db.scalar(
        select(models.Event)
        .where(models.Event.id == event_id)
    )

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found."
        )

    return event    


@router.patch("/{event_id}")
def update_event(
    event_id: int,
    event_data: schemas.EventUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    event = db.scalar(
        select(models.Event)
        .where(models.Event.id == event_id)
    )

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found."
        )

    if event.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to update this event."
        )

    updates = event_data.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(event, field, value)

    db.commit()
    db.refresh(event)

    return event


@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    event = db.scalar(
        select(models.Event)
        .where(models.Event.id == event_id)
    )

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found."
        )

    if event.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to delete this event."
        )

    db.delete(event)
    db.commit()

    return {"message": "Event deleted successfully."}


@router.post("/{event_id}/going", status_code=201)
def attend_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Find the event and lock it during registration
    event = db.scalar(
        select(models.Event)
        .where(models.Event.id == event_id)
        .with_for_update()
    )

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found."
        )

    # Check whether this user is already going
    existing = db.scalar(
        select(models.EventAttendee)
        .where(
            models.EventAttendee.event_id == event_id,
            models.EventAttendee.user_id == current_user.id
        )
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="You are already going to this event."
        )

    # Count current attendees
    attendee_count = db.scalar(
        select(func.count())
        .select_from(models.EventAttendee)
        .where(models.EventAttendee.event_id == event_id)
    )

    if attendee_count >= event.capacity:
        raise HTTPException(
            status_code=409,
            detail="This event is full."
        )

    # Register the user
    attendance = models.EventAttendee(
        user_id=current_user.id,
        event_id=event_id
    )

    db.add(attendance)
    db.commit()

    return {
        "message": "You are now going to this event.",
        "event_id": event_id
    }    



@router.delete("/{event_id}/going")
def cancel_attendance(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Lock the event while changing attendance
    event = db.scalar(
        select(models.Event)
        .where(models.Event.id == event_id)
        .with_for_update()
    )

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found."
        )

    # Find this user's attendance record
    attendance = db.scalar(
        select(models.EventAttendee)
        .where(
            models.EventAttendee.event_id == event_id,
            models.EventAttendee.user_id == current_user.id
        )
    )

    if attendance is None:
        raise HTTPException(
            status_code=404,
            detail="You are not going to this event."
        )

    db.delete(attendance)
    db.commit()

    return {
        "message": "You are no longer going to this event.",
        "event_id": event_id
    }

@router.get("/{event_id}/attendees")
def get_event_attendees(
    event_id: int,
    db: Session = Depends(get_db)
):
    event = db.scalar(
        select(models.Event)
        .where(models.Event.id == event_id)
    )

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found."
        )

    attendee_count = db.scalar(
        select(func.count())
        .select_from(models.EventAttendee)
        .where(models.EventAttendee.event_id == event_id)
    )

    return {
        "event_id": event_id,
        "attendee_count": attendee_count,
        "capacity": event.capacity,
        "spots_remaining": max(
            event.capacity - attendee_count,
            0
        )
    }


@router.get("/{event_id}/my-attendance")
def get_my_attendance(
    event_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    event = db.get(models.Event, event_id)

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found."
        )

    attendance = db.scalar(
        select(models.EventAttendee)
        .where(
            models.EventAttendee.event_id == event_id,
            models.EventAttendee.user_id == current_user.id
        )
    )

    return {
        "event_id": event_id,
        "is_attending": attendance is not None
    }
