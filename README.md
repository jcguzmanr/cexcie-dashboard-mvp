# 🚀 CExCIE Dashboard MVP

## 📋 Descripción
Dashboard administrativo para gestión de prospectos educativos del Centro de Excelencia en Ciencias e Ingeniería (CExCIE).

### 🎯 Características MVP
- ✅ Dashboard con métricas en tiempo real
- ✅ Gestión completa de prospectos
- ✅ Timeline de interacciones
- ✅ Análisis de resultados de tests
- ✅ Exportación de datos a CSV
- ✅ Diseño responsive

## 🛠️ Stack Tecnológico

### Backend
- **FastAPI** - Framework web moderno y rápido
- **PostgreSQL** - Base de datos en AWS RDS
- **Pydantic** - Validación de datos
- **Python 3.9+**

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** - Estilos utility-first
- **Recharts** - Gráficos y visualizaciones
- **React Query** - Gestión de estado server-side
- **Lucide React** - Iconos

## 🚀 Instalación

### Prerrequisitos
- Node.js 16+
- Python 3.9+
- PostgreSQL (o acceso a la instancia RDS)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales correctas

# Ejecutar servidor
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
# o
yarn install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con la URL del backend

# Ejecutar en desarrollo
npm run dev
# o
yarn dev
```

## 📊 Base de Datos

### Conexión AWS RDS
```
Host: cexcie-db.c25y06iykpqk.us-east-1.rds.amazonaws.com
Port: 5432
Database: postgres
Username: postgres
```

### Tablas principales
- `prospects` - Información de prospectos
- `interactions` - Historial de interacciones
- `tests` - Resultados de evaluaciones
- `advisories` - Asesorías realizadas
- `centers` - Centros educativos
- `devices` - Dispositivos de acceso

## 🔗 API Endpoints

### Prospectos
- `GET /api/prospects` - Lista paginada
- `GET /api/prospects/{id}` - Detalle
- `POST /api/prospects` - Crear
- `PUT /api/prospects/{id}` - Actualizar
- `DELETE /api/prospects/{id}` - Eliminar

### Dashboard
- `GET /api/dashboard/metrics` - Métricas generales
- `GET /api/dashboard/interactions` - Gráfico de interacciones
- `GET /api/dashboard/cities` - Top ciudades

### Reportes
- `GET /api/reports/export` - Exportar CSV

## 📱 Vistas principales

1. **Dashboard** - Vista general con métricas y gráficos
2. **Lista de Prospectos** - Tabla con filtros y búsqueda
3. **Detalle de Prospecto** - Información completa con timeline
4. **Analytics** - Reportes y estadísticas avanzadas

## 🎨 Diseño UI

### Colores principales
- Primary: `#2563eb`
- Success: `#059669`
- Warning: `#d97706`
- Danger: `#dc2626`
- Neutral: Escala de grises

### Tipografía
- Font Family: Inter
- Headings: 600-700 weight
- Body: 400-500 weight

## 📦 Deployment

### Backend (Railway/Render)
```bash
# Dockerfile incluido
docker build -t cexcie-backend .
docker run -p 8000:8000 cexcie-backend
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy directorio 'dist'
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo licencia privada de CExCIE.

## 👥 Equipo

- **Frontend**: React + TypeScript
- **Backend**: FastAPI + PostgreSQL
- **DevOps**: Docker + CI/CD

---

**Para más información, revisar la carpeta `/docs`** 