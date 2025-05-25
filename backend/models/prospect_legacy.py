from sqlalchemy import Column, String, DateTime, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class ProspectoLegacy(Base):
    __tablename__ = "prospecto"
    
    prospecto_id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    tipo_documento = Column(String(50))
    dni = Column(String(20), index=True)
    nombre = Column(String(255), nullable=False)
    correo = Column(String(255), index=True)
    celular = Column(String(50))
    ciudad = Column(String(100))
    fecha_registro = Column(DateTime, default=datetime.utcnow)
    origen = Column(String(50))
    consentimiento_datos = Column(Boolean, default=False)
    estado = Column(String(50), default="Nuevo")
    
    def to_dict(self):
        return {
            "id": str(self.prospecto_id),
            "dni": self.dni,
            "full_name": self.nombre,
            "email": self.correo,
            "phone": self.celular,
            "city": self.ciudad,
            "status": self.estado.lower() if self.estado else "nuevo",
            "origin": self.origen.lower() if self.origen else None,
            "created_at": self.fecha_registro.isoformat() if self.fecha_registro else None
        }

class InteraccionLegacy(Base):
    __tablename__ = "interaccion"
    
    interaccion_id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    prospecto_id = Column(UUID(as_uuid=True), index=True)
    uid_nfc = Column(String)
    dispositivo_id = Column(String)
    modulo = Column(String)
    accion = Column(String)
    flow_id = Column(UUID(as_uuid=True))
    orden_en_flujo = Column(String)
    estado_interaccion = Column(String)
    payload_json = Column(Text)  # JSON field
    timestamp = Column(DateTime, default=datetime.utcnow)

class TestResultadoLegacy(Base):
    __tablename__ = "test_resultado"
    
    resultado_id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    test_id = Column(UUID(as_uuid=True))
    prospecto_id = Column(UUID(as_uuid=True), index=True)
    puntaje = Column(String)  # Puede ser integer, pero definido como string
    clasificacion = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class AsesoriaLegacy(Base):
    __tablename__ = "asesoria"
    
    asesoria_id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    prospecto_id = Column(UUID(as_uuid=True), index=True)
    asesor_id = Column(String)
    motivaciones = Column(Text)
    barreras = Column(Text)
    modalidad_preferida = Column(String)
    observaciones = Column(Text)
    fecha_asesoria = Column(DateTime, default=datetime.utcnow)

class CentroExperienciaLegacy(Base):
    __tablename__ = "centro_experiencia"
    
    centro_id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    nombre = Column(String)
    ubicacion = Column(String)
    tipo = Column(String)
    activo = Column(Boolean, default=True)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)

class DispositivoLegacy(Base):
    __tablename__ = "dispositivo"
    
    dispositivo_id = Column(String, primary_key=True, index=True)
    centro_id = Column(UUID(as_uuid=True))
    tipo = Column(String)
    ubicacion = Column(String)
    fecha_uso = Column(DateTime, default=datetime.utcnow) 