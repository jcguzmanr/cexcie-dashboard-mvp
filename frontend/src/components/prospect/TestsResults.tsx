import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Test {
  id: string;
  test_id: string;
  score: string;
  classification: string;
  timestamp: string;
}

interface TestsResultsProps {
  tests: Test[];
  isLoading?: boolean;
}

const TestsResults: React.FC<TestsResultsProps> = ({
  tests,
  isLoading = false
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch {
      return dateString;
    }
  };

  const getScoreColor = (score: string) => {
    const numScore = parseInt(score);
    if (numScore >= 80) return 'text-green-600 bg-green-50';
    if (numScore >= 60) return 'text-yellow-600 bg-yellow-50';
    if (numScore >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getTestTypeLabel = (testId: string) => {
    // Mapear diferentes tipos de test basado en el ID
    const types = {
      'vocacional': 'Test Vocacional',
      'aptitud': 'Test de Aptitudes',
      'personalidad': 'Test de Personalidad',
      'inteligencia': 'Test de Inteligencia',
      'default': 'Test Psicológico'
    };
    
    // Buscar coincidencias en el testId
    for (const [key, label] of Object.entries(types)) {
      if (testId.toLowerCase().includes(key)) {
        return label;
      }
    }
    
    return types.default;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="animate-pulse p-4 border border-gray-200 rounded-lg">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sin tests realizados</h3>
        <p className="text-gray-500">No hay tests completados para este prospecto.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tests.map((test) => (
        <div key={test.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {getTestTypeLabel(test.test_id)}
              </h4>
              
              <div className="space-y-2">
                {test.score && (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Puntaje:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getScoreColor(test.score)}`}>
                      {test.score}%
                    </span>
                  </div>
                )}
                
                {test.classification && (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Clasificación:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {test.classification}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Fecha:</span>
                  <span className="text-sm text-gray-900">
                    {formatDate(test.timestamp)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="ml-4">
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
          
          {/* Barra de progreso para el puntaje */}
          {test.score && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Progreso</span>
                <span>{test.score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(parseInt(test.score) || 0, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TestsResults; 