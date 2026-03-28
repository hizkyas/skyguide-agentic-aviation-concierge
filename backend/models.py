from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # One-to-many relationship with itineraries
    itineraries = relationship("Itinerary", back_populates="owner")


class Itinerary(Base):
    __tablename__ = "itineraries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    origin = Column(String, index=True)
    destination = Column(String, index=True)
    
    # Store the entire LangGraph generated JSON structure natively
    timeline_data = Column(JSON, nullable=False)
    
    hitl_status = Column(String, default="auto") # Tracking human-in-the-loop decisions
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="itineraries")
