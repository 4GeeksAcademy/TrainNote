from app import app, db
from api.models import BikeModel
from datetime import datetime

with app.app_context():
    # Limpiar tabla primero (opcional)
    # BikeModel.query.delete()
    
    bikes = [
        # TREK
        BikeModel(brand='Trek', model_name='Marlin 5', model_year=2024, bike_type='Mountain', 
                  description='Mountain bike de entrada. Horquilla SR Suntour, ruedas 29", ideal para principiantes', created_at=datetime.utcnow()),
        BikeModel(brand='Trek', model_name='Marlin 7', model_year=2024, bike_type='Mountain',
                  description='Mountain bike versátil. Suspensión delantera, componentes Shimano, buena relación precio', created_at=datetime.utcnow()),
        BikeModel(brand='Trek', model_name='Rockhopper', model_year=2024, bike_type='Mountain',
                  description='Mountain bike hardtail robusto. Perfecto para senderos técnicos', created_at=datetime.utcnow()),
        BikeModel(brand='Trek', model_name='X-Caliber', model_year=2024, bike_type='Mountain',
                  description='XC race bike de alto rendimiento. Marco en aluminio, muy ligero', created_at=datetime.utcnow()),
        BikeModel(brand='Trek', model_name='FX 3', model_year=2024, bike_type='Hybrid',
                  description='Bicicleta de trekking versátil. Posición cómoda, apta para carretera y caminos', created_at=datetime.utcnow()),
        
        # SPECIALIZED
        BikeModel(brand='Specialized', model_name='Rockhopper', model_year=2024, bike_type='Mountain',
                  description='Mountain bike de entrada. Ruedas 27.5", componentes confiables', created_at=datetime.utcnow()),
        BikeModel(brand='Specialized', model_name='Stumpjumper', model_year=2024, bike_type='Mountain',
                  description='All-mountain bike de alto rendimiento. Suspensión dual completa', created_at=datetime.utcnow()),
        BikeModel(brand='Specialized', model_name='Diverge', model_year=2024, bike_type='Gravel',
                  description='Gravel bike versátil. Excelente para grava y asfalto', created_at=datetime.utcnow()),
        BikeModel(brand='Specialized', model_name='Hardrock', model_year=2024, bike_type='Mountain',
                  description='Hardtail de entrada económico. Perfecto para aprender', created_at=datetime.utcnow()),
        BikeModel(brand='Specialized', model_name='Sirrus X', model_year=2024, bike_type='Hybrid',
                  description='Bicicleta urbana rápida. Posición más agresiva que las híbridas tradicionales', created_at=datetime.utcnow()),
        
        # GIANT
        BikeModel(brand='Giant', model_name='Talon', model_year=2024, bike_type='Mountain',
                  description='Mountain bike hardtail versátil. Ruedas 29" para mejor rodadura', created_at=datetime.utcnow()),
        BikeModel(brand='Giant', model_name='Stance', model_year=2024, bike_type='Mountain',
                  description='Mountain bike de suspensión dual. Muy manejable en terreno técnico', created_at=datetime.utcnow()),
        BikeModel(brand='Giant', model_name='Escape', model_year=2024, bike_type='Hybrid',
                  description='Bicicleta urbana cómoda. Ideal para desplazamientos y paseos', created_at=datetime.utcnow()),
        BikeModel(brand='Giant', model_name='Escape 3', model_year=2024, bike_type='Hybrid',
                  description='Bicicleta de entrada muy económica. Buena para iniciarse', created_at=datetime.utcnow()),
        BikeModel(brand='Giant', model_name='Beyond', model_year=2024, bike_type='Road',
                  description='Bicicleta de carretera endurance. Confortable para largas distancias', created_at=datetime.utcnow()),
        
        # SCOTT
        BikeModel(brand='Scott', model_name='Aspect', model_year=2024, bike_type='Mountain',
                  description='Mountain bike hardtail. Excelente relación precio-rendimiento', created_at=datetime.utcnow()),
        BikeModel(brand='Scott', model_name='Spark', model_year=2024, bike_type='Mountain',
                  description='XC race bike. Marco de carbono, muy ligero y responsivo', created_at=datetime.utcnow()),
        BikeModel(brand='Scott', model_name='Sub Cross', model_year=2024, bike_type='Gravel',
                  description='Gravel bike versátil. Perfecta para aventuras multiusos', created_at=datetime.utcnow()),
        BikeModel(brand='Scott', model_name='Speedster', model_year=2024, bike_type='Hybrid',
                  description='Bicicleta urbana de velocidad. Componentes de calidad', created_at=datetime.utcnow()),
        
        # CANNONDALE
        BikeModel(brand='Cannondale', model_name='Trail', model_year=2024, bike_type='Mountain',
                  description='Mountain bike trail versátil. Suspensión balanceada', created_at=datetime.utcnow()),
        BikeModel(brand='Cannondale', model_name='Cujo', model_year=2024, bike_type='Mountain',
                  description='Mountain bike fat bike. Neumáticos anchos para terrenos extremos', created_at=datetime.utcnow()),
        BikeModel(brand='Cannondale', model_name='Quick', model_year=2024, bike_type='Hybrid',
                  description='Bicicleta rápida urbana. Posición deportiva', created_at=datetime.utcnow()),
        BikeModel(brand='Cannondale', model_name='Synapse', model_year=2024, bike_type='Road',
                  description='Bicicleta de carretera endurance. Muy cómoda', created_at=datetime.utcnow()),
        
        # Agrega más si quieres...
    ]
    
    db.session.bulk_save_objects(bikes)
    db.session.commit()
    
    print(f"✓ Se agregaron {len(bikes)} modelos de bicicletas exitosamente")
