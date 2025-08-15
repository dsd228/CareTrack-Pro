import { Disease } from '@/data/educationData';
import Tabs from '@/components/Tabs';

interface DiseaseDetailProps {
  disease: Disease;
  onBack: () => void;
}

const DiseaseDetail = ({ disease, onBack }: DiseaseDetailProps) => {
  const tabs = [
    {
      id: 'overview',
      label: 'Información General',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
            <p className="text-gray-700">{disease.description}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Síntomas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {disease.symptoms.map((symptom, index) => (
                <div key={index} className="flex items-start p-3 bg-red-50 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{symptom}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'doctors',
      label: 'Para Médicos',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                </svg>
              </div>
              Tratamiento Farmacológico
            </h3>
            <div className="grid gap-3">
              {disease.pharmacologicalTreatment.map((treatment, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <p className="text-gray-700">{treatment}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              Tratamiento No Farmacológico
            </h3>
            <div className="grid gap-3">
              {disease.nonPharmacologicalTreatment.map((treatment, index) => (
                <div key={index} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <p className="text-gray-700">{treatment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'nursing',
      label: 'Para Estudiantes de Enfermería',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Protocolos de Enfermería
            </h3>
            <div className="grid gap-3">
              {disease.nursingProtocols.map((protocol, index) => (
                <div key={index} className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-gray-700">{protocol}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              Cuidados de Enfermería Específicos
            </h3>
            <div className="grid gap-3">
              {disease.nursingCare.map((care, index) => (
                <div key={index} className="p-4 bg-pink-50 rounded-lg border-l-4 border-pink-400">
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-pink-100 text-pink-600 rounded-full text-sm font-medium mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-gray-700">{care}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{disease.name}</h1>
      </div>

      <Tabs tabs={tabs} defaultTab="overview" />
    </div>
  );
};

export default DiseaseDetail;