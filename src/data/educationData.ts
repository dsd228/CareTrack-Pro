export interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  pharmacologicalTreatment: string[];
  nonPharmacologicalTreatment: string[];
  nursingProtocols: string[];
  nursingCare: string[];
}

export interface Medication {
  id: string;
  genericName: string;
  commercialNames: string[];
  adultIndication: string;
  pediatricIndication: string;
  adultDose: string;
  pediatricDose: string;
  sideEffects: string[];
  contraindications: string[];
  category: string;
}

export const diseases: Disease[] = [
  {
    id: "diabetes-tipo-2",
    name: "Diabetes Mellitus Tipo 2",
    description: "Enfermedad crónica caracterizada por niveles elevados de glucosa en sangre debido a resistencia a la insulina y/o deficiencia en su producción.",
    symptoms: [
      "Poliuria (micción frecuente)",
      "Polidipsia (sed excesiva)",
      "Polifagia (hambre excesiva)",
      "Pérdida de peso inexplicable",
      "Fatiga",
      "Visión borrosa",
      "Cicatrización lenta de heridas"
    ],
    pharmacologicalTreatment: [
      "Metformina como primera línea",
      "Sulfonilureas (glibenclamida, gliclazida)",
      "Inhibidores DPP-4 (sitagliptina, linagliptina)",
      "Agonistas GLP-1 (liraglutida, semaglutida)",
      "Insulina en casos avanzados"
    ],
    nonPharmacologicalTreatment: [
      "Dieta balanceada baja en carbohidratos simples",
      "Ejercicio aeróbico regular (150 min/semana)",
      "Control de peso corporal",
      "Abandono del tabaquismo",
      "Monitoreo regular de glucemia",
      "Educación diabetológica"
    ],
    nursingProtocols: [
      "Valoración integral del paciente diabético",
      "Monitoreo de signos vitales",
      "Control de glucemia capilar",
      "Administración segura de medicamentos",
      "Educación sobre automonitoreo",
      "Evaluación de pies diabéticos"
    ],
    nursingCare: [
      "Inspección diaria de pies y cuidado podológico",
      "Educación sobre dieta y ejercicio",
      "Enseñanza de técnicas de automonitoreo",
      "Apoyo psicológico y motivacional",
      "Coordinación con equipo multidisciplinario",
      "Seguimiento de adherencia al tratamiento"
    ]
  },
  {
    id: "hipertension-arterial",
    name: "Hipertensión Arterial",
    description: "Condición crónica en la que la presión arterial sistólica es ≥140 mmHg y/o la diastólica ≥90 mmHg de forma persistente.",
    symptoms: [
      "Cefalea",
      "Mareos",
      "Visión borrosa",
      "Dolor de pecho",
      "Dificultad para respirar",
      "Sangrado nasal",
      "Latidos cardíacos irregulares"
    ],
    pharmacologicalTreatment: [
      "IECA (enalapril, lisinopril)",
      "ARA II (losartán, valsartán)",
      "Diuréticos tiazídicos (hidroclorotiazida)",
      "Bloqueadores de canales de calcio (amlodipino)",
      "Betabloqueadores (metoprolol, atenolol)"
    ],
    nonPharmacologicalTreatment: [
      "Dieta DASH baja en sodio",
      "Ejercicio aeróbico regular",
      "Mantenimiento de peso saludable",
      "Limitación del consumo de alcohol",
      "Abandono del tabaquismo",
      "Manejo del estrés"
    ],
    nursingProtocols: [
      "Toma de presión arterial correcta",
      "Monitoreo cardiovascular",
      "Valoración de factores de riesgo",
      "Educación sobre hipertensión",
      "Seguimiento de adherencia",
      "Detección de complicaciones"
    ],
    nursingCare: [
      "Medición de PA en diferentes posiciones",
      "Educación sobre dieta hiposódica",
      "Enseñanza de automonitoreo de PA",
      "Promoción de estilos de vida saludables",
      "Apoyo en modificación de hábitos",
      "Vigilancia de efectos adversos de medicamentos"
    ]
  },
  {
    id: "insuficiencia-cardiaca",
    name: "Insuficiencia Cardíaca",
    description: "Síndrome clínico complejo en el que el corazón no puede bombear sangre suficiente para satisfacer las necesidades metabólicas del organismo.",
    symptoms: [
      "Disnea de esfuerzo y en reposo",
      "Ortopnea",
      "Disnea paroxística nocturna",
      "Edema en extremidades inferiores",
      "Fatiga y debilidad",
      "Tos nocturna",
      "Disminución de la tolerancia al ejercicio"
    ],
    pharmacologicalTreatment: [
      "IECA (enalapril, captopril)",
      "Betabloqueadores (carvedilol, metoprolol)",
      "Diuréticos (furosemida, espironolactona)",
      "ARA II (losartán, valsartán)",
      "Digitálicos (digoxina) en casos seleccionados"
    ],
    nonPharmacologicalTreatment: [
      "Restricción de sodio (2-3g/día)",
      "Control estricto de líquidos",
      "Ejercicio supervisado y gradual",
      "Vacunación contra influenza y neumococo",
      "Monitoreo diario del peso",
      "Abandono del tabaquismo"
    ],
    nursingProtocols: [
      "Monitoreo hemodinámico",
      "Balance hídrico estricto",
      "Valoración respiratoria",
      "Control de peso diario",
      "Administración de oxigenoterapia",
      "Prevención de complicaciones"
    ],
    nursingCare: [
      "Posicionamiento semisentado",
      "Educación sobre restricción hídrica",
      "Monitoreo de signos de descompensación",
      "Apoyo en actividades de la vida diaria",
      "Educación sobre signos de alarma",
      "Coordinación con cardiología"
    ]
  }
];

export const medications: Medication[] = [
  {
    id: "metformina",
    genericName: "Metformina",
    commercialNames: ["Glucofage", "Metfonorm", "Glafornil"],
    adultIndication: "Diabetes mellitus tipo 2",
    pediatricIndication: "Diabetes mellitus tipo 2 en niños >10 años",
    adultDose: "500-850 mg cada 8-12 horas, máximo 2550 mg/día",
    pediatricDose: "500 mg cada 12 horas, máximo 2000 mg/día",
    sideEffects: [
      "Náuseas y vómitos",
      "Diarrea",
      "Dolor abdominal",
      "Sabor metálico",
      "Acidosis láctica (rara)"
    ],
    contraindications: [
      "Insuficiencia renal severa (TFG <30 mL/min)",
      "Acidosis metabólica",
      "Insuficiencia hepática",
      "Insuficiencia cardíaca descompensada",
      "Hipoxemia severa"
    ],
    category: "Antidiabético"
  },
  {
    id: "enalapril",
    genericName: "Enalapril",
    commercialNames: ["Renitec", "Glioten", "Enaladil"],
    adultIndication: "Hipertensión arterial, insuficiencia cardíaca",
    pediatricIndication: "Hipertensión arterial en niños >1 mes",
    adultDose: "5-20 mg cada 12 horas",
    pediatricDose: "0.08-0.6 mg/kg/día dividido en 1-2 dosis",
    sideEffects: [
      "Tos seca",
      "Hipotensión",
      "Hiperkalemia",
      "Cefalea",
      "Mareos",
      "Angioedema (raro)"
    ],
    contraindications: [
      "Embarazo",
      "Angioedema previo por IECA",
      "Estenosis bilateral de arteria renal",
      "Hiperkalemia severa",
      "Hipotensión severa"
    ],
    category: "Antihipertensivo"
  },
  {
    id: "furosemida",
    genericName: "Furosemida",
    commercialNames: ["Lasix", "Seguril", "Diural"],
    adultIndication: "Edema, hipertensión arterial, insuficiencia cardíaca",
    pediatricIndication: "Edema, insuficiencia cardíaca congenital",
    adultDose: "20-80 mg/día, hasta 600 mg en casos severos",
    pediatricDose: "1-6 mg/kg/día dividido en 1-2 dosis",
    sideEffects: [
      "Deshidratación",
      "Hipokalemia",
      "Hiponatremia",
      "Ototoxicidad",
      "Hiperuricemia",
      "Hipotensión"
    ],
    contraindications: [
      "Hipersensibilidad a sulfamidas",
      "Anuria",
      "Depleción severa de volumen",
      "Hipokalemia severa",
      "Insuficiencia renal con anuria"
    ],
    category: "Diurético"
  },
  {
    id: "paracetamol",
    genericName: "Paracetamol (Acetaminofén)",
    commercialNames: ["Tylenol", "Winadol", "Dolex"],
    adultIndication: "Dolor leve a moderado, fiebre",
    pediatricIndication: "Dolor y fiebre en niños >3 meses",
    adultDose: "500-1000 mg cada 6-8 horas, máximo 4g/día",
    pediatricDose: "10-15 mg/kg cada 4-6 horas, máximo 5 dosis/día",
    sideEffects: [
      "Hepatotoxicidad (sobredosis)",
      "Rash cutáneo (raro)",
      "Náuseas (raras)",
      "Trombocitopenia (muy rara)"
    ],
    contraindications: [
      "Hipersensibilidad al paracetamol",
      "Hepatopatía severa",
      "Déficit de G6PD",
      "Alcoholismo crónico"
    ],
    category: "Analgésico-Antipirético"
  },
  {
    id: "omeprazol",
    genericName: "Omeprazol",
    commercialNames: ["Prilosec", "Losec", "Pepticum"],
    adultIndication: "Úlcera péptica, reflujo gastroesofágico, síndrome de Zollinger-Ellison",
    pediatricIndication: "Reflujo gastroesofágico en niños >1 año",
    adultDose: "20-40 mg/día en ayunas",
    pediatricDose: "0.7-3.3 mg/kg/día una vez al día",
    sideEffects: [
      "Cefalea",
      "Diarrea",
      "Dolor abdominal",
      "Náuseas",
      "Hipomagnesemia (uso prolongado)",
      "Riesgo de fracturas (uso prolongado)"
    ],
    contraindications: [
      "Hipersensibilidad al omeprazol",
      "Uso concomitante con atazanavir",
      "Hipersensibilidad a benzimidazoles"
    ],
    category: "Inhibidor de bomba de protones"
  }
];