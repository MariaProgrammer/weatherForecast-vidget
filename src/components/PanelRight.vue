<script setup>
import Stat from './Stat.vue'
import Cityselect from './Cityselect.vue'
import ErrorComponent from './Error.vue'
import DayCard from './DayCard.vue'

const props = defineProps({
  error: { type: String, default: '' },
  savedCity: { type: String, required: true },
  todayDataModified: { type: Array, required: true },   // [{label, stat}]
  forecastDays: { type: Array, required: true },        // массив дней из API
  activeIndex: { type: Number, default: 0 }             // активный день
})

// Родителю: выбор города и выбор дня
const emit = defineEmits(['select-city', 'select-day'])

function handleSelect(i) {
  emit('select-day', i)
}
</script>

<template>
  <ErrorComponent :error="error" />

  <div id="city">{{ savedCity }}</div>

  <Stat v-for="item in todayDataModified" :key="item.label" v-bind="item" />

  <div class="day-card__wrap" v-if="forecastDays && forecastDays.length">
    <DayCard
      v-for="(day, i) in forecastDays"
      :key="day.datetime"
      :icon="day.icon"
      :temp="day.temp"
      :date="new Date(day.datetime)"
      :is-active="activeIndex === i"
      @select="handleSelect(i)"
    />
  </div>

  <Cityselect @select-city="city => emit('select-city', city)" />
</template>

<style scoped>
#city {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 25px;
  color: #fff;
}
.day-card__wrap {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 15px;
  margin-top: 50px;
  margin-bottom: 50px;
}

@media (max-width: 576px) {
  .day-card__wrap :deep(.day-card:nth-child(n+4)) {
    display: none;
  }
}
</style>
