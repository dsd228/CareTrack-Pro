import { Medication } from '@/data/educationData';
import Card from '@/components/Card';

interface MedicationCardProps {
  medication: Medication;
}

const MedicationCard = ({ medication }: MedicationCardProps) => {
  return (
    <Card 
      title={medication.genericName}
      icon={
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
          </svg>
        </div>
      }
      className="h-full"
    >
      <div className="space-y-4">
        <div>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {medication.category}
          </span>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Nombres comerciales:</h4>
          <p className="text-sm">{medication.commercialNames.join(', ')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Indicación Adultos:</h4>
            <p className="text-sm">{medication.adultIndication}</p>
            <p className="text-xs text-gray-500 mt-1">Dosis: {medication.adultDose}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Indicación Pediátrica:</h4>
            <p className="text-sm">{medication.pediatricIndication}</p>
            <p className="text-xs text-gray-500 mt-1">Dosis: {medication.pediatricDose}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Efectos secundarios principales:</h4>
          <ul className="text-sm space-y-1">
            {medication.sideEffects.slice(0, 3).map((effect, index) => (
              <li key={index} className="flex items-start">
                <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                {effect}
              </li>
            ))}
            {medication.sideEffects.length > 3 && (
              <li className="text-gray-500 italic">y {medication.sideEffects.length - 3} efectos más...</li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Contraindicaciones principales:</h4>
          <ul className="text-sm space-y-1">
            {medication.contraindications.slice(0, 2).map((contraindication, index) => (
              <li key={index} className="flex items-start">
                <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                {contraindication}
              </li>
            ))}
            {medication.contraindications.length > 2 && (
              <li className="text-gray-500 italic">y {medication.contraindications.length - 2} contraindicaciones más...</li>
            )}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default MedicationCard;