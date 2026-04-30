import { ref, watch, onMounted } from 'vue'

export function useCountUp(target, duration = 1400) {
  const value = ref(0)

  function animate(to) {
    const start = performance.now()
    const from = value.value
    const diff = to - from

    function tick(now) {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      value.value = Math.round(from + diff * eased)
      if (p < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }

  onMounted(() => animate(target.value ?? target))

  watch(
    () => (typeof target === 'object' && target !== null ? target.value : target),
    (to) => animate(to),
  )

  return value
}
