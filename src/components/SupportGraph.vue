<template>
  <div class="chart-wrapper graph-genre">
    <h2 class="card-title">
      {{ title }}<InfoIcon v-if="isToolTip" :tooltipData="helpToolTips.yearGraph" />
    </h2>
    <div class="chart-container">
      <div class="pie-container">
        <Pie :data="chartData" :options="chartOptions" />
      </div>
      <div class="legend-container">
        <div v-for="(value, label, index) in formatData" :key="label" class="legend-item">
          <div
            class="color-indicator"
            :style="{ backgroundColor: chartColors[index % chartColors.length] }"
          ></div>
          <div class="label-info">
            <span class="label-name">{{ formatLabel(label) }}</span>
            <span class="label-count">{{ value }} albums</span>
          </div>
          <div class="label-percentage">{{ calculatePercentage(value) }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { helpToolTips } from '@/data/helpToolTips'
import InfoIcon from '@/components/InfoIcon.vue'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js'
import { Pie } from 'vue-chartjs'

const props = defineProps({
  labels: {
    type: Object,
    required: true,
  },
  values: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    default: 'Répartition des supports',
    required: true,
  },
  isToolTip: {
    type: Boolean,
    default: false,
    required: false,
  },
})

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

const chartColors = [
  '#FF6384',
  '#36A2EB',
  '#FFCD56',
  '#4BC0C0',
  '#ffbd69',
  '#6a65d8',
  '#ff79c6',
  '#50fa7b',
  '#8be9fd',
  '#ff5555',
  '#4c566a',
]

const formatData = computed(() => {
  const filteredData = {}
  let totalItems = 0

  for (const [key, value] of Object.entries(props.values)) {
    if (value && value > 0) {
      filteredData[key] = value
      totalItems += value
    }
  }

  // Trier par valeur décroissante
  const sortedEntries = Object.entries(filteredData).sort((a, b) => b[1] - a[1])
  const sortedData = {}

  sortedEntries.forEach(([key, value]) => {
    sortedData[key] = value
  })

  return sortedData
})

const calculatePercentage = (value) => {
  const total = Object.values(formatData.value).reduce((sum, val) => sum + val, 0)
  return ((value / total) * 100).toFixed(1)
}

const formatLabel = (label) => {
  // Mettre en majuscule la première lettre et formater le texte
  return label.charAt(0).toUpperCase() + label.slice(1)
}

const chartData = computed(() => {
  const labels = Object.keys(formatData.value).map(formatLabel)
  const data = Object.values(formatData.value)

  return {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: chartColors.slice(0, labels.length),
        borderColor: 'rgba(14, 14, 22, 0.5)',
        borderWidth: 2,
        hoverOffset: 15,
        hoverBorderWidth: 0,
      },
    ],
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '30%', // Ajustez pour un donut ou un pie plein
  plugins: {
    legend: {
      display: false, // Nous utilisons notre propre légende
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.label || ''
          const value = context.raw || 0
          const percentage = (
            (value / Object.values(formatData.value).reduce((a, b) => a + b, 0)) *
            100
          ).toFixed(1)
          return `${label}: ${value} albums (${percentage}%)`
        },
      },
      backgroundColor: 'rgba(14, 14, 22, 0.85)',
      titleFont: {
        size: 14,
        family: 'Poppins',
      },
      bodyFont: {
        size: 13,
        family: 'Poppins',
      },
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      boxWidth: 12,
      boxHeight: 12,
      boxPadding: 3,
    },
  },
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 800,
    easing: 'easeOutQuart',
  },
}))
</script>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;
@use '@/assets/mixin.scss' as *;

.chart-wrapper {
  @include card-background;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 1.5rem;
  }
}

.pie-container {
  flex: 1 1 50%;
  min-width: 0;
  max-width: 100%;
  margin: 0 auto;
  position: relative;
  height: auto;
  width: 100%;

  @media (min-width: 768px) {
    max-width: 50%;
    height: 100%;
  }
}

.legend-container {
  flex: 1 1 50%;
  padding: 1rem;
  padding-right: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  max-height: 30rem;
  min-width: 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;

  @media (min-width: 768px) {
    flex: 0 0 50%;
    max-height: 100%;
    padding-left: 1.5rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    padding: 0.6rem;
    border-radius: 8px;
    transition: background-color 0.2s;
    position: relative;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .color-indicator {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      margin-right: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .label-info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .label-name {
        font-weight: 600;
        font-size: clamp(1.2rem, 2vw, 1.6rem);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .label-count {
        font-size: 1.1rem;
        opacity: 0.8;
      }
    }

    .label-percentage {
      font-size: clamp(1.6rem, 3vw, 2.2rem);
      font-weight: 700;
      font-family: 'Poppins-Bold';
      background: $gradient;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      flex-shrink: 0;
      margin-left: 0.5rem;
    }
  }
}
</style>
