# ⚡ SETUP RÁPIDO - CExCIE Dashboard MVP

## 🚀 **Instalación Express (5 minutos)**

### 1. **Clonar el repositorio:**
```bash
git clone https://github.com/jcguzmanr/cexcie-dashboard-mvp.git
cd cexcie-dashboard-mvp
```

### 2. **Backend Setup (FastAPI):**
```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar base de datos
cp env_example.txt .env
# Editar .env con las credenciales reales:
# DB_HOST=cexcie-db.c25y06iykpqk.us-east-1.rds.amazonaws.com
# DB_PASSWORD=Conti2025#DB

# Ejecutar servidor
uvicorn main:app --reload --port 8000
```

### 3. **Frontend Setup (React):**
```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables
cp env_example.txt .env.local
# VITE_API_URL=http://localhost:8000

# Ejecutar en desarrollo
npm run dev
```

### 4. **Verificar instalación:**
- **Backend**: http://localhost:8000 (API docs: http://localhost:8000/docs)
- **Frontend**: http://localhost:3000

## 🎯 **Para V0.dev:**

1. Abrir `docs/v0-dev-brief.md`
2. Copiar el prompt completo
3. Pegar en [V0.dev](https://v0.dev)
4. Generar el dashboard

## 📊 **Datos disponibles:**
- ✅ 100+ prospectos reales
- ✅ 183 interacciones
- ✅ 60 tests completados
- ✅ 30 asesorías
- ✅ 3 centros activos

## 🔧 **Próximos pasos:**
1. Generar UI con V0.dev
2. Conectar frontend con API
3. Implementar autenticación
4. Deploy a producción

---
**🚀 MVP listo en minutos!** 