export interface Medication {
  id: string
  genericName: string
  commercialNames: string[]
  category: string
  indications: string[]
  adultDose: string
  pediatricDose: string
  commonSideEffects: string[]
  contraindications: string[]
  administrationRoute: string[]
  precautions: string[]
  interactions: string[]
}

export const medications: Medication[] = [
  {
    id: 'paracetamol',
    genericName: 'Paracetamol (Acetaminofén)',
    commercialNames: ['Tylenol', 'Acetaminofén MK', 'Winadol', 'Dolex'],
    category: 'Analgésico y Antipirético',
    indications: [
      'Dolor leve a moderado',
      'Fiebre',
      'Cefalea',
      'Dolor dental',
      'Dolor muscular',
      'Artralgia'
    ],
    adultDose: '500-1000 mg cada 6-8 horas. Máximo 4 g/día',
    pediatricDose: '10-15 mg/kg cada 6-8 horas. Máximo 75 mg/kg/día',
    commonSideEffects: [
      'Náuseas leves',
      'Vómito (poco frecuente)',
      'Rash cutáneo (raro)',
      'Hepatotoxicidad (en sobredosis)'
    ],
    contraindications: [
      'Hipersensibilidad al paracetamol',
      'Insuficiencia hepática severa',
      'Hepatitis aguda',
      'Alcoholismo crónico'
    ],
    administrationRoute: ['Oral', 'Intravenosa', 'Rectal'],
    precautions: [
      'No exceder dosis máxima diaria',
      'Uso cuidadoso en pacientes con enfermedad hepática',
      'Evitar consumo de alcohol',
      'Vigilar función hepática en tratamientos prolongados'
    ],
    interactions: [
      'Warfarina (aumenta efecto anticoagulante)',
      'Alcohol (aumenta hepatotoxicidad)',
      'Carbamazepina (reduce eficacia del paracetamol)'
    ]
  },
  {
    id: 'ibuprofen',
    genericName: 'Ibuprofeno',
    commercialNames: ['Advil', 'Motrin', 'Ibuprofeno MK', 'Genfar'],
    category: 'AINE (Antiinflamatorio No Esteroideo)',
    indications: [
      'Dolor leve a moderado',
      'Inflamación',
      'Fiebre',
      'Artritis reumatoide',
      'Osteoartritis',
      'Dismenorrea'
    ],
    adultDose: '400-800 mg cada 6-8 horas. Máximo 3.2 g/día',
    pediatricDose: '5-10 mg/kg cada 6-8 horas. Máximo 40 mg/kg/día',
    commonSideEffects: [
      'Náuseas y dispepsia',
      'Dolor abdominal',
      'Diarrea',
      'Mareos',
      'Cefalea',
      'Rash cutáneo'
    ],
    contraindications: [
      'Hipersensibilidad a AINEs',
      'Úlcera péptica activa',
      'Insuficiencia renal severa',
      'Insuficiencia cardíaca',
      'Tercer trimestre del embarazo'
    ],
    administrationRoute: ['Oral', 'Intravenosa'],
    precautions: [
      'Tomar con alimentos para reducir irritación gástrica',
      'Monitorear función renal y hepática',
      'Uso cuidadoso en adultos mayores',
      'Vigilar signos de sangrado gastrointestinal'
    ],
    interactions: [
      'Warfarina (aumenta riesgo de sangrado)',
      'Litio (aumenta niveles de litio)',
      'Metotrexato (aumenta toxicidad)',
      'Diuréticos (reduce eficacia)'
    ]
  },
  {
    id: 'amoxicillin',
    genericName: 'Amoxicilina',
    commercialNames: ['Amoxil', 'Flemoxin', 'Amoxicilina MK', 'Penamox'],
    category: 'Antibiótico Betalactámico',
    indications: [
      'Infecciones del tracto respiratorio',
      'Infecciones del tracto urinario',
      'Infecciones de piel y tejidos blandos',
      'Otitis media',
      'Sinusitis',
      'Profilaxis de endocarditis'
    ],
    adultDose: '500-875 mg cada 8-12 horas por 7-10 días',
    pediatricDose: '25-45 mg/kg/día dividido cada 8-12 horas',
    commonSideEffects: [
      'Diarrea',
      'Náuseas y vómito',
      'Rash cutáneo',
      'Candidiasis oral',
      'Dolor abdominal',
      'Flatulencia'
    ],
    contraindications: [
      'Hipersensibilidad a penicilinas',
      'Mononucleosis infecciosa',
      'Antecedente de reacción alérgica severa a betalactámicos'
    ],
    administrationRoute: ['Oral'],
    precautions: [
      'Investigar antecedentes de alergia',
      'Completar el curso completo de tratamiento',
      'Monitorear función renal en insuficiencia',
      'Usar probióticos para prevenir diarrea'
    ],
    interactions: [
      'Warfarina (aumenta INR)',
      'Metotrexato (aumenta toxicidad)',
      'Anticonceptivos orales (reduce eficacia)',
      'Alopurinol (aumenta riesgo de rash)'
    ]
  },
  {
    id: 'metformin',
    genericName: 'Metformina',
    commercialNames: ['Glucophage', 'Metformina MK', 'Diabex', 'Glafornil'],
    category: 'Antidiabético - Biguanida',
    indications: [
      'Diabetes mellitus tipo 2',
      'Síndrome de ovario poliquístico',
      'Prevención de diabetes en prediabetes',
      'Síndrome metabólico'
    ],
    adultDose: '500-850 mg 2-3 veces al día con comidas. Máximo 3 g/día',
    pediatricDose: '500 mg 2 veces al día (>10 años). Máximo 2 g/día',
    commonSideEffects: [
      'Náuseas y vómito',
      'Diarrea',
      'Dolor abdominal',
      'Flatulencia',
      'Sabor metálico',
      'Pérdida del apetito'
    ],
    contraindications: [
      'Insuficiencia renal (TFG <30)',
      'Acidosis metabólica',
      'Insuficiencia hepática',
      'Alcoholismo',
      'Insuficiencia cardíaca descompensada'
    ],
    administrationRoute: ['Oral'],
    precautions: [
      'Suspender antes de procedimientos con contraste',
      'Monitorear función renal anualmente',
      'Tomar con alimentos para reducir efectos GI',
      'Vigilar síntomas de acidosis láctica'
    ],
    interactions: [
      'Contrastes yodados (aumenta riesgo de nefropatía)',
      'Alcohol (aumenta riesgo de acidosis láctica)',
      'Diuréticos (pueden afectar función renal)',
      'Corticoides (antagonizan efecto hipoglucemiante)'
    ]
  },
  {
    id: 'omeprazole',
    genericName: 'Omeprazol',
    commercialNames: ['Prilosec', 'Losec', 'Omeprazol MK', 'Peprazol'],
    category: 'Inhibidor de Bomba de Protones',
    indications: [
      'Úlcera gástrica y duodenal',
      'Enfermedad por reflujo gastroesofágico',
      'Síndrome de Zollinger-Ellison',
      'Erradicación de H. pylori',
      'Gastritis'
    ],
    adultDose: '20-40 mg una vez al día en ayunas',
    pediatricDose: '0.7-3.3 mg/kg una vez al día (>1 año)',
    commonSideEffects: [
      'Cefalea',
      'Náuseas',
      'Diarrea',
      'Dolor abdominal',
      'Flatulencia',
      'Mareos'
    ],
    contraindications: [
      'Hipersensibilidad al omeprazol',
      'Hipersensibilidad a otros IBP',
      'Uso concomitante con atazanavir'
    ],
    administrationRoute: ['Oral', 'Intravenosa'],
    precautions: [
      'Uso prolongado aumenta riesgo de fracturas',
      'Puede enmascarar síntomas de cáncer gástrico',
      'Reducir dosis en insuficiencia hepática',
      'Monitorear niveles de magnesio en uso prolongado'
    ],
    interactions: [
      'Warfarina (aumenta INR)',
      'Digoxina (aumenta niveles)',
      'Ketoconazol (reduce absorción)',
      'Clopidogrel (reduce eficacia antiagregante)'
    ]
  },
  {
    id: 'amlodipine',
    genericName: 'Amlodipino',
    commercialNames: ['Norvasc', 'Amlodipino MK', 'Amlovas', 'Cardiostat'],
    category: 'Bloqueador de Canales de Calcio',
    indications: [
      'Hipertensión arterial',
      'Angina de pecho estable',
      'Angina vasoespástica',
      'Cardiopatía isquémica'
    ],
    adultDose: '5-10 mg una vez al día',
    pediatricDose: '0.1-0.6 mg/kg una vez al día (>6 años)',
    commonSideEffects: [
      'Edema periférico',
      'Cefalea',
      'Mareos',
      'Fatiga',
      'Náuseas',
      'Rubor facial'
    ],
    contraindications: [
      'Hipersensibilidad al amlodipino',
      'Shock cardiogénico',
      'Estenosis aórtica severa',
      'Hipotensión severa'
    ],
    administrationRoute: ['Oral'],
    precautions: [
      'Iniciar con dosis bajas en adultos mayores',
      'Monitorear presión arterial regularmente',
      'Usar con precaución en insuficiencia hepática',
      'Vigilar desarrollo de edema'
    ],
    interactions: [
      'Simvastatina (aumenta riesgo de miopatía)',
      'Digoxina (aumenta niveles)',
      'Ciclosporina (aumenta niveles de ciclosporina)',
      'Sildenafil (aumenta hipotensión)'
    ]
  },
  {
    id: 'salbutamol',
    genericName: 'Salbutamol',
    commercialNames: ['Ventolin', 'ProAir', 'Salbutamol MK', 'Airomir'],
    category: 'Broncodilatador Beta-2 Agonista',
    indications: [
      'Asma bronquial',
      'EPOC exacerbado',
      'Broncoespasmo',
      'Prevención de asma inducida por ejercicio'
    ],
    adultDose: 'Inhalador: 2 puffs cada 4-6 horas. Nebulización: 2.5-5 mg cada 6-8 horas',
    pediatricDose: 'Inhalador: 1-2 puffs cada 4-6 horas. Nebulización: 0.1-0.15 mg/kg cada 4-6 horas',
    commonSideEffects: [
      'Temblor',
      'Nerviosismo',
      'Cefalea',
      'Taquicardia',
      'Palpitaciones',
      'Calambres musculares'
    ],
    contraindications: [
      'Hipersensibilidad al salbutamol',
      'Taquiarritmias',
      'Tirotoxicosis no controlada'
    ],
    administrationRoute: ['Inhalada', 'Nebulización', 'Oral', 'Intravenosa'],
    precautions: [
      'Usar con precaución en cardiopatía',
      'Monitorear niveles de potasio',
      'No exceder dosis recomendada',
      'Enseñar técnica correcta de inhalación'
    ],
    interactions: [
      'Beta-bloqueadores (antagonizan el efecto)',
      'Diuréticos (aumentan riesgo de hipopotasemia)',
      'Digoxina (aumenta riesgo de arritmias)',
      'Antidepresivos tricíclicos (aumentan efectos cardiovasculares)'
    ]
  }
]