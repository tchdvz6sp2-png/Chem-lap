from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config.config import config
from app.models import db

def create_app(config_name='development'):
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    CORS(app)
    JWTManager(app)
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.chemicals import chemicals_bp
    from app.routes.experiments import experiments_bp
    from app.routes.safety import safety_bp
    from app.routes.dashboard import dashboard_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(chemicals_bp)
    app.register_blueprint(experiments_bp)
    app.register_blueprint(safety_bp)
    app.register_blueprint(dashboard_bp)
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    @app.route('/')
    def index():
        return {'message': 'Laboratory Management API', 'version': '1.0.0'}, 200
    
    return app

if __name__ == '__main__':
    import os
    app = create_app()
    # Only enable debug mode in development
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)
