// services/statsService.js
export const statsService = {
  calculateArtistsCount(collection) {
    const artists = new Set(collection.map((item) => item.basic_information.artists[0].name))
    return artists.size
  },
  calculateGenreStats(collection) {
    // Créer la Map et compter les genres
    const genres = new Map()
    collection.forEach((item) => {
      item.basic_information.genres?.forEach((style) => {
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
  calculateStyleStats(collection) {
    // Créer la Map et compter les styles
    const styles = new Map()
    collection.forEach((item) => {
      item.basic_information.styles?.forEach((style) => {
        styles.set(style, (styles.get(style) || 0) + 1)
      })
    })

    // Convertir la Map en tableau d'objets
    const arrayStyles = Array.from(styles)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => [name, count])

    return arrayStyles
  },
  calculateAddedPerYearStats(collection) {
    // 1. Créer une Map pour compter les occurrences par année
    const years = new Map()

    // 2. Parcourir la collection et compter les années
    collection.forEach((item) => {
      const year = new Date(item.date_added).getFullYear()
      // Si l'année existe, incrémenter le compteur, sinon initialiser à 1
      years.set(year, (years.get(year) || 0) + 1)
    })

    // 3. Convertir la Map en tableau d'objets
    const addedPerYearArray = Array.from(years, ([year, count]) => ({
      year,
      count,
    })).sort((a, b) => a.year - b.year)

    return addedPerYearArray
  },
  calculateAddedPerYearAndFormatStats(collection) {
    // 1. Créer un objet pour stocker les données par format
    const formatYears = {
      Vinyl: new Map(),
      CD: new Map(),
      Cassette: new Map(),
      File: new Map(),
      Other: new Map(),
    }

    // 2. Parcourir la collection et compter par année et par format
    collection.forEach((item) => {
      const year = new Date(item.date_added).getFullYear()
      // Récupérer le vrai format depuis l'item
      const format = item.basic_information.formats?.[0]?.name || 'Other'

      // Vérifier si le format existe, sinon mettre dans Other
      const formatKey = formatYears.hasOwnProperty(format) ? format : 'Other'

      // Incrémenter le compteur pour ce format et cette année
      formatYears[formatKey].set(year, (formatYears[formatKey].get(year) || 0) + 1)
    })

    // 3. Transformer les données pour le graphique
    const allYears = new Set()
    Object.values(formatYears).forEach((formatMap) => {
      formatMap.forEach((_, year) => allYears.add(year))
    })
    const years = Array.from(allYears).sort()
    // 4. Créer le format final des données
    return {
      labels: years,
      datasets: Object.entries(formatYears).map(([format, yearMap]) => ({
        label: format,
        data: years.map((year) => yearMap.get(year) || 0),
        borderColor: this.getFormatColor(format),
        backgroundColor: this.getFormatColor(format, 0.2),
        tension: 0.4,
        fill: false,
      })),
    }
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
  calculateLastAddedAlbumsStats(collection, limit = 5) {
    // 1. Trier la collection par date d'ajout (du plus récent au plus ancien)
    const sortedAlbums = [...collection].sort((a, b) => {
      return new Date(b.date_added) - new Date(a.date_added)
    })

    // 2. Prendre les 5 premiers et formater les données
    return sortedAlbums.slice(0, limit).map((album) => ({
      id: album.id,
      artist: album.basic_information.artists[0].name,
      title: album.basic_information.title,
      cover: album.basic_information.cover_image,
      dateAdded: new Date(album.date_added).toLocaleDateString(),
    }))
  },
  analyzeAlbumTitles(collection) {
    const wordCount = {}
    const commonWordsToExclude = {
      english: ['the', 'and', 'for', 'with', 'from', 'vol', 'volume'],
      french: ['les', 'des', 'pour', 'avec', 'dans', 'par', 'sur'],
      spanish: ['los', 'las', 'del', 'por', 'con'],
      german: ['der', 'die', 'das', 'und', 'von'],
      italian: ['gli', 'dei', 'delle', 'nella', 'dal'],
      numbers: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
    }
    const wordsToExclude = Object.values(commonWordsToExclude).flat()
    collection.forEach((item) => {
      const title = item.basic_information.title
      const words = title
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
        .split(' ')
        .filter((word) => word.length > 2)
        .filter((word) => !wordsToExclude.includes(word))

      words.forEach((word) => {
        wordCount[word] = (wordCount[word] || 0) + 1
      })
    })

    const sortedWords = Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15)

    return sortedWords
  },
  calculateBestArtistsStats(collection) {
    const artists = new Map()
    collection.forEach((item) => {
      // Prend en compte tous les artistes d'une release
      item.basic_information.artists.forEach((artist) => {
        artists.set(artist.name, (artists.get(artist.name) || 0) + 1)
      })
    })

    // Trier les résultats par nombre d'occurrences
    const sortedArtists = [...artists.entries()]
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .reduce(
        (obj, [key, value]) => ({
          ...obj,
          [key]: value,
        }),
        {},
      )

    return sortedArtists
  },
  calculateFormatRepartion(collection) {
    const formats = {}
    collection.forEach((item) => {
      item.basic_information.formats.forEach((format) => {
        // Si la propriété n'existe pas, on l'initialise à 0, puis on incrémente
        formats[format.name.toLowerCase()] = (formats[format.name.toLowerCase()] || 0) + 1
      })
    })

    return formats
  },
  getFormatColor(format, alpha = 1) {
    const colors = {
      Vinyl: `rgba(255, 99, 132, ${alpha})`, // Rouge
      CD: `rgba(54, 162, 235, ${alpha})`, // Bleu
      Cassette: `rgba(255, 206, 86, ${alpha})`, // Jaune
      File: `rgba(75, 192, 192, ${alpha})`, // Turquoise
      Other: `rgba(153, 102, 255, ${alpha})`, // Violet
    }
    return colors[format] || colors.Other
  },
}
