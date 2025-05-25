import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProspect, useProspectInteractions, useProspectTests, useProspectAdvisories } from '../hooks/useProspects';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import InteractionsTimeline from '../components/prospect/InteractionsTimeline';
import TestsResults from '../components/prospect/TestsResults';
import { format } from 'date-fns';

const ProspectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: prospect, isLoading, isError } = useProspect(id!);
  const { data: interactionsData, isLoading: loadingInteractions } = useProspectInteractions(id!);
  const { data: testsData, isLoading: loadingTests } = useProspectTests(id!);
  const { data: advisoriesData, isLoading: loadingAdvisories } = useProspectAdvisories(id!);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      nuevo: { variant: 'info' as const, label: 'Nuevo' },
      contactado: { variant: 'warning' as const, label: 'Contactado' },
      en_proceso: { variant: 'default' as const, label: 'En Proceso' },
      matriculado: { variant: 'success' as const, label: 'Matriculado' },
      no_interesado: { variant: 'danger' as const, label: 'No Interesado' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'default' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !prospect) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detalle del Prospecto</h2>
            <p className="text-gray-600">Información completa del prospecto</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/prospects')}>
            Volver a Lista
          </Button>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">No se pudo cargar la información del prospecto.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Resumen', icon: '👤' },
    { id: 'interactions', name: `Interacciones (${interactionsData?.total || 0})`, icon: '💬' },
    { id: 'tests', name: `Tests (${testsData?.total || 0})`, icon: '📝' },
    { id: 'advisories', name: `Asesorías (${advisoriesData?.total || 0})`, icon: '🎓' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{prospect.full_name}</h2>
          <div className="flex items-center space-x-3 mt-2">
            <p className="text-gray-600">Detalle del prospecto</p>
            {getStatusBadge(prospect.status)}
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => navigate('/prospects')}>
            ← Volver a Lista
          </Button>
          <Button onClick={() => navigate(`/prospects/${prospect.id}/edit`)}>
            ✏️ Editar
          </Button>
        </div>
      </div>

      {/* Información principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Datos personales */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Información Personal</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                <span className="text-xl font-medium text-primary-700">
                  {prospect.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">{prospect.full_name}</h4>
                <p className="text-sm text-gray-500">DNI: {prospect.dni}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                <p className="text-gray-900 mt-1">{prospect.email}</p>
              </div>
              
              {prospect.phone && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</label>
                  <p className="text-gray-900 mt-1">{prospect.phone}</p>
                </div>
              )}
              
              {prospect.city && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</label>
                  <p className="text-gray-900 mt-1">{prospect.city}</p>
                </div>
              )}

              {prospect.origin && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Origen</label>
                  <p className="text-gray-900 mt-1 capitalize">{prospect.origin}</p>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Registro</label>
                <p className="text-gray-900 mt-1">{formatDate(prospect.created_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de actividad */}
        <div className="lg:col-span-2 space-y-6">
          {/* Métricas rápidas */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{interactionsData?.total || 0}</div>
              <div className="text-sm text-blue-600">Interacciones</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{testsData?.total || 0}</div>
              <div className="text-sm text-green-600">Tests</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{advisoriesData?.total || 0}</div>
              <div className="text-sm text-purple-600">Asesorías</div>
            </div>
          </div>

          {/* Última actividad */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🕒 Actividad Reciente</h3>
            
            {interactionsData?.interactions?.length > 0 ? (
              <div className="space-y-3">
                {interactionsData.interactions.slice(0, 3).map((interaction: any, index: number) => (
                  <div key={interaction.id} className="flex items-center space-x-3 py-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{interaction.action}</p>
                      <p className="text-xs text-gray-500">{formatDate(interaction.timestamp)}</p>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setActiveTab('interactions')}
                  className="w-full mt-3"
                >
                  Ver todas las interacciones →
                </Button>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay actividad reciente</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Resumen del Prospecto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Estado del Proceso</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Estado actual:</span>
                        <span className="text-sm font-medium">{prospect.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Interacciones:</span>
                        <span className="text-sm font-medium">{interactionsData?.total || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Tests completados:</span>
                        <span className="text-sm font-medium">{testsData?.total || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Información de Contacto</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Método de contacto:</span>
                        <span className="text-sm font-medium">{prospect.phone ? 'Teléfono' : 'Email'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Origen:</span>
                        <span className="text-sm font-medium capitalize">{prospect.origin || 'No especificado'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Ciudad:</span>
                        <span className="text-sm font-medium">{prospect.city || 'No especificado'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'interactions' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💬 Historial de Interacciones ({interactionsData?.total || 0})
              </h3>
              <InteractionsTimeline 
                interactions={interactionsData?.interactions || []} 
                isLoading={loadingInteractions}
              />
            </div>
          )}

          {activeTab === 'tests' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📝 Resultados de Tests ({testsData?.total || 0})
              </h3>
              <TestsResults 
                tests={testsData?.tests || []} 
                isLoading={loadingTests}
              />
            </div>
          )}

          {activeTab === 'advisories' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🎓 Asesorías Realizadas ({advisoriesData?.total || 0})
              </h3>
              {loadingAdvisories ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-4 border border-gray-200 rounded-lg">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : advisoriesData?.advisories?.length > 0 ? (
                <div className="space-y-4">
                  {advisoriesData.advisories.map((advisory: any) => (
                    <div key={advisory.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">👨‍🏫</span>
                            <h4 className="text-lg font-medium text-gray-900">
                              Asesoría con {advisory.advisor_id || 'Asesor'}
                            </h4>
                          </div>
                          
                          {advisory.motivations && (
                            <div className="mb-3">
                              <label className="text-sm font-medium text-gray-500">Motivaciones:</label>
                              <p className="text-sm text-gray-900 mt-1">{advisory.motivations}</p>
                            </div>
                          )}
                          
                          {advisory.barriers && (
                            <div className="mb-3">
                              <label className="text-sm font-medium text-gray-500">Barreras:</label>
                              <p className="text-sm text-gray-900 mt-1">{advisory.barriers}</p>
                            </div>
                          )}
                          
                          {advisory.preferred_modality && (
                            <div className="mb-3">
                              <label className="text-sm font-medium text-gray-500">Modalidad Preferida:</label>
                              <p className="text-sm text-gray-900 mt-1">{advisory.preferred_modality}</p>
                            </div>
                          )}
                          
                          {advisory.observations && (
                            <div className="mb-3">
                              <label className="text-sm font-medium text-gray-500">Observaciones:</label>
                              <p className="text-sm text-gray-900 mt-1">{advisory.observations}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4 text-right">
                          <p className="text-sm text-gray-500">
                            {advisory.date ? formatDate(advisory.date) : 'Fecha no disponible'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sin asesorías</h3>
                  <p className="text-gray-500">No hay asesorías registradas para este prospecto.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProspectDetail; 