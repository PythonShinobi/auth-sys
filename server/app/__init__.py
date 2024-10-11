from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager

from app.config import Config

db = SQLAlchemy()
bcrypt = Bcrypt()
migrate = Migrate()
login_manager = LoginManager()
login_manager.login_view = "auth.login"

def create_app(config=Config):
    flask_app = Flask(__name__)
    flask_app.config.from_object(config)

    db.init_app(flask_app)
    bcrypt.init_app(flask_app)
    migrate.init_app(flask_app, db)
    login_manager.init_app(flask_app)    

    # Initialize CORS with your frontend URL
    CORS(flask_app, resources={r"/*": {"origins": flask_app.config["FRONTEND_ENDPOINT"], "supports_credentials": True}})

    # Register the authentication blueprint.
    from .auth import bp as auth_bp
    flask_app.register_blueprint(auth_bp, url_prefix="/api")

    return flask_app

from app import models