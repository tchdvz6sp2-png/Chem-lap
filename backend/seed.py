"""
Seed the database with initial data for testing and demonstration
"""
from app import create_app
from models import db, User, Chemical, SafetyProtocol, Experiment
from datetime import date, timedelta

def seed_data():
    app = create_app()
    with app.app_context():
        # Create admin user
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            admin = User(username='admin', email='admin@chemlap.com', role='admin')
            admin.set_password('admin123')
            db.session.add(admin)
            print("Created admin user")
        
        # Create sample chemicals
        if Chemical.query.count() == 0:
            chemicals = [
                Chemical(
                    name='Hydrochloric Acid',
                    cas_number='7647-01-0',
                    quantity=500,
                    unit='ml',
                    location='Cabinet A1',
                    expiry_date=date.today() + timedelta(days=365),
                    minimum_stock=100,
                    safety_info='Corrosive - wear PPE including gloves, goggles, and lab coat'
                ),
                Chemical(
                    name='Sodium Hydroxide',
                    cas_number='1310-73-2',
                    quantity=250,
                    unit='g',
                    location='Cabinet A2',
                    expiry_date=date.today() + timedelta(days=180),
                    minimum_stock=50,
                    safety_info='Corrosive - avoid contact with skin and eyes'
                ),
                Chemical(
                    name='Ethanol',
                    cas_number='64-17-5',
                    quantity=1000,
                    unit='ml',
                    location='Flammables Cabinet',
                    expiry_date=date.today() + timedelta(days=730),
                    minimum_stock=200,
                    safety_info='Flammable - keep away from heat sources'
                ),
                Chemical(
                    name='Sulfuric Acid',
                    cas_number='7664-93-9',
                    quantity=50,
                    unit='ml',
                    location='Cabinet A1',
                    expiry_date=date.today() + timedelta(days=30),
                    minimum_stock=100,
                    safety_info='Highly corrosive - handle with extreme care'
                ),
            ]
            db.session.add_all(chemicals)
            print(f"Created {len(chemicals)} sample chemicals")
        
        # Create safety protocols
        if SafetyProtocol.query.count() == 0:
            protocols = [
                SafetyProtocol(
                    title='General Laboratory Safety',
                    description='Always wear appropriate PPE including lab coat, safety goggles, and gloves. No eating or drinking in the lab. Know the location of safety equipment.',
                    category='general'
                ),
                SafetyProtocol(
                    title='Handling Corrosive Chemicals',
                    description='Wear acid-resistant gloves and face shield when handling corrosive substances. Work in fume hood when possible. Have neutralizing agents readily available.',
                    category='chemical_specific',
                    related_chemicals='["HCl", "NaOH", "H2SO4"]'
                ),
                SafetyProtocol(
                    title='Emergency Procedures',
                    description='In case of chemical spill: evacuate area, alert others, contain spill if safe, notify supervisor. For injuries: use eyewash/shower immediately, seek medical attention.',
                    category='emergency'
                ),
                SafetyProtocol(
                    title='Personal Protective Equipment',
                    description='Minimum PPE requirements: safety goggles, lab coat, closed-toe shoes, long pants. Additional PPE based on specific hazards.',
                    category='ppe'
                ),
            ]
            db.session.add_all(protocols)
            print(f"Created {len(protocols)} safety protocols")
        
        db.session.commit()
        print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed_data()
