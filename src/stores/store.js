// stores/discogsStore.js
import { defineStore } from 'pinia'
import { discogsApi } from '@/services/discogsAPI'
import { statsService } from '@/services/statsService'

export const useDiscogsStore = defineStore('discogs', {
  state: () => ({
    collection: [],
    userProfile: null,
    currentRelease: null,
    isLoading: false,
    progress: {
      current: 0,
      currentPage: 0,
      totalPages: 0,
    },
    error: null,
  }),

  actions: {
    // Action pour récupérer la collection complète
    async fetchCollection(username) {
      this.isLoading = true
      this.error = null

      try {
        const onProgress = (progress, currentPage, totalPages) => {
          this.progress = {
            current: progress,
            currentPage,
            totalPages,
          }
        }

        const collection = await discogsApi.getAllCollection(username, onProgress)
        this.collection = collection
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },

    // Action pour récupérer le profil utilisateur
    async fetchUserProfile(username) {
      this.isLoading = true
      this.error = null

      try {
        const profile = await discogsApi.userProfile(username)
        this.userProfile = profile
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },

    // Action pour chercher
    async searchItems(query) {
      this.isLoading = true
      this.error = null

      try {
        return await discogsApi.search(query)
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },

    // Action pour récupérer une release spécifique
    async fetchRelease(id) {
      this.isLoading = true
      this.error = null

      try {
        const release = await discogsApi.getRelease(id)
        this.currentRelease = release
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },

    // Action pour réinitialiser le store
    resetStore() {
      this.collection = []
      this.userProfile = null
      this.currentRelease = null
      this.error = null
      this.progress = {
        current: 0,
        currentPage: 0,
        totalPages: 0,
      }
    },
  },

  getters: {
    // Ajoute des getters si tu as besoin de données dérivées
    collectionSize: (state) => state.collection.length,
    isCollectionEmpty: (state) => state.collection.length === 0,
    loadingProgress: (state) => state.progress.current,
    // Statistiques calculées à partir de la collection
    statistics: (state) => {
      if (!state.collection.length) return null

      return {
        totalAlbums: state.collection.length,
        uniqueArtists: statsService.calculateArtistsCount(state.collection),
        genre: statsService.calculateGenreStats(state.collection),
        releaseByDecade: statsService.calculateReleaseYearStats(state.collection),
      }
    },
  },
})
