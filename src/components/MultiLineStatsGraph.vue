<template>
  <div class="chart-wrapper">
    <h2 class="card-title">
      {{ title }}<InfoIcon v-if="isToolTip" :tooltipData="helpToolTips.yearGraph" />
    </h2>
    <InfoIcon v-if="isToolTip" :tooltipData="helpToolTips.yearGraph" />
    <div class="chart-container" :style="{ minWidth: `${minWidth}px` }">
      <Line :data="chartData" :options="chartOptions" />
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
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Line } from 'vue-chartjs'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    default: 'Additions par année et format',
  },
  isToolTip: {
    type: Boolean,
    default: false,
  },
})

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const minWidth = computed(() => {
  const minWidthValue = 40
  const totalPoints = props.data.labels.length
  const padding = 100
  return Math.max(totalPoints * minWidthValue + padding)
})

const chartData = computed(() => ({
  labels: props.data.labels,
  datasets: props.data.datasets,
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: 'rgba(255, 255, 255, 0.8)',
      },
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
  padding-right: 0;
}

.chart-container {
  height: 40rem;
  padding: 1rem;
  padding-left: 0;
}
</style>
