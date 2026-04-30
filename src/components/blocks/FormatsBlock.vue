<template>
  <HBarChart :items="formats" color="var(--oisogs-accent)" :height="28" />
</template>

<script setup>
import { computed } from 'vue'
import { useDiscogsStore } from '@/stores/store'
import HBarChart from '@/components/charts/HBarChart.vue'

const store = useDiscogsStore()
const formats = computed(() => store.formatsForUI)
</script>
