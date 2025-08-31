<template>
  <div class="randomize-view">
    <div v-if="!selectedAlbum && !store.collection.length">
      <p class="randomize-logout">
        Vous devez <RouterLink to="/">rechercher une collection</RouterLink> pour utiliser le
        randomizer
      </p>
    </div>
    <div v-if="store.collection.length" class="randomize-container">
      <div class="randomize-card all">
        <h2 class="randomize-title">Album aléatoire</h2>
        <div v-if="isShufflingAll" class="shuffle-animation">
          <img :src="shufflingAlbumCoverAll" alt="Tirage..." class="album-cover" />
        </div>
        <template v-else-if="!selectedAllAlbum">
          <div class="cta">
            <button @click="randomizeAllAlbum" class="cta-button">Lancer le tirage</button>
          </div>
        </template>
        <template v-else>
          <div class="album-result">
            <img
              :src="selectedAllAlbum.cover_image"
              alt="Pochette de l'album"
              class="album-cover"
            />
            <div class="album-info">
              <p>{{ selectedAllAlbum.title }}</p>
              <p>{{ selectedAllAlbum.artist }} - {{ selectedAllAlbum.year }}</p>
              <button @click="selectedAllAlbum = null" class="back-button">Nouveau tirage</button>
            </div>
          </div>
        </template>
      </div>
      <div class="randomize-card genre">
        <h2 class="randomize-title">Album aléatoire par genre</h2>
        <div v-if="isShufflingGenre" class="shuffle-animation">
          <img :src="shufflingAlbumCoverGenre" alt="Tirage..." class="album-cover" />
        </div>
        <template v-else-if="!selectedGenreAlbum">
          <div class="cta">
            <select v-model="selectedGenre" class="filter-select">
              <option disabled value="">Choisissez un genre</option>
              <option v-for="genre in availableGenres" :key="genre" :value="genre">
                {{ genre }}
              </option>
            </select>
            <button @click="randomizeGenreAlbum" class="cta-button" :disabled="!selectedGenre">
              Lancer le tirage
            </button>
          </div>
        </template>
        <template v-else>
          <div class="album-result">
            <img
              :src="selectedGenreAlbum.cover_image"
              alt="Pochette de l'album"
              class="album-cover"
            />
            <div class="album-info">
              <p>{{ selectedGenreAlbum.title }}</p>
              <p>{{ selectedGenreAlbum.artist }} - {{ selectedGenreAlbum.year }}</p>
              <button @click="selectedGenreAlbum = null" class="back-button">Nouveau tirage</button>
            </div>
          </div>
        </template>
      </div>
      <div class="randomize-card style">
        <h2 class="randomize-title">Album aléatoire par style</h2>
        <div v-if="isShufflingStyle" class="shuffle-animation">
          <img :src="shufflingAlbumCoverStyle" alt="Tirage..." class="album-cover" />
        </div>
        <template v-else-if="!selectedStyleAlbum">
          <div class="cta">
            <select v-model="selectedStyle" class="filter-select">
              <option disabled value="">Choisissez un style</option>
              <option v-for="style in availableStyles" :key="style" :value="style">
                {{ style }}
              </option>
            </select>
            <button @click="randomizeStyleAlbum" class="cta-button" :disabled="!selectedStyle">
              Lancer le tirage
            </button>
          </div>
        </template>
        <template v-else>
          <div class="album-result">
            <img
              :src="selectedStyleAlbum.cover_image"
              alt="Pochette de l'album"
              class="album-cover"
            />
            <div class="album-info">
              <p class="album-name">{{ selectedStyleAlbum.title }}</p>
              <p class="album-artist">
                {{ selectedStyleAlbum.artist }} - {{ selectedStyleAlbum.year }}
              </p>
              <button @click="selectedStyleAlbum = null" class="back-button">Nouveau tirage</button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDiscogsStore } from '@/stores/store'

const store = useDiscogsStore()

const albums = computed(() => store.collection)
const selectedAllAlbum = ref(null)
const selectedGenreAlbum = ref(null)
const selectedStyleAlbum = ref(null)

const isShufflingAll = ref(false)
const shufflingAlbumCoverAll = ref('')
const isShufflingGenre = ref(false)
const shufflingAlbumCoverGenre = ref('')
const isShufflingStyle = ref(false)
const shufflingAlbumCoverStyle = ref('')

const selectedGenre = ref('')
const selectedStyle = ref('')

const availableGenres = computed(() => {
  if (!albums.value) return []
  const allGenres = albums.value.flatMap((album) => album.basic_information.genres || [])
  const genreCounts = allGenres.reduce((acc, genre) => {
    acc[genre] = (acc[genre] || 0) + 1
    return acc
  }, {})
  return Object.keys(genreCounts).sort((a, b) => genreCounts[b] - genreCounts[a])
})

const availableStyles = computed(() => {
  if (!albums.value) return []
  const allStyles = albums.value.flatMap((album) => album.basic_information.styles || [])
  const styleCounts = allStyles.reduce((acc, style) => {
    acc[style] = (acc[style] || 0) + 1
    return acc
  }, {})
  return Object.keys(styleCounts).sort((a, b) => styleCounts[b] - styleCounts[a])
})

const runShuffle = async (config) => {
  const { albumList, isShuffling, shufflingCover, finalSelection, duration = 2000 } = config

  if (!albumList || albumList.length < 1) return

  isShuffling.value = true

  // Preload images for smooth animation
  const preloadCovers = []
  const shuffledList = [...albumList].sort(() => 0.5 - Math.random())
  const selection = shuffledList.slice(0, Math.min(15, shuffledList.length)) // Preload up to 20 covers

  const imagePromises = selection.map((album) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = album.basic_information.cover_image
      img.onload = () => {
        preloadCovers.push(img.src)
        resolve()
      }
      img.onerror = reject
    })
  })

  await Promise.all(imagePromises.map((p) => p.catch((e) => e))) // Wait for all images to preload, ignore failures

  if (preloadCovers.length === 0) {
    // Fallback if no images loaded
    const randomIndex = Math.floor(Math.random() * albumList.length)
    finalSelection.value = albumList[randomIndex]
    isShuffling.value = false
    return
  }

  let coverIndex = 0
  const shuffleInterval = setInterval(() => {
    shufflingCover.value = preloadCovers[coverIndex]
    coverIndex = (coverIndex + 1) % preloadCovers.length
  }, 120)

  setTimeout(() => {
    clearInterval(shuffleInterval)

    const randomIndex = Math.floor(Math.random() * albumList.length)
    const randomRelease = albumList[randomIndex]

    finalSelection.value = {
      title: randomRelease.basic_information.title,
      artist: randomRelease.basic_information.artists.map((a) => a.name).join(', '),
      year: randomRelease.basic_information.year,
      cover_image: randomRelease.basic_information.cover_image,
    }

    isShuffling.value = false
  }, duration)
}

const randomizeAllAlbum = () => {
  runShuffle({
    albumList: albums.value,
    isShuffling: isShufflingAll,
    shufflingCover: shufflingAlbumCoverAll,
    finalSelection: selectedAllAlbum,
  })
}

const randomizeGenreAlbum = () => {
  const filteredAlbums = albums.value.filter((album) =>
    album.basic_information.genres?.includes(selectedGenre.value),
  )
  runShuffle({
    albumList: filteredAlbums,
    isShuffling: isShufflingGenre,
    shufflingCover: shufflingAlbumCoverGenre,
    finalSelection: selectedGenreAlbum,
  })
}

const randomizeStyleAlbum = () => {
  const filteredAlbums = albums.value.filter((album) =>
    album.basic_information.styles?.includes(selectedStyle.value),
  )
  runShuffle({
    albumList: filteredAlbums,
    isShuffling: isShufflingStyle,
    shufflingCover: shufflingAlbumCoverStyle,
    finalSelection: selectedStyleAlbum,
  })
}
</script>

<style scoped lang="scss">
.randomize-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  text-align: center;
  .randomize-logout {
    a {
      background: linear-gradient(110deg, #ff881a, #ff008c, #1457ff);
      background-clip: border-box;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 600;
    }
  }
}

.cta-button {
  background: rgba(255, 255, 255, 0.2);
  border-radius: $round-radius;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  transition: 0.1s ease-in-out;
  padding: 0 2rem;
  outline: none;
  border: none;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  font-size: 1.6rem;
  height: 4.5rem;
  width: fit-content;
  color: white;
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.2s;
  margin-bottom: 2rem;

  &:hover {
    outline: none;
    box-shadow: 0 6px 12px rgba(28, 4, 4, 0.2);
    transition: all 0.2s ease;
  }
}

.randomize-container {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-select {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid #555;
  background-color: #333;
  color: white;
}

.randomize-card {
  @include card-background;
  padding: 1.5rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  flex: 1 1 22rem;
  .randomize-title {
    margin: 0.5rem 0;
    text-align: center;
    font-size: 1.8rem;
    font-family: Poppins-Bold;
    &::after {
      content: '';
      display: block;
      width: 5rem;
      height: 0.2rem;
      margin: 0.3rem auto 1rem;
      background: linear-gradient(90deg, #0088ff, #692fff, #c1498a);
    }
  }
}

.album-cover {
  width: 100%;
  height: auto;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.album-info {
  text-align: center;
}

.back-button {
  background-color: #333;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;

  &:hover {
    background-color: #444;
  }
}

.album-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
</style>
