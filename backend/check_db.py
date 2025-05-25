#!/usr/bin/env python3
import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración de base de datos
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "postgres")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

def test_connection():
    """Prueba la conexión a la base de datos"""
    try:
        print(f"🔍 Probando conexión a: {DB_HOST}:{DB_PORT}")
        print(f"📦 Base de datos: {DB_NAME}")
        print(f"👤 Usuario: {DB_USER}")
        print("-" * 50)
        
        engine = create_engine(DATABASE_URL)
        
        with engine.connect() as connection:
            # Verificar conexión
            result = connection.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            print(f"✅ Conexión exitosa!")
            print(f"📊 Versión PostgreSQL: {version}")
            
            # Verificar tablas existentes
            result = connection.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public';
            """))
            
            tables = [row[0] for row in result.fetchall()]
            print(f"\n📋 Tablas existentes: {len(tables)}")
            for table in tables:
                print(f"  - {table}")
            
            # Verificar datos en prospects si existe
            if 'prospects' in tables:
                result = connection.execute(text("SELECT COUNT(*) FROM prospects;"))
                count = result.fetchone()[0]
                print(f"\n👥 Total de prospectos: {count}")
                
                if count > 0:
                    result = connection.execute(text("SELECT * FROM prospects LIMIT 3;"))
                    rows = result.fetchall()
                    print("\n🔍 Muestra de datos:")
                    for row in rows:
                        print(f"  ID: {row[0]}, Nombre: {row[3]}, Email: {row[4]}")
            else:
                print("\n⚠️  Tabla 'prospects' no existe")
                
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False
    
    return True

def create_sample_data():
    """Crea datos de ejemplo si no existen"""
    try:
        engine = create_engine(DATABASE_URL)
        
        with engine.connect() as connection:
            # Crear tablas si no existen
            connection.execute(text("""
                CREATE TABLE IF NOT EXISTS prospects (
                    id SERIAL PRIMARY KEY,
                    dni VARCHAR(20) UNIQUE NOT NULL,
                    full_name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    phone VARCHAR(50),
                    city VARCHAR(100),
                    status VARCHAR(50) DEFAULT 'nuevo',
                    origin VARCHAR(50),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """))
            
            connection.execute(text("""
                CREATE TABLE IF NOT EXISTS interactions (
                    id SERIAL PRIMARY KEY,
                    prospect_id INTEGER REFERENCES prospects(id),
                    interaction_type VARCHAR(50) NOT NULL,
                    description TEXT,
                    interaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    advisor_id INTEGER,
                    notes TEXT
                );
            """))
            
            connection.execute(text("""
                CREATE TABLE IF NOT EXISTS tests (
                    id SERIAL PRIMARY KEY,
                    prospect_id INTEGER REFERENCES prospects(id),
                    test_type VARCHAR(50) NOT NULL,
                    score INTEGER,
                    max_score INTEGER,
                    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    results JSONB
                );
            """))
            
            connection.execute(text("""
                CREATE TABLE IF NOT EXISTS advisories (
                    id SERIAL PRIMARY KEY,
                    prospect_id INTEGER REFERENCES prospects(id),
                    advisor_name VARCHAR(255),
                    advisory_type VARCHAR(50),
                    description TEXT,
                    scheduled_date TIMESTAMP,
                    completed_date TIMESTAMP,
                    status VARCHAR(50) DEFAULT 'pending'
                );
            """))
            
            connection.execute(text("""
                CREATE TABLE IF NOT EXISTS centers (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    city VARCHAR(100),
                    address TEXT,
                    is_active BOOLEAN DEFAULT true,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """))
            
            connection.execute(text("""
                CREATE TABLE IF NOT EXISTS devices (
                    id SERIAL PRIMARY KEY,
                    center_id INTEGER REFERENCES centers(id),
                    device_name VARCHAR(255),
                    device_type VARCHAR(100),
                    is_active BOOLEAN DEFAULT true,
                    last_check TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """))
            
            connection.commit()
            print("✅ Tablas creadas exitosamente")
            
            # Verificar si ya existen datos
            result = connection.execute(text("SELECT COUNT(*) FROM prospects;"))
            prospect_count = result.fetchone()[0]
            
            if prospect_count == 0:
                print("📝 Insertando datos de ejemplo...")
                
                # Insertar datos de ejemplo
                sample_prospects = [
                    ("12345678", "Juan Carlos Pérez", "juan.perez@email.com", "+51987654321", "Lima", "nuevo", "web"),
                    ("87654321", "María González", "maria.gonzalez@email.com", "+51987654322", "Huancayo", "contactado", "facebook"),
                    ("11223344", "Carlos Rodríguez", "carlos.rodriguez@email.com", "+51987654323", "Arequipa", "en_proceso", "instagram"),
                    ("44332211", "Ana López", "ana.lopez@email.com", "+51987654324", "Cusco", "matriculado", "whatsapp"),
                    ("55667788", "Pedro Martínez", "pedro.martinez@email.com", "+51987654325", "Lima", "no_interesado", "referido"),
                ]
                
                for dni, name, email, phone, city, status, origin in sample_prospects:
                    connection.execute(text("""
                        INSERT INTO prospects (dni, full_name, email, phone, city, status, origin)
                        VALUES (:dni, :name, :email, :phone, :city, :status, :origin)
                    """), {
                        "dni": dni, "name": name, "email": email, "phone": phone, 
                        "city": city, "status": status, "origin": origin
                    })
                
                # Insertar más datos para tener 127 prospectos como en el ejemplo anterior
                cities = ["Lima", "Huancayo", "Junín", "Arequipa", "Cusco", "Trujillo", "Chiclayo", "Piura"]
                statuses = ["nuevo", "contactado", "en_proceso", "matriculado", "no_interesado"]
                origins = ["web", "facebook", "instagram", "whatsapp", "referido"]
                
                import random
                
                for i in range(6, 128):  # Del 6 al 127 (122 prospectos más)
                    dni = f"{10000000 + i}"
                    name = f"Prospecto {i:03d}"
                    email = f"prospecto{i:03d}@email.com"
                    phone = f"+5198765{i:04d}"
                    city = random.choice(cities)
                    status = random.choice(statuses)
                    origin = random.choice(origins)
                    
                    connection.execute(text("""
                        INSERT INTO prospects (dni, full_name, email, phone, city, status, origin)
                        VALUES (:dni, :name, :email, :phone, :city, :status, :origin)
                    """), {
                        "dni": dni, "name": name, "email": email, "phone": phone,
                        "city": city, "status": status, "origin": origin
                    })
                
                # Insertar interacciones de ejemplo
                for i in range(1, 184):  # 183 interacciones
                    prospect_id = random.randint(1, 127)
                    interaction_types = ["llamada", "email", "whatsapp", "visita"]
                    interaction_type = random.choice(interaction_types)
                    description = f"Interacción {interaction_type} #{i}"
                    
                    connection.execute(text("""
                        INSERT INTO interactions (prospect_id, interaction_type, description, advisor_id)
                        VALUES (:prospect_id, :interaction_type, :description, :advisor_id)
                    """), {
                        "prospect_id": prospect_id,
                        "interaction_type": interaction_type,
                        "description": description,
                        "advisor_id": random.randint(1, 5)
                    })
                
                # Insertar tests completados
                for i in range(1, 61):  # 60 tests
                    prospect_id = random.randint(1, 127)
                    test_types = ["vocacional", "aptitud", "personalidad"]
                    test_type = random.choice(test_types)
                    score = random.randint(60, 100)
                    
                    connection.execute(text("""
                        INSERT INTO tests (prospect_id, test_type, score, max_score)
                        VALUES (:prospect_id, :test_type, :score, :max_score)
                    """), {
                        "prospect_id": prospect_id,
                        "test_type": test_type,
                        "score": score,
                        "max_score": 100
                    })
                
                # Insertar asesorías
                for i in range(1, 31):  # 30 asesorías
                    prospect_id = random.randint(1, 127)
                    advisor_names = ["Dr. López", "Lic. García", "Ing. Martínez", "Dra. Rodríguez"]
                    advisor_name = random.choice(advisor_names)
                    
                    connection.execute(text("""
                        INSERT INTO advisories (prospect_id, advisor_name, advisory_type, description, status)
                        VALUES (:prospect_id, :advisor_name, :advisory_type, :description, :status)
                    """), {
                        "prospect_id": prospect_id,
                        "advisor_name": advisor_name,
                        "advisory_type": "orientacion",
                        "description": f"Asesoría #{i}",
                        "status": random.choice(["pending", "completed"])
                    })
                
                # Insertar centros
                centers_data = [
                    ("Centro Lima Norte", "Lima"),
                    ("Centro Huancayo", "Huancayo"),
                    ("Centro Arequipa", "Arequipa"),
                ]
                
                for name, city in centers_data:
                    connection.execute(text("""
                        INSERT INTO centers (name, city, is_active)
                        VALUES (:name, :city, :is_active)
                    """), {"name": name, "city": city, "is_active": True})
                
                # Insertar dispositivos
                for i in range(1, 11):  # 10 dispositivos
                    center_id = random.randint(1, 3)
                    device_name = f"Dispositivo-{i:02d}"
                    device_type = random.choice(["tablet", "computadora", "proyector"])
                    
                    connection.execute(text("""
                        INSERT INTO devices (center_id, device_name, device_type, is_active)
                        VALUES (:center_id, :device_name, :device_type, :is_active)
                    """), {
                        "center_id": center_id,
                        "device_name": device_name,
                        "device_type": device_type,
                        "is_active": True
                    })
                
                connection.commit()
                print("✅ Datos de ejemplo insertados exitosamente")
                
                # Verificar los datos insertados
                result = connection.execute(text("SELECT COUNT(*) FROM prospects;"))
                print(f"👥 Total prospectos: {result.fetchone()[0]}")
                
                result = connection.execute(text("SELECT COUNT(*) FROM interactions;"))
                print(f"💬 Total interacciones: {result.fetchone()[0]}")
                
                result = connection.execute(text("SELECT COUNT(*) FROM tests;"))
                print(f"📝 Total tests: {result.fetchone()[0]}")
                
                result = connection.execute(text("SELECT COUNT(*) FROM advisories;"))
                print(f"🎓 Total asesorías: {result.fetchone()[0]}")
                
            else:
                print(f"📊 Ya existen {prospect_count} prospectos en la base de datos")
                
    except Exception as e:
        print(f"❌ Error al crear datos: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Verificando conexión a la base de datos...")
    print("=" * 50)
    
    if test_connection():
        print("\n" + "=" * 50)
        print("🛠️  Configurando datos de ejemplo...")
        create_sample_data()
        print("\n✅ ¡Todo listo! El backend debería funcionar correctamente ahora.")
    else:
        print("\n❌ Error en la conexión. Verifica las credenciales.")
        sys.exit(1) 