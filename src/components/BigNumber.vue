<template>
  <div class="big-number-wrapper">
    <div class="big-number-container">
      <span class="number">{{ bigNumber }}</span>
      <span class="wording">{{ wording }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  bigNumber: {
    type: [Number, String, Object],
    required: true,
  },
  wording: {
    type: String,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
@use '@/assets/variables.scss' as *;
@use '@/assets/mixin.scss' as *;

.big-number-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 3.5rem 0 5rem 0;
  .big-number-container {
    position: relative;
    padding: 0 1.5rem;
    .number {
      font-size: 8rem;
      line-height: 8rem;
      font-family: Poppins-Bold;
      font-style: italic;
      background: $gradient;
      font-weight: bolder;
      letter-spacing: -0.05em;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: inline-block;
      padding-right: 1.2rem;
    }

    .wording {
      position: absolute;
      font-size: 1.6rem;
      color: rgba(255, 255, 255, 0.8);
      text-align: center;
      @include card-background;
      backdrop-filter: blur(5px);
      padding: 1rem;
      border-radius: 1rem;
      bottom: -1rem;
      right: -2rem;
    }
  }
}
</style>
