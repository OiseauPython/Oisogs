<template>
  <div>
    <div class="presentation">
      <!-- Section Recherche -->
      <form v-if="!store.collection.length" @submit.prevent="handleSearch">
        <input
          type="text"
          v-model="searchValue"
          placeholder="Rechercher..."
          :disabled="store.isLoading"
        />
        <button type="submit" :disabled="store.isLoading || !isSearchValid">
          <img src="@/assets/img/right-arrow.svg" alt="" />
        </button>
      </form>

      <!-- En-tête collection -->
      <div v-else>
        <p class="profil_name">
          Voici la collection de
          <span class="profil_username">
            {{ store.userProfile?.username }}
          </span>
        </p>
      </div>

      <!-- Loading -->
      <div v-if="store.isLoading" class="loading">Chargement... {{ store.loadingProgress }}%</div>
      <VinylLoader :is-loading="store.isLoading" />

      <!-- Erreurs -->
      <div v-if="store.error" class="error-message">
        {{ store.error }}
      </div>
    </div>

    <!-- Résultats -->
    <div v-if="store.collection.length && !store.error" class="results">
      <SimpleInfoBlock
        title="Total d'albums"
        :value="store.statistics.totalAlbums"
        suffix="Albums"
        variant="primary"
      />
      <SimpleInfoBlock
        title="Nombre d'artistes différents"
        :value="store.statistics.uniqueArtists"
        suffix="Artistes"
        variant="secondary"
      />
      <SimpleInfoBlock
        title="Nombre de genres différents"
        :value="Object.values(store.statistics.genre ?? {}).length"
        suffix="Genres"
        variant="secondary"
      />
      <InfoIcon :tooltipData="tooltips.yearGraph" />
      <StatsGraph
        type="bar"
        :labels="store.statistics.genre.map((item) => item.name)"
        :values="store.statistics.genre.map((item) => item.count)"
        title="Formats Distribution"
      />
      <StatsGraph
        type="bar"
        :labels="store.statistics.releaseByDecade.map((item) => item.decade)"
        :values="store.statistics.releaseByDecade.map((item) => item.count)"
        title="Formats Distribution"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDiscogsStore } from '@/stores/store'
import SimpleInfoBlock from '@/components/SimpleInfoBlock.vue'
import StatsGraph from '@/components/StatsGraph.vue'
import InfoIcon from '@/components/InfoIcon.vue'
import VinylLoader from '@/components/VinylLoader.vue'
import { tooltips } from '@/data/tooltips'

const store = useDiscogsStore()
const searchValue = ref('')
const lastSearchTime = ref(0)
const labels = null
const values = null

// Validations
const isSearchValid = computed(() => {
  const query = searchValue.value.trim()
  return query && query.length <= 50
})

// Gestionnaire de recherche
const handleSearch = async () => {
  const now = Date.now()
  if (now - lastSearchTime.value < 3000) {
    store.setError('Veuillez patienter un instant avant de recommencer')
    return
  }

  if (!isSearchValid.value) {
    store.setError("Le nom d'utilisateur doit faire entre 1 et 50 caractères")
    return
  }

  lastSearchTime.value = now

  try {
    // Charge le profil et la collection
    await store.fetchUserProfile(searchValue.value)
    await store.fetchCollection(searchValue.value)
  } catch (error) {
    console.error('Erreur lors de la recherche:', error)
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;

.presentation {
  background-color: $color-background-light;
  border-radius: 2rem;
  padding: 3rem;
  margin: 2rem;
  flex: 1;
  height: 20rem;
  overflow: hidden;
  position: relative;

  .profil_name {
    font-size: 48px;
    width: 30rem;
    line-height: 4rem;
    font-family: Poppins-Bold;
    .profil_username {
      font-weight: 600;
      font-size: 52px;
      text-transform: capitalize;
      color: cornflowerblue;
    }
  }
  form {
    position: relative;
    input {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      transition: 0.1s ease-in-out;
      border-radius: 25px;
      padding: 15px 25px;
      font-size: 15px;
      outline: none;
      border: none;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }

    input:focus {
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
      transition: all 0.2s ease;
    }

    input::placeholder {
      color: #bfbfbf;
    }

    button {
      position: absolute;
      height: 2.3rem;
      width: 2.3rem;
      border-radius: 50%;
      margin: 5px;
      padding: unset;
      left: 11.7rem;
      border: none;
      &:focus,
      &:hover {
        background-color: blue;
        transition: all 0.1s ease;
        img {
          filter: invert(100%);
        }
      }

      img {
        width: 2.5rem;
        margin: -0.1rem 0 0 -0.1rem;
      }
    }
  }
}

.loading {
  margin: 1rem 0;
  color: #666;
}

.error-message {
  color: red;
  margin: 1rem 0;
}

.results {
  margin-top: 1rem;
}

button {
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
