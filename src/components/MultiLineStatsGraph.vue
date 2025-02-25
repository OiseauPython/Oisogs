<template>
  <div class="chart-wrapper">
    <InfoIcon v-if="isToolTip" :helpTooltipData="helpToolTips.yearGraph" />
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
    // Format attendu: { labels: [], datasets: [{ label, data, borderColor, backgroundColor }] }
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
    title: {
      display: true,
      text: props.title,
      color: 'rgba(255, 255, 255, 0.8)',
      font: {
        size: 16,
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

.chart-wrapper {
  overflow: auto;
  background: rgba(255, 255, 255, 0.16);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5.1px);
  -webkit-backdrop-filter: blur(5.1px);
  border-radius: $card-radius;
}

.chart-container {
  height: 40rem;
  padding: 1rem;
}
</style>
