<script setup>
import { ref, computed } from "vue";
import Stat from "./components/Stat.vue";
import Cityselect from "./components/Cityselect.vue";
// ИЗМЕНЕНИЕ 1: Переименовываем импорт, чтобы избежать конфликта с классом Error
import ErrorComponent from "./components/Error.vue";

// --- НАСТРОЙКИ API Visual Crossing ---
const API_TOKEN = "UBUTEHUV7B9S5KDAVZU3WXWWE";
const API_BASE_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

// --- Состояние компонента ---
const savedCity = ref("Санкт-Петербург");
const data = ref({
  temperature: 0,
  humidity: 0,
  precipitation: 0,
  wind: 0,
  pressure: 0,
});

// ИЗМЕНЕНИЕ 2: Инициализируем ошибку пустой строкой, это хорошая практика
let error = ref('');

const dataModified = computed(() => {
  // ... этот блок без изменений
  return [
    {
      label: "Температура",
      stat: Math.round(data.value.temperature) + " °C",
    },
    {
      label: "Влажность",
      stat: Math.round(data.value.humidity) + "%",
    },
    {
      label: "Осадки",
      stat: data.value.precipitation + " мм",
    },
    {
      label: "Ветер",
      stat: data.value.wind.toFixed(1) + " м/с",
    },
    {
      label: "Давление",
      stat: Math.round(data.value.pressure) + " мм рт. ст.",
    },
  ];
});

// --- Функция для получения погоды ---
// --- Функция для получения погоды ---
async function getCity(cityName) {
  if (!cityName) return;
  savedCity.value = cityName;

  const queryUrl = `${API_BASE_URL}${encodeURIComponent(cityName)}/today?unitGroup=metric&key=${API_TOKEN}&contentType=json`;

  try {
    // Очищаем предыдущую ошибку перед каждым новым запросом
    error.value = '';
    
    const response = await fetch(queryUrl);

    // ИЗМЕНЕНИЕ 1: Создаем разные сообщения об ошибке в зависимости от ответа сервера
    if (!response.ok) {
      if (response.status === 400) {
        // 400 Bad Request обычно означает, что город не найден или в запросе ошибка
        throw new Error('Город не найден. Проверьте правильность написания.');
      }
      // Для всех других ошибок сервера (500, 404 и т.д.)
      throw new Error(`Ошибка сервера: ${response.status}. Попробуйте позже.`);
    }

    const weatherData = await response.json();
    
    const currentConditions = weatherData.days[0];
    if (!currentConditions) {
        throw new Error('Получены некорректные данные о погоде от сервера.');
    }

    // --- Обновление данных в компоненте (если все успешно) ---
    data.value.temperature = currentConditions.temp;
    data.value.humidity = currentConditions.humidity;
    data.value.precipitation = currentConditions.precip;
    data.value.wind = currentConditions.windspeed / 3.6;
    data.value.pressure = currentConditions.pressure * 0.750062;

  } catch (err) {
    // ИЗМЕНЕНИЕ 2: Присваиваем именно то сообщение, которое было создано в 'throw new Error'
    // или которое пришло от системной ошибки (например, сбой сети)
    console.error("Произошла ошибка при выполнении запроса:", err);

    // Проверяем, не является ли это ошибкой сети
    if (err.message.includes('Failed to fetch')) {
        error.value = 'Ошибка сети. Проверьте ваше подключение к интернету.';
    } else {
        // Для всех остальных ошибок используем их собственное сообщение
        error.value = err.message;
    }
    
    // Сбрасываем данные, чтобы на экране были нули
    data.value = { temperature: 0, humidity: 0, precipitation: 0, wind: 0, pressure: 0 };
  }
}


// Загружаем погоду для города по умолчанию при загрузке компонента
getCity(savedCity.value);

</script>


<template>
  <main class="main">
    <!-- ИЗМЕНЕНИЕ 5: Используем новое имя компонента -->
    <ErrorComponent :error="error" />
    <div id="city">{{ savedCity }}</div>

    <Stat v-for="item in dataModified" v-bind="item" :key="item.label"/>
    
    <Cityselect @select-city="getCity" />
  </main>
</template>

<style scoped>
/* ... ваши стили остаются без изменений ... */
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
</style>
