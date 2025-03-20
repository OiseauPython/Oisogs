<template>
  <div class="top-artists-wrapper">
    <h2 class="card-title">Top Artistes</h2>
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
@use '@/assets/mixin.scss' as *;

.top-artists-wrapper {
  @include card-background;
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
        color: #ff881a;
        font-size: 3.1rem;
      }
    }
    &-rank2 {
      .artist-rank {
        color: #ff008c;
        font-size: 2.8rem;
      }
    }
    &-rank3 {
      .artist-rank {
        color: #1457ff;
        font-size: 2.5rem;
      }
    }
  }
}
</style>
