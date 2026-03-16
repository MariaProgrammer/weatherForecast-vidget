<script setup>
import { ref, computed } from "vue";
import Stat from "./components/Stat.vue";
import Cityselect from "./components/Cityselect.vue";
import ErrorComponent from "./components/Error.vue";
import DayCard from "./components/DayCard.vue";

// --- НАСТРОЙКИ API ---
const API_TOKEN = "UBUTEHUV7B9S5KDAVZU3WXWWE";
const API_BASE_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

// --- СОСТОЯНИЕ КОМПОНЕНТА ---
const savedCity = ref("Санкт-Петербург");
const error = ref('');

// Этот ref будет хранить данные для виджета СЕГОДНЯШНЕЙ погоды
const todayData = ref({
  humidity: 0,
  precipitation: 0,
  wind: 0,
  pressure: 0,
});

// НОВЫЙ REF: Здесь мы будем хранить массив с прогнозом на 4 дня
const forecastDays = ref([]);

// Вычисляемое свойство для сегодняшних статов
const todayDataModified = computed(() => {
  return [
    {
      label: "Влажность",
      stat: Math.round(todayData.value.humidity) + "%",
    },
    {
      label: "Осадки",
      stat: todayData.value.precipitation + " мм",
    },
    {
      label: "Ветер",
      stat: todayData.value.wind.toFixed(1) + " м/с",
    },
    {
      label: "Давление",
      stat: Math.round(todayData.value.pressure) + " мм рт. ст.",
    },
  ];
});

// --- ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ПОГОДЫ ---
async function getCity(cityName) {
  if (!cityName) return;
  savedCity.value = cityName;
  
  // Запрос теперь на 5 дней, чтобы получить сегодня + 4 следующих
  const queryUrl = `${API_BASE_URL}${encodeURIComponent(cityName)}/next4days?unitGroup=metric&key=${API_TOKEN}&contentType=json`;

  try {
    error.value = '';
    const response = await fetch(queryUrl);

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('Город не найден. Проверьте правильность написания.');
      }
      throw new Error(`Ошибка сервера: ${response.status}. Попробуйте позже.`);
    }

    const weatherData = await response.json();
    console.log('Полный ответ от сервера:', weatherData);
    
    // 1. Обработка СЕГОДНЯШНЕГО дня (первый элемент массива)
    const currentConditions = weatherData.days[0];
    if (!currentConditions) {
        throw new Error('Получены некорректные данные о погоде от сервера.');
    }
    todayData.value.humidity = currentConditions.humidity;
    todayData.value.precipitation = currentConditions.precip;
    todayData.value.wind = currentConditions.windspeed / 3.6;
    todayData.value.pressure = currentConditions.pressure * 0.750062;

    // 2. ЗАПОЛНЯЕМ МАССИВ С ПРОГНОЗОМ НА СЛЕДУЮЩИЕ 4 ДНЯ
    // .slice(1, 5) берет элементы с 1-го по 4-й (индексы), то есть 4 дня, не включая сегодняшний
    forecastDays.value = weatherData.days.slice(0, 4);

  } catch (err) {
    console.error("Произошла ошибка при выполнении запроса:", err);
    error.value = err.message.includes('Failed to fetch') 
      ? 'Ошибка сети. Проверьте ваше подключение к интернету.' 
      : err.message;
    
    // Сбрасываем все данные при ошибке
    todayData.value = { humidity: 0, precipitation: 0, wind: 0, pressure: 0 };
    forecastDays.value = [];
  }
}

// Загружаем погоду при первом запуске
getCity(savedCity.value);

</script>


<template>
  <main class="main">
    <ErrorComponent :error="error" />    
    
    <div id="city">{{ savedCity }}</div>

    <!-- Этот v-for выводит статы на СЕГОДНЯ -->
    <Stat v-for="item in todayDataModified" v-bind="item" :key="item.label"/>    

    <!-- ЗАМЕНЯЕМ СТАТИЧЕСКИЕ КАРТОЧКИ НА ДИНАМИЧЕСКИЙ ЦИКЛ v-for -->
    <div class="day-card__wrap">
      <DayCard 
        v-for="day in forecastDays" 
        :key="day.datetime"
        :icon="day.icon"
        :temp="day.temp"
        :date="new Date(day.datetime)"
      />
    </div>
    
    <Cityselect @select-city="getCity" />
  </main>
</template>

<style scoped>
/* ... ваши стили ... */
.main {
  background: var(--color-bg-main);
  padding: 50px 60px;
  border-radius: 25px;
}
#city {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 25px;
  color: #fff;
}
.day-card__wrap {
  display: flex;
  gap: 15px; /* Увеличил отступ для красоты */
  margin-top: 90px;
  margin-bottom: 71px;
}
</style>
