<template>
  <div class="oi-hero">
    <div class="oi-hero__eyebrow">
      <span>{{ t('hero.eyebrow') }}</span>
      <span v-if="store.userProfile">{{ store.userProfile.username }} · {{ t('hero.member_since', { year: memberSince }) }}</span>
    </div>

    <!-- Desktop: big number + side stats -->
    <div class="oi-hero__body">
      <div class="oi-hero__number" :aria-label="t('hero.albums_aria')">{{ displayCount }}</div>
      <div class="oi-hero__side-stats">
        <div v-for="(s, i) in sideStats" :key="s.label" class="oi-hero__stat" :class="{ '--last': i === sideStats.length - 1 }">
          <div class="oi-hero__stat-label">{{ s.label }}</div>
          <div class="oi-hero__stat-row">
            <span class="oi-hero__stat-value">{{ s.value }}</span>
            <span class="oi-hero__stat-sub">{{ s.sub }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile: compact hero -->
    <div class="oi-hero__body-mobile">
      <div class="oi-hero__number-mobile">{{ displayCount }}</div>
      <div class="oi-hero__subtitle">
        <span class="oi-hero__albums-word">{{ t('hero.albums_word') }}</span>
        <span class="oi-hero__meta">{{ t('hero.artists_meta', { n: store.statistics?.uniqueArtists }) }}</span>
      </div>
      <div class="oi-hero__mobile-grid">
        <div v-for="(s, i) in sideStats.slice(0, 4)" :key="s.label" class="oi-hero__mobile-cell" :class="{ '--right': i % 2 === 1, '--bottom': i >= 2 }">
          <div class="oi-hero__stat-label">{{ s.label }}</div>
          <div class="oi-hero__stat-value">{{ s.value }}</div>
          <div class="oi-hero__stat-sub">{{ s.sub }}</div>
        </div>
      </div>
    </div>

    <div class="oi-hero__footer">
      <div class="oi-hero__footer-word">{{ t('hero.albums_word') }}</div>
      <div class="oi-hero__footer-desc">
        {{ t('hero.footer_spread', { n: store.statistics?.uniqueArtists }) }}
        <template v-if="funFacts">
          {{ t('hero.footer_formats', { n: funFacts.count }) }}
        </template>
      </div>
      <div v-if="funFacts?.avgPerMonth" class="oi-hero__footer-cadence">
        {{ t('hero.footer_rate') }}&nbsp;
        <span class="oi-hero__footer-rate">{{ funFacts.avgPerMonth }}</span>
        {{ t('hero.footer_per_month') }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'HeroBlock' })
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDiscogsStore } from '@/stores/store'
import { useCountUp } from '@/composables/useCountUp'

const { t } = useI18n()

const store = useDiscogsStore()

const totalAlbums = computed(() => store.statistics?.totalAlbums ?? 0)
const countUp = useCountUp(totalAlbums)
const displayCount = computed(() => countUp.value.toLocaleString('fr-FR'))

const funFacts = computed(() => store.funFactsForUI)
const topGenres = computed(() => store.topGenresForUI)
const topStyles = computed(() => store.topStylesForUI)
const decades = computed(() => store.decadesForUI)

const memberSince = computed(() => {
  if (!store.userProfile?.registered) return ''
  return new Date(store.userProfile.registered).getFullYear()
})

const dominantDecade = computed(() => {
  if (!decades.value.length) return null
  return [...decades.value].sort((a, b) => b.count - a.count)[0]
})

const sideStats = computed(() => [
  {
    label: t('hero.stat_genre'),
    value: topGenres.value[0]?.name ?? '—',
    sub: topGenres.value[0] ? `${topGenres.value[0].count} · ${topGenres.value[0].pct.toFixed(1)} %` : '',
  },
  {
    label: t('hero.stat_decade'),
    value: dominantDecade.value?.decade ?? '—',
    sub: dominantDecade.value ? `${dominantDecade.value.count} albums` : '',
  },
  {
    label: t('hero.stat_style'),
    value: topStyles.value[0]?.name ?? '—',
    sub: topStyles.value[0] ? `${topStyles.value[0].count} albums` : '',
  },
  {
    label: t('hero.stat_artists'),
    value: store.statistics?.uniqueArtists?.toLocaleString('fr-FR') ?? '—',
    sub: t('hero.stat_artists_sub'),
  },
])
</script>

<style lang="scss" scoped>
.oi-hero {
  padding: 48px 40px 56px;
  @include oi-divider;

  @media (max-width: #{$oi-bp-mobile}) {
    padding: 20px 20px 24px;
  }

  &__eyebrow {
    display: flex;
    justify-content: space-between;
    @include oi-label(1rem, 0.2em);
    margin-bottom: 24px;

    @media (max-width: #{$oi-bp-mobile}) {
      font-size: 0.9rem;
      margin-bottom: 12px;
    }
  }

  &__body {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 48px;
    align-items: stretch;

    @media (max-width: #{$oi-bp-mobile}) { display: none; }
  }

  &__number {
    font-family: $oi-font-display;
    font-weight: 900;
    font-size: clamp(160px, 22vw, 340px);
    line-height: 0.78;
    letter-spacing: -0.04em;
    color: var(--oisogs-ink);
    @include oi-tnum;
  }

  &__side-stats {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 12px 0;
  }

  &__stat {
    padding: 10px 0;
    @include oi-divider;

    &.--last { border-bottom: none; }
  }

  &__stat-label {
    @include oi-label(0.9rem, 0.15em);
    margin-bottom: 4px;
  }

  &__stat-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
  }

  &__stat-value {
    font-family: $oi-font-serif;
    color: var(--oisogs-ink);
    font-weight: 400;
    line-height: 1;
    font-size: 2.4rem;
    letter-spacing: -0.02em;
  }

  &__stat-sub {
    font-family: $oi-font-sans;
    font-size: 1rem;
    color: var(--oisogs-ink-soft);
  }

  // ── Mobile body ───────────────────────────────
  &__body-mobile {
    display: none;

    @media (max-width: #{$oi-bp-mobile}) { display: block; }
  }

  &__number-mobile {
    font-family: $oi-font-display;
    font-weight: 900;
    font-size: 38vw;
    line-height: 0.78;
    letter-spacing: -0.04em;
    color: var(--oisogs-ink);
    @include oi-tnum;
  }

  &__subtitle {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-top: 8px;
  }

  &__albums-word {
    font-family: $oi-font-serif;
    font-style: italic;
    color: var(--oisogs-accent);
    font-size: 2.2rem;
  }

  &__meta {
    font-family: $oi-font-sans;
    color: var(--oisogs-mute);
    font-size: 1.1rem;
  }

  &__mobile-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 20px;
    border-top: 1px solid var(--oisogs-rule);
  }

  &__mobile-cell {
    padding: 14px 0;
    @include oi-divider;

    &.--right {
      border-left: 1px solid var(--oisogs-rule);
      padding-left: 14px;
    }

    &.--bottom { border-bottom: none; }

    .oi-hero__stat-value { font-size: 2rem; }
  }

  // ── Footer ───────────────────────────────────
  &__footer {
    margin-top: 36px;
    padding-top: 24px;
    border-top: 1px solid var(--oisogs-rule);
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 40px;
    align-items: baseline;

    @media (max-width: #{$oi-bp-mobile}) { display: none; }
  }

  &__footer-word {
    font-family: $oi-font-serif;
    font-style: italic;
    color: var(--oisogs-accent);
    font-size: 3.4rem;
    font-weight: 400;
    line-height: 1;
  }

  &__footer-desc {
    font-family: $oi-font-sans;
    font-size: 1.4rem;
    color: var(--oisogs-ink-soft);
    line-height: 1.5;

    strong { color: var(--oisogs-ink); font-weight: 500; }
  }

  &__footer-cadence {
    font-family: $oi-font-sans;
    font-size: 1.2rem;
    color: var(--oisogs-mute);
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  &__footer-rate {
    color: var(--oisogs-accent);
    font-family: $oi-font-serif;
    font-style: italic;
    font-size: 1.6rem;
  }
}
</style>
