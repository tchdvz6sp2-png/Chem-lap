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
            print("Vytvořen administrátorský uživatel")
        
        # Create sample chemicals
        if Chemical.query.count() == 0:
            chemicals = [
                Chemical(
                    name='Kyselina chlorovodíková',
                    cas_number='7647-01-0',
                    quantity=500,
                    unit='ml',
                    location='Skříň A1',
                    expiry_date=date.today() + timedelta(days=365),
                    minimum_stock=100,
                    safety_info='Žíravina - noste OOP včetně rukavic, brýlí a laboratorního pláště'
                ),
                Chemical(
                    name='Hydroxid sodný',
                    cas_number='1310-73-2',
                    quantity=250,
                    unit='g',
                    location='Skříň A2',
                    expiry_date=date.today() + timedelta(days=180),
                    minimum_stock=50,
                    safety_info='Žíravina - zabraňte kontaktu s pokožkou a očima'
                ),
                Chemical(
                    name='Ethanol',
                    cas_number='64-17-5',
                    quantity=1000,
                    unit='ml',
                    location='Skříň pro hořlaviny',
                    expiry_date=date.today() + timedelta(days=730),
                    minimum_stock=200,
                    safety_info='Hořlavina - uchovávejte mimo zdroje tepla'
                ),
                Chemical(
                    name='Kyselina sírová',
                    cas_number='7664-93-9',
                    quantity=50,
                    unit='ml',
                    location='Skříň A1',
                    expiry_date=date.today() + timedelta(days=30),
                    minimum_stock=100,
                    safety_info='Silně žíravá - manipulujte s maximální opatrností'
                ),
            ]
            db.session.add_all(chemicals)
            print(f"Vytvořeno {len(chemicals)} ukázkových chemikálií")
        
        # Create safety protocols
        if SafetyProtocol.query.count() == 0:
            protocols = [
                SafetyProtocol(
                    title='Obecná laboratorní bezpečnost',
                    description='Vždy noste vhodné OOP včetně laboratorního pláště, ochranných brýlí a rukavic. V laboratoři nejezte ani nepijte. Zjistěte umístění bezpečnostního vybavení.',
                    category='general'
                ),
                SafetyProtocol(
                    title='Manipulace s žíravinami',
                    description='Noste rukavice odolné proti kyselinám a obličejový štít při manipulaci s žíravinami. Pracujte v digestoři, je-li to možné. Mějte připravené neutralizační činidla.',
                    category='chemical_specific',
                    related_chemicals='["HCl", "NaOH", "H2SO4"]'
                ),
                SafetyProtocol(
                    title='Nouzové postupy',
                    description='V případě úniku chemikálie: evakuujte oblast, upozorněte ostatní, zadržte únik, je-li to bezpečné, informujte nadřízeného. Při zranění: okamžitě použijte oční sprchu/bezpečnostní sprchu, vyhledejte lékařskou pomoc.',
                    category='emergency'
                ),
                SafetyProtocol(
                    title='Osobní ochranné prostředky',
                    description='Minimální požadavky na OOP: ochranné brýle, laboratorní plášť, uzavřená obuv, dlouhé kalhoty. Další OOP dle konkrétních nebezpečí.',
                    category='ppe'
                ),
            ]
            db.session.add_all(protocols)
            print(f"Vytvořeno {len(protocols)} bezpečnostních protokolů")
        
        db.session.commit()
        print("Naplnění databáze úspěšně dokončeno!")

if __name__ == '__main__':
    seed_data()
