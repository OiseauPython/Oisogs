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
    const years = new Map()

    collection.forEach((item) => {
      const year = new Date(item.date_added).getFullYear()
      years.set(year, (years.get(year) || 0) + 1)
    })

    const addedPerYearArray = Array.from(years, ([year, count]) => ({
      year,
      count,
    })).sort((a, b) => a.year - b.year)

    return addedPerYearArray
  },
  calculateAddedPerYearAndFormatStats(collection) {
    const formatYears = {
      Vinyl: new Map(),
      CD: new Map(),
      Cassette: new Map(),
      File: new Map(),
      Other: new Map(),
    }

    collection.forEach((item) => {
      const year = new Date(item.date_added).getFullYear()
      const format = item.basic_information.formats?.[0]?.name || 'Other'

      const formatKey = formatYears.hasOwnProperty(format) ? format : 'Other'

      formatYears[formatKey].set(year, (formatYears[formatKey].get(year) || 0) + 1)
    })

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
  calculateLastAddedAlbumsStats(collection, limit = 50) {
    const sortedAlbums = [...collection].sort((a, b) => {
      return new Date(b.date_added) - new Date(a.date_added)
    })
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
      item.basic_information.artists.forEach((artist) => {
        artists.set(artist.name, (artists.get(artist.name) || 0) + 1)
      })
    })

    const allArtists = [...artists.entries()].sort(([, a], [, b]) => b - a)

    let topArtists = allArtists.filter(([, count]) => count >= 2)

    if (topArtists.length < 10) {
      const needed = 10 - topArtists.length
      const extraArtists = allArtists.filter((a) => !topArtists.includes(a)).slice(0, needed)
      topArtists.push(...extraArtists)
      topArtists.sort(([, a], [, b]) => b - a)
    }

    const finalArtists = topArtists.slice(0, 50).reduce((obj, [key, value]) => {
      obj[key] = value
      return obj
    }, {})

    return finalArtists
  },
  calculateFormatRepartion(collection) {
    const formats = {}
    collection.forEach((item) => {
      item.basic_information.formats.forEach((format) => {
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
