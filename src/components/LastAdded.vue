<template>
  <div class="top-albums-wrapper">
    <h2 class="card-title">
      Derniers ajouts <InfoIcon v-if="isToolTip" :tooltipData="helpToolTips.yearGraph" />
    </h2>
    <div v-for="album in limitedLastAddedAlbums" :key="album.title" class="album-container">
      <img class="album-cover" :src="album.cover" alt="" />
      <div class="album-info">
        <div class="album-title">{{ album.title }}</div>
        <div class="album-artist">{{ album.artist }}</div>
        <div class="album-added">{{ album.dateAdded }}</div>
      </div>
    </div>
    <button @click="isPopupVisible = true" class="see-more-button">Voir plus</button>
  </div>
  <Teleport to="body">
    <Popup v-if="isPopupVisible" :visible="isPopupVisible" @close="isPopupVisible = false">
      <template #header>
        <h3>Les 50 derniers ajouts</h3>
      </template>
      <template #default>
        <div class="popup-added-list">
          <div v-for="album in lastAddedAlbums" :key="album.title">
            <div class="album-container">
              <img class="album-cover" :src="album.cover" alt="" />
              <div class="album-info">
                <div class="album-title">{{ album.title }}</div>
                <div class="album-artist">{{ album.artist }}</div>
                <div class="album-added">{{ album.dateAdded }}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Popup>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import Popup from './shared/Popup.vue'

const props = defineProps({
  lastAddedAlbums: {
    type: Object,
    required: true,
  },
})
const isPopupVisible = ref(false)
const limitedLastAddedAlbums = computed(() => {
  return Object.fromEntries(Object.entries(props.lastAddedAlbums).slice(0, 5))
})
</script>

<style lang="scss" scoped>
// Les imports sont gérés par Vite dans vite.config.js

.top-albums-wrapper {
  min-width: 0;
  width: 100%;
  min-height: 50rem;
  @media (min-width: 768px) {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: calc(33.333% - 3rem);
    height: inherit;
  }

  display: grid;
  grid-template-rows: auto auto;
  align-content: space-between;
  @include card-background;

  .see-more-button {
    text-decoration: underline;
    background-color: transparent;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1.6rem;
    width: 100%;
    margin-top: 2rem;

    &:hover {
      text-decoration: none;
    }
  }
  .album-container {
    display: grid;
    grid-template-columns: 6.5rem auto;
    gap: 1rem;
    align-items: center;
    .album-info {
      display: grid;
      grid-template-rows: auto auto;
      gap: 0rem;
      .album-title,
      .album-artist {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 500;
      }
      .album-added,
      .album-artist {
        font-size: 1.2rem;
      }
    }
    .album-cover {
      width: 6rem;
      border-radius: 0.5rem;
    }
  }
}
.popup-added-list {
  > div {
    margin-bottom: 1rem;
  }
  .album-container {
    display: grid;
    grid-template-columns: 6.5rem auto;
    gap: 3rem;
    align-items: center;
    .album-info {
      display: grid;
      grid-template-rows: auto auto;
      gap: 0rem;
      .album-title,
      .album-artist {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 500;
      }
      .album-added,
      .album-artist {
        font-size: 1.2rem;
      }
    }
    .album-cover {
      width: 8rem;
      border-radius: 0.5rem;
    }
  }
}
</style>
