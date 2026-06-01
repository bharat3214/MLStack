"""
User Model
"""
from datetime import datetime
import json
import os
from werkzeug.security import generate_password_hash, check_password_hash
from app import db


# Path to the whitelist JSON file (lives next to models/)
_WHITELIST_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'whitelist.json')


def _load_whitelist():
    """Read the whitelist file each time so edits take effect without restart."""
    try:
        with open(_WHITELIST_PATH, 'r') as f:
            data = json.load(f)
        return [e.strip().lower() for e in data.get('unlimited_access', [])]
    except (FileNotFoundError, json.JSONDecodeError):
        return []


class User(db.Model):
    """User model for authentication"""
    
    __tablename__ = 'users'
    __table_args__ = (
        db.UniqueConstraint('oauth_provider', 'oauth_provider_id', name='uq_oauth_identity'),
    )
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    email_verified = db.Column(db.Boolean, default=False, nullable=False)
    verification_code_hash = db.Column(db.String(256), nullable=True)
    verification_code_expires_at = db.Column(db.DateTime, nullable=True)
    verification_sent_at = db.Column(db.DateTime, nullable=True)
    password_reset_code_hash = db.Column(db.String(256), nullable=True)
    password_reset_code_expires_at = db.Column(db.DateTime, nullable=True)
    password_reset_sent_at = db.Column(db.DateTime, nullable=True)
    last_login_at = db.Column(db.DateTime, nullable=True)

    # OAuth
    oauth_provider = db.Column(db.String(20), nullable=True)
    oauth_provider_id = db.Column(db.String(256), nullable=True)
    avatar_url = db.Column(db.String(512), nullable=True)
    
    # Usage Quota (free-tier demo: 5 successful trainings per user)
    training_count = db.Column(db.Integer, server_default='0', nullable=False)
    
    # Relationships
    datasets = db.relationship('Dataset', backref='owner', lazy='dynamic')
    experiments = db.relationship('Experiment', backref='owner', lazy='dynamic')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check password against hash"""
        if not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)
    
    @property
    def is_whitelisted(self):
        """Check if this user's email is in the unlimited-access whitelist."""
        return (self.email or '').strip().lower() in _load_whitelist()

    @property
    def has_training_quota(self):
        """Check if the user still has training runs remaining (5 max), or is whitelisted."""
        if self.is_whitelisted:
            return True
        return (self.training_count or 0) < 5

    @property
    def trainings_remaining(self):
        """Number of training runs still available (-1 means unlimited)."""
        if self.is_whitelisted:
            return -1
        return max(0, 5 - (self.training_count or 0))
    
    def to_dict(self):
        """Serialize to dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active,
            'email_verified': self.email_verified,
            'last_login_at': self.last_login_at.isoformat() if self.last_login_at else None,
            'training_count': self.training_count or 0,
            'trainings_remaining': self.trainings_remaining,
            'has_training_quota': self.has_training_quota,
            'is_whitelisted': self.is_whitelisted,
            'oauth_provider': self.oauth_provider,
            'avatar_url': self.avatar_url,
        }
    
    def __repr__(self):
        return f'<User {self.username}>'
