<template>
  <div v-if="visible" class="popup-overlay" :style="{ width: visible ? '100%' : '0' }" @click.self="close">
    <div class="popup-container">
      <button class="close-button" @click="close">&times;</button>
      <div class="popup-header">
        <slot name="header"></slot>
      </div>
      <div class="popup-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-container {
  background-color: #2c2c2c; /* Dark background */
  color: #f0f0f0; /* Light text */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  width: 80%;
  max-width: 600px;
  position: relative;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}

.popup-header {
  border-bottom: 1px solid #444;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.popup-content {
  overflow-y: auto;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  color: #f0f0f0;
  cursor: pointer;
}
</style>
