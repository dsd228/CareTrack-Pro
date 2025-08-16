// Integración con APIs externas (OpenFDA, MedlinePlus, Wikipedia)
export async function buscarMedicamento(term) {
  try {
    const res = await fetch(`https://api.fda.gov/drug/label.json?search=${encodeURIComponent(term)}`);
    const data = await res.json();
    if (data.results && data.results.length) {
      return data.results[0];
    }
    return null;
  } catch {
    return null;
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
