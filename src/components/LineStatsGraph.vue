<template>
  <div class="chart-wrapper">
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
  LineController,
  Filler,
} from 'chart.js'
import { Line } from 'vue-chartjs'

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
    required: true,
  },
  isToolTip: {
    type: Boolean,
    default: false,
    required: false,
  },
})

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  LineController,
  Filler,
)

class ShadowLineController extends LineController {
  draw() {
    const ctx = this.chart.ctx
    ctx.save()
    ctx.shadowColor = '#1a1426'
    ctx.shadowBlur = 15
    ctx.shadowOffsetY = 5
    super.draw()
    ctx.restore()
  }
}

ChartJS.register({
  id: 'shadowLine',
  controller: ShadowLineController,
})

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

        // Création du gradient
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
        gradient.addColorStop(0, 'rgba(71, 34, 96, .7)')
        gradient.addColorStop(0.9, 'rgba(44, 51, 233, .7)')
        gradient.addColorStop(1, 'rgba(44, 51, 233, .7)')

        return gradient
      },
      borderColor: 'rgb(193, 130, 255)',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: 'rgba(255, 255, 255, 1)',
      pointBorderColor: 'rgba(255, 255, 255, 1)',
      pointRadius: 4,
      pointHoverRadius: 7,
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
    title: {
      display: true,
      text: props.title,
      color: 'rgba(255, 255, 255, 0.8)',
      font: {
        size: 16,
      },
    },
    filler: {
      propagate: true,
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
