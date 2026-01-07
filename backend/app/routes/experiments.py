from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Experiment, ExperimentChemical, User

experiments_bp = Blueprint('experiments', __name__, url_prefix='/api/experiments')

@experiments_bp.route('', methods=['GET'])
@jwt_required()
def get_experiments():
    """Get all experiments."""
    experiments = Experiment.query.order_by(Experiment.created_at.desc()).all()
    return jsonify({'experiments': [e.to_dict() for e in experiments]}), 200

@experiments_bp.route('/<int:experiment_id>', methods=['GET'])
@jwt_required()
def get_experiment(experiment_id):
    """Get a specific experiment."""
    experiment = Experiment.query.get(experiment_id)
    
    if not experiment:
        return jsonify({'error': 'Experiment not found'}), 404
    
    return jsonify({'experiment': experiment.to_dict()}), 200

@experiments_bp.route('', methods=['POST'])
@jwt_required()
def create_experiment():
    """Create a new experiment."""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('title'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    experiment = Experiment(
        title=data['title'],
        description=data.get('description'),
        procedure=data.get('procedure'),
        results=data.get('results'),
        status=data.get('status', 'planned'),
        user_id=current_user_id
    )
    
    db.session.add(experiment)
    db.session.commit()
    
    # Add chemicals used if provided
    if data.get('chemicals_used'):
        for chem in data['chemicals_used']:
            exp_chem = ExperimentChemical(
                experiment_id=experiment.id,
                chemical_id=chem['chemical_id'],
                quantity_used=chem['quantity_used'],
                unit=chem['unit']
            )
            db.session.add(exp_chem)
        db.session.commit()
    
    return jsonify({'message': 'Experiment created successfully', 'experiment': experiment.to_dict()}), 201

@experiments_bp.route('/<int:experiment_id>', methods=['PUT'])
@jwt_required()
def update_experiment(experiment_id):
    """Update an experiment."""
    current_user_id = get_jwt_identity()
    experiment = Experiment.query.get(experiment_id)
    
    if not experiment:
        return jsonify({'error': 'Experiment not found'}), 404
    
    # Check if user owns the experiment or is admin
    user = User.query.get(current_user_id)
    if experiment.user_id != current_user_id and user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    if 'title' in data:
        experiment.title = data['title']
    if 'description' in data:
        experiment.description = data['description']
    if 'procedure' in data:
        experiment.procedure = data['procedure']
    if 'results' in data:
        experiment.results = data['results']
    if 'status' in data:
        experiment.status = data['status']
    
    db.session.commit()
    
    return jsonify({'message': 'Experiment updated successfully', 'experiment': experiment.to_dict()}), 200

@experiments_bp.route('/<int:experiment_id>', methods=['DELETE'])
@jwt_required()
def delete_experiment(experiment_id):
    """Delete an experiment."""
    current_user_id = get_jwt_identity()
    experiment = Experiment.query.get(experiment_id)
    
    if not experiment:
        return jsonify({'error': 'Experiment not found'}), 404
    
    # Check if user owns the experiment or is admin
    user = User.query.get(current_user_id)
    if experiment.user_id != current_user_id and user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(experiment)
    db.session.commit()
    
    return jsonify({'message': 'Experiment deleted successfully'}), 200

@experiments_bp.route('/my', methods=['GET'])
@jwt_required()
def get_my_experiments():
    """Get current user's experiments."""
    current_user_id = get_jwt_identity()
    experiments = Experiment.query.filter_by(user_id=current_user_id).order_by(Experiment.created_at.desc()).all()
    return jsonify({'experiments': [e.to_dict() for e in experiments]}), 200
