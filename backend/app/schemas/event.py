from enum import Enum
from sqlmodel import SQLModel, Field

class EventType(str, Enum):
    PAGE_VIEW = "page_view"
    CLICK = "click"
    SIGNUP = "signup"
    PURCHASE = "purchase"

class EventBase(SQLModel):
    event_type: EventType
    value: float = Field(default=0.0)

class EventCreate(EventBase):
    pass

class EventRead(EventBase):
    id: int
    created_at: str
    project_id: int

class EventCreateBulk(SQLModel):
    project_id: int
    events: list[EventCreate]
