<!-- components/DayCard.vue -->
<script setup>
import IconCloude from './icons/weather/IconCloude.vue';
import IconSun from './icons/weather/IconSun.vue';
import IconSnow from './icons/weather/IconSnow.vue'; // Добавлено
import IconRain from './icons/weather/IconRain.vue'; // Добавлено

const {icon, temp, date} = defineProps({
  icon: String,
  temp: Number,
  date: Date,
})
</script>

<template>
  <button class="day-card">
    <IconSun v-if="icon == 'clear-day'" />
    <IconCloude v-if="icon == 'partly-cloudy-day' || icon == 'cloudy'" />
    <IconSnow v-if="icon == 'snow'" />
    <IconRain v-if="icon == 'rain'" />
    <div class="day-card__date">
      {{ date?.toLocaleDateString("ru-RU", {weekday: "short"}) }}
    </div>
    <div class="day-card__temp">
      {{ Math.round(temp) }} °C <!-- Добавил округление -->
    </div>
  </button>
</template>

<style scoped>
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
  transition: background 0.6s ease-in-out;

}

.day-card:hover {
  background:#39424f;
}
.day-card__date {
  font-weight: 400;
  font-size: 20px;
  
}
.day-card__temp {
  font-weight: 700;
  font-size: 20px;
} 
</style>