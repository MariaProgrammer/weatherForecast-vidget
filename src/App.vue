<script setup>
import { ref, computed } from "vue";
import PanelRight from "./components/PanelRight.vue";
import PanelLeft from "./components/PanelLeft.vue";
import { API_BASE_URL, API_TOKEN } from "./constants.js";

const savedCity = ref("Санкт-Петербург");
const error = ref("");

// Полный ответ от API
const weatherData = ref(null);

// Активный индекс дня (0 — сегодня)
const selectedIndex = ref(0);

// Массив прогноза (например, 4 дня)
const forecastDays = ref([]);

// Выбранный день из API
const selectedDay = computed(() => weatherData.value?.days?.[selectedIndex.value] ?? null);

// Текущий часовой пояс из API
const timezone = computed(() => weatherData.value?.timezone ?? "Europe/Moscow");

// Текущие условия (для сегодняшнего дня)
const currentFromApi = computed(() => weatherData.value?.currentConditions ?? null);

// Отображаемый город
const cityDisplay = computed(() => weatherData.value?.address || savedCity.value);

// Статистика для правой панели из выбранного дня
const todayDataModified = computed(() => {
  const d = selectedDay.value;
  if (!d) return [
    { label: "Влажность", stat: "0%" },
    { label: "Осадки",    stat: "0 мм" },
    { label: "Ветер",     stat: "0.0 м/с" },
    { label: "Давление",  stat: "0 мм рт. ст." },
  ];
  const humidity     = Math.round(d.humidity ?? 0);
  const precipitation= d.precip ?? 0;
  const wind         = ((d.windspeed ?? 0) / 3.6).toFixed(1);
  const pressure     = Math.round((d.pressure ?? 0) * 0.750062);

  return [
    { label: "Влажность", stat: `${humidity}%` },
    { label: "Осадки",    stat: `${precipitation} мм` },
    { label: "Ветер",     stat: `${wind} м/с` },
    { label: "Давление",  stat: `${pressure} мм рт. ст.` },
  ];
});

// Получение погоды по названию города
async function getCity(cityName) {
  if (!cityName) return;
  savedCity.value = cityName;

  const queryUrl = `${API_BASE_URL}${encodeURIComponent(cityName)}/next4days?unitGroup=metric&key=${API_TOKEN}&contentType=json`;
  await fetchAndFill(queryUrl);
}

// Получение погоды по координатам
async function getByCoords(lat, lon) {
  const queryUrl = `${API_BASE_URL}${lat},${lon}/next4days?unitGroup=metric&key=${API_TOKEN}&contentType=json`;
  await fetchAndFill(queryUrl);
}

// Общая функция запроса и заполнения состояния
async function fetchAndFill(queryUrl) {
  try {
    error.value = "";
    const response = await fetch(queryUrl);
    if (!response.ok) {
      if (response.status === 400) throw new Error("Город не найден. Проверьте правильность написания.");
      throw new Error(`Ошибка сервера: ${response.status}. Попробуйте позже.`);
    }

    const apiData = await response.json();
    console.log("Полный ответ от сервера:", apiData);
    weatherData.value = apiData;

    // Сбрасываем активный день на сегодня
    selectedIndex.value = 0;

    // Берём первые 4 дня (если хотите исключить сегодня — .slice(1,5))
    forecastDays.value = apiData.days.slice(0, 4);
  } catch (err) {
    console.error("Произошла ошибка при выполнении запроса:", err);
    error.value = err.message.includes("Failed to fetch")
      ? "Ошибка сети. Проверьте ваше подключение к интернету."
      : err.message;

    forecastDays.value = [];
    weatherData.value = null;
    selectedIndex.value = 0;
  }
}

// Автоопределение города по геолокации
async function detectCityByGeolocation() {
  if (!("geolocation" in navigator)) {
    error.value = "Геолокация не поддерживается вашим браузером.";
    return;
  }
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      await getByCoords(latitude, longitude);
    },
    (err) => {
      console.warn(err);
      error.value = "Не удалось получить доступ к геолокации.";
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

// Первичная загрузка
getCity(savedCity.value);

// Обработчик выбора дня из правой панели
function handleSelectDay(i) {
  selectedIndex.value = i;
}
</script>

<template>
  <main class="main">
    <div class="left">
      <!-- Левый блок показывает выбранный день -->
      <PanelLeft
        v-if="selectedDay"
        :day-data="selectedDay"
        :timezone="timezone"
        :city="cityDisplay"
        :current="selectedIndex === 0 ? currentFromApi : null"
      />
    </div>

    <div class="right">
      <PanelRight
        :error="error"
        :saved-city="savedCity"
        :today-data-modified="todayDataModified"
        :forecast-days="forecastDays"
        :active-index="selectedIndex"
        @select-day="handleSelectDay"
        @select-city="getCity"
      />
    </div>
  </main>
</template>



<style scoped>

.main {
  height: 100vh;
  display: flex;
  align-items: center;
}
.left {  
  width: 500px;
  height: 95%;
  max-height: 95%;  
  border-radius: 30px;
  background-image: url('../public/img-left__bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  padding: 48px 32px;

}
.right {
  max-height: 100%;
  background: var(--color-bg-main);
  padding: 50px 60px;
  border-radius: 25px; 
}


@media (max-width: 1200px) {
  .main {
    height: auto;
    flex-direction: column;
  }
  
  .left, .right {
    width: 100%;
    height: auto;

  }
  
}

@media (max-width: 768px) {
  .right {
    /* Уменьшаем отступы */
    padding: 35px 30px;
    width: 100%;
    height: auto;
  }
  #city {
    font-size: 20px;
  }
  .day-card__wrap {
    gap: 10px;
    margin-top: 60px;
    margin-bottom: 50px;
  }
}

@media (max-width: 560px) {
  .day-card__wrap {
    gap: 8px;
    margin-top: 30px;
    margin-bottom: 25px;
  }
  /* Выбираем ПОСЛЕДНИЙ компонент DayCard внутри обертки и скрываем его */
  .day-card__wrap :deep(.day-card:last-child) {
    display: none;
  }
}
@media (max-width: 360px) {
  .right {
    padding: 15px;
  }
}
</style>
