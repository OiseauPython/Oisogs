<template>
  <div class="oi-styles">

    <!-- ─── Nuage typographique ───────────────────────────────────────────── -->
    <div class="oi-styles__cloud">
      <div class="oi-styles__tier oi-styles__tier--primary">
        <template v-for="(s, i) in tierPrimary" :key="s.name">
          <span
            class="oi-styles__word"
            :style="{
              fontSize: (56 + s.weight * 24) + 'px',
              fontStyle: i % 2 === 0 ? 'italic' : 'normal',
              color: i === 0 ? 'var(--oisogs-accent)' : 'var(--oisogs-ink)',
            }"
            @click="openStyle(s)"
          >{{ s.name }}</span>
          <span v-if="i < tierPrimary.length - 1" class="oi-styles__sep oi-styles__sep--primary">·</span>
        </template>
      </div>

      <div class="oi-styles__tier oi-styles__tier--secondary">
        <template v-for="(s, i) in tierSecondary" :key="s.name">
          <span
            class="oi-styles__word"
            :style="{
              fontSize: (24 + s.weight * 16) + 'px',
              fontStyle: i % 3 === 1 ? 'italic' : 'normal',
              opacity: 0.85,
            }"
            @click="openStyle(s)"
          >{{ s.name }}</span>
          <span v-if="i < tierSecondary.length - 1" class="oi-styles__sep oi-styles__sep--secondary">—</span>
        </template>
      </div>

      <div class="oi-styles__tier oi-styles__tier--tertiary">
        <template v-for="(s, i) in tierTertiary" :key="s.name">
          <span
            class="oi-styles__word oi-styles__word--small"
            @click="openStyle(s)"
          >{{ s.name }}</span>
          <span v-if="i < tierTertiary.length - 1" class="oi-styles__sep oi-styles__sep--tertiary">·</span>
        </template>
      </div>

      <div class="oi-styles__cloud-note">
        {{ t('styles.cloud_note', { n: styles.length }) }}
      </div>
    </div>

    <!-- ─── Top 10 ranking ────────────────────────────────────────────────── -->
    <div class="oi-styles__ranking">
      <div class="oi-styles__ranking-title">{{ t('styles.top10_title') }}</div>
      <ol class="oi-styles__list">
        <li
          v-for="(s, i) in styles.slice(0, 10)"
          :key="s.name"
          class="oi-styles__item"
          @click="openStyle(s)"
        >
          <span class="oi-styles__rank">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="oi-styles__item-body">
            <div class="oi-styles__item-name" :class="{ '--first': i === 0 }">{{ s.name }}</div>
            <div class="oi-styles__bar-track">
              <div class="oi-styles__bar-fill" :style="{ width: barPct(s) + '%', transitionDelay: i * 60 + 'ms' }" />
            </div>
          </div>
          <span class="oi-styles__item-count">{{ s.count }}</span>
        </li>
      </ol>
    </div>

  </div>

  <!-- ─── Popup albums ──────────────────────────────────────────────────── -->
  <Popup
    :visible="!!activeStyle"
    :kicker="activeStyle ? t('styles.popup_kicker', { n: activeStyle.count }) : ''"
    :title="activeStyle?.name ?? ''"
    @close="closeStyle"
  >
    <div
      v-for="album in activeAlbums"
      :key="album.title + album.artist"
      class="oi-styles__album"
    >
      <img :src="album.cover" :alt="album.title" class="oi-styles__album-cover" />
      <div class="oi-styles__album-info">
        <div class="oi-styles__album-title">{{ album.title }}</div>
        <div class="oi-styles__album-artist">{{ album.artist }}</div>
      </div>
      <span class="oi-styles__album-year">{{ album.year }}</span>
    </div>
  </Popup>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDiscogsStore } from '@/stores/store'
import Popup from '@/components/shared/Popup.vue'

const { t } = useI18n()

const store = useDiscogsStore()

// ─── Données ──────────────────────────────────────────────────────────────────

const styles = computed(() => store.allStylesForUI)

const tierPrimary   = computed(() => styles.value.filter((s) => s.weight >= 0.7))
const tierSecondary = computed(() => styles.value.filter((s) => s.weight >= 0.3 && s.weight < 0.7))
const tierTertiary  = computed(() => styles.value.filter((s) => s.weight < 0.3))

const barPct = (s) => styles.value.length ? (s.count / styles.value[0].count) * 100 : 0

// ─── Popup ────────────────────────────────────────────────────────────────────

const activeStyle = ref(null)

const activeAlbums = computed(() => {
  if (!activeStyle.value) return []
  return store.collection
    .filter((item) => item.basic_information.styles?.includes(activeStyle.value.name))
    .map((item) => ({
      title:  item.basic_information.title,
      artist: item.basic_information.artists?.map((a) => a.name).join(', ') ?? '—',
      year:   item.basic_information.year,
      cover:  item.basic_information.cover_image,
    }))
    .sort((a, b) => (b.year || 0) - (a.year || 0))
})

function openStyle(s) { activeStyle.value = s }
function closeStyle()  { activeStyle.value = null }

onUnmounted(() => { activeStyle.value = null })
</script>

<style lang="scss" scoped>
// ─── Layout ───────────────────────────────────────────────────────────────────

.oi-styles {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 56px;

  @media (max-width: #{$oi-bp-mobile}) {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  // ── Cloud ────────────────────────────────────────────────────────────────

  &__cloud {
    font-family: $oi-font-serif;
    color: var(--oisogs-ink);
    font-weight: 400;
    line-height: 1.05;
  }

  &__tier {
    margin-bottom: 18px;
    &--secondary { line-height: 1.15; margin-bottom: 16px; }
    &--tertiary {
      font-family: $oi-font-sans;
      line-height: 1.6;
    }
  }

  &__word {
    display: inline-block;
    margin-right: 8px;
    color: var(--oisogs-ink);
    letter-spacing: -0.02em;
    cursor: pointer;
    transition: color 0.12s, opacity 0.12s;

    &:hover { color: var(--oisogs-accent); }

    &--small {
      font-size: 1.3rem !important;
      color: var(--oisogs-ink-soft);
      letter-spacing: 0.02em;
      font-family: $oi-font-sans;

      &:hover { color: var(--oisogs-accent); opacity: 1; }
    }
  }

  &__sep {
    display: inline-block;
    margin-right: 4px;
    color: var(--oisogs-rule-strong);
    pointer-events: none;

    &--primary   { font-size: 3.6rem; margin-right: 8px; }
    &--secondary { font-size: 1.8rem; margin-right: 8px; }
    &--tertiary  { font-size: 1.2rem; }
  }

  &__cloud-note {
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px solid var(--oisogs-rule);
    font-family: $oi-font-sans;
    font-size: 1.2rem;
    color: var(--oisogs-mute);
    letter-spacing: 0.03em;
  }

  // ── Ranking ──────────────────────────────────────────────────────────────

  &__ranking {
    @media (max-width: #{$oi-bp-mobile}) { display: none; }
  }

  &__ranking-title {
    @include oi-label(1rem, 0.15em);
    margin-bottom: 16px;
  }

  &__list { list-style: none; margin: 0; padding: 0; }

  &__item {
    display: grid;
    grid-template-columns: 24px 1fr auto;
    gap: 12px;
    align-items: center;
    padding: 12px 0;
    @include oi-divider;
    cursor: pointer;
    transition: opacity 0.12s;

    &:hover { opacity: 0.65; }
  }

  &__rank { @include oi-rank; }

  &__item-body { min-width: 0; }

  &__item-name {
    font-family: $oi-font-serif;
    font-size: 1.5rem;
    color: var(--oisogs-ink);
    letter-spacing: -0.01em;
    margin-bottom: 6px;

    &.--first { font-style: italic; color: var(--oisogs-accent); }
  }

  &__bar-track {
    position: relative;
    height: 3px;
    background: var(--oisogs-rule);
  }

  &__bar-fill {
    position: absolute;
    inset: 0;
    background: var(--oisogs-accent);
    transition: width 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  &__item-count {
    font-family: $oi-font-serif;
    color: var(--oisogs-ink);
    font-size: 1.6rem;
    @include oi-tnum;
  }
}

// ─── Contenu slot popup (albums) ─────────────────────────────────────────────

.oi-styles__album       { @include oi-popup-row; }
.oi-styles__album-cover { @include oi-popup-cover; }
.oi-styles__album-info  { min-width: 0; }

.oi-styles__album-title {
  font-family: $oi-font-display;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--oisogs-ink);
  @include oi-truncate;
}

.oi-styles__album-artist {
  font-family: $oi-font-sans;
  font-size: 1.2rem;
  color: var(--oisogs-ink-soft);
  @include oi-truncate;
}

.oi-styles__album-year {
  font-family: $oi-font-serif;
  font-size: 1.4rem;
  color: var(--oisogs-mute);
  @include oi-tnum;
  flex-shrink: 0;
}
</style>
