#!/usr/bin/env python3
import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

DATABASE_URL = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"

def inspect_tables():
    """Inspecciona la estructura de las tablas existentes"""
    try:
        engine = create_engine(DATABASE_URL)
        
        with engine.connect() as connection:
            print("🔍 Inspeccionando estructura de tablas...")
            print("=" * 60)
            
            # Obtener lista de tablas
            result = connection.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """))
            
            tables = [row[0] for row in result.fetchall()]
            
            for table_name in tables:
                print(f"\n📋 Tabla: {table_name}")
                print("-" * 40)
                
                # Obtener estructura de la tabla
                result = connection.execute(text(f"""
                    SELECT column_name, data_type, is_nullable, column_default
                    FROM information_schema.columns 
                    WHERE table_name = '{table_name}'
                    AND table_schema = 'public'
                    ORDER BY ordinal_position;
                """))
                
                columns = result.fetchall()
                for col in columns:
                    nullable = "NULL" if col[2] == "YES" else "NOT NULL"
                    default = f" DEFAULT {col[3]}" if col[3] else ""
                    print(f"  • {col[0]}: {col[1]} {nullable}{default}")
                
                # Contar registros
                try:
                    result = connection.execute(text(f"SELECT COUNT(*) FROM {table_name};"))
                    count = result.fetchone()[0]
                    print(f"  📊 Registros: {count}")
                except Exception as e:
                    print(f"  ⚠️  Error al contar: {e}")
                    
                # Mostrar muestra de datos para tablas principales
                if table_name in ['prospecto', 'prospects'] and count > 0:
                    print("  🔍 Muestra de datos:")
                    try:
                        result = connection.execute(text(f"SELECT * FROM {table_name} LIMIT 3;"))
                        rows = result.fetchall()
                        for i, row in enumerate(rows, 1):
                            print(f"    {i}. {dict(zip([col[0] for col in columns], row))}")
                    except Exception as e:
                        print(f"    ⚠️  Error: {e}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    inspect_tables() 