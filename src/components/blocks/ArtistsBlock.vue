<template>
  <div class="oi-artists">
    <div class="oi-artists__controls">
      <input
        v-model="query"
        class="oi-artists__search"
        :placeholder="t('artists.filter_placeholder')"
        type="search"
      />
      <span v-if="query" class="oi-artists__count">
        {{ filtered.length }} résultat{{ filtered.length > 1 ? 's' : '' }}
      </span>
    </div>

    <ol class="oi-artists__list">
      <li v-for="(a, i) in filtered" :key="a.name" class="oi-artists__item">
        <span class="oi-artists__rank">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="oi-artists__name">{{ a.name }}</span>
        <span class="oi-artists__genre">{{ a.genre }}</span>
        <span class="oi-artists__count-val">{{ a.count }}</span>
      </li>
    </ol>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDiscogsStore } from '@/stores/store'

const { t } = useI18n()

const store = useDiscogsStore()
const query = ref('')

// Tous les artistes calculés directement depuis la collection
const allArtists = computed(() => {
  if (!store.collection.length) return []
  const counts = new Map()
  const artistGenre = {}
  store.collection.forEach((item) => {
    const bi = item.basic_information
    ;(bi.artists || []).forEach((a) => counts.set(a.name, (counts.get(a.name) || 0) + 1))
    const first = bi.artists?.[0]?.name
    if (first && !artistGenre[first] && bi.genres?.length) {
      artistGenre[first] = bi.genres[0]
    }
  })
  return [...counts.entries()]
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count, genre: artistGenre[name] || '' }))
})

// Sans query : top 30. Avec query : recherche sur toute la collection.
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return allArtists.value.slice(0, 30)
  return allArtists.value.filter((a) => a.name.toLowerCase().includes(q))
})
</script>

<style lang="scss" scoped>
.oi-artists {
  &__controls {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }

  &__search {
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--oisogs-rule);
    color: var(--oisogs-ink);
    padding: 6px 0;
    font-size: 1.3rem;
    outline: none;
    width: 240px;
    font-family: $oi-font-sans;
    transition: border-color 0.15s;

    &::placeholder { color: var(--oisogs-mute); }
    &:focus { border-bottom-color: var(--oisogs-accent); }

    @media (max-width: #{$oi-bp-mobile}) { width: 100%; }
  }

  &__count {
    font-family: $oi-font-sans;
    font-size: 1.1rem;
    color: var(--oisogs-mute);
    letter-spacing: 0.05em;
  }

  &__list {
    list-style: none;
    margin: 0; padding: 0;
    columns: 2;
    column-gap: 36px;

    @media (max-width: #{$oi-bp-mobile}) { columns: 1; }
  }

  &__item {
    display: grid;
    grid-template-columns: 28px 1fr auto auto;
    align-items: baseline;
    gap: 12px;
    padding: 10px 0;
    @include oi-divider;
    break-inside: avoid;
  }

  &__rank { @include oi-rank; }

  &__name {
    font-family: $oi-font-serif;
    font-style: italic;
    color: var(--oisogs-ink);
    font-size: 1.6rem;
    min-width: 0;
    @include oi-truncate;
  }

  &__genre {
    @include oi-label(1rem, 0.1em);
    white-space: nowrap;
  }

  &__count-val { @include oi-count; }
}
</style>
