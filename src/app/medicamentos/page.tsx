'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { medications, type Medication } from '@/data/medications'

const MedicationsPage = () => {
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', ...Array.from(new Set(medications.map(m => m.category)))]
  
  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.commercialNames.some(name => name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || med.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Base de Datos de Medicamentos
          </h1>
          <p className="text-lg text-gray-600">
            Información completa sobre medicamentos: dosis, indicaciones, efectos secundarios y contraindicaciones.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with search and medication list */}
          <div className="lg:w-1/3">
            <div className="card sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Buscar Medicamentos
              </h2>
              
              {/* Search */}
              <div className="mb-4">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar por nombre:
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar medicamento..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  aria-label="Buscar medicamentos por nombre"
                />
              </div>

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
                  aria-label="Filtrar medicamentos por categoría"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Medication List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredMedications.map((medication) => (
                  <button
                    key={medication.id}
                    onClick={() => setSelectedMedication(medication)}
                    className={`w-full text-left p-3 rounded-md border transition-colors duration-200 ${
                      selectedMedication?.id === medication.id
                        ? 'bg-primary-50 border-primary-200 text-primary-900'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    aria-pressed={selectedMedication?.id === medication.id}
                  >
                    <div className="font-medium">{medication.genericName}</div>
                    <div className="text-sm text-gray-500 mt-1">{medication.category}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {medication.commercialNames.slice(0, 2).join(', ')}
                      {medication.commercialNames.length > 2 && '...'}
                    </div>
                  </button>
                ))}
              </div>

              {filteredMedications.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No se encontraron medicamentos que coincidan con tu búsqueda.
                </div>
              )}
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:w-2/3">
            {selectedMedication ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="card">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedMedication.genericName}
                  </h2>
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedMedication.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Nombres Comerciales:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMedication.commercialNames.map((name, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dosage Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="text-green-600 mr-2">👤</span>
                      Dosis Adulto
                    </h3>
                    <p className="text-gray-700 bg-green-50 p-3 rounded-md border border-green-200">
                      {selectedMedication.adultDose}
                    </p>
                  </div>
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="text-blue-600 mr-2">👶</span>
                      Dosis Pediátrica
                    </h3>
                    <p className="text-gray-700 bg-blue-50 p-3 rounded-md border border-blue-200">
                      {selectedMedication.pediatricDose}
                    </p>
                  </div>
                </div>

                {/* Indications */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="text-purple-600 mr-2">🎯</span>
                    Indicaciones
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {selectedMedication.indications.map((indication, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span className="text-gray-700">{indication}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Administration Routes */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="text-orange-600 mr-2">💉</span>
                    Vías de Administración
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMedication.administrationRoute.map((route, index) => (
                      <span
                        key={index}
                        className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {route}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Side Effects and Contraindications */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="text-yellow-600 mr-2">⚠️</span>
                      Efectos Secundarios Comunes
                    </h3>
                    <ul className="space-y-2">
                      {selectedMedication.commonSideEffects.map((effect, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-yellow-500 mr-2">•</span>
                          <span className="text-gray-700">{effect}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="text-red-600 mr-2">🚫</span>
                      Contraindicaciones
                    </h3>
                    <ul className="space-y-2">
                      {selectedMedication.contraindications.map((contraindication, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          <span className="text-gray-700">{contraindication}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Precautions */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="text-indigo-600 mr-2">🛡️</span>
                    Precauciones
                  </h3>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <ul className="space-y-2">
                      {selectedMedication.precautions.map((precaution, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-indigo-600 mr-2">•</span>
                          <span className="text-gray-800">{precaution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Interactions */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="text-pink-600 mr-2">🔄</span>
                    Interacciones Medicamentosas
                  </h3>
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <ul className="space-y-2">
                      {selectedMedication.interactions.map((interaction, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-pink-600 mr-2">•</span>
                          <span className="text-gray-800">{interaction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecciona un medicamento
                </h3>
                <p className="text-gray-600">
                  Busca y selecciona un medicamento de la lista lateral para ver información detallada sobre dosis, indicaciones, efectos secundarios y más.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default MedicationsPage