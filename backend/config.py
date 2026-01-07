import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///lab_management.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # Production warning
    @classmethod
    def init_app(cls):
        if cls.SECRET_KEY == 'dev-secret-key-change-in-production':
            import warnings
            warnings.warn(
                'Using default SECRET_KEY in production is insecure! '
                'Set the SECRET_KEY environment variable.',
                stacklevel=2
            )
