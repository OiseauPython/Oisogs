<template>
  <div class="fun-fact-wrapper">
    <h2 class="card-title">
      Fun Facts<InfoIcon v-if="isToolTip" :tooltipData="helpToolTips.yearGraph" />
    </h2>

    <div class="facts-grid">
      <div v-for="fact in facts" :key="fact.id" class="fact-item">
        <div class="fact-content">
          <p class="stat-value">{{ fact.value.toFixed(fact.decimals || 2) }}</p>
          <p class="stat-unit">{{ fact.unit }}</p>
        </div>
        <!-- <p class="fact-description">{{ getDescriptionForFact(fact.id) }}</p> -->
      </div>
    </div>
    <div class="fact-item time-fact">
      <div class="fact-content time">
        <div class="time-container">
          <div class="fact-content">
            <span class="stat-value">{{ collectionTime.days.value }}</span>
            <span class="stat-unit">{{ collectionTime.days.label }}</span>
          </div>
          <div class="fact-content">
            <span class="stat-value">{{ collectionTime.hours.value }}</span>
            <span class="stat-unit">{{ collectionTime.hours.label }}</span>
          </div>
          <div class="fact-content">
            <span class="stat-value">{{ collectionTime.minutes.value }}</span>
            <span class="stat-unit">{{ collectionTime.minutes.label }}</span>
          </div>
        </div>
        <!-- <p class="fact-description">pour écouter toute votre collection</p> -->
      </div>
    </div>

    <!-- <div class="fun-comparison" v-if="showComparison">
      <p class="didyouknow">Le saviez vous ?</p>
      <p>{{ randomComparison }}</p>
    </div> -->
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useDiscogsStore } from '@/stores/store'

const store = useDiscogsStore()
const props = defineProps({
  collection: {
    type: Object,
    required: true,
  },
  isToolTip: {
    type: Boolean,
    default: true,
  },
  helpToolTips: {
    type: Object,
    default: () => ({
      yearGraph: 'Statistiques amusantes sur votre collection',
    }),
  },
})

const showComparison = ref(true)

// Constantes pour les calculs (meilleure maintenance)
const MEASUREMENTS = {
  VINYL: {
    height: 0.0055, // meter
    length: 0.315, // meter
    surface: 0.099, // m2
    weight: 0.34, // kg
  },
  CD: {
    height: 0.012,
    length: 0.14,
    surface: 0.02,
    weight: 0.08,
  },
  CASSETTE: {
    height: 0.012,
    length: 0.11,
    surface: 0.006,
    weight: 0.012,
  },
}

const counts = computed(() => ({
  vinyl: store.statistics.format.vinyl || 0,
  cd: store.statistics.format.cd || 0,
  cassette: store.statistics.format.cassette || 0,
}))

const calculateValue = (type) => {
  return (
    counts.value.vinyl * MEASUREMENTS.VINYL[type] +
    counts.value.cd * MEASUREMENTS.CD[type] +
    counts.value.cassette * MEASUREMENTS.CASSETTE[type]
  )
}

const collectionTime = computed(() => {
  const totalMinutes = store.statistics.totalAlbums * 45
  const days = Math.floor(totalMinutes / (24 * 60))
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
  const minutes = totalMinutes % 60

  return {
    days: {
      value: days,
      label: days === 1 ? 'jour' : 'jours',
    },
    hours: {
      value: hours,
      label: hours === 1 ? 'heure' : 'heures',
    },
    minutes: {
      value: minutes,
      label: minutes === 1 ? 'minute' : 'minutes',
    },
  }
})

const collectionHeight = computed(() => {
  const value = calculateValue('height')
  return {
    id: 'height',
    value: value < 1 ? value * 100 : value,
    unit: value < 1 ? 'cm' : 'm',
    decimals: value < 1 ? 1 : 2,
  }
})

const collectionLength = computed(() => ({
  id: 'length',
  value: calculateValue('length'),
  unit: 'm',
  decimals: 2,
}))

const collectionSurface = computed(() => ({
  id: 'surface',
  value: calculateValue('surface'),
  unit: 'm²',
  decimals: 1,
}))

const collectionWeight = computed(() => ({
  id: 'weight',
  value: calculateValue('weight'),
  unit: 'kg',
  decimals: 1,
}))

const facts = computed(() => [
  collectionHeight.value,
  //collectionLength.value,
  collectionSurface.value,
  collectionWeight.value,
])

const getDescriptionForFact = (factId) => {
  const descriptions = {
    height: 'de hauteur empilée',
    length: 'alignés bout à bout',
    surface: 'de surface totale',
    weight: 'au total',
  }
  return descriptions[factId] || ''
}

// Comparaisons amusantes
const comparisons = computed(() => [
  `Votre collection de vinyles pèse autant que ${(collectionWeight.value.value / 5).toFixed(1)} chats.`,
  `Empilés, vos disques atteindraient ${((collectionHeight.value.value / 1.8) * 100).toFixed(1)}% de la hauteur d'un humain moyen.`,
  `Vos supports occuperaient environ ${((collectionSurface.value.value / 260) * 100).toFixed(1)}% d'un terrain de tennis.`,
  `Le temps d'écoute de votre collection équivaut à ${(collectionTime.value.days / 7).toFixed(1)} semaines non-stop!`,
])

const randomComparison = computed(() => {
  const randomIndex = Math.floor(Math.random() * comparisons.value.length)
  return comparisons.value[randomIndex]
})
</script>

<style lang="scss" scoped>
// Les imports sont gérés par Vite dans vite.config.js


.fun-fact-wrapper {
  .facts-grid {
    display: flex;
    gap: 1.25rem;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
  }
  .fact-item {
    padding: 1.25rem 1rem;
    position: relative;
    .fact-content:not(.time) {
      align-items: baseline;
    }
    .fact-content {
      position: relative;
      .stat-value {
        font-size: 4rem;
        line-height: 4rem;
        font-family: Poppins-Bold;
        font-style: italic;
        background: $gradient;
        font-weight: bolder;
        letter-spacing: -0.05em;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        padding-right: 1.2rem;
        margin: 0;
      }

      .time-value {
        font-size: 1.5rem;
      }

      .stat-unit {
        position: absolute;
        font-size: 1.6rem;
        color: rgba(255, 255, 255, 0.8);
        text-align: center;
        @include card-background;
        backdrop-filter: blur(5px);
        padding: 1rem;
        border-radius: 1rem;
        bottom: -4rem;
        right: -2rem;
      }
    }

    &.time-fact {
      grid-column: 1 / -1;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: center;
      padding: 1.5rem;
    }
  }
  .time-fact {
    .fact-content {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      .time-container {
        display: flex;
        gap: 1.5rem;
        > div {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      }
    }
    .stat-value {
      font-size: 2.2rem;
      line-height: 2.6rem;
    }
    .stat-unit {
      font-size: 1.2rem;
      margin-top: 0.1rem;
    }
  }

  .fun-comparison {
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.05);
    font-style: italic;
    position: relative;
  }
}
</style>
