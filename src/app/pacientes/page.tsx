import Navbar from '@/components/Navbar'

export default function PacientesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Gestión de Pacientes
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Esta sección estará disponible próximamente. Por ahora, puedes explorar nuestros recursos educativos 
            y la base de datos de medicamentos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/educacion" className="btn-primary">
              Ir a Educación
            </a>
            <a href="/medicamentos" className="btn-secondary">
              Ver Medicamentos
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}