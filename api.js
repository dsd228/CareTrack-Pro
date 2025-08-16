// Integración con APIs externas (OpenFDA, MedlinePlus, Wikipedia)
export async function buscarMedicamento(term) {
  try {
    // Mock data for testing - would normally fetch from OpenFDA
    console.log('Mock OpenFDA search for:', term);
    return {
      brand_name: [`Mock Medicine for ${term}`],
      generic_name: [`Generic ${term}`],
      description: [`Mock description for ${term}`],
      purpose: [`Mock purpose for ${term}`],
      dosage_and_administration: [`Mock dosage for ${term}`],
      contraindications: [`Mock contraindications for ${term}`],
      active_ingredient: [`Mock active ingredient for ${term}`],
      adverse_reactions: [`Mock side effects for ${term}`]
    };
  } catch {
    return null;
  }
}

export async function buscarWiki(term, lang="es") {
  try {
    // Mock data for testing - would normally fetch from Wikipedia
    console.log('Mock Wikipedia search for:', term, 'in', lang);
    return {
      title: `Mock Wikipedia: ${term}`,
      extract: `This is mock Wikipedia content for ${term}. In a real implementation, this would fetch from Wikipedia API.`
    };
  } catch {
    return null;
  }
}
