<template>
  <div class="oi-last-added">
    <div v-for="album in limitedLastAddedAlbums" :key="album.title" class="oi-last-added__row">
      <img class="oi-last-added__cover" :src="album.cover" alt="" />
      <div class="oi-last-added__info">
        <div class="oi-last-added__title">{{ album.title }}</div>
        <div class="oi-last-added__artist">{{ album.artist }}</div>
        <div class="oi-last-added__date">{{ album.dateAdded }}</div>
      </div>
    </div>
    <button class="oi-last-added__more" @click="isPopupVisible = true">{{ t('lastadded.see_more') }}</button>
  </div>

  <Popup
    :visible="isPopupVisible"
    :kicker="t('lastadded.popup_kicker')"
    :title="t('lastadded.popup_title')"
    @close="isPopupVisible = false"
  >
    <div v-for="album in lastAddedAlbums" :key="album.title" class="oi-last-added__row oi-last-added__row--popup">
      <img class="oi-last-added__cover oi-last-added__cover--lg" :src="album.cover" alt="" />
      <div class="oi-last-added__info">
        <div class="oi-last-added__title">{{ album.title }}</div>
        <div class="oi-last-added__artist">{{ album.artist }}</div>
        <div class="oi-last-added__date">{{ album.dateAdded }}</div>
      </div>
    </div>
  </Popup>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Popup from './shared/Popup.vue'

const { t } = useI18n()

const props = defineProps({
  lastAddedAlbums: { type: Array, required: true },
})

const isPopupVisible = ref(false)
const limitedLastAddedAlbums = computed(() => props.lastAddedAlbums.slice(0, 5))
</script>

<style lang="scss" scoped>
.oi-last-added {
  display: flex;
  flex-direction: column;
  gap: 0;

  &__row {
    display: grid;
    grid-template-columns: 5.6rem 1fr;
    gap: 14px;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid var(--oisogs-rule);

    &--popup {
      padding: 14px 40px;
      grid-template-columns: 7.2rem 1fr;
      border-radius: 0;
      transition: background 0.12s;

      &:hover { background: var(--oisogs-bg-elev); }

      @media (max-width: #{$oi-bp-mobile}) {
        padding: 12px 20px;
      }
    }
  }

  &__cover {
    width: 5.6rem;
    height: 5.6rem;
    object-fit: cover;
    border-radius: $oi-radius-sm;

    &--lg {
      width: 7.2rem;
      height: 7.2rem;
    }
  }

  &__info {
    min-width: 0;
  }

  &__title {
    font-family: $oi-font-serif;
    font-size: 1.5rem;
    color: var(--oisogs-ink);
    font-style: italic;
    @include oi-truncate;
  }

  &__artist {
    font-family: $oi-font-sans;
    font-size: 1.2rem;
    color: var(--oisogs-ink-soft);
    margin-top: 2px;
    @include oi-truncate;
  }

  &__date {
    font-family: $oi-font-sans;
    font-size: 1.1rem;
    color: var(--oisogs-mute);
    margin-top: 2px;
    @include oi-tnum;
  }

  &__more {
    background: none;
    border: none;
    color: var(--oisogs-accent);
    font-family: $oi-font-sans;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 14px 0 0;
    text-align: left;
    letter-spacing: 0.02em;
    transition: opacity 0.15s;

    &:hover { opacity: 0.7; }
  }
}

</style>
