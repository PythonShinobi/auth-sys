from datetime import datetime
from flask_login import UserMixin
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey, DateTime

from . import db, bcrypt

class User(db.Model, UserMixin):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(100), nullable=False)

    # Change the backref name to avoid conflict
    user_sessions = relationship('Session', backref='owner', lazy=True)

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

class Session(db.Model):
    __tablename__ = "sessions"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    session_token: Mapped[str] = mapped_column(String(255), nullable=False)  # Length may vary depending on token
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    # The backref here can remain the same as it refers to the User class
    user = relationship('User', backref='sessions')