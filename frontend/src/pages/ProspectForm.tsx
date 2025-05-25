import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { prospectsApi } from '../services/api';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

interface ProspectFormData {
  tipo_documento: string;
  dni: string;
  nombre: string;
  correo: string;
  celular: string;
  ciudad: string;
  origen: string;
  consentimiento_datos: boolean;
  estado: string;
}

const ProspectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const isEditing = id && id !== 'new';

  const [formData, setFormData] = useState<ProspectFormData>({
    tipo_documento: 'DNI',
    dni: '',
    nombre: '',
    correo: '',
    celular: '',
    ciudad: '',
    origen: 'Web',
    consentimiento_datos: false,
    estado: 'Nuevo'
  });

  const [errors, setErrors] = useState<Partial<ProspectFormData>>({});

  const createMutation = useMutation({
    mutationFn: (data: ProspectFormData) => prospectsApi.createProspect(data),
    onSuccess: (response) => {
      toast.success(response.message || 'Prospecto creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      navigate('/prospects');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Error al crear prospecto');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProspectFormData) => prospectsApi.updateProspect(id!, data),
    onSuccess: (response) => {
      toast.success(response.message || 'Prospecto actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      queryClient.invalidateQueries({ queryKey: ['prospect', id] });
      navigate('/prospects');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Error al actualizar prospecto');
    }
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<ProspectFormData> = {};

    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es requerido';
    } else if (formData.tipo_documento === 'DNI' && formData.dni.length !== 8) {
      newErrors.dni = 'El DNI debe tener 8 dígitos';
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'El correo no tiene un formato válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: keyof ProspectFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isEditing ? 'Editar Prospecto' : 'Agregar Nuevo Prospecto'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditing ? 'Actualiza la información del prospecto' : 'Completa la información del nuevo prospecto'}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/prospects')}>
          ← Volver a Lista
        </Button>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipo de Documento */}
            <div>
              <label className="label">
                Tipo de Documento *
              </label>
              <select
                value={formData.tipo_documento}
                onChange={(e) => handleInputChange('tipo_documento', e.target.value)}
                className="select"
              >
                <option value="DNI">DNI</option>
                <option value="CE">Carnet de Extranjería</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
            </div>

            {/* DNI */}
            <div>
              <label className="label">
                {formData.tipo_documento} *
              </label>
              <input
                type="text"
                value={formData.dni}
                onChange={(e) => handleInputChange('dni', e.target.value)}
                className={`input ${errors.dni ? 'input-error' : ''}`}
                placeholder={`Ingrese ${formData.tipo_documento}`}
              />
              {errors.dni && <p className="error-text">{errors.dni}</p>}
            </div>

            {/* Nombre Completo */}
            <div className="md:col-span-2">
              <label className="label">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className={`input ${errors.nombre ? 'input-error' : ''}`}
                placeholder="Ingrese el nombre completo"
              />
              {errors.nombre && <p className="error-text">{errors.nombre}</p>}
            </div>

            {/* Correo */}
            <div>
              <label className="label">
                Correo Electrónico *
              </label>
              <input
                type="email"
                value={formData.correo}
                onChange={(e) => handleInputChange('correo', e.target.value)}
                className={`input ${errors.correo ? 'input-error' : ''}`}
                placeholder="ejemplo@correo.com"
              />
              {errors.correo && <p className="error-text">{errors.correo}</p>}
            </div>

            {/* Celular */}
            <div>
              <label className="label">
                Celular
              </label>
              <input
                type="tel"
                value={formData.celular}
                onChange={(e) => handleInputChange('celular', e.target.value)}
                className="input"
                placeholder="999 999 999"
              />
            </div>

            {/* Ciudad */}
            <div>
              <label className="label">
                Ciudad
              </label>
              <select
                value={formData.ciudad}
                onChange={(e) => handleInputChange('ciudad', e.target.value)}
                className="select"
              >
                <option value="">Seleccionar ciudad</option>
                <option value="Lima">Lima</option>
                <option value="Arequipa">Arequipa</option>
                <option value="Cusco">Cusco</option>
                <option value="Trujillo">Trujillo</option>
                <option value="Chiclayo">Chiclayo</option>
                <option value="Piura">Piura</option>
                <option value="Iquitos">Iquitos</option>
                <option value="Huancayo">Huancayo</option>
                <option value="Chimbote">Chimbote</option>
                <option value="Ica">Ica</option>
                <option value="Junín">Junín</option>
                <option value="Sullana">Sullana</option>
                <option value="Tacna">Tacna</option>
              </select>
            </div>

            {/* Origen */}
            <div>
              <label className="label">
                Origen
              </label>
              <select
                value={formData.origen}
                onChange={(e) => handleInputChange('origen', e.target.value)}
                className="select"
              >
                <option value="Web">Web</option>
                <option value="Facebook">Facebook</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Referido">Referido</option>
                <option value="Llamada">Llamada</option>
                <option value="Evento">Evento</option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="label">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) => handleInputChange('estado', e.target.value)}
                className="select"
              >
                <option value="Nuevo">Nuevo</option>
                <option value="Contactado">Contactado</option>
                <option value="Interesado">Interesado</option>
                <option value="Matriculado">Matriculado</option>
                <option value="Descartado">Descartado</option>
              </select>
            </div>

            {/* Consentimiento */}
            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="consentimiento"
                  checked={formData.consentimiento_datos}
                  onChange={(e) => handleInputChange('consentimiento_datos', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                />
                <label htmlFor="consentimiento" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  El prospecto ha dado su consentimiento para el tratamiento de datos personales
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/prospects')}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isLoading}
            >
              {isEditing ? 'Actualizar Prospecto' : 'Crear Prospecto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProspectForm; 