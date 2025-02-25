<template>
  <div>
    <div class="presentation">
      <!-- Section Recherche -->
      <form v-if="!store.collection.length && !store.isLoading" @submit.prevent="handleSearch">
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

      <!-- Infos -->
      <div
        v-if="store.isLoading || store.error"
        class="infos-container"
        :class="{ '--error': store.error }"
      >
        <div class="info">
          <div v-if="store.isLoading" class="loading_info">Récupération de la collection...</div>
        </div>
        <div class="error">
          <div v-if="store.error" class="error-message">
            {{ store.error }}
          </div>
        </div>
      </div>

      <!-- En-tête collection -->
      <div class="profil_card" v-if="store.collection.length">
        <div class="profil_name">
          Voici la collection de
          <span class="profil_username">
            {{ store.userProfile?.username }}
          </span>
        </div>
        <div class="profil_highlights-container">
          <div class="profil_highlights">
            <p class="stat_value">{{ store.statistics.totalAlbums }}</p>
            <p class="stat_suffix">Albums</p>
          </div>
          <div class="profil_highlights">
            <p class="stat_value">{{ store.statistics.uniqueArtists }}</p>
            <p class="stat_suffix">Artistes</p>
          </div>
          <div class="profil_highlights">
            <p class="stat_value">{{ Object.values(store.statistics.genre ?? {}).length }}</p>
            <p class="stat_suffix">Genres</p>
          </div>
          <div class="profil_highlights">
            <p class="stat_value">{{ Object.values(store.statistics.style ?? {}).length }}</p>
            <p class="stat_suffix">Styles</p>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <VinylLoader :is-loading="store.isLoading" />
      <div
        v-if="store.isLoading"
        class="loading_bar"
        :style="{ width: store.loadingProgress + '%' }"
      ></div>
    </div>

    <!-- Résultats -->
    <div v-if="store.collection.length && !store.error" class="results">
      <TopArtists :top-artists="store.statistics.bestArtists" />
      <MultiLineStatsGraph
        :data="store.statistics.addedPerYearAndFormat"
        title="Évolution des ajouts par format"
      />
      <LineStatsGraph
        :labels="store.statistics.releaseByDecade.map((item) => item.decade)"
        :values="store.statistics.releaseByDecade.map((item) => item.count)"
        title="Nombre de sorties par décennies"
        variant="gradient"
        :is-tool-tip="true"
      />
      <LineStatsGraph
        :labels="store.statistics.genre.map((item) => item.name)"
        :values="store.statistics.genre.map((item) => item.count)"
        title="Nombre de genres dans la collection"
        :is-tool-tip="false"
        class="graph-genre"
      />
      <LastAdded :last-added-albums="store.statistics.lastAddedAlbums" />
      <BarStatsGraph
        :labels="store.statistics.addedPerYear.map((item) => item.year)"
        :values="store.statistics.addedPerYear.map((item) => item.count)"
        title="Nombre d'ajout dans la collection par années"
        variant="gradient"
        :is-tool-tip="false"
      />
      <WordCloud :words="store.statistics.albumWordCloud" />
      <SimpleInfoBlock
        title="Nombre de genres différents"
        :value="Object.values(store.statistics.genre ?? {}).length"
        suffix="Genres"
        variant="secondary"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDiscogsStore } from '@/stores/store'
import SimpleInfoBlock from '@/components/SimpleInfoBlock.vue'
import LineStatsGraph from '@/components/LineStatsGraph.vue'
import MultiLineStatsGraph from '@/components/MultiLineStatsGraph.vue'
import BarStatsGraph from '@/components/BarStatsGraph.vue'
import VinylLoader from '@/components/VinylLoader.vue'
import TopArtists from '@/components/TopArtists.vue'
import LastAdded from '@/components/LastAdded.vue'
import WordCloud from '@/components/WordCloud.vue'

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
  background: rgba(255, 255, 255, 0.16);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5.1px);
  -webkit-backdrop-filter: blur(5.1px);
  border-radius: $card-radius;
  padding: 3rem;
  flex: 1;
  height: 30rem;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;

  .profil_card {
    display: flex;
    flex-direction: column;
    gap: 10rem;
    .profil_name {
      font-size: 4.8rem;
      width: 50rem;
      line-height: 6rem;
      font-family: Poppins-Bold;
      .profil_username {
        font-weight: 600;
        font-size: 52px;
        text-transform: capitalize;
        color: cornflowerblue;
      }
    }
    .profil_highlights-container {
      display: flex;
      gap: 3rem;
      p {
        margin: 0;
        text-align: center;
      }
      .profil_highlights {
        .stat_value {
          font-size: 4rem;
        }
        .stat_suffix {
        }
      }
    }
  }

  .infos-container {
    border: rgba(255, 255, 255, 0.2) dashed 2px;
    padding: 1rem;
    margin-top: 2rem;
    border-radius: 1.2rem;
    &.--error {
      border: rgba(215, 52, 52, 0.5) dashed 2px;
    }
    .error {
      color: rgb(215, 52, 52);
    }
    .info {
    }
  }

  form {
    position: relative;
    input {
      background: rgba(255, 255, 255, 0.2);
      border-radius: $round-radius;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      transition: 0.1s ease-in-out;
      padding: 0 2rem;
      outline: none;
      border: none;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      font-size: 2rem;
      height: 5rem;
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
      height: 4rem;
      width: 4rem;
      border-radius: $round-radius;
      margin: 5px;
      padding: unset;
      left: 26.1rem;
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
        width: 4.5rem;
        margin: -0.2rem 0 0 -0.2rem;
      }
    }
  }
  .loading_info {
    margin: 1rem 0;
    color: #666;
  }
  .loading_bar {
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    position: fixed;
    --gradient-lavender: #d300c5;
    --gradient-orange: #ff7a00;
    --gradient-pink: #ff0169;
    --gradient-purple: #7638fa;
    --gradient-yellow: #ffd600;
  }
  .loading_bar {
    transition: width 1s ease;
    animation:
      2s linear infinite RefreshedLoadingBarProgress,
      0.5s ease-out LoadingBarEnter;
    background: linear-gradient(
      to right,
      var(--gradient-yellow),
      var(--gradient-orange),
      var(--gradient-pink),
      var(--gradient-lavender),
      var(--gradient-purple),
      var(--gradient-yellow)
    );
    background-size: 500%;
    height: 3px;
    transform-origin: left;
    margin: 0 2.7rem;
    width: 100%;
  }
  @keyframes RefreshedLoadingBarProgress {
    0% {
      background-position: 125% 0;
    }
    100% {
      background-position: 0% 0;
    }
  }
  @keyframes LoadingBarEnter {
    0% {
      transform: scaleX(0);
    }
    100% {
      transform: scaleX(1);
    }
  }
}

.results {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-flow: dense;
  gap: 1rem;
  .chart-wrapper {
    grid-column: span 2;
  }

  .stat-card {
    grid-column: span 1;
  }

  .graph-genre {
    grid-column: span 3;
  }
}

button {
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
