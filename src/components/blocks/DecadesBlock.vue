<template>
  <div class="oi-decades">
    <div class="oi-decades__bars">
      <DecadeBars :data="decades" :height="200" />
    </div>
    <div class="oi-decades__right">
      <div class="oi-decades__sparkline-label">{{ t('decades.sparkline_label') }}</div>
      <Sparkline
        v-if="additions.length"
        :data="additions"
        :w="380"
        :h="80"
        color="var(--oisogs-accent)"
        :fill="true"
        :fill-opacity="0.18"
        :stroke-width="1.5"
        class="oi-decades__sparkline"
      />
      <div class="oi-decades__sparkline-axis">
        <span>{{ additionsStart }}</span>
        <span>{{ t('decades.today') }}</span>
      </div>
      <div v-if="peakMonth" class="oi-decades__note">
        Pic d'ajouts en
        <em class="oi-decades__note-em">{{ peakMonth }}</em>,
        moyenne&nbsp;:
        <span class="oi-decades__note-rate">{{ avgPerMonth }}</span> albums/mois.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDiscogsStore } from '@/stores/store'
import DecadeBars from '@/components/charts/DecadeBars.vue'
import Sparkline from '@/components/charts/Sparkline.vue'

const { t } = useI18n()

const store = useDiscogsStore()
const decades  = computed(() => store.decadesForUI.map((d) => ({ label: d.decade.replace('s', ''), count: d.count })))
const additions = computed(() => store.additionsForUI)

const MONTHS_FR = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

const additionsStart = computed(() => {
  if (!additions.value.length) return ''
  const now = new Date()
  const d = new Date(now.getFullYear(), now.getMonth() - additions.value.length + 1)
  return `${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`
})

const peakIdx = computed(() => {
  const a = additions.value
  if (!a.length) return null
  return a.indexOf(Math.max(...a))
})

const peakMonth = computed(() => {
  if (peakIdx.value === null) return ''
  const now = new Date()
  const offset = additions.value.length - 1 - peakIdx.value
  const d = new Date(now.getFullYear(), now.getMonth() - offset)
  return MONTHS_FR[d.getMonth()]
})

const avgPerMonth = computed(() => {
  if (!additions.value.length) return ''
  const avg = additions.value.reduce((s, v) => s + v, 0) / additions.value.length
  return avg.toFixed(1)
})
</script>

<style lang="scss" scoped>
.oi-decades {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 56px;

  @media (max-width: #{$oi-bp-mobile}) {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  &__right {
    border-left: 1px solid var(--oisogs-rule);
    padding-left: 36px;

    @media (max-width: #{$oi-bp-mobile}) {
      border-left: none;
      padding-left: 0;
      border-top: 1px solid var(--oisogs-rule);
      padding-top: 20px;
    }
  }

  &__sparkline-label {
    font-family: $oi-font-sans;
    font-size: 1rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--oisogs-mute);
    margin-bottom: 12px;
  }

  &__sparkline {
    width: 100%;
    height: 80px;
    margin-bottom: 8px;
  }

  &__sparkline-axis {
    display: flex;
    justify-content: space-between;
    font-family: $oi-font-sans;
    font-size: 1rem;
    color: var(--oisogs-mute);
  }

  &__note {
    margin-top: 28px;
    padding-top: 16px;
    border-top: 1px solid var(--oisogs-rule);
    font-family: $oi-font-sans;
    font-size: 1.3rem;
    color: var(--oisogs-ink-soft);
    line-height: 1.6;
  }

  &__note-em {
    font-family: $oi-font-serif;
    font-style: italic;
    color: var(--oisogs-ink);
  }

  &__note-rate {
    font-family: $oi-font-serif;
    color: var(--oisogs-accent);
    font-size: 1.6rem;
  }
}
</style>
