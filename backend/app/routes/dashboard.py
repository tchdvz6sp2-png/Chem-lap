from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.models import db, Chemical, Experiment, User, SafetyProtocol
from datetime import date, timedelta

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@dashboard_bp.route('/metrics', methods=['GET'])
@jwt_required()
def get_metrics():
    """Get dashboard metrics."""
    # Count totals
    total_chemicals = Chemical.query.count()
    total_experiments = Experiment.query.count()
    total_users = User.query.count()
    total_protocols = SafetyProtocol.query.count()
    
    # Get active experiments
    active_experiments = Experiment.query.filter(
        Experiment.status.in_(['planned', 'in_progress'])
    ).count()
    
    # Get low stock chemicals
    low_stock_count = Chemical.query.filter(
        Chemical.quantity <= Chemical.minimum_stock
    ).count()
    
    # Get expiring chemicals (within 30 days)
    thirty_days_from_now = date.today() + timedelta(days=30)
    expiring_count = Chemical.query.filter(
        Chemical.expiry_date.isnot(None),
        Chemical.expiry_date <= thirty_days_from_now
    ).count()
    
    # Get recent experiments
    recent_experiments = Experiment.query.order_by(
        Experiment.updated_at.desc()
    ).limit(5).all()
    
    return jsonify({
        'metrics': {
            'total_chemicals': total_chemicals,
            'total_experiments': total_experiments,
            'total_users': total_users,
            'total_protocols': total_protocols,
            'active_experiments': active_experiments,
            'low_stock_count': low_stock_count,
            'expiring_count': expiring_count
        },
        'recent_experiments': [e.to_dict() for e in recent_experiments]
    }), 200

@dashboard_bp.route('/alerts', methods=['GET'])
@jwt_required()
def get_alerts():
    """Get all alerts (low stock and expiring chemicals)."""
    alerts = []
    
    # Low stock alerts
    low_stock_chemicals = Chemical.query.filter(
        Chemical.quantity <= Chemical.minimum_stock
    ).all()
    
    for chemical in low_stock_chemicals:
        alerts.append({
            'type': 'low_stock',
            'severity': 'warning',
            'message': f'{chemical.name} is low on stock ({chemical.quantity} {chemical.unit})',
            'chemical_id': chemical.id,
            'chemical': chemical.to_dict()
        })
    
    # Expiring chemicals alerts
    thirty_days_from_now = date.today() + timedelta(days=30)
    expiring_chemicals = Chemical.query.filter(
        Chemical.expiry_date.isnot(None),
        Chemical.expiry_date <= thirty_days_from_now
    ).all()
    
    for chemical in expiring_chemicals:
        days_until_expiry = (chemical.expiry_date - date.today()).days
        severity = 'critical' if days_until_expiry < 7 else 'warning'
        alerts.append({
            'type': 'expiring',
            'severity': severity,
            'message': f'{chemical.name} expires in {days_until_expiry} days',
            'chemical_id': chemical.id,
            'days_until_expiry': days_until_expiry,
            'chemical': chemical.to_dict()
        })
    
    return jsonify({'alerts': alerts}), 200
