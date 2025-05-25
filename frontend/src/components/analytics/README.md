# Analytics Components

Esta carpeta contiene todos los componentes relacionados con la funcionalidad de Analytics del CRM CExCIE.

## Componentes Principales

### 1. **ChannelPerformance.tsx**
Muestra la efectividad de los diferentes canales de marketing y ventas.

**Características:**
- Visualización de métricas por canal (Facebook, Instagram, Google, etc.)
- Tasas de contacto y conversión
- Identificación del mejor canal
- Barras de progreso interactivas
- Puntuación de calidad por canal

**Datos mostrados:**
- Total de leads por canal
- Número de contactados
- Número de matriculados
- Tasa de contacto (%)
- Tasa de conversión (%)
- Score de calidad

### 2. **GeographicChart.tsx**
Presenta la distribución geográfica de prospectos y conversiones.

**Características:**
- Top 5 ciudades con más prospectos
- Tasas de conversión por ciudad
- Visualización con barras de progreso
- Lista expandible para ver todas las ciudades
- Estadísticas generales

**Datos mostrados:**
- Total de prospectos por ciudad
- Número de matriculados por ciudad
- Tasa de conversión por ciudad
- Ranking de ciudades

### 3. **ConversionFunnel.tsx**
Visualiza el embudo de conversión paso a paso.

**Características:**
- Etapas del proceso de ventas
- Porcentajes de conversión entre etapas
- Iconos representativos para cada etapa
- Líneas conectoras entre etapas
- Métricas de resumen

**Etapas del embudo:**
- Nuevo (👋)
- Contactado (📞)
- En proceso (⚡)
- Matriculado (🎓)
- No interesado (❌)

### 4. **RealTimeMetrics.tsx**
Muestra métricas clave en tiempo real con indicadores de tendencia.

**Características:**
- Métricas actualizadas automáticamente
- Indicadores de cambio (↑↓)
- Colores diferenciados por tipo de métrica
- Estados de carga y error
- Iconos representativos

**Métricas incluidas:**
- Conversión General
- Leads Totales
- Matriculados
- Tiempo Promedio de Conversión

### 5. **AnalyticsFilters.tsx**
Componente de filtros avanzados para personalizar el análisis.

**Características:**
- Filtros básicos siempre visibles
- Filtros avanzados expandibles
- Selección múltiple por categorías
- Resumen de filtros activos
- Limpieza rápida de filtros

**Tipos de filtros:**
- Período de tiempo (día/semana/mes)
- Rango de fechas personalizado
- Canales de origen
- Ciudades
- Estados de prospecto

### 6. **AnalyticsInsights.tsx**
Genera insights automáticos y recomendaciones basadas en los datos.

**Características:**
- Análisis automático de patrones
- Recomendaciones personalizadas
- Alertas por rendimiento bajo
- Identificación de oportunidades
- Acciones sugeridas

**Tipos de insights:**
- Canal de mayor rendimiento
- Canales con bajo rendimiento
- Problemas en el embudo de conversión
- Tiempo de conversión elevado
- Oportunidades de mejora

### 7. **ExecutiveSummary.tsx**
Resumen ejecutivo con las métricas más importantes.

**Características:**
- Vista de alto nivel
- Métricas clave consolidadas
- Resumen textual del período
- Indicadores de estado
- Diseño ejecutivo elegante

**Información incluida:**
- Tasa de conversión general
- Leads generados en el período
- Canal principal
- Eficiencia del embudo
- Resumen narrativo

## Hooks Utilizados

### useAnalytics.ts
Contiene todos los hooks personalizados para obtener datos de analytics:

- `useConversionFunnel()` - Datos del embudo de conversión
- `useGeographicDistribution()` - Distribución geográfica
- `useChannelEffectiveness()` - Efectividad de canales
- `useInteractionPatterns()` - Patrones de interacción
- `useTestPerformance()` - Rendimiento de pruebas
- `useAdvisoryImpact()` - Impacto de asesorías
- `useTemporalTrends()` - Tendencias temporales
- `useOperationalKPIs()` - KPIs operacionales

## API Endpoints

Los componentes consumen datos de los siguientes endpoints:

```
/api/v1/analytics/conversion-funnel
/api/v1/analytics/geographic-distribution
/api/v1/analytics/channel-effectiveness
/api/v1/analytics/interaction-patterns
/api/v1/analytics/test-performance
/api/v1/analytics/advisory-impact
/api/v1/analytics/temporal-trends
/api/v1/analytics/operational-kpis
```

## Estructura de Datos

### Channel Data
```typescript
interface ChannelData {
  channel: string;
  total_leads: number;
  contacted: number;
  enrolled: number;
  contact_rate: number;
  conversion_rate: number;
  quality_score: number;
}
```

### Funnel Stage
```typescript
interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
  conversion_rate: number;
}
```

### City Data
```typescript
interface CityData {
  city: string;
  total_prospects: number;
  enrolled: number;
  conversion_rate: number;
}
```

## Uso en la Página Principal

```tsx
import ChannelPerformance from '../components/analytics/ChannelPerformance';
import GeographicChart from '../components/analytics/GeographicChart';
import ConversionFunnel from '../components/analytics/ConversionFunnel';
import RealTimeMetrics from '../components/analytics/RealTimeMetrics';
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import AnalyticsInsights from '../components/analytics/AnalyticsInsights';
import ExecutiveSummary from '../components/analytics/ExecutiveSummary';

// En el componente Analytics
<ExecutiveSummary />
<AnalyticsFilters onFiltersChange={handleFiltersChange} />
<RealTimeMetrics />
<ConversionFunnel />
<ChannelPerformance />
<GeographicChart />
<AnalyticsInsights />
```

## Características Técnicas

- **Framework**: React con TypeScript
- **Estado**: React Query para cache y sincronización
- **Estilos**: Tailwind CSS
- **Iconos**: Heroicons
- **Responsivo**: Diseño adaptable a móviles y desktop
- **Accesibilidad**: Componentes accesibles con ARIA labels
- **Performance**: Lazy loading y optimización de re-renders

## Próximas Mejoras

1. **Exportación de datos** - Funcionalidad para exportar reportes
2. **Gráficos interactivos** - Integración con Chart.js o D3
3. **Comparación de períodos** - Análisis comparativo
4. **Alertas automáticas** - Notificaciones por cambios significativos
5. **Personalización** - Dashboards personalizables por usuario 