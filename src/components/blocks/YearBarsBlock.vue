<template>
  <div class="oi-years">
    <div class="oi-years__peak">
      {{ t('years.peak', { year: peakYear, n: peakCount }) }}
    </div>

    <DecadeBars
      :data="barsData"
      :height="180"
      @bar-click="openYear"
    />
  </div>

  <!-- Popup albums de l'année -->
  <Popup
    :visible="!!activeYear"
    :kicker="activeYear ? t('years.popup_kicker', { year: activeYear.label, n: activeAlbums.length }) : ''"
    :title="activeYear ? String(activeYear.label) : ''"
    @close="closeYear"
  >
    <div
      v-for="album in activeAlbums"
      :key="album.id"
      class="oi-years__album"
    >
      <img :src="album.cover" :alt="album.title" class="oi-years__album-cover" />
      <div class="oi-years__album-info">
        <div class="oi-years__album-title">{{ album.title }}</div>
        <div class="oi-years__album-artist">{{ album.artist }}</div>
      </div>
      <span class="oi-years__album-date">{{ album.dateShort }}</span>
    </div>
  </Popup>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDiscogsStore } from '@/stores/store'

const { t } = useI18n()
import DecadeBars from '@/components/charts/DecadeBars.vue'
import Popup from '@/components/shared/Popup.vue'

const props = defineProps({
  data: { type: Array, required: true }, // [{ year, count }]
})

const store = useDiscogsStore()

// Mappe vers le format générique { label, count }
const barsData  = computed(() => props.data.map((d) => ({ label: d.year, count: d.count })))
const maxCount  = computed(() => Math.max(...props.data.map((d) => d.count)))
const peakYear  = computed(() => props.data.find((d) => d.count === maxCount.value)?.year ?? '—')
const peakCount = computed(() => maxCount.value)

// ─── Popup ────────────────────────────────────────────────────────────────────

const activeYear = ref(null)

const MONTHS_FR = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

const activeAlbums = computed(() => {
  if (!activeYear.value) return []
  return store.collection
    .filter((item) => new Date(item.date_added).getFullYear() === activeYear.value.label)
    .map((item) => {
      const d = new Date(item.date_added)
      return {
        id:        item.id,
        title:     item.basic_information.title,
        artist:    item.basic_information.artists?.map((a) => a.name).join(', ') ?? '—',
        cover:     item.basic_information.cover_image,
        dateShort: `${MONTHS_FR[d.getMonth()]} ${d.getDate()}`,
        dateTs:    d.getTime(),
      }
    })
    .sort((a, b) => b.dateTs - a.dateTs)
})

function openYear(d) { activeYear.value = d }
function closeYear()  { activeYear.value = null }
</script>

<style lang="scss" scoped>
.oi-years {
  &__peak {
    font-family: $oi-font-sans;
    font-size: 1.2rem;
    color: var(--oisogs-mute);
    letter-spacing: 0.04em;
    margin-bottom: 28px;

    em {
      font-family: $oi-font-serif;
      font-style: italic;
      color: var(--oisogs-ink);
      font-size: 1.5rem;
    }
  }
}

// ─── Popup albums ─────────────────────────────────────────────────────────────

.oi-years__album       { @include oi-popup-row; }
.oi-years__album-cover { @include oi-popup-cover; }
.oi-years__album-info  { min-width: 0; }

.oi-years__album-title {
  font-family: $oi-font-display;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--oisogs-ink);
  @include oi-truncate;
}

.oi-years__album-artist {
  font-family: $oi-font-sans;
  font-size: 1.2rem;
  color: var(--oisogs-ink-soft);
  @include oi-truncate;
}

.oi-years__album-date {
  font-family: $oi-font-serif;
  font-size: 1.4rem;
  color: var(--oisogs-mute);
  @include oi-tnum;
  flex-shrink: 0;
}
</style>
