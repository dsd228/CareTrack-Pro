export default function PacientesPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Gestión de Pacientes
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Esta sección estará disponible próximamente. Aquí podrás gestionar 
          toda la información de tus pacientes de manera eficiente y segura.
        </p>
      </div>

      <div className="bg-blue-50 p-8 rounded-lg text-center">
        <svg className="mx-auto h-16 w-16 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h2 className="text-2xl font-semibold text-blue-900 mb-2">Próximamente</h2>
        <p className="text-blue-700">
          Funcionalidades de gestión de pacientes en desarrollo
        </p>
      </div>
    </div>
  );
}