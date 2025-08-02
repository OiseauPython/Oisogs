<template>
  <div class="top-artists-wrapper">
    <h2 class="card-title">Top Artistes</h2>
    <div
      v-for="(count, artist, index) in limitedTopArtists"
      :key="artist"
      :class="['artist-container', `artist-container-rank${index + 1}`]"
    >
      <div class="artist-rank">#{{ index + 1 }}</div>
      <div class="artist-info">
        <div class="artist-name">{{ artist }}</div>
        <div class="album-count">{{ count }} albums</div>
      </div>
    </div>
    <button @click="isPopupVisible = true" class="see-more-button">Voir plus</button>
  </div>

  <Teleport to="body">
    <Popup v-if="isPopupVisible" :visible="isPopupVisible" @close="isPopupVisible = false">
      <template #header>
        <h3>Top 50 Artistes</h3>
      </template>
      <template #default>
        <div class="popup-artist-list">
          <div v-for="(count, artist, index) in topArtists" :key="artist" class="artist-container">
            <div class="artist-rank">#{{ index + 1 }}</div>
            <div class="artist-info">
              <div class="artist-name">{{ artist }}</div>
              <div class="album-count">{{ count }} albums</div>
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
  topArtists: {
    type: Object,
    required: true,
  },
})

const isPopupVisible = ref(false)

const limitedTopArtists = computed(() => {
  return Object.fromEntries(Object.entries(props.topArtists).slice(0, 10))
})
</script>

<style lang="scss" scoped>
.top-artists-wrapper {
  min-width: 0;
  width: 100%;
  @media (min-width: 768px) {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: calc(33.333% - 3rem);
    height: inherit;
  }

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

.popup-artist-list {
  .artist-container {
    display: grid;
    grid-template-columns: 3rem auto;
    gap: 1rem;
    align-items: center;
    padding: 0.5rem 0;

    .artist-rank {
      font-family: Poppins-Bold;
      font-size: 1.5rem;
      color: #ff881a;
    }

    .artist-info {
      .artist-name {
        font-weight: 500;
      }
      .album-count {
        font-size: 1rem;
        color: #aaa;
      }
    }
  }
}
</style>
