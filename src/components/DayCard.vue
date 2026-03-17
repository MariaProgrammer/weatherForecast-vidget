<!-- components/DayCard.vue -->
<script setup>
// 1. Импортируем все необходимое из vue
import { ref, onMounted, onUnmounted } from 'vue';
import IconCloude from './icons/weather/IconCloude.vue';
import IconSun from './icons/weather/IconSun.vue';
import IconSnow from './icons/weather/IconSnow.vue';
import IconRain from './icons/weather/IconRain.vue';

const props = defineProps({
  icon: String,
  temp: Number,
  date: Date,
  isActive: Boolean
})

// 2. Создаем реактивную переменную для размера иконки
// 54 - это наше значение по умолчанию для больших экранов
const iconSize = ref(54);

// 3. Создаем функцию для проверки размера экрана
const checkScreenSize = () => {
  if (window.innerWidth <= 460) {
    iconSize.value = 36; // Устанавливаем меньший размер для мобильных
  } else {
    iconSize.value = 54; // Возвращаем стандартный размер для больших экранов
  }
};

// 4. Используем хуки жизненного цикла
onMounted(() => {
  // Вызываем функцию один раз при загрузке компонента
  checkScreenSize();
  // Добавляем слушатель события 'resize', который будет вызывать нашу функцию
  // при каждом изменении размера окна
  window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
  // ОБЯЗАТЕЛЬНО удаляем слушатель, когда компонент уничтожается,
  // чтобы избежать утечек памяти
  window.removeEventListener('resize', checkScreenSize);
});

// Вычисляемое свойство для цвета иконки (остается без изменений)
import { computed } from 'vue';
const iconColor = computed(() => {
  return props.isActive ? 'black' : 'white';
});
</script>

<template>
  <button class="day-card" :class="{active: isActive}">
    <!-- 5. Привязываем нашу реактивную переменную iconSize к пропу :size -->
    <IconSun v-if="icon == 'clear-day'" :color="iconColor" :size="iconSize" />
    <IconCloude v-if="icon == 'partly-cloudy-day' || icon == 'cloudy'" :color="iconColor" :size="iconSize" />
    <IconSnow v-if="icon == 'snow'" :color="iconColor" :size="iconSize" />
    <IconRain v-if="icon == 'rain'" :color="iconColor" :size="iconSize" />
    
    <div class="day-card__date">
      {{ date?.toLocaleDateString("ru-RU", {weekday: "short"}) }}
    </div>
    <div class="day-card__temp">
      {{ Math.round(temp) }} °C
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
  transition: all 0.3s ease-in-out; /* Улучшил transition */
}

.day-card:not(.active):hover {
  background: #39424f;
}

/* Этот стиль уже есть, он меняет цвет ТЕКСТА */
.day-card.active {
  background: var(--color-primary);
  color: var(
    --color-primary-inverted
  ); /* Скорее всего, это и есть черный цвет */
}




.day-card__date {
  font-weight: 400;
  font-size: 20px;
}
.day-card__temp {
  font-weight: 700;
  font-size: 20px;
}
@media (max-width: 560px) {
  .day-card {
    flex: 1 1 auto;
    padding: 10px 14px;
    gap: 10px;
  }
}
</style>
