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
    async fetchUserProfile(username) {
      this.isLoading = true
      this.error = null

      try {
        const profile = await discogsApi.userProfile(username)
        this.userProfile = profile
      } catch (error) {
        this.error = error.errorKey || 'generic'
      } finally {
        this.isLoading = false
      }
    },

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
        this.error = error.errorKey || 'generic'
      } finally {
        this.isLoading = false
      }
    },

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
    collectionSize: (state) => state.collection.length,
    isCollectionEmpty: (state) => state.collection.length === 0,
    loadingProgress: (state) => state.progress.current,
    userCollection: (state) => state.collection,
    statistics: (state) => {
      if (!state.collection.length) return null
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

    topGenresForUI: (state) => {
      if (!state.collection.length) return []
      const genres = statsService.calculateGenreStats(state.collection)
      const total = genres.reduce((s, g) => s + g.count, 0)
      return genres.slice(0, 9).map((g) => ({
        name: g.name,
        count: g.count,
        pct: total > 0 ? (g.count / total) * 100 : 0,
      }))
    },

    topStylesForUI: (state) => {
      if (!state.collection.length) return []
      const styles = statsService.calculateStyleStats(state.collection)
      if (!styles.length) return []
      const max = styles[0][1]
      return styles.slice(0, 20).map(([name, count]) => ({
        name,
        count,
        weight: max > 0 ? count / max : 0,
      }))
    },

    allStylesForUI: (state) => {
      if (!state.collection.length) return []
      const styles = statsService.calculateStyleStats(state.collection)
      if (!styles.length) return []
      const max = styles[0][1]
      return styles.map(([name, count]) => ({
        name,
        count,
        weight: max > 0 ? count / max : 0,
      }))
    },

    decadesForUI: (state) => {
      if (!state.collection.length) return []
      return statsService
        .calculateReleaseYearStats(state.collection)
        .map((d) => ({ decade: d.decade + 's', count: d.count }))
    },

    topArtistsForUI: (state) => {
      if (!state.collection.length) return []
      const artistGenre = {}
      state.collection.forEach((item) => {
        const name = item.basic_information.artists[0]?.name
        if (name && !artistGenre[name] && item.basic_information.genres?.length) {
          artistGenre[name] = item.basic_information.genres[0]
        }
      })
      const best = statsService.calculateBestArtistsStats(state.collection)
      return Object.entries(best)
        .slice(0, 30)
        .map(([name, count]) => ({ name, count, genre: artistGenre[name] || '' }))
    },

    allArtistsForUI: (state) => {
      if (!state.collection.length) return []
      const counts = new Map()
      const artistGenre = {}
      state.collection.forEach((item) => {
        const bi = item.basic_information
        bi.artists.forEach((a) => counts.set(a.name, (counts.get(a.name) || 0) + 1))
        const first = bi.artists[0]?.name
        if (first && !artistGenre[first] && bi.genres?.length) {
          artistGenre[first] = bi.genres[0]
        }
      })
      return [...counts.entries()]
        .sort(([, a], [, b]) => b - a)
        .map(([name, count]) => ({ name, count, genre: artistGenre[name] || '' }))
    },

    formatsForUI: (state) => {
      if (!state.collection.length) return []
      const fmt = statsService.calculateFormatRepartion(state.collection)
      const total = Object.values(fmt).reduce((s, c) => s + c, 0)
      return Object.entries(fmt)
        .map(([name, count]) => ({
          name,
          count,
          pct: total > 0 ? (count / total) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count)
    },

    additionsForUI: (state) => {
      if (!state.collection.length) return []
      const byMonth = new Map()
      state.collection.forEach((item) => {
        const d = new Date(item.date_added)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        byMonth.set(key, (byMonth.get(key) || 0) + 1)
      })
      return [...byMonth.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-24)
        .map(([, count]) => count)
    },

    funFactsForUI: (state) => {
      if (!state.collection.length) return null
      const count = state.collection.length
      const years = state.collection
        .map((i) => i.basic_information.year)
        .filter((y) => y > 1900 && y <= new Date().getFullYear() + 1)
      const oldest = years.length ? Math.min(...years) : null
      const newest = years.length ? Math.max(...years) : null
      const addedPerYear = statsService.calculateAddedPerYearStats(state.collection)
      const totalMonths =
        addedPerYear.length > 1
          ? (addedPerYear[addedPerYear.length - 1].year - addedPerYear[0].year) * 12
          : 12
      const avgPerMonth = totalMonths > 0 ? (count / totalMonths).toFixed(1) : null
      return {
        count,
        stackM: (count * 0.003).toFixed(2),
        weightKg: Math.round(count * 0.18),
        oldest,
        newest,
        avgPerMonth,
      }
    },
  },
})
