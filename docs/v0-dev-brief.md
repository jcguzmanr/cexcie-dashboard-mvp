# 📋 BRIEF V0.DEV - CExCIE Dashboard MVP

## 🎯 PROMPT OPTIMIZADO PARA V0.DEV

```
Create a modern educational prospects management dashboard with the following specifications:

## LAYOUT STRUCTURE
- Fixed sidebar navigation (collapsible on mobile)
- Top header with breadcrumbs and user profile
- Main content area with responsive grid

## NAVIGATION SIDEBAR
- Logo at top
- Menu items with icons:
  - Dashboard (home icon)
  - Prospectos (users icon)
  - Analytics (chart icon)
  - Reportes (file icon)
  - Configuración (settings icon)
- Active state with blue background
- Hover effects

## DASHBOARD PAGE
Create 6 metric cards in a grid (3x2 on desktop, 1 column mobile):
1. Total Prospectos: 100+ with green up arrow
2. Interacciones: 183 with activity icon
3. Tests Completados: 60 with check icon
4. Asesorías: 30 with chat icon
5. Centros Activos: 3 with building icon
6. Dispositivos: 9 with device icon

Below metrics:
- Line chart showing "Interacciones por día" for last 30 days
- Bar chart showing "Top 5 Ciudades" with prospect count

## PROSPECTS LIST PAGE
- Search bar with placeholder "Buscar por nombre, DNI o email..."
- Filter row with:
  - Ciudad dropdown (Lima, Huancayo, Junín, Todas)
  - Estado dropdown (Nuevo, Contactado, En Proceso, Matriculado)
  - Origen dropdown (Web, Facebook, Instagram, WhatsApp)
  - Date range picker
  - Clear filters button

Data table with columns:
- Checkbox for selection
- Nombre (with avatar initial)
- DNI
- Email
- Celular
- Ciudad
- Estado (colored badge)
- Fecha Registro
- Actions (view, edit icons)

Footer with:
- Showing X-Y of Z results
- Pagination controls
- Items per page selector (25, 50, 100)

## PROSPECT DETAIL PAGE
Header section:
- Back button
- Avatar with initials
- Full name as title
- Status badge
- Edit and Export buttons

Tab navigation:
- Datos Personales
- Interacciones
- Tests
- Asesorías

Datos Personales tab:
- 2-column grid with labeled fields
- Sections: Información Personal, Contacto, Educación, Marketing

Interacciones tab:
- Timeline view with:
  - Date/time stamps
  - Interaction type icons
  - Description text
  - User who registered

Tests tab:
- Cards showing test results with:
  - Test name
  - Score with progress bar
  - Date taken
  - View details button

## DESIGN SPECIFICATIONS
Colors:
- Primary: #2563eb (blue)
- Success: #059669 (green)
- Warning: #d97706 (amber)
- Danger: #dc2626 (red)
- Neutral: gray scale

Typography:
- Font: Inter
- Headings: font-semibold
- Body: font-normal

Components:
- Cards with subtle shadows (shadow-sm)
- Rounded corners (rounded-lg)
- Hover states on interactive elements
- Loading skeletons for data
- Empty states with illustrations

Mobile responsive:
- Collapsible sidebar
- Stacked layouts
- Touch-friendly buttons (min 44px)
- Horizontal scroll for tables

Include these UI elements:
- Toast notifications
- Modal dialogs
- Dropdown menus
- Loading spinners
- Form validations
- Tooltips on hover

Use Tailwind CSS classes and make it production-ready with proper accessibility attributes.
```

## 🎨 COMPONENTES CLAVE PARA V0

### 1. **MetricCard Component**
```jsx
<div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-600">Title</p>
      <p className="text-2xl font-semibold mt-1">Value</p>
    </div>
    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
      <Icon className="w-6 h-6 text-blue-600" />
    </div>
  </div>
  <div className="flex items-center mt-4 text-sm">
    <TrendIcon className="w-4 h-4 text-green-500 mr-1" />
    <span className="text-green-500">+12%</span>
    <span className="text-gray-500 ml-2">vs mes anterior</span>
  </div>
</div>
```

### 2. **DataTable Component**
```jsx
<div className="bg-white rounded-lg shadow-sm overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Column
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        <tr className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">Data</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### 3. **StatusBadge Component**
```jsx
<span className={clsx(
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
  {
    "bg-green-100 text-green-800": status === "nuevo",
    "bg-blue-100 text-blue-800": status === "contactado",
    "bg-yellow-100 text-yellow-800": status === "en_proceso",
    "bg-purple-100 text-purple-800": status === "matriculado"
  }
)}>
  {status}
</span>
```

## 📊 DATOS DE EJEMPLO

### Métricas Dashboard
```json
{
  "totalProspects": 127,
  "totalInteractions": 183,
  "completedTests": 60,
  "advisories": 30,
  "activeCenters": 3,
  "devices": 9
}
```

### Gráfico de Interacciones
```json
[
  { "date": "2024-05-01", "count": 12 },
  { "date": "2024-05-02", "count": 15 },
  { "date": "2024-05-03", "count": 8 },
  // ... más días
]
```

### Lista de Prospectos (muestra)
```json
[
  {
    "id": 1,
    "name": "Juan Pérez García",
    "dni": "12345678",
    "email": "juan.perez@gmail.com",
    "phone": "987654321",
    "city": "Lima",
    "status": "nuevo",
    "createdAt": "2024-05-15"
  }
]
```

## 🔧 FUNCIONALIDADES INTERACTIVAS

1. **Búsqueda en tiempo real** - Filtrar tabla mientras se escribe
2. **Ordenamiento de columnas** - Click en headers
3. **Selección múltiple** - Checkboxes con acción bulk
4. **Filtros combinados** - Aplicar múltiples filtros
5. **Paginación** - Navegación entre páginas
6. **Export CSV** - Descargar datos filtrados
7. **Vista responsive** - Adaptación móvil/desktop
8. **Loading states** - Skeletons mientras carga
9. **Empty states** - Mensajes cuando no hay datos
10. **Toast notifications** - Feedback de acciones

## 🚀 OPTIMIZACIONES PARA V0

- Usar componentes funcionales con hooks
- Implementar React.memo para performance
- Lazy loading de rutas
- Debounce en búsquedas
- Virtualización para listas largas
- Optimistic updates
- Error boundaries
- Accesibilidad ARIA

## 📱 BREAKPOINTS RESPONSIVE

```css
/* Mobile: < 640px */
/* Tablet: 640px - 1024px */  
/* Desktop: > 1024px */
```

---

**NOTA**: Este brief está optimizado para copiar y pegar directamente en V0.dev para generar el dashboard completo. 