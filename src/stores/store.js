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

    // Action pour récupérer la collection complète
    async fetchCollection(username) {
      this.isLoading = true
      this.error = null
      this.progress = {
        current: 0,
        currentPage: 0,
        totalPages: this.userProfile ? Math.ceil(this.userProfile.num_collection / 100) : 0,
      }

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
        this.progress.current = 100
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
    userCollection: (state) => state.collection,
    // Statistiques calculées à partir de la collection
    statistics: (state) => {
      if (!state.collection.length) return null
      console.log(state.collection)
      console.log(statsService.calculateFormatRepartion(state.collection))
      return {
        totalAlbums: state.userProfile.num_collection,
        uniqueArtists: statsService.calculateArtistsCount(state.collection),
        style: statsService.calculateStyleStats(state.collection),
        genre: statsService.calculateGenreStats(state.collection),
        releaseByDecade: statsService.calculateReleaseYearStats(state.collection),
        addedPerYear: statsService.calculateAddedPerYearStats(state.collection),
        addedPerYearAndFormat: statsService.calculateAddedPerYearAndFormatStats(state.collection),
        bestArtists: statsService.calculateBestArtistsStats(state.collection),
        lastAddedAlbums: statsService.calculateLastAddedAlbumsStats(state.collection),
        albumWordCloud: statsService.analyzeAlbumTitles(state.collection),
        format: statsService.calculateFormatRepartion(state.collection),
      }
    },
  },
})
