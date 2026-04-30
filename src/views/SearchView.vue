<template>
  <div class="search-container">
    <div class="presentation">
      <div class="presentation-kicker">{{ t('search.edition') }}</div>
      <h1 class="presentation-title">
        {{ t('search.title1') }} <br />{{ t('search.title2') }}<br /><span class="presentation-title-accent">{{ t('search.title3') }}</span>
      </h1>
      <p class="presentation-description">{{ t('search.desc') }}</p>
      <p v-if="!store.isLoading" class="input-label">{{ t('search.input_label') }}</p>
      <div v-if="!store.isLoading" class="input-wrapper">
        <form @submit.prevent="handleSearch">
          <div class="input-row">
            <span class="name-symbol">@</span>
            <input type="text" v-model="searchValue" :placeholder="t('search.input_placeholder')" :disabled="store.isLoading" />
          </div>
          <button type="submit" :disabled="store.isLoading || !isSearchValid">
            {{ t('search.cta') }}
          </button>
        </form>
        <div v-if="store.error" class="error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span class="error__message">{{ t(`errors.${store.error}`) }}</span>
        </div>
        <div v-if="recentSearches.length > 0" class="recent-searches">
          <p class="recent-searches__label">{{ t('search.recent_label') }}</p>
          <button
            v-for="(s, i) in recentSearches"
            :key="s.username"
            class="recent-searches__item"
            @click="loadRecentSearch(s.username)"
          >
            <span class="recent-searches__num">0{{ i + 1 }}</span>
            <span class="recent-searches__user">@{{ s.username }}</span>
            <span class="recent-searches__count">{{ s.count }}</span>
          </button>
        </div>
      </div>
      <div v-if="store.isLoading" class="infos-container">
        <div class="info">
          <p class="info__kicker">{{ t('search.loading_kicker') }}</p>
          <p class="info__text">{{ t('search.loading_text', { username: `@${searchValue}` }) }}</p>
        </div>
        <div class="loading-track">
          <div class="loading_bar" :style="{ width: (store.loadingProgress || 0) + '%' }"></div>
        </div>
        <div class="loading-meta">
          <span>{{ t('search.loading_meta') }}</span>
          <span>{{ t('search.loading_time') }}</span>
        </div>
      </div>
    </div>

    <div class="vinyl-panel">
      <div class="vinyl-panel__meta">
        <span>Side A</span>
        <span>33⅓ rpm</span>
        <span>{{ store.isLoading ? t('search.vinyl_playing') : t('search.vinyl_waiting') }}</span>
      </div>

      <div class="vinyl-panel__mobile-title">
        <h1 class="vinyl-panel__mobile-heading">
          {{ t('search.title1') }} <br />{{ t('search.title2') }}<br /><span>{{ t('search.title3') }}</span>
        </h1>
      </div>

      <div class="vinyl-panel__disc" :class="{ '--spinning': store.isLoading }">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="vinylBody" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stop-color="#1a1a1a" />
              <stop offset="60%" stop-color="#0d0d0d" />
              <stop offset="100%" stop-color="#000" />
            </radialGradient>
            <radialGradient id="vinylShine" cx="35%" cy="30%" r="40%">
              <stop offset="0%" stop-color="rgba(255,255,255,0.18)" />
              <stop offset="100%" stop-color="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="98" fill="url(#vinylBody)" />
          <circle v-for="gr in [92,86,80,74,68,62,56,50,44,38]" :key="gr"
            cx="100" cy="100" :r="gr"
            fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="0.4" />
          <circle cx="100" cy="100" r="32" fill="#b78445" />
          <circle cx="100" cy="100" r="32" fill="url(#vinylShine)" />
          <text x="100" y="92" text-anchor="middle" fill="#0a1337"
            font-family="'Koh Santepheap', serif" font-weight="900" font-size="9" letter-spacing="1">OISOGS</text>
          <text x="100" y="106" text-anchor="middle" fill="#0a1337"
            font-family="'Outfit', sans-serif" font-size="5" letter-spacing="0.5" opacity="0.7">side a · 33⅓ rpm</text>
          <text x="100" y="116" text-anchor="middle" fill="#0a1337"
            font-family="'Outfit', sans-serif" font-size="4" opacity="0.5">éd. 2026</text>
          <circle cx="100" cy="100" r="2" fill="#0a1337" />
          <circle cx="100" cy="100" r="98" fill="url(#vinylShine)" opacity="0.6" />
        </svg>
      </div>

      <div class="vinyl-panel__quote">
        <span>{{ t('search.vinyl_quote') }}</span>
        <span class="vinyl-panel__edition">OISOGS</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDiscogsStore } from '@/stores/store'

const { t } = useI18n()

const store = useDiscogsStore()
const router = useRouter()
const searchValue = ref('')
const lastSearchTime = ref(0)

const recentSearches = ref(JSON.parse(localStorage.getItem('oi-recent-searches') || '[]'))

function saveRecentSearch(username, count) {
  const list = recentSearches.value.filter(s => s.username !== username)
  list.unshift({ username, count, date: new Date().toLocaleDateString('fr-FR') })
  recentSearches.value = list.slice(0, 5)
  localStorage.setItem('oi-recent-searches', JSON.stringify(recentSearches.value))
}

function loadRecentSearch(username) {
  searchValue.value = username
}

const isSearchValid = computed(() => {
  const query = searchValue.value.trim()
  return query && query.length <= 50
})

const handleSearch = async () => {
  const now = Date.now()
  if (now - lastSearchTime.value < 3000) {
    store.error = 'wait'
    return
  }
  if (!isSearchValid.value) {
    store.error = 'invalid_username'
    return
  }
  lastSearchTime.value = now
  store.error = null
  window.scrollTo({ top: 0, behavior: 'instant' })
  const username = searchValue.value.trim().toLowerCase()
  await store.fetchUserProfile(username)
  await store.fetchCollection(username)
  if (!store.error && store.collection.length > 0) {
    const count = store.userProfile?.num_collection ?? store.collection.length
    saveRecentSearch(username, count)
    router.push('/')
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

// ─── Colonne gauche ──────────────────────────────────────────────────────────

.presentation {
  border-right: 1px solid var(--oisogs-rule);
  padding: 80px 40px;
  min-height: calc(100vh - 77px);
  display: flex;
  align-items: flex-start;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 28px 20px 48px;
    border-right: none;
  }

  .presentation-kicker {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: $oi-font-sans;
    font-size: 1rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--oisogs-accent);
    font-weight: 600;

    @media (max-width: 768px) { display: none; }

    &::before {
      content: '';
      display: block;
      width: 32px;
      height: 1px;
      background: currentColor;
      flex-shrink: 0;
    }
  }

  .presentation-title {
    font-family: $oi-font-display;
    font-weight: 800;
    color: var(--oisogs-ink);
    font-size: 9rem;
    margin-bottom: 1rem;
    margin-top: 2rem;
    line-height: 1;

    @media (max-width: 768px) { display: none; }

    .presentation-title-accent {
      color: var(--oisogs-accent);
      font-weight: 400;
    }
  }

  .presentation-description {
    font-family: $oi-font-display;
    line-height: 1.55;
    font-size: 2rem;
    color: var(--oisogs-muted);
    margin-bottom: 6rem;
    width: 80%;

    @media (max-width: 768px) {
      font-size: 1rem;
      width: 100%;
      margin-bottom: 3rem;
    }
  }

  .input-wrapper {
    @media (max-width: 768px) { width: 100%; }
  }

  .input-label {
    margin-bottom: 1rem;
    font-size: 1.1rem;
    color: var(--oisogs-muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .loading-label {
    margin-bottom: 1rem;
    font-size: 1.1rem;
    color: var(--oisogs-accent);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .error {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    border-left: 2px solid var(--oisogs-danger, #c0392b);
    background: var(--oisogs-bg-elev);
    margin-top: 8px;

    svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      color: var(--oisogs-danger, #c0392b);
      opacity: 0.8;
    }

    &__message {
      font-family: $oi-font-sans;
      font-size: 1.3rem;
      color: var(--oisogs-ink-soft);
      letter-spacing: 0.01em;
    }
  }

  .infos-container {
    width: 100%;
    margin-top: 1rem;

    .info {
      margin-bottom: 24px;

      &__kicker {
        font-family: $oi-font-sans;
        font-size: 1rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--oisogs-accent);
        font-weight: 600;
        margin: 0 0 12px;
      }

      &__text {
        font-family: $oi-font-display;
        font-weight: 800;
        color: var(--oisogs-ink);
        font-size: 3.2rem;
        line-height: 1.15;
        margin: 0;

        @media (max-width: 768px) {
          font-size: 2.2rem;
        }

        span {
          color: var(--oisogs-accent);
          font-weight: 400;
          font-style: italic;
        }

        em {
          color: var(--oisogs-ink-soft);
          font-weight: 400;
          font-style: italic;
        }
      }
    }

    .loading-track {
      width: 100%;
      height: 2px;
      background: var(--oisogs-rule);
      position: relative;
      overflow: hidden;
      margin-bottom: 12px;
    }

    .loading-meta {
      display: flex;
      justify-content: space-between;
      font-family: $oi-font-sans;
      font-size: 1rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-weight: 600;
      color: var(--oisogs-mute);
    }
  }

  form {
    width: 100%;
    display: flex;
    align-items: stretch;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 16px;
    }

    .input-row {
      flex: 1;
      display: flex;
      align-items: stretch;
      border-bottom: 2px solid var(--oisogs-accent);
      padding-bottom: 4px;
    }

    input {
      flex: 1;
      background: none;
      padding: 8px 12px;
      border: none;
      outline: none;
      font-size: 2.2rem;
      font-family: $oi-font-display;
      font-weight: 700;
      color: var(--oisogs-ink);

      @media (max-width: 768px) {
        font-size: 2rem;
      }

      &::placeholder {
        color: rgba(255, 255, 255, 0.25);
      }
    }

    button {
      background-color: var(--oisogs-accent);
      color: #0a1337;
      border: none;
      cursor: pointer;
      padding: 14px 24px;
      text-transform: uppercase;
      min-width: 13rem;
      font-size: 1.2rem;
      font-weight: 700;
      font-family: $oi-font-sans;
      letter-spacing: 0.08em;
      align-self: flex-end;
      line-height: 1.3;
      transition: opacity 0.15s;

      &:hover {
        opacity: 0.88;
      }

      &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      @media (max-width: 768px) {
        min-width: unset;
        width: 100%;
        align-self: auto;
        margin-top: 16px;
      }
    }

    .name-symbol {
      font-size: 3.2rem;
      font-family: $oi-font-display;
      font-weight: 700;
      color: var(--oisogs-accent);
      align-self: flex-end;
      line-height: 1.15;
      padding-bottom: 8px;

      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }
  }

  .recent-searches {
    margin-top: 40px;
    width: 100%;

    &__label {
      font-family: $oi-font-sans;
      font-size: 1rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-weight: 600;
      color: var(--oisogs-mute);
      margin: 0 0 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--oisogs-rule);
    }

    &__item {
      width: 100%;
      display: grid;
      grid-template-columns: 2.4rem 1fr auto;
      align-items: baseline;
      gap: 8px;
      padding: 14px 0;
      border: none;
      border-bottom: 1px solid var(--oisogs-rule);
      background: transparent;
      cursor: pointer;
      text-align: left;
      transition: opacity 0.15s;

      &:hover { opacity: 0.7; }
    }

    &__num {
      font-family: $oi-font-display;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--oisogs-mute);
      font-variant-numeric: tabular-nums;
    }

    &__user {
      font-family: $oi-font-display;
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--oisogs-accent);

      @media (max-width: 768px) {
        font-size: 1.5rem;
      }
    }

    &__count {
      font-family: $oi-font-sans;
      font-size: 1.2rem;
      color: var(--oisogs-ink-soft);
      font-variant-numeric: tabular-nums;
    }
  }
}

.loading_bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: var(--oisogs-accent);
  transition: width 1s ease;
  min-width: 4px;
}

// ─── Colonne droite — vinyle éditorial ──────────────────────────────────────

.vinyl-panel {
  position: sticky;
  top: 77px;
  height: calc(100vh - 77px);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--oisogs-bg) 0%, var(--oisogs-bg-panel) 100%);

  @media (max-width: 768px) {
    position: relative;
    top: 0;
    height: 240px;
    order: -1;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 0 0 28px;
  }

  &__mobile-title {
    display: none;

    @media (max-width: 768px) {
      display: block;
      position: relative;
      z-index: 2;
      padding: 0 20px;
      margin: 15px 0px;
    }
  }

  &__mobile-heading {
    font-family: $oi-font-display;
    font-weight: 800;
    color: var(--oisogs-ink);
    font-size: 3.8rem;
    line-height: 0.95;
    letter-spacing: -0.02em;
    margin: 0;

    span { color: var(--oisogs-accent); font-weight: 400; }
  }

  &__meta {
    position: absolute;
    top: 32px;
    left: 32px;
    right: 32px;
    display: flex;
    justify-content: space-between;
    font-family: $oi-font-sans;
    font-size: 0.9rem;
    color: var(--oisogs-mute);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 600;
    z-index: 2;

    @media (max-width: 768px) {
      top: 14px;
      left: 20px;
      right: 20px;
      font-size: 0.7rem;
    }
  }

  &__disc {
    position: absolute;
    width: calc(100vh - 77px);
    height: calc(100vh - 77px);
    right: -55%;
    top: 50%;
    transform: translateY(-50%);
    filter: drop-shadow(-20px 0 60px rgba(0, 0, 0, 0.6));

    svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    &.--spinning {
      animation: vinyl-spin 2.4s linear infinite;
    }

    @media (max-width: 768px) {
      right: -60px;
      top: 50%;
      transform: translateY(-50%);
      width: 260px;
      height: 260px;
      z-index: 1;

      &.--spinning {
        animation: vinyl-spin-mobile 2.4s linear infinite;
      }
    }
  }

  &__arm {
    position: absolute;
    top: 80px;
    right: 60px;
    width: 200px;
    height: 200px;
    opacity: 0.6;
    transform-origin: 100% 0%;
    transform: rotate(-28deg);
    transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms;
    z-index: 2;

    &.--playing {
      transform: rotate(-12deg);
      opacity: 1;
    }

    @media (max-width: 768px) {
      display: none;
    }
  }

  &__quote {
    position: absolute;
    bottom: 32px;
    left: 32px;
    right: 32px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-family: $oi-font-serif;
    font-style: italic;
    font-size: 1.1rem;
    color: var(--oisogs-ink-soft);
    z-index: 2;

    @media (max-width: 768px) {
      bottom: 14px;
      left: 20px;
      right: 160px;
      font-size: 0.85rem;
    }
  }

  &__edition {
    font-style: normal;
    font-family: $oi-font-sans;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--oisogs-mute);

    @media (max-width: 768px) {
      display: none;
    }
  }
}

@keyframes vinyl-spin {
  from { transform: translateY(-50%) rotate(0deg); }
  to   { transform: translateY(-50%) rotate(360deg); }
}

@keyframes vinyl-spin-mobile {
  from { transform: translateY(-50%) rotate(0deg); }
  to   { transform: translateY(-50%) rotate(360deg); }
}
</style>
