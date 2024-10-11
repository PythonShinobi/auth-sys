import uuid
from datetime import datetime, timedelta
from flask_login import login_user, logout_user, login_required, current_user
from flask import request, jsonify, make_response

from app import db, login_manager
from ..auth import bp
from ..models import User, Session

# User loader function
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400
    
    existing_username = User.query.filter(User.username == username).first()
    if existing_username:
        return jsonify({"error": "Username already exists"}), 400

    existing_email = User.query.filter(User.email == email).first()
    if existing_email:
        return jsonify({"error": "Email already exists"}), 400

    # Register new user
    new_user = User(username=username, email=email)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    # Automatically log in the user after registration
    login_user(new_user)

    # Create a session token
    session_token = str(uuid.uuid4())
    expires_at = datetime.now() + timedelta(days=1)  # Set session expiration (1 day)

    # Store session in the database
    new_session = Session(user_id=new_user.id, session_token=session_token, expires_at=expires_at)
    db.session.add(new_session)
    db.session.commit()

    # Create a response and set the cookie
    response = make_response(jsonify({"message": "Registration successful"}), 201)
    response.set_cookie(
        'session_token',
        session_token,
        httponly=True,  # JavaScript can't access this cookie
        secure=True,    # Use HTTPS
        samesite='Lax', # SameSite attribute for CSRF protection
        expires=expires_at  # Set cookie expiration
    )

    # Optionally, redirect to the original page or a specific page
    # The frontend can handle the redirect based on the response message or URL

    return response

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')

    # Find user by email
    user = User.query.filter_by(email=email).first()
    
    # Validate user credentials
    if user and user.check_password(password):
        login_user(user)

        # Check if a session already exists for this user
        existing_session = Session.query.filter_by(user_id=user.id).first()
        
        if existing_session:
            # If a session exists, use the existing session token
            session_token = existing_session.session_token
            expires_at = existing_session.expires_at
        else:
            # If no session exists, create a new session token and store it
            session_token = str(uuid.uuid4())
            expires_at = datetime.now() + timedelta(days=1)  # Session expires in 1 day

            new_session = Session(user_id=user.id, session_token=session_token, expires_at=expires_at)
            db.session.add(new_session)
            db.session.commit()

        # Create a response and set the cookie with the session token
        response = make_response(jsonify({"message": "Login successful"}), 200)
        response.set_cookie(
            'session_token',
            session_token,
            httponly=True,  # JavaScript can't access this cookie
            secure=True,    # Use HTTPS for secure cookies
            samesite='Lax', # CSRF protection
            expires=expires_at  # Cookie expires when session expires
        )

        return response

    # If credentials are invalid, return an error
    return jsonify({"error": "Invalid email or password"}), 401

@bp.route('/logout', methods=['POST'])
@login_required
def logout():
    # Get the session token from the request's cookies
    session_token = request.cookies.get('session_token')

    # Delete the session from the database.
    if session_token:
        Session.query.filter_by(session_token=session_token).delete()
        db.session.commit()

    logout_user()

    # Create a response and delete the cookie
    response = make_response(jsonify({"message": "Logout successful"}), 200)
    response.set_cookie('session_token', '', expires=0)  # Delete the cookie by setting expiration to 0

    return response