# 📚 API Documentation - CExCIE Dashboard

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
Por ahora la API no requiere autenticación (MVP). En producción se implementará JWT.

## Endpoints

### 🏠 Dashboard

#### GET /dashboard/metrics
Obtiene las métricas principales del dashboard.

**Response:**
```json
{
  "total_prospects": 127,
  "total_interactions": 183,
  "completed_tests": 60,
  "total_advisories": 30,
  "active_centers": 3,
  "total_devices": 9,
  "growth_percentage": 12.5
}
```

#### GET /dashboard/interactions-chart
Obtiene datos para el gráfico de interacciones por día.

**Query Parameters:**
- `days` (optional): Número de días a mostrar (default: 30)

**Response:**
```json
{
  "data": [
    {
      "date": "2024-05-01",
      "count": 12
    },
    {
      "date": "2024-05-02", 
      "count": 15
    }
  ]
}
```

#### GET /dashboard/cities-chart
Obtiene el top 5 de ciudades con más prospectos.

**Response:**
```json
{
  "data": [
    {
      "city": "Lima",
      "count": 67
    },
    {
      "city": "Huancayo",
      "count": 35
    }
  ]
}
```

### 👥 Prospects

#### GET /prospects
Lista paginada de prospectos con filtros.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 25)
- `search`: Buscar por nombre, DNI o email
- `city`: Filtrar por ciudad
- `status`: Filtrar por estado
- `origin`: Filtrar por origen
- `start_date`: Fecha inicio (YYYY-MM-DD)
- `end_date`: Fecha fin (YYYY-MM-DD)
- `sort_by`: Campo para ordenar
- `sort_order`: asc o desc

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "dni": "12345678",
      "full_name": "Juan Pérez García",
      "email": "juan.perez@gmail.com",
      "phone": "987654321",
      "city": "Lima",
      "status": "nuevo",
      "origin": "web",
      "created_at": "2024-05-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 25,
    "total": 127,
    "pages": 6
  }
}
```

#### GET /prospects/:id
Obtiene el detalle completo de un prospecto.

**Response:**
```json
{
  "id": 1,
  "dni": "12345678",
  "first_name": "Juan",
  "last_name": "Pérez García",
  "email": "juan.perez@gmail.com",
  "phone": "987654321",
  "city": "Lima",
  "address": "Av. Javier Prado 123",
  "birth_date": "1995-03-15",
  "gender": "masculino",
  "education_level": "universitario",
  "current_institution": "Universidad Nacional Mayor de San Marcos",
  "career_interest": "Ingeniería de Sistemas",
  "status": "nuevo",
  "origin": "web",
  "campaign": "Google Ads 2024",
  "notes": "Interesado en el programa de becas",
  "created_at": "2024-05-15T10:30:00Z",
  "updated_at": "2024-05-15T10:30:00Z",
  "interactions_count": 3,
  "tests_count": 1,
  "advisories_count": 0
}
```

#### POST /prospects
Crea un nuevo prospecto.

**Request Body:**
```json
{
  "dni": "87654321",
  "first_name": "María",
  "last_name": "González",
  "email": "maria.gonzalez@gmail.com",
  "phone": "912345678",
  "city": "Huancayo",
  "status": "nuevo",
  "origin": "facebook"
}
```

#### PUT /prospects/:id
Actualiza un prospecto existente.

#### DELETE /prospects/:id
Elimina un prospecto (soft delete).

### 📞 Interactions

#### GET /prospects/:id/interactions
Lista las interacciones de un prospecto.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "type": "llamada",
      "channel": "telefono",
      "description": "Primera llamada de contacto",
      "outcome": "interesado",
      "next_action": "Enviar información por email",
      "next_action_date": "2024-05-17",
      "created_by": "Ana Rodríguez",
      "created_at": "2024-05-15T14:30:00Z"
    }
  ]
}
```

#### POST /prospects/:id/interactions
Crea una nueva interacción.

### 📝 Tests

#### GET /prospects/:id/tests
Lista los tests realizados por un prospecto.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "test_type": "Aptitud Matemática",
      "score": 85,
      "max_score": 100,
      "passed": "si",
      "created_at": "2024-05-16T10:00:00Z"
    }
  ]
}
```

### 💬 Advisories

#### GET /prospects/:id/advisories
Lista las asesorías de un prospecto.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "advisor_name": "Carlos Mendoza",
      "topic": "Orientación vocacional",
      "duration_minutes": 45,
      "notes": "Se explicaron las opciones de carrera disponibles",
      "created_at": "2024-05-18T15:00:00Z"
    }
  ]
}
```

### 📊 Reports

#### GET /reports/export
Exporta los datos filtrados a CSV.

**Query Parameters:**
- Mismos parámetros que GET /prospects

**Response:**
- Content-Type: text/csv
- Content-Disposition: attachment; filename="prospects_export.csv"

### 🏢 Centers

#### GET /centers
Lista todos los centros educativos.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "CExCIE Lima",
      "city": "Lima",
      "address": "Av. Universitaria 1234",
      "phone": "01-234-5678",
      "email": "lima@cexcie.edu.pe",
      "is_active": true
    }
  ]
}
```

## Status Codes

- `200 OK`: Solicitud exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Error en los parámetros
- `404 Not Found`: Recurso no encontrado
- `422 Unprocessable Entity`: Error de validación
- `500 Internal Server Error`: Error del servidor

## Rate Limiting

- 100 requests por minuto por IP (en producción)

## CORS

Habilitado para:
- http://localhost:3000
- http://localhost:8000

## Ejemplos de uso

### cURL
```bash
# Obtener métricas del dashboard
curl http://localhost:8000/api/v1/dashboard/metrics

# Buscar prospectos de Lima
curl "http://localhost:8000/api/v1/prospects?city=Lima&limit=10"

# Crear un prospecto
curl -X POST http://localhost:8000/api/v1/prospects \
  -H "Content-Type: application/json" \
  -d '{"dni":"12345678","first_name":"Test","last_name":"User","email":"test@example.com"}'
```

### JavaScript/Axios
```javascript
// Obtener lista de prospectos
const response = await axios.get('/api/v1/prospects', {
  params: {
    page: 1,
    limit: 25,
    city: 'Lima',
    status: 'nuevo'
  }
});

// Crear interacción
const interaction = await axios.post(`/api/v1/prospects/${prospectId}/interactions`, {
  type: 'llamada',
  channel: 'telefono',
  description: 'Llamada de seguimiento',
  outcome: 'interesado'
});
``` 