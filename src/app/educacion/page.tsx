'use client';

import { useState } from 'react';
import { diseases, medications } from '@/data/educationData';
import Tabs from '@/components/Tabs';
import DiseaseCard from '@/components/DiseaseCard';
import MedicationCard from '@/components/MedicationCard';
import DiseaseDetail from '@/components/DiseaseDetail';

export default function EducacionPage() {
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMedications = medications.filter(med =>
    med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.commercialNames.some(name => name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedDiseaseData = selectedDisease 
    ? diseases.find(d => d.id === selectedDisease) 
    : null;

  if (selectedDiseaseData) {
    return (
      <DiseaseDetail 
        disease={selectedDiseaseData} 
        onBack={() => setSelectedDisease(null)} 
      />
    );
  }

  const tabs = [
    {
      id: 'diseases',
      label: 'Enfermedades Frecuentes',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Información para Médicos y Estudiantes de Enfermería
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Explora las enfermedades más frecuentes con información detallada sobre tratamientos 
              farmacológicos, no farmacológicos, protocolos de enfermería y cuidados específicos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diseases.map((disease) => (
              <div
                key={disease.id}
                onClick={() => setSelectedDisease(disease.id)}
                className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedDisease(disease.id);
                  }
                }}
                aria-label={`Ver detalles de ${disease.name}`}
              >
                <DiseaseCard disease={disease} />
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Información Especializada por Profesión
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Para Médicos
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Descripción detallada de enfermedades</li>
                  <li>• Tratamientos farmacológicos basados en evidencia</li>
                  <li>• Opciones de tratamiento no farmacológico</li>
                  <li>• Guías de práctica clínica actualizadas</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-purple-800 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Para Estudiantes de Enfermería
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Protocolos básicos de enfermería</li>
                  <li>• Cuidados específicos por patología</li>
                  <li>• Procedimientos paso a paso</li>
                  <li>• Valoración integral del paciente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'medications',
      label: 'Medicamentos',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Vademécum de Medicamentos
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Base de datos completa de medicamentos con información sobre indicaciones, 
              dosis, efectos secundarios y contraindicaciones para población adulta y pediátrica.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar medicamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Buscar medicamentos por nombre genérico, comercial o categoría"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedications.map((medication) => (
              <MedicationCard key={medication.id} medication={medication} />
            ))}
          </div>

          {filteredMedications.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron medicamentos</h3>
              <p className="mt-1 text-sm text-gray-500">
                Intenta con otro término de búsqueda.
              </p>
            </div>
          )}

          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Información Importante
            </h3>
            <div className="text-sm text-yellow-800">
              <p className="mb-2">
                <strong>Aviso Médico:</strong> La información proporcionada es únicamente para fines educativos 
                y de referencia profesional. No debe utilizarse como sustituto del juicio clínico profesional.
              </p>
              <p>
                Siempre consulte las guías farmacológicas actualizadas y considere las características 
                individuales del paciente antes de prescribir o administrar cualquier medicamento.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sección de Educación
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Recursos educativos especializados para profesionales de la salud y estudiantes de enfermería. 
          Accede a información actualizada sobre enfermedades frecuentes, tratamientos y medicamentos.
        </p>
      </div>

      <Tabs tabs={tabs} defaultTab="diseases" />
    </div>
  );
}