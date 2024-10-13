import os
from dotenv import load_dotenv

# Load environment variable from .env file
load_dotenv()

db_path = os.path.join(os.path.dirname(__file__), 'app.db')

class Config:
    # Default configuration
    SECRET_KEY = "t8hrNO6ibFODgZWxhunyhQ"
    FRONTEND_ENDPOINT = 'http://localhost:3000'    

    # Set the SQLAlchemy database URI for SQLite
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{db_path}'  # SQLite URI format
    SQLALCHEMY_TRACK_MODIFICATIONS = False