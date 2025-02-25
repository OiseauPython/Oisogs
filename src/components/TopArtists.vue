<template>
  <div class="top-artists-wrapper">
    <div
      v-for="(count, artist, index) in topArtists"
      :key="artist"
      :class="['artist-container', `artist-container-rank${index + 1}`]"
    >
      <div class="artist-rank">#{{ index + 1 }}</div>
      <div class="artist-info">
        <div class="artist-name">{{ artist }}</div>
        <div class="album-count">{{ count }} albums</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  topArtists: {
    type: Object,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;

.top-artists-wrapper {
  background: rgba(255, 255, 255, 0.16);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5.1px);
  -webkit-backdrop-filter: blur(5.1px);
  border-radius: $card-radius;
  padding: 3rem;
  .artist-container {
    display: grid;
    grid-template-columns: 4.5rem auto;
    gap: 1rem;
    align-items: center;
    .artist-info {
      display: grid;
      grid-template-rows: auto auto;
      gap: 0rem;
      .artist-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 500;
      }
      .album-count {
        font-size: 1.2rem;
        text-decoration: underline;
        width: fit-content;
        cursor: pointer;
      }
    }
    .artist-rank {
      font-family: Poppins-Bold;
      font-size: 2rem;
    }
    &-rank1 {
      .artist-rank {
        color: #d5a500;
        font-size: 3.1rem;
      }
    }
    &-rank2 {
      .artist-rank {
        color: #b7b7b7;
        font-size: 2.8rem;
      }
    }
    &-rank3 {
      .artist-rank {
        color: #a17419;
        font-size: 2.5rem;
      }
    }
  }
}
</style>
