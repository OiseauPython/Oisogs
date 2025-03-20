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
        <p class="fact-description">{{ getDescriptionForFact(fact.id) }}</p>
      </div>

      <div class="fact-item time-fact">
        <div class="fact-content time">
          <p class="stat-value time-value">{{ collectionTime.formatted }}</p>
          <p class="fact-description">pour écouter toute votre collection</p>
        </div>
      </div>
    </div>

    <div class="fun-comparison" v-if="showComparison">
      <p>{{ randomComparison }}</p>
    </div>
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
    formatted: formatExtendedTime(days, hours, minutes),
    raw: { days, hours, minutes },
  }
})

const formatExtendedTime = (days, hours, minutes) => {
  const parts = []

  if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'jour' : 'jours'}`)
  }
  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'heure' : 'heures'}`)
  }
  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`)
  }

  if (parts.length > 2) {
    return parts.slice(0, -1).join(', ') + ' et ' + parts.slice(-1)
  } else if (parts.length === 2) {
    return parts.join(' et ')
  }
  return parts[0] || '0 minute'
}

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
  decimals: 2,
}))

const collectionWeight = computed(() => ({
  id: 'weight',
  value: calculateValue('weight'),
  unit: 'kg',
  decimals: 1,
}))

const facts = computed(() => [
  collectionHeight.value,
  collectionLength.value,
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
  `Empilés, vos disques atteindraient ${(collectionHeight.value.value / 1.8).toFixed(1)}% de la hauteur d'un humain moyen.`,
  `Alignés, vos supports occuperaient ${(collectionLength.value.value / 100).toFixed(1)}% d'un terrain de football.`,
  `Le temps d'écoute de votre collection équivaut à ${(collectionTime.value.raw.days / 7).toFixed(1)} semaines non-stop!`,
])

const randomComparison = computed(() => {
  const randomIndex = Math.floor(Math.random() * comparisons.value.length)
  return comparisons.value[randomIndex]
})
</script>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;
@use '@/assets/mixin.scss' as *;

.fun-fact-wrapper {
  @include card-background;

  .facts-grid {
    display: flex;
    gap: 1.25rem;

    .fact-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 1.25rem 1rem;
      border-radius: 12px;
      background-color: rgba(255, 255, 255, 0.05);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      .fact-content:not(.time) {
        display: flex;
        align-items: baseline;
      }
      .fact-content {
        .stat-value {
          font-family: 'Poppins-Bold', sans-serif;
          font-size: 3.1rem;
          margin: 0;
          background: $gradient;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .time-value {
          font-size: 1.5rem;
        }

        .stat-unit {
          margin: 0.25rem 0 0.75rem;
        }
      }

      &.time-fact {
        grid-column: 1 / -1;
        display: flex;
        flex-direction: row;
        justify-content: center;
        padding: 1.5rem;
      }
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
