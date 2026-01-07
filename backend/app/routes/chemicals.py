from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Chemical, User
from datetime import datetime

chemicals_bp = Blueprint('chemicals', __name__, url_prefix='/api/chemicals')

def check_admin_role():
    """Check if current user is admin."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return user and user.role == 'admin'

@chemicals_bp.route('', methods=['GET'])
@jwt_required()
def get_chemicals():
    """Get all chemicals."""
    chemicals = Chemical.query.all()
    return jsonify({'chemicals': [c.to_dict() for c in chemicals]}), 200

@chemicals_bp.route('/<int:chemical_id>', methods=['GET'])
@jwt_required()
def get_chemical(chemical_id):
    """Get a specific chemical."""
    chemical = Chemical.query.get(chemical_id)
    
    if not chemical:
        return jsonify({'error': 'Chemical not found'}), 404
    
    return jsonify({'chemical': chemical.to_dict()}), 200

@chemicals_bp.route('', methods=['POST'])
@jwt_required()
def create_chemical():
    """Create a new chemical."""
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('quantity') or not data.get('unit'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    chemical = Chemical(
        name=data['name'],
        formula=data.get('formula'),
        cas_number=data.get('cas_number'),
        quantity=data['quantity'],
        unit=data['unit'],
        location=data.get('location'),
        expiry_date=datetime.fromisoformat(data['expiry_date']) if data.get('expiry_date') else None,
        minimum_stock=data.get('minimum_stock', 0),
        hazard_class=data.get('hazard_class')
    )
    
    db.session.add(chemical)
    db.session.commit()
    
    return jsonify({'message': 'Chemical created successfully', 'chemical': chemical.to_dict()}), 201

@chemicals_bp.route('/<int:chemical_id>', methods=['PUT'])
@jwt_required()
def update_chemical(chemical_id):
    """Update a chemical."""
    chemical = Chemical.query.get(chemical_id)
    
    if not chemical:
        return jsonify({'error': 'Chemical not found'}), 404
    
    data = request.get_json()
    
    if 'name' in data:
        chemical.name = data['name']
    if 'formula' in data:
        chemical.formula = data['formula']
    if 'cas_number' in data:
        chemical.cas_number = data['cas_number']
    if 'quantity' in data:
        chemical.quantity = data['quantity']
    if 'unit' in data:
        chemical.unit = data['unit']
    if 'location' in data:
        chemical.location = data['location']
    if 'expiry_date' in data:
        chemical.expiry_date = datetime.fromisoformat(data['expiry_date']) if data['expiry_date'] else None
    if 'minimum_stock' in data:
        chemical.minimum_stock = data['minimum_stock']
    if 'hazard_class' in data:
        chemical.hazard_class = data['hazard_class']
    
    db.session.commit()
    
    return jsonify({'message': 'Chemical updated successfully', 'chemical': chemical.to_dict()}), 200

@chemicals_bp.route('/<int:chemical_id>', methods=['DELETE'])
@jwt_required()
def delete_chemical(chemical_id):
    """Delete a chemical."""
    if not check_admin_role():
        return jsonify({'error': 'Unauthorized. Admin role required.'}), 403
    
    chemical = Chemical.query.get(chemical_id)
    
    if not chemical:
        return jsonify({'error': 'Chemical not found'}), 404
    
    db.session.delete(chemical)
    db.session.commit()
    
    return jsonify({'message': 'Chemical deleted successfully'}), 200

@chemicals_bp.route('/low-stock', methods=['GET'])
@jwt_required()
def get_low_stock():
    """Get chemicals with low stock."""
    chemicals = Chemical.query.filter(Chemical.quantity <= Chemical.minimum_stock).all()
    return jsonify({'chemicals': [c.to_dict() for c in chemicals]}), 200

@chemicals_bp.route('/expiring-soon', methods=['GET'])
@jwt_required()
def get_expiring_soon():
    """Get chemicals expiring soon (within 30 days)."""
    from datetime import date, timedelta
    thirty_days_from_now = date.today() + timedelta(days=30)
    
    chemicals = Chemical.query.filter(
        Chemical.expiry_date.isnot(None),
        Chemical.expiry_date <= thirty_days_from_now
    ).all()
    
    return jsonify({'chemicals': [c.to_dict() for c in chemicals]}), 200
