<template>
  <div class="chart-wrapper">
    <h2 class="card-title">
      {{ title }}<InfoIcon v-if="isToolTip" :tooltipData="helpToolTips.yearGraph" />
    </h2>
    <div class="chart-container" :style="{ minWidth: `${minWidth}px` }">
      <Bar :data="chartData" :options="chartOptions" />
      <!-- Changé Line en Bar -->
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { helpToolTips } from '@/data/helpToolTips'
import InfoIcon from '@/components/InfoIcon.vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement, // Changé LineElement en BarElement
  CategoryScale,
  LinearScale,
  BarController, // Changé LineController en BarController
} from 'chart.js'
import { Bar } from 'vue-chartjs' // Changé Line en Bar

const props = defineProps({
  labels: {
    type: Array,
    required: true,
  },
  values: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: 'Statistics',
  },
  isToolTip: {
    type: Boolean,
    default: false,
  },
})

// Enregistrement des composants nécessaires pour le bar chart
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, BarController)

// Supprimé ShadowLineController car spécifique aux lignes

const minWidth = computed(() => {
  const minWidthValue = 40
  const totalPoints = props.values.length
  const padding = 100
  return Math.max(totalPoints * minWidthValue + padding)
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.title,
      data: props.values,
      backgroundColor: (context) => {
        const chart = context.chart
        const { ctx, chartArea } = chart

        if (!chartArea) return null

        // Création du gradient vertical pour les barres
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
        gradient.addColorStop(0, 'rgba(71, 34, 96, .7)')
        gradient.addColorStop(1, 'rgba(44, 51, 233, .7)')

        return gradient
      },
      borderColor: 'rgb(193, 130, 255)',
      borderWidth: 1,
      borderRadius: 5, // Ajout d'un border radius pour les barres
      // Supprimé les propriétés spécifiques aux lignes (tension, pointRadius, etc.)
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(64, 71, 91, 1)',
        borderDash: [5, 2],
      },
      ticks: {
        padding: 16,
        color: 'rgba(255, 255, 255, 0.8)',
      },
    },
    y: {
      grid: {
        color: 'rgba(64, 71, 91, 1)',
        borderDash: [5, 2],
      },
      beginAtZero: true,
      ticks: {
        padding: 10,
        color: 'rgba(255, 255, 255, 0.8)',
        callback: function (value) {
          return value
        },
      },
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  animation: {
    duration: 1000,
  },
}))
</script>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;
@use '@/assets/mixin.scss' as *;

.chart-wrapper {
  overflow: auto;
  @include card-background;
  padding-right: 2rem;
  padding-bottom: 0;
}

.chart-container {
  height: 30rem;
  padding: 1rem;
  padding-left: 0;
}
</style>
