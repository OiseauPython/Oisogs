// services/statsService.js
export const statsService = {
  // Fonctions de calcul pures
  calculateArtistsCount(collection) {
    const artists = new Set(collection.map((item) => item.basic_information.artists[0].name))
    return artists.size
  },
  calculateGenreStats(collection) {
    // Créer la Map et compter les genres
    const genres = new Map()
    collection.forEach((item) => {
      item.basic_information.styles?.forEach((style) => {
        genres.set(style, (genres.get(style) || 0) + 1)
      })
    })

    // Convertir la Map en tableau d'objets
    const arrayGenres = Array.from(genres, ([name, count]) => ({
      name,
      count,
    })).sort((a, b) => b.count - a.count)

    return arrayGenres
  },
  calculateReleaseYearStats(collection) {
    const decades = new Map()
    collection.forEach((item) => {
      const year = item.basic_information.year
      const decade = Math.floor(year / 10) * 10
      decades.set(decade, (decades.get(decade) || 0) + 1)
    })
    // Convertir la Map en tableau d'objets
    const releaseByDecadeArray = Array.from(decades, ([decade, count]) => ({
      decade,
      count,
    }))
      .sort((a, b) => a.decade - b.decade)
      .slice(1)
    return releaseByDecadeArray
  },
  calculateAdvancedStats(collection) {
    return {
      // Valeur estimée de la collection
      estimatedValue: collection.reduce((acc, item) => acc + (item.estimated_value || 0), 0),

      // Albums par note
      ratings: collection.reduce((acc, item) => {
        const rating = item.rating || 0
        acc[rating] = (acc[rating] || 0) + 1
        return acc
      }, {}),

      // Albums par pays
      countries: collection.reduce((acc, item) => {
        const country = item.basic_information.country
        acc[country] = (acc[country] || 0) + 1
        return acc
      }, {}),
    }
  },
}
