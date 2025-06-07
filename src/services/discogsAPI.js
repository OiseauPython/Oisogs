const BASE_URL = 'https://tourmaline-valkyrie-c86344.netlify.app/.netlify/functions/discogs-proxy'

// Créer une fonction réutilisable pour les appels API
// Dans discogsAPI.js
async function fetchDiscogsAPI(endpoint, options = {}) {
  const defaultHeaders = {
    'User-Agent': 'Oisogs/1.0',
  }

  const maxRetries = 3
  let retryCount = 0

  while (retryCount < maxRetries) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: { ...defaultHeaders, ...options.headers },
      })

      // Si on reçoit un 429, on attend avant de réessayer
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || 60
        console.log(`Rate limit atteint, attente de ${retryAfter} secondes`)
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000))
        retryCount++
        continue
      }

      if (!response.ok) {
        throw new Error(response.status)
      }

      return await response.json()
    } catch (error) {
      if (retryCount === maxRetries - 1) {
        const errorMessages = {
          403: 'Cette collection est privée ou inaccessible',
          404: 'Collection introuvable',
          429: 'Trop de requêtes, attendez un moment',
          network: 'Erreur de connexion au serveur',
          default: 'Une erreur est survenue',
        }

        const userMessage = errorMessages[error.message] || errorMessages.default
        throw {
          status: error.message,
          message: userMessage,
        }
      }
      retryCount++
    }
  }
}

export const discogsApi = {
  async getAllCollection(username, onProgress) {
    let allReleases = []
    let page = 1
    let hasNextPage = true

    while (hasNextPage) {
      try {
        const data = await fetchDiscogsAPI(
          `/users/${username}/collection/folders/0/releases?page=${page}&per_page=100`,
        )

        allReleases = [...allReleases, ...data.releases]

        const progress = Math.round(((page - 1) / (data.pagination.pages - 1)) * 100)
        if (onProgress) {
          onProgress(progress, page, data.pagination.pages)
        }

        hasNextPage = page < data.pagination.pages
        page++

        let restrictionTimer = data.pagination.pages > 29 ? 2000 : 0
        console.log('restrictionTimer : ', data.pagination.pages, restrictionTimer)
        await new Promise((resolve) => setTimeout(resolve, restrictionTimer))
      } catch (error) {
        throw error
      }
    }

    return allReleases
  },

  async userProfile(username) {
    return fetchDiscogsAPI(`/users/${username}`)
  },

  async search(query) {
    return fetchDiscogsAPI(`/database/search?q=${query}`)
  },

  async getRelease(id) {
    return fetchDiscogsAPI(`/releases/${id}`)
  },
}
