import os
from dotenv import load_dotenv

# Load environment variable from .env file
load_dotenv()

class Config:
    # Default configuration
    SECRET_KEY="t8hrNO6ibFODgZWxhunyhQ"
    FRONTEND_ENDPOINT = 'http://localhost:3000'

    # Database configuration
    DB_HOST = os.getenv('DB_HOST')
    USER = os.getenv('USER')
    PASSWORD = os.getenv('PASSWORD')
    DATABASE = os.getenv('DATABASE')
    DB_PORT = os.getenv('DB_PORT')

    # Set the SQLAlchemy database URI
    SQLALCHEMY_DATABASE_URI = f'postgresql://{USER}:{PASSWORD}@{DB_HOST}:{DB_PORT}/{DATABASE}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False