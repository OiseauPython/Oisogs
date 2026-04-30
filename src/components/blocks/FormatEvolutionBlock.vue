<template>
  <div class="oi-fmt-evo">
    <div
      v-for="ds in nonEmptyDatasets"
      :key="ds.label"
      class="oi-fmt-evo__row"
    >
      <div class="oi-fmt-evo__name">{{ ds.label }}</div>
      <Sparkline
        class="oi-fmt-evo__spark"
        :data="ds.data"
        :w="300"
        :h="36"
        color="var(--oisogs-accent)"
        :fill="true"
        :fill-opacity="0.15"
        :stroke-width="1.5"
      />
      <div class="oi-fmt-evo__total">{{ ds.total }}</div>
    </div>
    <div class="oi-fmt-evo__axis">
      <span>{{ firstYear }}</span>
      <span>{{ lastYear }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Sparkline from '@/components/charts/Sparkline.vue'

const props = defineProps({
  data: { type: Object, required: true }, // { labels: [years], datasets: [{ label, data }] }
})

const nonEmptyDatasets = computed(() =>
  props.data.datasets
    .map((ds) => ({ ...ds, total: ds.data.reduce((s, v) => s + v, 0) }))
    .filter((ds) => ds.total > 0)
    .sort((a, b) => b.total - a.total),
)

const firstYear = computed(() => props.data.labels?.[0] ?? '')
const lastYear  = computed(() => props.data.labels?.[props.data.labels.length - 1] ?? '')
</script>

<style lang="scss" scoped>
.oi-fmt-evo {
  &__row {
    display: grid;
    grid-template-columns: 72px 1fr 40px;
    gap: 16px;
    align-items: center;
    padding: 10px 0;
    @include oi-divider;
  }

  &__name { @include oi-label(1rem, 0.12em); }

  &__spark {
    width: 100%;
    height: 36px;
    display: block;
  }

  &__total {
    @include oi-count;
    text-align: right;
  }

  &__axis {
    display: flex;
    justify-content: space-between;
    padding-left: calc(72px + 16px);
    margin-top: 6px;
    font-family: $oi-font-sans;
    font-size: 1rem;
    color: var(--oisogs-mute);
    @include oi-tnum;
  }
}
</style>
