from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, SafetyProtocol, User

safety_bp = Blueprint('safety', __name__, url_prefix='/api/safety-protocols')

def check_admin_role():
    """Check if current user is admin."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return user and user.role == 'admin'

@safety_bp.route('', methods=['GET'])
@jwt_required()
def get_safety_protocols():
    """Get all safety protocols."""
    protocols = SafetyProtocol.query.all()
    return jsonify({'protocols': [p.to_dict() for p in protocols]}), 200

@safety_bp.route('/<int:protocol_id>', methods=['GET'])
@jwt_required()
def get_safety_protocol(protocol_id):
    """Get a specific safety protocol."""
    protocol = SafetyProtocol.query.get(protocol_id)
    
    if not protocol:
        return jsonify({'error': 'Safety protocol not found'}), 404
    
    return jsonify({'protocol': protocol.to_dict()}), 200

@safety_bp.route('', methods=['POST'])
@jwt_required()
def create_safety_protocol():
    """Create a new safety protocol."""
    if not check_admin_role():
        return jsonify({'error': 'Unauthorized. Admin role required.'}), 403
    
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('description'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    protocol = SafetyProtocol(
        title=data['title'],
        description=data['description'],
        category=data.get('category'),
        applicable_to=data.get('applicable_to')
    )
    
    db.session.add(protocol)
    db.session.commit()
    
    return jsonify({'message': 'Safety protocol created successfully', 'protocol': protocol.to_dict()}), 201

@safety_bp.route('/<int:protocol_id>', methods=['PUT'])
@jwt_required()
def update_safety_protocol(protocol_id):
    """Update a safety protocol."""
    if not check_admin_role():
        return jsonify({'error': 'Unauthorized. Admin role required.'}), 403
    
    protocol = SafetyProtocol.query.get(protocol_id)
    
    if not protocol:
        return jsonify({'error': 'Safety protocol not found'}), 404
    
    data = request.get_json()
    
    if 'title' in data:
        protocol.title = data['title']
    if 'description' in data:
        protocol.description = data['description']
    if 'category' in data:
        protocol.category = data['category']
    if 'applicable_to' in data:
        protocol.applicable_to = data['applicable_to']
    
    db.session.commit()
    
    return jsonify({'message': 'Safety protocol updated successfully', 'protocol': protocol.to_dict()}), 200

@safety_bp.route('/<int:protocol_id>', methods=['DELETE'])
@jwt_required()
def delete_safety_protocol(protocol_id):
    """Delete a safety protocol."""
    if not check_admin_role():
        return jsonify({'error': 'Unauthorized. Admin role required.'}), 403
    
    protocol = SafetyProtocol.query.get(protocol_id)
    
    if not protocol:
        return jsonify({'error': 'Safety protocol not found'}), 404
    
    db.session.delete(protocol)
    db.session.commit()
    
    return jsonify({'message': 'Safety protocol deleted successfully'}), 200

@safety_bp.route('/category/<string:category>', methods=['GET'])
@jwt_required()
def get_protocols_by_category(category):
    """Get safety protocols by category."""
    protocols = SafetyProtocol.query.filter_by(category=category).all()
    return jsonify({'protocols': [p.to_dict() for p in protocols]}), 200
