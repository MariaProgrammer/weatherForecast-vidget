<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import IconWeatherPicker from './icons/weather/IconWeatherPicker.vue';

const props = defineProps({
  icon: String,
  temp: Number,
  date: Date,
  isActive: Boolean
});

const emit = defineEmits(['select']);

const iconSize = ref(54);

const checkScreenSize = () => {
  iconSize.value = window.innerWidth <= 460 ? 36 : 54;
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});
onUnmounted(() => window.removeEventListener('resize', checkScreenSize));

const iconColor = computed(() => (props.isActive ? 'black' : 'white'));
</script>

<template>
  <button class="day-card" :class="{active: isActive}" @click="emit('select')">
    <IconWeatherPicker :icon="icon" :color="iconColor" :size="iconSize" />

    <div class="day-card__date">
      {{ date?.toLocaleDateString("ru-RU", { weekday: "short" }) }}
    </div>
    <div class="day-card__temp">
      {{ Math.round(temp) }} °C
    </div>
  </button>
</template>

<style scoped>
/* стили без изменений */
.day-card {
  padding: 20px 24px;
  color: #fff;
  background: var(--color-bg-card);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}
.day-card:not(.active):hover { background: #39424f; }
.day-card.active { background: var(--color-primary); color: var(--color-primary-inverted); }
.day-card__date { font-weight: 400; font-size: 20px; }
.day-card__temp { font-weight: 700; font-size: 20px; }
@media (max-width: 560px) {
  .day-card { flex: 1 1 auto; padding: 10px 14px; gap: 10px; }
}
</style>
