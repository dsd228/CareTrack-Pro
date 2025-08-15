import { Disease } from '@/data/educationData';
import Card from '@/components/Card';

interface DiseaseCardProps {
  disease: Disease;
}

const DiseaseCard = ({ disease }: DiseaseCardProps) => {
  return (
    <Card 
      title={disease.name}
      icon={
        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
          </svg>
        </div>
      }
      className="h-full"
    >
      <div className="space-y-4">
        <p className="text-sm">{disease.description}</p>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Síntomas principales:</h4>
          <ul className="text-sm space-y-1">
            {disease.symptoms.slice(0, 3).map((symptom, index) => (
              <li key={index} className="flex items-start">
                <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                {symptom}
              </li>
            ))}
            {disease.symptoms.length > 3 && (
              <li className="text-gray-500 italic">y {disease.symptoms.length - 3} síntomas más...</li>
            )}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-medium text-blue-600">Tratamientos farmacológicos:</span>
            <p className="mt-1">{disease.pharmacologicalTreatment.length} opciones</p>
          </div>
          <div>
            <span className="font-medium text-green-600">Tratamientos no farmacológicos:</span>
            <p className="mt-1">{disease.nonPharmacologicalTreatment.length} opciones</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DiseaseCard;