<template>
  <div class="rnd">

    <!-- ─── Hero ──────────────────────────────────────────────────────────── -->
    <section class="rnd__hero">
      <div class="rnd__eyebrow">
        <span>{{ t('randomize.eyebrow') }}</span>
        <span v-if="store.collection.length">{{ t('randomize.eyebrow_count', { n: store.collection.length.toLocaleString('fr-FR') }) }}</span>
      </div>
      <h1 class="rnd__title">{{ t('randomize.title') }}</h1>
      <p class="rnd__desc">{{ t('randomize.desc') }}</p>
    </section>

    <!-- ─── Résultat ──────────────────────────────────────────────────────── -->
    <section v-if="selectedAlbum || isShuffling" class="rnd__result">
      <!-- Pochette -->
      <div class="rnd__cover-wrap">
        <div v-if="isShuffling" class="rnd__cover-shuffle">
          <img :src="shufflingCover" alt="" class="rnd__cover-img" />
          <div class="rnd__cover-shimmer" />
        </div>
        <img
          v-else-if="selectedAlbum"
          :src="selectedAlbum.cover_image"
          :alt="selectedAlbum.title"
          class="rnd__cover-img"
        />
      </div>

      <!-- Infos -->
      <div v-if="selectedAlbum && !isShuffling" class="rnd__info">
        <div class="rnd__info-kicker">{{ t('randomize.selected_kicker') }}</div>
        <div class="rnd__info-title">{{ selectedAlbum.title }}</div>
        <div class="rnd__info-artist">{{ selectedAlbum.artist }}</div>

        <div class="rnd__info-stats">
          <div class="rnd__info-stat">
            <div class="rnd__info-stat-label">{{ t('randomize.stat_year') }}</div>
            <div class="rnd__info-stat-value">{{ selectedAlbum.year || '—' }}</div>
          </div>
          <div class="rnd__info-stat">
            <div class="rnd__info-stat-label">{{ t('randomize.stat_label') }}</div>
            <div class="rnd__info-stat-value">{{ selectedAlbum.label }}</div>
          </div>
          <div class="rnd__info-stat">
            <div class="rnd__info-stat-label">{{ t('randomize.stat_format') }}</div>
            <div class="rnd__info-stat-value">{{ selectedAlbum.format }}</div>
          </div>
        </div>

        <div v-if="selectedAlbum.genres.length" class="rnd__info-tags">
          <span v-for="g in selectedAlbum.genres" :key="g" class="rnd__tag">{{ g }}</span>
          <span v-for="s in selectedAlbum.styles.slice(0, 2)" :key="s" class="rnd__tag rnd__tag--style">{{ s }}</span>
        </div>

        <div class="rnd__info-actions">
          <button class="rnd__btn rnd__btn--primary" @click="draw">
            {{ t('randomize.redraw') }}
          </button>
          <a
            v-if="selectedAlbum.discogsUrl"
            :href="selectedAlbum.discogsUrl"
            target="_blank"
            rel="noopener"
            class="rnd__btn rnd__btn--secondary"
          >
            {{ t('randomize.view_discogs') }}
          </a>
        </div>
      </div>

      <!-- Placeholder pendant le shuffle -->
      <div v-if="isShuffling" class="rnd__info rnd__info--loading">
        <div class="rnd__info-kicker">{{ t('randomize.loading_kicker') }}</div>
        <div class="rnd__info-title rnd__info-title--ghost">{{ t('randomize.loading_title') }}</div>
      </div>
    </section>

    <!-- ─── Grille des modes de tirage ───────────────────────────────────── -->
    <section class="rnd__modes">

      <!-- Tirage libre -->
      <div class="rnd__mode-cell" :class="{ '--active': activeMode === 'all' }">
        <div class="rnd__mode-kicker">{{ t('randomize.m1_kicker') }}</div>
        <div class="rnd__mode-title">{{ t('randomize.m1_title') }}</div>
        <p class="rnd__mode-desc">{{ t('randomize.m1_desc') }}</p>
        <button
          class="rnd__draw-btn"
          :disabled="isShuffling || !store.collection.length"
          @click="setModeAndDraw('all')"
        >
          {{ isShuffling && activeMode === 'all' ? t('randomize.m1_btn_loading') : t('randomize.m1_btn') }} →
        </button>
      </div>

      <!-- Par genre -->
      <div class="rnd__mode-cell" :class="{ '--active': activeMode === 'genre' }">
        <div class="rnd__mode-kicker">{{ t('randomize.m2_kicker') }}</div>
        <div class="rnd__mode-title">{{ t('randomize.m2_title') }}</div>
        <p class="rnd__mode-desc">{{ t('randomize.m2_desc') }}</p>
        <div class="rnd__filter-list">
          <button
            v-for="genre in availableGenres"
            :key="genre.name"
            class="rnd__filter-item"
            :class="{ '--selected': selectedGenre === genre.name }"
            @click="selectedGenre = genre.name"
          >
            <span class="rnd__filter-name">{{ genre.name }}</span>
            <span class="rnd__filter-count">{{ genre.count }}</span>
          </button>
        </div>
        <button
          class="rnd__draw-btn"
          :disabled="isShuffling || !selectedGenre"
          @click="setModeAndDraw('genre')"
        >
          {{ isShuffling && activeMode === 'genre' ? t('randomize.m2_btn_loading') : t('randomize.m2_btn') }} →
        </button>
      </div>

      <!-- Par style -->
      <div class="rnd__mode-cell rnd__mode-cell--last">
        <div class="rnd__mode-kicker">{{ t('randomize.m3_kicker') }}</div>
        <div class="rnd__mode-title">{{ t('randomize.m3_title') }}</div>
        <p class="rnd__mode-desc">{{ t('randomize.m3_desc') }}</p>
        <div class="rnd__filter-list">
          <button
            v-for="style in availableStyles"
            :key="style.name"
            class="rnd__filter-item"
            :class="{ '--selected': selectedStyle === style.name }"
            @click="selectedStyle = style.name"
          >
            <span class="rnd__filter-name">{{ style.name }}</span>
            <span class="rnd__filter-count">{{ style.count }}</span>
          </button>
        </div>
        <button
          class="rnd__draw-btn"
          :disabled="isShuffling || !selectedStyle"
          @click="setModeAndDraw('style')"
        >
          {{ isShuffling && activeMode === 'style' ? t('randomize.m3_btn_loading') : t('randomize.m3_btn') }} →
        </button>
      </div>

    </section>

    <!-- ─── Empty state ───────────────────────────────────────────────────── -->
    <section v-if="!store.collection.length" class="rnd__empty">
      <div class="rnd__empty-kicker">{{ t('randomize.empty_kicker') }}</div>
      <i18n-t keypath="randomize.empty_text" tag="p" class="rnd__empty-text">
        <template #link>
          <RouterLink to="/search" class="rnd__empty-link">{{ t('randomize.empty_link') }}</RouterLink>
        </template>
      </i18n-t>
    </section>

    <footer class="rnd__footer">
      <span>{{ t('randomize.footer') }}</span>
      <span v-if="selectedAlbum">{{ t('randomize.footer_last', { title: selectedAlbum.title }) }}</span>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDiscogsStore } from '@/stores/store'

const { t } = useI18n()
const store = useDiscogsStore()
const albums = computed(() => store.collection)

// ─── State ────────────────────────────────────────────────────────────────────

const selectedAlbum = ref(null)
const isShuffling = ref(false)
const shufflingCover = ref('')
const activeMode = ref('all')
const selectedGenre = ref('')
const selectedStyle = ref('')

// ─── Computed lists ───────────────────────────────────────────────────────────

const availableGenres = computed(() => {
  if (!albums.value.length) return []
  const counts = {}
  albums.value.forEach((a) => {
    ;(a.basic_information.genres || []).forEach((g) => {
      counts[g] = (counts[g] || 0) + 1
    })
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }))
})

const availableStyles = computed(() => {
  if (!albums.value.length) return []
  const counts = {}
  albums.value.forEach((a) => {
    ;(a.basic_information.styles || []).forEach((s) => {
      counts[s] = (counts[s] || 0) + 1
    })
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([name, count]) => ({ name, count }))
})

// ─── Pool helpers ─────────────────────────────────────────────────────────────

function getPool() {
  if (activeMode.value === 'genre' && selectedGenre.value) {
    return albums.value.filter((a) =>
      a.basic_information.genres?.includes(selectedGenre.value),
    )
  }
  if (activeMode.value === 'style' && selectedStyle.value) {
    return albums.value.filter((a) =>
      a.basic_information.styles?.includes(selectedStyle.value),
    )
  }
  return albums.value
}

// ─── Draw ─────────────────────────────────────────────────────────────────────

async function draw() {
  const pool = getPool()
  if (!pool.length) return

  isShuffling.value = true
  selectedAlbum.value = null

  window.scrollTo({ top: 0, behavior: 'smooth' })

  // Preload covers for animation
  const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 15)
  const preloaded = []

  await Promise.allSettled(
    shuffled.map(
      (a) =>
        new Promise((res, rej) => {
          const img = new Image()
          img.src = a.basic_information.cover_image
          img.onload = () => {
            preloaded.push(img.src)
            res()
          }
          img.onerror = rej
        }),
    ),
  )

  if (!preloaded.length) {
    finalizeSelection(pool)
    return
  }

  let idx = 0
  shufflingCover.value = preloaded[0]
  const interval = setInterval(() => {
    idx = (idx + 1) % preloaded.length
    shufflingCover.value = preloaded[idx]
  }, 110)

  setTimeout(() => {
    clearInterval(interval)
    finalizeSelection(pool)
  }, 2000)
}

function finalizeSelection(pool) {
  const raw = pool[Math.floor(Math.random() * pool.length)]
  const bi = raw.basic_information
  selectedAlbum.value = {
    title: bi.title,
    artist: bi.artists?.map((a) => a.name).join(', ') ?? '—',
    year: bi.year,
    cover_image: bi.cover_image,
    genres: bi.genres || [],
    styles: bi.styles || [],
    label: bi.labels?.[0]?.name ?? '—',
    format: bi.formats?.[0]?.name ?? '—',
    discogsUrl: raw.id ? `https://www.discogs.com/release/${raw.id}` : null,
  }
  isShuffling.value = false
}

function setModeAndDraw(mode) {
  activeMode.value = mode
  draw()
}
</script>

<style lang="scss" scoped>
.rnd {
  // ─── Hero ────────────────────────────────────────────────────────────────

  &__hero {
    padding: 48px 40px 52px;
    border-bottom: 1px solid var(--oisogs-rule);

    @media (max-width: #{$oi-bp-mobile}) {
      padding: 28px 20px 32px;
    }
  }

  &__eyebrow {
    display: flex;
    justify-content: space-between;
    font-family: $oi-font-sans;
    font-size: 1rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--oisogs-mute);
    margin-bottom: 20px;

    @media (max-width: #{$oi-bp-mobile}) {
      flex-direction: column;
      gap: 4px;
      margin-bottom: 12px;
    }
  }

  &__title {
    font-family: $oi-font-display;
    font-weight: 800;
    font-size: clamp(4rem, 8vw, 8rem);
    line-height: 0.95;
    letter-spacing: -0.03em;
    color: var(--oisogs-ink);
    margin: 0 0 20px;
  }

  &__desc {
    font-family: $oi-font-sans;
    font-size: 1.5rem;
    color: var(--oisogs-ink-soft);
    margin: 0;
    line-height: 1.55;

    @media (max-width: #{$oi-bp-mobile}) {
      font-size: 1.3rem;
    }
  }

  // ─── Résultat ─────────────────────────────────────────────────────────────

  &__result {
    padding: 48px 40px;
    border-bottom: 1px solid var(--oisogs-rule);
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 48px;
    align-items: start;

    @media (max-width: #{$oi-bp-mobile}) {
      padding: 28px 20px;
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }

  &__cover-wrap {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    background: var(--oisogs-bg-elev);
  }

  &__cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__cover-shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.04) 50%,
      transparent 100%
    );
    animation: shimmer 0.8s linear infinite;
  }

  @keyframes shimmer {
    from { transform: translateX(-100%); }
    to   { transform: translateX(100%); }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 8px;

    &--loading {
      opacity: 0.4;
    }
  }

  &__info-kicker {
    font-family: $oi-font-sans;
    font-size: 0.9rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--oisogs-accent);
  }

  &__info-title {
    font-family: $oi-font-display;
    font-weight: 800;
    font-size: clamp(2.4rem, 4vw, 4.8rem);
    line-height: 1.0;
    letter-spacing: -0.03em;
    color: var(--oisogs-ink);

    &--ghost {
      color: var(--oisogs-mute);
      font-weight: 400;
    }
  }

  &__info-artist {
    font-family: $oi-font-serif;
    font-size: 2rem;
    font-weight: 400;
    color: var(--oisogs-ink-soft);
    letter-spacing: -0.01em;
  }

  &__info-stats {
    display: flex;
    gap: 0;
    border-top: 1px solid var(--oisogs-rule);
    margin-top: 8px;
  }

  &__info-stat {
    padding: 12px 24px 12px 0;
    border-right: 1px solid var(--oisogs-rule);
    margin-right: 24px;

    &:last-child {
      border-right: none;
    }
  }

  &__info-stat-label {
    font-family: $oi-font-sans;
    font-size: 0.85rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--oisogs-mute);
    margin-bottom: 4px;
  }

  &__info-stat-value {
    font-family: $oi-font-display;
    font-weight: 700;
    font-size: 1.6rem;
    color: var(--oisogs-ink);
    letter-spacing: -0.01em;
  }

  &__info-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__tag {
    font-family: $oi-font-sans;
    font-size: 1.1rem;
    color: var(--oisogs-ink-soft);
    border: 1px solid var(--oisogs-rule);
    padding: 4px 12px;
    letter-spacing: 0.02em;

    &--style {
      color: var(--oisogs-mute);
      border-color: var(--oisogs-rule);
    }
  }

  &__info-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 8px;
  }

  &__btn {
    font-family: $oi-font-sans;
    font-size: 1.3rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    border: none;
    cursor: pointer;
    padding: 12px 24px;
    text-decoration: none;
    transition: opacity 0.15s;
    display: inline-flex;
    align-items: center;

    &--primary {
      background: var(--oisogs-accent);
      color: var(--oisogs-accent-ink);

      &:hover { opacity: 0.85; }
    }

    &--secondary {
      background: transparent;
      color: var(--oisogs-ink-soft);
      border: 1px solid var(--oisogs-rule);

      &:hover {
        border-color: var(--oisogs-rule-strong);
        color: var(--oisogs-ink);
      }
    }
  }

  // ─── Grille des modes ─────────────────────────────────────────────────────

  &__modes {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border-bottom: 1px solid var(--oisogs-rule);

    @media (max-width: #{$oi-bp-mobile}) {
      grid-template-columns: 1fr;
    }
  }

  &__mode-cell {
    padding: 40px 36px;
    border-right: 1px solid var(--oisogs-rule);
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: background 0.15s;

    &--last {
      border-right: none;
    }

    &.--active {
      background: var(--oisogs-bg-elev);
    }

    @media (max-width: #{$oi-bp-mobile}) {
      padding: 28px 20px;
      border-right: none;
      border-bottom: 1px solid var(--oisogs-rule);

      &--last {
        border-bottom: none;
      }
    }
  }

  &__mode-kicker {
    font-family: $oi-font-sans;
    font-size: 0.9rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--oisogs-mute);
  }

  &__mode-title {
    font-family: $oi-font-display;
    font-weight: 700;
    font-size: 2.4rem;
    line-height: 1;
    letter-spacing: -0.02em;
    color: var(--oisogs-ink);

    @media (max-width: #{$oi-bp-mobile}) {
      font-size: 2rem;
    }
  }

  &__mode-desc {
    font-family: $oi-font-sans;
    font-size: 1.2rem;
    line-height: 1.5;
    color: var(--oisogs-ink-soft);
    margin: 0 0 4px;
  }

  // ─── Liste de filtres ────────────────────────────────────────────────────

  &__filter-list {
    display: flex;
    flex-direction: column;
    max-height: 220px;
    overflow-y: auto;
    border-top: 1px solid var(--oisogs-rule);
    margin-bottom: 4px;

    &::-webkit-scrollbar {
      width: 3px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: var(--oisogs-rule-strong);
    }
  }

  &__filter-item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 10px 0;
    border: none;
    border-bottom: 1px solid var(--oisogs-rule);
    background: transparent;
    cursor: pointer;
    text-align: left;
    transition: color 0.1s;
    gap: 8px;

    &.--selected {
      .rnd__filter-name { color: var(--oisogs-accent); font-weight: 600; }
      .rnd__filter-count { color: var(--oisogs-accent); }
    }

    &:hover:not(.--selected) .rnd__filter-name {
      color: var(--oisogs-ink);
    }
  }

  &__filter-name {
    font-family: $oi-font-display;
    font-size: 1.4rem;
    color: var(--oisogs-ink-soft);
    line-height: 1.2;
  }

  &__filter-count {
    font-family: $oi-font-sans;
    font-size: 1rem;
    color: var(--oisogs-mute);
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
  }

  // ─── Draw button ─────────────────────────────────────────────────────────

  &__draw-btn {
    font-family: $oi-font-sans;
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    background: var(--oisogs-accent);
    color: var(--oisogs-accent-ink);
    border: none;
    cursor: pointer;
    padding: 14px 24px;
    margin-top: auto;
    transition: opacity 0.15s;
    align-self: flex-start;

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    &:not(:disabled):hover {
      opacity: 0.85;
    }
  }

  // ─── Empty state ─────────────────────────────────────────────────────────

  &__empty {
    padding: 56px 40px;
    border-bottom: 1px solid var(--oisogs-rule);

    @media (max-width: #{$oi-bp-mobile}) {
      padding: 32px 20px;
    }
  }

  &__empty-kicker {
    font-family: $oi-font-sans;
    font-size: 1rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--oisogs-accent);
    margin-bottom: 10px;
  }

  &__empty-text {
    font-family: $oi-font-sans;
    font-size: 1.4rem;
    color: var(--oisogs-ink-soft);
    line-height: 1.6;
    margin: 0;
  }

  &__empty-link {
    color: var(--oisogs-accent);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  // ─── Footer ───────────────────────────────────────────────────────────────

  &__footer {
    padding: 24px 40px;
    display: flex;
    justify-content: space-between;
    font-family: $oi-font-sans;
    font-size: 1.1rem;
    color: var(--oisogs-mute);
    letter-spacing: 0.05em;

    @media (max-width: #{$oi-bp-mobile}) {
      flex-direction: column;
      gap: 4px;
      padding: 20px;
    }
  }
}
</style>
