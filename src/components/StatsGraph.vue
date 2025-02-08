<template>
  <div class="chart-wrapper">
    <div class="chart-container" :style="{ width: `${minWidth}px` }">
      <component :is="chartComponent" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Bar, Line, Pie, Doughnut } from 'vue-chartjs'

// Enregistrement de tous les éléments nécessaires
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
)

export default {
  name: 'Graph',
  props: {
    // Type de graphique
    type: {
      type: String,
      default: 'bar',
      validator: (value) => ['bar', 'line', 'pie', 'doughnut'].includes(value),
    },
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
  },
  computed: {
    minWidth() {
      const minBarWidth = 40
      const totalBars = this.values.length
      const padding = 100
      return Math.max(800, totalBars * minBarWidth + padding)
    },
    // Sélection dynamique du composant en fonction du type
    chartComponent() {
      const components = {
        bar: Bar,
        line: Line,
        pie: Pie,
        doughnut: Doughnut,
      }
      return components[this.type]
    },

    // Configuration des données selon le type de graphique
    chartData() {
      const colors = [
        '#2196F3',
        '#4CAF50',
        '#FFC107',
        '#F44336',
        '#9C27B0',
        '#795548',
        '#FF9800',
        '#607D8B',
      ]

      // Configuration différente pour les graphiques circulaires
      if (['pie', 'doughnut'].includes(this.type)) {
        return {
          labels: this.labels,
          datasets: [
            {
              data: this.values,
              backgroundColor: colors.slice(0, this.values.length),
              borderWidth: 1,
            },
          ],
        }
      }

      // Configuration pour les graphiques en bâtons et lignes
      return {
        labels: this.labels,
        datasets: [
          {
            label: this.title,
            data: this.values,
            backgroundColor: this.type === 'line' ? colors[0] : colors,
            borderColor: this.type === 'line' ? colors[0] : undefined,
            borderWidth: 1,
            tension: this.type === 'line' ? 0.4 : undefined,
          },
        ],
      }
    },

    // Options selon le type de graphique
    chartOptions() {
      const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: ['pie', 'doughnut'].includes(this.type),
          },
          title: {
            display: true,
            text: this.title,
          },
        },
      }

      // Ajoute des échelles pour les graphiques bar et line
      if (['bar', 'line'].includes(this.type)) {
        return {
          ...baseOptions,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }
      }

      return baseOptions
    },
  },
}
</script>

<style scoped>
.chart-wrapper {
  max-width: 50rem;
  overflow: scroll;
  .chart-container {
    height: 40rem;
    width: 100%;
  }
}
</style>
