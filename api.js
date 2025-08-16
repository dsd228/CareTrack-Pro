// Integración con APIs externas (OpenFDA, NHS, Wikipedia)
// API Keys - Para agregar nuevas claves o cambiar las existentes, modifica estas constantes
const OPENFDA_API_KEY = 'Ua9uMKVX2JMhdKNvXGyexpjdKsMByFWWJO5Rd5Sf';
const NHS_API_KEY = 'cb536e23-13a3-478b-ac7e-ce39112447da';

/**
 * Busca información de medicamentos en OpenFDA
 * @param {string} term - Término de búsqueda
 * @returns {Object|null} - Datos del medicamento o null si no se encuentra
 */
export async function buscarMedicamento(term) {
  try {
    const url = `https://api.fda.gov/drug/label.json?api_key=${OPENFDA_API_KEY}&search=${encodeURIComponent(term)}&limit=1`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.results && data.results.length) {
      return data.results[0];
    }
    return null;
  } catch (error) {
    console.error("Error buscando medicamento en OpenFDA:", error);
    return null;
  }
}

/**
 * Busca información de enfermedades/condiciones en NHS API
 * @param {string} term - Término de búsqueda
 * @returns {Object|null} - Datos de la condición o null si no se encuentra
 */
export async function buscarNHS(term) {
  try {
    const url = `https://api.nhs.uk/conditions/${encodeURIComponent(term)}`;
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': NHS_API_KEY
      }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error buscando en NHS:", error);
    return null;
  }
}

/**
 * Traduce texto automáticamente al español usando LibreTranslate
 * @param {string} texto - Texto a traducir
 * @param {string} sourceLang - Idioma de origen (por defecto 'en')
 * @returns {string} - Texto traducido o texto original en caso de error
 */
export async function traducirAlEspañol(texto, sourceLang = 'en') {
  try {
    // LibreTranslate API gratuita - puede requerir instancia propia para producción
    const url = 'https://libretranslate.de/translate';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: texto,
        source: sourceLang,
        target: 'es',
        format: 'text'
      })
    });
    
    if (!res.ok) {
      // Fallback a MyMemory si LibreTranslate falla
      const fallbackRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=${sourceLang}|es`);
      const fallbackData = await fallbackRes.json();
      return fallbackData.responseData?.translatedText || texto;
    }
    
    const data = await res.json();
    return data.translatedText || texto;
  } catch (error) {
    console.error("Error traduciendo:", error);
    return texto;
  }
}

export async function buscarWiki(term, lang="es") {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}
