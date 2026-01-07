from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    """User model for authentication and authorization."""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='technician')  # admin, technician, viewer
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    experiments = db.relationship('Experiment', backref='user', lazy=True)
    
    def set_password(self, password):
        """Hash and set the password."""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if the provided password matches the hash."""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user to dictionary."""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }

class Chemical(db.Model):
    """Chemical inventory model."""
    __tablename__ = 'chemicals'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    formula = db.Column(db.String(100))
    cas_number = db.Column(db.String(50))
    quantity = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(20), nullable=False)  # g, ml, L, etc.
    location = db.Column(db.String(100))
    expiry_date = db.Column(db.Date)
    minimum_stock = db.Column(db.Float, default=0)
    hazard_class = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert chemical to dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'formula': self.formula,
            'cas_number': self.cas_number,
            'quantity': self.quantity,
            'unit': self.unit,
            'location': self.location,
            'expiry_date': self.expiry_date.isoformat() if self.expiry_date else None,
            'minimum_stock': self.minimum_stock,
            'hazard_class': self.hazard_class,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Experiment(db.Model):
    """Experiment log model."""
    __tablename__ = 'experiments'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    procedure = db.Column(db.Text)
    results = db.Column(db.Text)
    status = db.Column(db.String(20), default='in_progress')  # planned, in_progress, completed
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    chemicals_used = db.relationship('ExperimentChemical', backref='experiment', lazy=True)
    
    def to_dict(self):
        """Convert experiment to dictionary."""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'procedure': self.procedure,
            'results': self.results,
            'status': self.status,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'chemicals_used': [ec.to_dict() for ec in self.chemicals_used]
        }

class ExperimentChemical(db.Model):
    """Association table for chemicals used in experiments."""
    __tablename__ = 'experiment_chemicals'
    
    id = db.Column(db.Integer, primary_key=True)
    experiment_id = db.Column(db.Integer, db.ForeignKey('experiments.id'), nullable=False)
    chemical_id = db.Column(db.Integer, db.ForeignKey('chemicals.id'), nullable=False)
    quantity_used = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(20), nullable=False)
    
    chemical = db.relationship('Chemical')
    
    def to_dict(self):
        """Convert experiment chemical to dictionary."""
        return {
            'id': self.id,
            'chemical_id': self.chemical_id,
            'chemical_name': self.chemical.name if self.chemical else None,
            'quantity_used': self.quantity_used,
            'unit': self.unit
        }

class SafetyProtocol(db.Model):
    """Safety protocols model."""
    __tablename__ = 'safety_protocols'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50))  # general, chemical_specific, equipment, emergency
    applicable_to = db.Column(db.String(200))  # specific chemicals or equipment
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert safety protocol to dictionary."""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'applicable_to': self.applicable_to,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
