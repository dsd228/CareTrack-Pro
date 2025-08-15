export interface Disease {
  id: string
  name: string
  description: string
  symptoms: string[]
  causes: string[]
  pharmacologicalTreatments: string[]
  nonPharmacologicalTreatments: string[]
  nursingProtocols: string[]
  specificCare: string[]
  severity: 'low' | 'medium' | 'high'
  category: string
}

export const diseases: Disease[] = [
  {
    id: 'hypertension',
    name: 'Hipertensión Arterial',
    description: 'Condición crónica caracterizada por presión arterial elevada (≥140/90 mmHg) que puede causar complicaciones cardiovasculares graves.',
    symptoms: [
      'Dolor de cabeza frecuente',
      'Mareos o vértigo',
      'Visión borrosa',
      'Fatiga',
      'Dolor en el pecho',
      'Dificultad para respirar'
    ],
    causes: [
      'Factores genéticos',
      'Obesidad',
      'Consumo excesivo de sal',
      'Sedentarismo',
      'Estrés crónico',
      'Consumo de alcohol y tabaco'
    ],
    pharmacologicalTreatments: [
      'Inhibidores de la ECA (Enalapril, Lisinopril)',
      'Bloqueadores de los canales de calcio (Amlodipino)',
      'Diuréticos tiazídicos (Hidroclorotiazida)',
      'Bloqueadores beta (Metoprolol)',
      'Antagonistas de los receptores de angiotensina II (Losartán)'
    ],
    nonPharmacologicalTreatments: [
      'Dieta baja en sodio (DASH)',
      'Ejercicio aeróbico regular (30 min/día)',
      'Pérdida de peso',
      'Reducción del estrés (técnicas de relajación)',
      'Eliminación del tabaco y alcohol',
      'Monitoreo domiciliario de presión arterial'
    ],
    nursingProtocols: [
      'Medición de signos vitales cada 4-6 horas',
      'Monitoreo de presión arterial en posición supina y de pie',
      'Evaluación de edemas en extremidades',
      'Control de ingesta y eliminación de líquidos',
      'Educación sobre automonitoreo',
      'Seguimiento de adherencia al tratamiento'
    ],
    specificCare: [
      'Posición fowler para facilitar respiración',
      'Ambiente tranquilo y sin estímulos estresantes',
      'Vigilancia de signos de crisis hipertensiva',
      'Educación nutricional especializada',
      'Apoyo psicológico para manejo del estrés',
      'Coordinación con equipo multidisciplinario'
    ],
    severity: 'high',
    category: 'Cardiovascular'
  },
  {
    id: 'diabetes',
    name: 'Diabetes Mellitus Tipo 2',
    description: 'Trastorno metabólico crónico caracterizado por hiperglucemia debido a resistencia a la insulina y/o deficiencia relativa de insulina.',
    symptoms: [
      'Poliuria (micción frecuente)',
      'Polidipsia (sed excesiva)',
      'Polifagia (hambre excesiva)',
      'Pérdida de peso inexplicada',
      'Fatiga persistente',
      'Visión borrosa',
      'Cicatrización lenta de heridas'
    ],
    causes: [
      'Resistencia a la insulina',
      'Factores genéticos',
      'Obesidad abdominal',
      'Sedentarismo',
      'Edad avanzada',
      'Síndrome metabólico'
    ],
    pharmacologicalTreatments: [
      'Metformina (primera línea)',
      'Sulfonilureas (Glibenclamida)',
      'Inhibidores DPP-4 (Sitagliptina)',
      'Agonistas GLP-1 (Liraglutida)',
      'Insulina (casos avanzados)'
    ],
    nonPharmacologicalTreatments: [
      'Dieta controlada en carbohidratos',
      'Ejercicio físico regular',
      'Pérdida de peso gradual',
      'Monitoreo glucémico domiciliario',
      'Educación diabetológica',
      'Control de factores de riesgo cardiovascular'
    ],
    nursingProtocols: [
      'Monitoreo de glucemia capilar',
      'Control de signos vitales',
      'Inspección diaria de pies',
      'Evaluación del estado nutricional',
      'Educación sobre técnica de inyección',
      'Seguimiento de adherencia terapéutica'
    ],
    specificCare: [
      'Cuidado especial de la piel y extremidades',
      'Prevención de infecciones',
      'Educación sobre reconocimiento de hipoglucemia',
      'Apoyo nutricional especializado',
      'Vigilancia de complicaciones crónicas',
      'Promoción del autocuidado'
    ],
    severity: 'high',
    category: 'Endocrino'
  },
  {
    id: 'pneumonia',
    name: 'Neumonía Adquirida en la Comunidad',
    description: 'Infección aguda del parénquima pulmonar que causa inflamación alveolar y puede comprometer el intercambio gaseoso.',
    symptoms: [
      'Fiebre alta (>38°C)',
      'Tos productiva con esputo purulento',
      'Dolor torácico pleurítico',
      'Disnea o dificultad respiratoria',
      'Escalofríos',
      'Fatiga y malestar general',
      'Taquicardia'
    ],
    causes: [
      'Streptococcus pneumoniae',
      'Haemophilus influenzae',
      'Mycoplasma pneumoniae',
      'Virus respiratorios',
      'Staphylococcus aureus',
      'Aspiración de contenido gástrico'
    ],
    pharmacologicalTreatments: [
      'Antibióticos betalactámicos (Amoxicilina)',
      'Macrólidos (Azitromicina)',
      'Fluoroquinolonas (Levofloxacino)',
      'Antipiréticos (Paracetamol)',
      'Broncodilatadores si hay broncoespasmo'
    ],
    nonPharmacologicalTreatments: [
      'Reposo relativo',
      'Hidratación adecuada',
      'Fisioterapia respiratoria',
      'Oxigenoterapia si es necesaria',
      'Nutrición adecuada',
      'Aislamiento si es necesario'
    ],
    nursingProtocols: [
      'Monitoreo de signos vitales cada 4 horas',
      'Evaluación del patrón respiratorio',
      'Oximetría de pulso continua',
      'Control de temperatura',
      'Auscultación pulmonar',
      'Evaluación del estado de hidratación'
    ],
    specificCare: [
      'Posición semi-fowler para mejorar ventilación',
      'Técnicas de drenaje postural',
      'Estímulo de la tos efectiva',
      'Prevención de complicaciones (trombosis)',
      'Aislamiento de precauciones estándar',
      'Educación sobre higiene respiratoria'
    ],
    severity: 'medium',
    category: 'Respiratorio'
  },
  {
    id: 'gastritis',
    name: 'Gastritis Aguda',
    description: 'Inflamación aguda de la mucosa gástrica que puede ser causada por diversos factores irritantes o infecciosos.',
    symptoms: [
      'Dolor epigástrico',
      'Náuseas y vómitos',
      'Sensación de plenitud',
      'Ardor estomacal',
      'Pérdida del apetito',
      'Eructos frecuentes',
      'Malestar abdominal'
    ],
    causes: [
      'Helicobacter pylori',
      'Uso de AINEs',
      'Consumo de alcohol',
      'Estrés',
      'Alimentos picantes o ácidos',
      'Infecciones virales'
    ],
    pharmacologicalTreatments: [
      'Inhibidores de bomba de protones (Omeprazol)',
      'Antiácidos (Hidróxido de aluminio)',
      'Antagonistas H2 (Ranitidina)',
      'Antibióticos si hay H. pylori',
      'Protectores de mucosa (Sucralfato)'
    ],
    nonPharmacologicalTreatments: [
      'Dieta blanda y fraccionada',
      'Evitar irritantes (café, alcohol, picantes)',
      'Reducción del estrés',
      'Comidas pequeñas y frecuentes',
      'Masticación lenta y completa',
      'Hidratación adecuada'
    ],
    nursingProtocols: [
      'Evaluación del dolor abdominal',
      'Monitoreo de signos vitales',
      'Control de náuseas y vómitos',
      'Evaluación del estado nutricional',
      'Educación dietética',
      'Seguimiento de síntomas'
    ],
    specificCare: [
      'Posición de comodidad para aliviar dolor',
      'Administración de medicamentos en horarios',
      'Educación sobre factores desencadenantes',
      'Apoyo nutricional',
      'Técnicas de relajación para el estrés',
      'Seguimiento de evolución clínica'
    ],
    severity: 'low',
    category: 'Gastrointestinal'
  },
  {
    id: 'uti',
    name: 'Infección del Tracto Urinario',
    description: 'Infección bacteriana que puede afectar cualquier parte del sistema urinario, desde la uretra hasta los riñones.',
    symptoms: [
      'Disuria (dolor al orinar)',
      'Urgencia miccional',
      'Frecuencia urinaria aumentada',
      'Orina turbia o con mal olor',
      'Dolor suprapúbico',
      'Hematuria (sangre en orina)',
      'Fiebre (en casos complicados)'
    ],
    causes: [
      'Escherichia coli (80% de casos)',
      'Staphylococcus saprophyticus',
      'Klebsiella pneumoniae',
      'Enterococcus faecalis',
      'Factores anatómicos',
      'Higiene inadecuada'
    ],
    pharmacologicalTreatments: [
      'Nitrofurantoína',
      'Trimetoprim-sulfametoxazol',
      'Ciprofloxacino',
      'Amoxicilina-clavulánico',
      'Fosfomicina (dosis única)'
    ],
    nonPharmacologicalTreatments: [
      'Aumento de ingesta de líquidos',
      'Micción frecuente y completa',
      'Higiene perineal adecuada',
      'Evitar retención urinaria',
      'Ropa interior de algodón',
      'Evitar irritantes químicos'
    ],
    nursingProtocols: [
      'Monitoreo de diuresis',
      'Control de signos vitales',
      'Evaluación de características de la orina',
      'Educación sobre higiene',
      'Seguimiento de síntomas',
      'Promoción de hidratación'
    ],
    specificCare: [
      'Técnicas de higiene perineal',
      'Educación sobre prevención',
      'Alivio del disconfort',
      'Promoción del vaciamiento vesical',
      'Seguimiento de adherencia al tratamiento',
      'Identificación de factores de riesgo'
    ],
    severity: 'low',
    category: 'Genitourinario'
  }
]