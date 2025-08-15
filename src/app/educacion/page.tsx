'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { diseases, type Disease } from '@/data/diseases'

const EducationPage = () => {
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null)
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(diseases.map(d => d.category)))]
  const filteredDiseases = selectedCategory === 'all' 
    ? diseases 
    : diseases.filter(d => d.category === selectedCategory)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return 'Alta'
      case 'medium': return 'Media'
      case 'low': return 'Baja'
      default: return 'Desconocida'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Educación para Estudiantes de Enfermería
          </h1>
          <p className="text-lg text-gray-600">
            Explora información detallada sobre enfermedades frecuentes, tratamientos y protocolos de enfermería.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with disease list */}
          <div className="lg:w-1/3">
            <div className="card sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Enfermedades por Categoría
              </h2>
              
              {/* Category Filter */}
              <div className="mb-4">
                <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por categoría:
                </label>
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  aria-label="Filtrar enfermedades por categoría"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Disease List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredDiseases.map((disease) => (
                  <button
                    key={disease.id}
                    onClick={() => {
                      setSelectedDisease(disease)
                      setActiveTab('overview')
                    }}
                    className={`w-full text-left p-3 rounded-md border transition-colors duration-200 ${
                      selectedDisease?.id === disease.id
                        ? 'bg-primary-50 border-primary-200 text-primary-900'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    aria-pressed={selectedDisease?.id === disease.id}
                  >
                    <div className="font-medium">{disease.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{disease.category}</div>
                    <div className={`inline-block mt-2 px-2 py-1 text-xs rounded-full border ${getSeverityColor(disease.severity)}`}>
                      Severidad: {getSeverityText(disease.severity)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:w-2/3">
            {selectedDisease ? (
              <div className="card">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedDisease.name}
                  </h2>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-gray-600">
                      Categoría: <strong>{selectedDisease.category}</strong>
                    </span>
                    <span className={`px-3 py-1 text-sm rounded-full border ${getSeverityColor(selectedDisease.severity)}`}>
                      Severidad: {getSeverityText(selectedDisease.severity)}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedDisease.description}
                  </p>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs de información">
                    {[
                      { id: 'overview', label: 'Síntomas y Causas' },
                      { id: 'treatment', label: 'Tratamientos' },
                      { id: 'nursing', label: 'Enfermería' },
                      { id: 'care', label: 'Cuidados Específicos' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                          activeTab === tab.id
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                  {activeTab === 'overview' && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Síntomas Principales
                        </h3>
                        <ul className="space-y-2">
                          {selectedDisease.symptoms.map((symptom, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-primary-500 mr-2">•</span>
                              <span className="text-gray-700">{symptom}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Causas Principales
                        </h3>
                        <ul className="space-y-2">
                          {selectedDisease.causes.map((cause, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-red-500 mr-2">•</span>
                              <span className="text-gray-700">{cause}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'treatment' && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Tratamientos Farmacológicos
                        </h3>
                        <ul className="space-y-2">
                          {selectedDisease.pharmacologicalTreatments.map((treatment, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-2">💊</span>
                              <span className="text-gray-700">{treatment}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Tratamientos No Farmacológicos
                        </h3>
                        <ul className="space-y-2">
                          {selectedDisease.nonPharmacologicalTreatments.map((treatment, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-500 mr-2">🏃</span>
                              <span className="text-gray-700">{treatment}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'nursing' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Protocolos de Enfermería
                      </h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <ul className="space-y-3">
                          {selectedDisease.nursingProtocols.map((protocol, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-600 mr-3 font-bold">{index + 1}.</span>
                              <span className="text-gray-800">{protocol}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'care' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Cuidados Específicos de Enfermería
                      </h3>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <ul className="space-y-3">
                          {selectedDisease.specificCare.map((care, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-purple-600 mr-3">❤️</span>
                              <span className="text-gray-800">{care}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecciona una enfermedad
                </h3>
                <p className="text-gray-600">
                  Elige una enfermedad de la lista lateral para ver información detallada sobre síntomas, tratamientos y protocolos de enfermería.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default EducationPage