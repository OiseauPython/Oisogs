<template>
  <div>
    <div class="presentation">
      <div class="input-wrapper">
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
          <div v-if="store.isLoading" class="info">
            <span>i</span>
            <div class="loading_info">Récupération de la collection...</div>
          </div>
          <div v-if="store.error" class="error">
            <span>&#10005;</span>
            <div class="error-message">
              {{ store.error }}
            </div>
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
          <a target="_blank" :href="store.userProfile.uri">Voir le compte discogs</a>
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
      <div class="big-number-container">
        <BigNumber :big-number="store.statistics.totalAlbums" wording="Albums" />
        <BigNumber :big-number="store.statistics.uniqueArtists" wording="Artistes" />
        <BigNumber
          :big-number="Object.values(store.statistics.style ?? {}).length"
          wording="Styles"
        />
      </div>

      <TopArtists :top-artists="store.statistics.bestArtists" />
      <MultiLineStatsGraph
        :data="store.statistics.addedPerYearAndFormat"
        title="Évolution des ajouts par format"
        class="graph-added"
      />
      <LineStatsGraph
        :labels="store.statistics.releaseByDecade.map((item) => item.decade)"
        :values="store.statistics.releaseByDecade.map((item) => item.count)"
        title="Nombre de sorties par décennies"
        variant="gradient"
        :is-tool-tip="true"
      />
      <LastAdded :last-added-albums="store.statistics.lastAddedAlbums" />
      <FunFact :collection="store.userCollection" />
      <SupportGraph
        :labels="store.statistics.format"
        :values="store.statistics.format"
        title="Répartition des supports"
        :is-tool-tip="false"
        class="graph-genre-repartition"
      />
      <BarStatsGraph
        :labels="store.statistics.addedPerYear.map((item) => item.year)"
        :values="store.statistics.addedPerYear.map((item) => item.count)"
        title="Nombre d'ajout dans la collection par années"
        variant="gradient"
        :is-tool-tip="false"
        class="graph-added-per-year"
      />
      <LineStatsGraph
        :labels="store.statistics.genre.map((item) => item.name)"
        :values="store.statistics.genre.map((item) => item.count)"
        title="Nombre de genres dans la collection"
        :is-tool-tip="false"
        class="graph-genre"
      />
      <WordCloud
        class="word-cloud-albums"
        title="Nuage des titres d'album"
        :words="store.statistics.albumWordCloud"
      />
      <div class="word-cloud-styles">
        <WordCloud title="Nuage des styles" :words="store.statistics.style" />
      </div>
      <!-- <SimpleInfoBlock
        title="Nombre de genres différents"
        :value="Object.values(store.statistics.genre ?? {}).length"
        suffix="Genres"
        variant="secondary"
      /> -->
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
import FunFact from '@/components/FunFact.vue'
import BigNumber from '@/components/BigNumber.vue'
import SupportGraph from '@/components/SupportGraph.vue'

const store = useDiscogsStore()
const searchValue = ref('')
const lastSearchTime = ref(0)

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
// Les imports sont gérés par Vite dans vite.config.js

.presentation {
  @include card-background;
  flex: 1;
  height: 30rem;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  @media (max-width: 768px) {
    @include card-background-mobile;
  }

  .profil_card {
    display: flex;
    flex-direction: column;
    gap: 10rem;
    .profil_name {
      font-size: 4.8rem;
      width: 50rem;
      line-height: 6rem;
      font-family: Poppins-Bold;
      @media (max-width: 768px) {
        font-size: 3.2rem;
        line-height: 4.5rem;
        width: auto;
      }
      .profil_username {
        font-weight: 900;
        text-transform: capitalize;
        background: $gradient;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    .profil_highlights-container {
      display: flex;
      a {
        color: white;
      }
    }
  }

  .input-wrapper {
    min-width: 18rem;
    width: 40%;
    max-width: 35rem;
    position: relative;
    @media (max-width: 768px) {
      width: 100%;
      max-width: none;
    }
    .infos-container {
      position: absolute;
      top: calc(50% - 4.5rem);
      left: 0;
      border: rgba(255, 255, 255, 0.2) dashed 2px;
      padding: 1rem;
      margin-top: 2rem;
      border-radius: 1.2rem;
      width: 100%;
      box-sizing: border-box;
      &.--error {
        border: rgba(221, 37, 37, 0.5) dashed 2px;
        position: absolute;
        top: calc(50% + 2rem);
      }
      .error,
      .info {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 1rem;
      }
      .error {
        color: rgb(221, 37, 37);

        span {
          color: rgb(200, 200, 200);
          background-color: rgb(221, 37, 37);
        }
      }
      .info {
        color: rgb(200, 200, 200);
        span {
          color: #000;
          background-color: rgb(200, 200, 200);
        }
      }
      span {
        border-radius: 5rem;
        height: 1.5rem;
        min-width: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        font-weight: 700;
      }
    }

    form {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
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
        height: 6.5rem;
        width: 100%;
        color: white;
        @media (min-width: 768px) {
          height: 5rem;
        }
      }

      input:focus {
        outline: none;
        box-shadow: 0 6px 12px rgba(107, 127, 255, 0.2);
        transition: all 0.2s ease;
      }

      input::placeholder {
        color: #bfbfbf;
      }

      button {
        position: absolute;
        height: 5.5rem;
        width: 5.5rem;
        border-radius: $round-radius;
        margin: 5px;
        padding: unset;
        right: 0;
        border: none;
        &:focus,
        &:hover {
          background-color: $background;
          transition: all 0.1s ease;
          img {
            filter: invert(100%);
          }
        }
        @media (min-width: 768px) {
          height: 4rem;
          width: 4rem;
        }

        img {
          width: 6rem;
          margin: -0.2rem 0 0 -0.2rem;
          @media (min-width: 768px) {
            width: 4.5rem;
          }
        }
      }
    }
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
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  :deep(.card-title) {
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
  .big-number-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;

    .big-number-wrapper {
      width: 20rem;
    }

    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 1rem;

      .big-number-wrapper {
        width: 100%;
        display: flex;
        margin: 0.5rem 0 0.5rem -1rem;

        &:nth-child(1) {
          align-items: flex-start;
        }
        &:nth-child(2) {
          align-items: center;
        }
        &:nth-child(3) {
          align-items: flex-end;
        }

        :deep(.wording) {
          right: 0rem;
        }
        @media (max-width: 340px) {
          :deep(.number) {
            font-size: 23vw;
          }
          :deep(.wording) {
            right: 2rem;
          }
        }
      }
    }
  }
  .top-artists-wrapper,
  .top-albums-wrapper {
    width: 100%;
    height: 50rem;
    @media (min-width: 768px) {
      flex: 0 0 calc(33.333% - 3rem);
      height: inherit;
    }
  }
  .chart-wrapper {
    width: 100%;
    @media (min-width: 768px) {
      flex: 0 0 calc(66.666% - 4rem);
    }
  }
  .fun-fact-wrapper {
    width: 100%;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    @media (min-width: 768px) {
      flex: 0 0 calc(33.333% - 1rem);
    }
  }
  .chart-wrapper.graph-added-per-year,
  .word-cloud-styles {
    width: 100%;
    @media (min-width: 768px) {
      flex: 0 0 calc(100% - 4rem);
    }
  }
  .word-cloud-container:not(.word-cloud-styles) {
    width: 100%;
    @media (min-width: 768px) {
      flex: 0 0 calc(33.333% - 3rem);
    }
  }
  .word-cloud-albums {
    height: 20rem;
    @media (min-width: 768px) {
      height: inherit;
    }
  }
  .graph-genre-repartition {
    width: 100%;
    @media (min-width: 768px) {
      flex: 0 0 calc(66.666% - 4rem);
    }
  }
  .word-cloud-styles {
    height: 45rem;
    width: 100%;
    margin-bottom: 3rem;
    @media (min-width: 768px) {
      flex: 0 0 100%;
    }
    .word-cloud-container {
      width: calc(100% - 4rem);
    }
  }
}

button {
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
