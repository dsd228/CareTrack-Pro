import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            CareTrack <span className="text-primary-600">Pro</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma profesional de gestión de pacientes y educación para estudiantes de enfermería. 
            Aprende, practica y mejora tus habilidades clínicas con recursos educativos especializados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/educacion" className="btn-primary text-lg px-8 py-3">
              Explorar Educación
            </Link>
            <Link href="/medicamentos" className="btn-secondary text-lg px-8 py-3">
              Base de Medicamentos
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Education Feature */}
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Educación Especializada
            </h3>
            <p className="text-gray-600 mb-4">
              Información detallada sobre enfermedades frecuentes, protocolos de enfermería y cuidados específicos por patología.
            </p>
            <Link href="/educacion" className="text-primary-600 font-medium hover:text-primary-700">
              Ver más →
            </Link>
          </div>

          {/* Medications Feature */}
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Base de Medicamentos
            </h3>
            <p className="text-gray-600 mb-4">
              Información completa de medicamentos con dosis, indicaciones, efectos secundarios y contraindicaciones.
            </p>
            <Link href="/medicamentos" className="text-green-600 font-medium hover:text-green-700">
              Ver más →
            </Link>
          </div>

          {/* Protocols Feature */}
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Protocolos Clínicos
            </h3>
            <p className="text-gray-600 mb-4">
              Protocolos básicos de enfermería y guías de cuidados específicos para diferentes patologías.
            </p>
            <Link href="/educacion" className="text-purple-600 font-medium hover:text-purple-700">
              Ver más →
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Recursos Educativos Disponibles
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">5+</div>
              <div className="text-gray-600">Enfermedades Documentadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">7+</div>
              <div className="text-gray-600">Medicamentos Detallados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">25+</div>
              <div className="text-gray-600">Protocolos de Enfermería</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
              <div className="text-gray-600">Contenido Actualizado</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-primary-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Comienza tu Aprendizaje Hoy
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Accede a recursos educativos especializados diseñados específicamente para estudiantes de enfermería.
          </p>
          <Link href="/educacion" className="bg-white text-primary-600 font-bold py-3 px-8 rounded-md hover:bg-gray-100 transition-colors duration-200">
            Explorar Ahora
          </Link>
        </div>
      </main>
    </div>
  )
}