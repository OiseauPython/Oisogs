<template>
  <div v-if="facts" class="oi-funfacts">
    <div
      v-for="(f, i) in facts"
      :key="f.kicker"
      class="oi-funfacts__cell"
      :class="{
        '--no-right': i % 3 === 2,
        '--no-bottom': i >= 3,
        '--clickable': !!f.onClick,
      }"
      @click="f.onClick && f.onClick()"
    >
      <div class="oi-funfacts__kicker">{{ f.kicker }}</div>
      <div class="oi-funfacts__value-row">
        <span class="oi-funfacts__value">{{ f.value }}</span>
        <span v-if="f.unit" class="oi-funfacts__unit">{{ f.unit }}</span>
      </div>
      <div v-if="f.sub" class="oi-funfacts__sub">{{ f.sub }}</div>
    </div>
  </div>

  <!-- Popup oldest -->
  <Popup
    :visible="activePopup === 'oldest'"
    :kicker="oldestAlbums.length ? t('funfacts.oldest_popup_kicker', oldestAlbums.length, { named: { year: ff.oldest, n: oldestAlbums.length } }) : ''"
    :title="String(ff?.oldest ?? '—')"
    @close="activePopup = null"
  >
    <div v-for="album in oldestAlbums" :key="album.id" class="oi-funfacts__album">
      <img :src="album.cover" :alt="album.title" class="oi-funfacts__album-cover" />
      <div class="oi-funfacts__album-info">
        <div class="oi-funfacts__album-title">{{ album.title }}</div>
        <div class="oi-funfacts__album-artist">{{ album.artist }}</div>
      </div>
    </div>
  </Popup>

  <!-- Popup newest -->
  <Popup
    :visible="activePopup === 'newest'"
    :kicker="newestAlbums.length ? t('funfacts.newest_popup_kicker', newestAlbums.length, { named: { year: ff.newest, n: newestAlbums.length } }) : ''"
    :title="String(ff?.newest ?? '—')"
    @close="activePopup = null"
  >
    <div v-for="album in newestAlbums" :key="album.id" class="oi-funfacts__album">
      <img :src="album.cover" :alt="album.title" class="oi-funfacts__album-cover" />
      <div class="oi-funfacts__album-info">
        <div class="oi-funfacts__album-title">{{ album.title }}</div>
        <div class="oi-funfacts__album-artist">{{ album.artist }}</div>
      </div>
    </div>
  </Popup>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDiscogsStore } from '@/stores/store'
import Popup from '@/components/shared/Popup.vue'

const { t } = useI18n()
const store = useDiscogsStore()

const activePopup = ref(null)

const ff = computed(() => store.funFactsForUI)

const oldestAlbums = computed(() => {
  if (!ff.value?.oldest) return []
  return store.collection
    .filter((item) => item.basic_information.year === ff.value.oldest)
    .map((item) => ({
      id:     item.id,
      title:  item.basic_information.title,
      artist: item.basic_information.artists?.map((a) => a.name).join(', ') ?? '—',
      cover:  item.basic_information.cover_image,
    }))
})

const newestAlbums = computed(() => {
  if (!ff.value?.newest) return []
  return store.collection
    .filter((item) => item.basic_information.year === ff.value.newest)
    .map((item) => ({
      id:     item.id,
      title:  item.basic_information.title,
      artist: item.basic_information.artists?.map((a) => a.name).join(', ') ?? '—',
      cover:  item.basic_information.cover_image,
    }))
})

const facts = computed(() => {
  if (!ff.value) return null
  return [
    { kicker: t('funfacts.stacked'),  value: ff.value.stackM,                              unit: 'm',                    sub: t('funfacts.stacked_sub') },
    { kicker: t('funfacts.weight'),   value: ff.value.weightKg,                             unit: 'kg',                   sub: t('funfacts.weight_sub') },
    { kicker: t('funfacts.albums'),   value: ff.value.count.toLocaleString('fr-FR'),         unit: '',                     sub: t('funfacts.albums_sub') },
    { kicker: t('funfacts.oldest'),   value: ff.value.oldest ?? '—',                        unit: '',                     sub: t('funfacts.oldest_sub'), onClick: () => { activePopup.value = 'oldest' } },
    { kicker: t('funfacts.newest'),   value: ff.value.newest ?? '—',                        unit: '',                     sub: t('funfacts.newest_sub'), onClick: () => { activePopup.value = 'newest' } },
    { kicker: t('funfacts.rate'),     value: ff.value.avgPerMonth ?? '—',                   unit: t('funfacts.rate_unit'), sub: t('funfacts.rate_sub') },
  ]
})
</script>

<style lang="scss" scoped>
.oi-funfacts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid var(--oisogs-rule);
  background: var(--oisogs-bg-elev);

  @media (max-width: #{$oi-bp-mobile}) {
    grid-template-columns: repeat(3, 1fr);
  }

  &__cell {
    padding: 28px 24px;
    border-right: 1px solid var(--oisogs-rule);
    @include oi-divider;

    &.--no-right { border-right: none; }
    &.--no-bottom { border-bottom: none; }

    &.--clickable {
      cursor: pointer;
      transition: background 0.15s;

      &:hover {
        background: var(--oisogs-bg);
      }
    }

    @media (max-width: #{$oi-bp-mobile}) {
      padding: 14px 10px;
    }
  }

  &__kicker {
    @include oi-label(0.9rem, 0.15em);
    margin-bottom: 12px;

    @media (max-width: #{$oi-bp-mobile}) {
      font-size: 0.8rem;
      margin-bottom: 4px;
    }
  }

  &__value-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  &__value {
    font-family: $oi-font-display;
    font-weight: 800;
    color: var(--oisogs-ink);
    font-size: 5.6rem;
    line-height: 1;
    letter-spacing: -0.03em;
    @include oi-tnum;

    @media (max-width: #{$oi-bp-mobile}) {
      font-size: 2.4rem;
    }
  }

  &__unit {
    font-family: $oi-font-display;
    font-weight: 700;
    font-size: 2rem;
    color: var(--oisogs-accent);

    @media (max-width: #{$oi-bp-mobile}) {
      font-size: 1.2rem;
    }
  }

  &__sub {
    font-family: $oi-font-serif;
    font-size: 1.2rem;
    color: var(--oisogs-ink-soft);
    margin-top: 10px;
    font-style: italic;

    @media (max-width: #{$oi-bp-mobile}) {
      display: none;
    }
  }
}

// ─── Popup albums ──────────────────────────────────────────────────────────────

.oi-funfacts__album       { @include oi-popup-row; }
.oi-funfacts__album-cover { @include oi-popup-cover; }
.oi-funfacts__album-info  { min-width: 0; }

.oi-funfacts__album-title {
  font-family: $oi-font-display;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--oisogs-ink);
  @include oi-truncate;
}

.oi-funfacts__album-artist {
  font-family: $oi-font-sans;
  font-size: 1.2rem;
  color: var(--oisogs-ink-soft);
  @include oi-truncate;
}
</style>
