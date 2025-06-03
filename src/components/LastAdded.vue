<template>
  <div class="top-albums-wrapper">
    <h2 class="card-title">
      Derniers ajouts <InfoIcon v-if="isToolTip" :tooltipData="helpToolTips.yearGraph" />
    </h2>
    <div v-for="album in lastAddedAlbums" :key="album.title" class="album-container">
      <img class="album-cover" :src="album.cover" alt="" />
      <div class="album-info">
        <div class="album-title">{{ album.title }}</div>
        <div class="album-artist">{{ album.artist }}</div>
        <div class="album-added">{{ album.dateAdded }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  lastAddedAlbums: {
    type: Object,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
// Les imports sont gérés par Vite dans vite.config.js


.top-albums-wrapper {
  display: grid;
  grid-template-rows: auto auto;
  align-content: space-between;
  @include card-background;
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
</style>
