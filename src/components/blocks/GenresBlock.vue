<template>
  <div class="oi-genres">
    <div class="oi-genres__donut">
      <Donut
        :data="genres"
        :size="donutSize"
        :thickness="36"
        :colors="colors"
        center-label="Genres"
        :center-value="genres.length"
      />
    </div>
    <div class="oi-genres__list">
      <div v-for="(g, i) in genres" :key="g.name" class="oi-genres__row">
        <div class="oi-genres__dot" :style="{ background: colors[i % colors.length] }" />
        <span class="oi-genres__name">{{ g.name }}</span>
        <span class="oi-genres__count">{{ g.count }}</span>
        <span class="oi-genres__pct">
          {{ g.pct.toFixed(1) }}<span class="oi-genres__pct-unit">%</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useDiscogsStore } from '@/stores/store'
import Donut from '@/components/charts/Donut.vue'

const store = useDiscogsStore()
const genres = computed(() => store.topGenresForUI)

const colors = ['#ffd67e', '#c69552', '#b78445', '#8a6232', '#5a8aa8', '#7a7095', '#c5b389', '#4a5a85', '#9c8458']

const donutSize = ref(300)

function updateSize() {
  donutSize.value = window.innerWidth < 640 ? 190 : 300
}
onMounted(() => { updateSize(); window.addEventListener('resize', updateSize) })
onUnmounted(() => window.removeEventListener('resize', updateSize))
</script>

<style lang="scss" scoped>
.oi-genres {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 56px;
  align-items: center;

  @media (max-width: #{$oi-bp-mobile}) {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  &__donut {
    display: flex;
    justify-content: center;
  }

  &__list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 24px;

    @media (max-width: #{$oi-bp-mobile}) {
      grid-template-columns: 1fr;
    }
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    @include oi-divider;
  }

  &__dot {
    width: 10px;
    height: 10px;
    flex-shrink: 0;

    @media (max-width: #{$oi-bp-mobile}) {
      width: 8px; height: 8px;
    }
  }

  &__name {
    flex: 1;
    font-family: $oi-font-sans;
    font-size: 1.3rem;
    color: var(--oisogs-ink);
    min-width: 0;
    @include oi-truncate;
  }

  &__count {
    font-family: $oi-font-sans;
    font-size: 1.2rem;
    color: var(--oisogs-mute);
    @include oi-tnum;
  }

  &__pct {
    font-family: $oi-font-serif;
    font-size: 1.6rem;
    color: var(--oisogs-ink);
    @include oi-tnum;
    min-width: 50px;
    text-align: right;
  }

  &__pct-unit {
    font-size: 1rem;
    color: var(--oisogs-mute);
    margin-left: 1px;
  }
}
</style>
