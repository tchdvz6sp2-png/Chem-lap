from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, Chemical, Experiment, SafetyProtocol
from datetime import datetime, date, timedelta
import json

# Blueprints
auth_bp = Blueprint('auth', __name__)
inventory_bp = Blueprint('inventory', __name__)
experiments_bp = Blueprint('experiments', __name__)
safety_bp = Blueprint('safety', __name__)
dashboard_bp = Blueprint('dashboard', __name__)

# Authentication Routes
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password') or not data.get('email'):
        return jsonify({'error': 'Chybí povinná pole'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Uživatelské jméno již existuje'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email již existuje'}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        role=data.get('role', 'technician')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'Uživatel byl úspěšně vytvořen', 'user': user.to_dict()}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Chybí uživatelské jméno nebo heslo'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Neplatné uživatelské jméno nebo heslo'}), 401
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'access_token': access_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'Uživatel nenalezen'}), 404
    
    return jsonify(user.to_dict()), 200

# Inventory Routes
@inventory_bp.route('/', methods=['GET'])
@jwt_required()
def get_chemicals():
    chemicals = Chemical.query.all()
    return jsonify([chemical.to_dict() for chemical in chemicals]), 200

@inventory_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_chemical(id):
    chemical = Chemical.query.get(id)
    if not chemical:
        return jsonify({'error': 'Chemikálie nenalezena'}), 404
    return jsonify(chemical.to_dict()), 200

@inventory_bp.route('/', methods=['POST'])
@jwt_required()
def add_chemical():
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('quantity') or not data.get('unit'):
        return jsonify({'error': 'Chybí povinná pole'}), 400
    
    try:
        expiry_date = None
        if data.get('expiry_date'):
            expiry_date = datetime.strptime(data['expiry_date'], '%Y-%m-%d').date()
        
        chemical = Chemical(
            name=data['name'],
            cas_number=data.get('cas_number'),
            quantity=data['quantity'],
            unit=data['unit'],
            location=data.get('location'),
            expiry_date=expiry_date,
            minimum_stock=data.get('minimum_stock', 0),
            safety_info=data.get('safety_info')
        )
        
        db.session.add(chemical)
        db.session.commit()
        
        return jsonify(chemical.to_dict()), 201
    except ValueError as e:
        return jsonify({'error': f'Neplatný formát data. Použijte RRRR-MM-DD: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Nepodařilo se přidat chemikálii: {str(e)}'}), 500

@inventory_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_chemical(id):
    chemical = Chemical.query.get(id)
    if not chemical:
        return jsonify({'error': 'Chemikálie nenalezena'}), 404
    
    data = request.get_json()
    
    try:
        if 'name' in data:
            chemical.name = data['name']
        if 'cas_number' in data:
            chemical.cas_number = data['cas_number']
        if 'quantity' in data:
            chemical.quantity = data['quantity']
        if 'unit' in data:
            chemical.unit = data['unit']
        if 'location' in data:
            chemical.location = data['location']
        if 'expiry_date' in data:
            if data['expiry_date']:
                chemical.expiry_date = datetime.strptime(data['expiry_date'], '%Y-%m-%d').date()
            else:
                chemical.expiry_date = None
        if 'minimum_stock' in data:
            chemical.minimum_stock = data['minimum_stock']
        if 'safety_info' in data:
            chemical.safety_info = data['safety_info']
        
        db.session.commit()
        
        return jsonify(chemical.to_dict()), 200
    except ValueError as e:
        return jsonify({'error': f'Neplatný formát data. Použijte RRRR-MM-DD: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Nepodařilo se aktualizovat chemikálii: {str(e)}'}), 500

@inventory_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_chemical(id):
    chemical = Chemical.query.get(id)
    if not chemical:
        return jsonify({'error': 'Chemikálie nenalezena'}), 404
    
    db.session.delete(chemical)
    db.session.commit()
    
    return jsonify({'message': 'Chemikálie byla úspěšně smazána'}), 200

# Experiment Routes
@experiments_bp.route('/', methods=['GET'])
@jwt_required()
def get_experiments():
    experiments = Experiment.query.all()
    return jsonify([experiment.to_dict() for experiment in experiments]), 200

@experiments_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_experiment(id):
    experiment = Experiment.query.get(id)
    if not experiment:
        return jsonify({'error': 'Experiment nenalezen'}), 404
    return jsonify(experiment.to_dict()), 200

@experiments_bp.route('/', methods=['POST'])
@jwt_required()
def create_experiment():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('title'):
        return jsonify({'error': 'Chybí povinná pole'}), 400
    
    experiment = Experiment(
        title=data['title'],
        description=data.get('description'),
        procedure=data.get('procedure'),
        results=data.get('results'),
        chemicals_used=data.get('chemicals_used'),
        user_id=user_id,
        status=data.get('status', 'in_progress')
    )
    
    db.session.add(experiment)
    db.session.commit()
    
    return jsonify(experiment.to_dict()), 201

@experiments_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_experiment(id):
    experiment = Experiment.query.get(id)
    if not experiment:
        return jsonify({'error': 'Experiment nenalezen'}), 404
    
    data = request.get_json()
    
    if 'title' in data:
        experiment.title = data['title']
    if 'description' in data:
        experiment.description = data['description']
    if 'procedure' in data:
        experiment.procedure = data['procedure']
    if 'results' in data:
        experiment.results = data['results']
    if 'chemicals_used' in data:
        experiment.chemicals_used = data['chemicals_used']
    if 'status' in data:
        experiment.status = data['status']
    
    db.session.commit()
    
    return jsonify(experiment.to_dict()), 200

@experiments_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_experiment(id):
    experiment = Experiment.query.get(id)
    if not experiment:
        return jsonify({'error': 'Experiment nenalezen'}), 404
    
    db.session.delete(experiment)
    db.session.commit()
    
    return jsonify({'message': 'Experiment byl úspěšně smazán'}), 200

# Safety Protocol Routes
@safety_bp.route('/', methods=['GET'])
@jwt_required()
def get_protocols():
    protocols = SafetyProtocol.query.all()
    return jsonify([protocol.to_dict() for protocol in protocols]), 200

@safety_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_protocol(id):
    protocol = SafetyProtocol.query.get(id)
    if not protocol:
        return jsonify({'error': 'Bezpečnostní protokol nenalezen'}), 404
    return jsonify(protocol.to_dict()), 200

@safety_bp.route('/', methods=['POST'])
@jwt_required()
def create_protocol():
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('description'):
        return jsonify({'error': 'Chybí povinná pole'}), 400
    
    protocol = SafetyProtocol(
        title=data['title'],
        description=data['description'],
        category=data.get('category'),
        related_chemicals=data.get('related_chemicals')
    )
    
    db.session.add(protocol)
    db.session.commit()
    
    return jsonify(protocol.to_dict()), 201

@safety_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_protocol(id):
    protocol = SafetyProtocol.query.get(id)
    if not protocol:
        return jsonify({'error': 'Bezpečnostní protokol nenalezen'}), 404
    
    data = request.get_json()
    
    if 'title' in data:
        protocol.title = data['title']
    if 'description' in data:
        protocol.description = data['description']
    if 'category' in data:
        protocol.category = data['category']
    if 'related_chemicals' in data:
        protocol.related_chemicals = data['related_chemicals']
    
    db.session.commit()
    
    return jsonify(protocol.to_dict()), 200

@safety_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_protocol(id):
    protocol = SafetyProtocol.query.get(id)
    if not protocol:
        return jsonify({'error': 'Bezpečnostní protokol nenalezen'}), 404
    
    db.session.delete(protocol)
    db.session.commit()
    
    return jsonify({'message': 'Bezpečnostní protokol byl úspěšně smazán'}), 200

# Dashboard Routes
@dashboard_bp.route('/metrics', methods=['GET'])
@jwt_required()
def get_metrics():
    total_chemicals = Chemical.query.count()
    low_stock_chemicals = Chemical.query.filter(Chemical.quantity <= Chemical.minimum_stock).count()
    
    # Check for expiring chemicals (within 30 days)
    today = date.today()
    thirty_days_from_now = today + timedelta(days=30)
    expiring_chemicals = Chemical.query.filter(
        Chemical.expiry_date.isnot(None),
        Chemical.expiry_date <= thirty_days_from_now
    ).count()
    
    active_experiments = Experiment.query.filter_by(status='in_progress').count()
    total_experiments = Experiment.query.count()
    total_users = User.query.count()
    
    return jsonify({
        'total_chemicals': total_chemicals,
        'low_stock_chemicals': low_stock_chemicals,
        'expiring_chemicals': expiring_chemicals,
        'active_experiments': active_experiments,
        'total_experiments': total_experiments,
        'total_users': total_users
    }), 200

@dashboard_bp.route('/alerts', methods=['GET'])
@jwt_required()
def get_alerts():
    alerts = []
    
    # Low stock alerts
    low_stock = Chemical.query.filter(Chemical.quantity <= Chemical.minimum_stock).all()
    for chemical in low_stock:
        alerts.append({
            'type': 'low_stock',
            'severity': 'warning',
            'message': f'{chemical.name} má nízké zásoby ({chemical.quantity} {chemical.unit} zbývá)',
            'chemical_id': chemical.id
        })
    
    # Expiring soon alerts (within 30 days)
    today = date.today()
    thirty_days_from_now = today + timedelta(days=30)
    expiring = Chemical.query.filter(
        Chemical.expiry_date.isnot(None),
        Chemical.expiry_date <= thirty_days_from_now
    ).all()
    
    for chemical in expiring:
        alerts.append({
            'type': 'expiring',
            'severity': 'error',
            'message': f'{chemical.name} vyprší {chemical.expiry_date}',
            'chemical_id': chemical.id
        })
    
    return jsonify(alerts), 200
