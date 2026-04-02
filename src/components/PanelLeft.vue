<script setup>
import { computed } from "vue";
import IconLocation from "./icons/IconLocation.vue";
import IconWeatherPicker from "./icons/weather/IconWeatherPicker.vue";

const props = defineProps({
  dayData: { type: Object, required: true },  // days[0]
  timezone: { type: String, default: "Europe/Moscow" },
  city: { type: String, default: "" },
  current: { type: Object, default: null }    // currentConditions
});

function capitalizeFirst(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Дата (верхняя часть)
const dateObj = computed(() => {
  if (!props.dayData?.datetimeEpoch) return null;
  return new Date(props.dayData.datetimeEpoch * 1000);
});

const weekdayText = computed(() => {
  if (!dateObj.value) return "";
  const w = new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    timeZone: props.timezone
  }).format(dateObj.value);
  return capitalizeFirst(w);
});

const fullDateText = computed(() => {
  if (!dateObj.value) return "";
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: props.timezone
  });
  const parts = formatter.formatToParts(dateObj.value)
    .filter(p => !(p.type === "literal" && p.value.trim() === "г."))
    .map(p => p.value)
    .join("");
  return parts.replace(/\s+/g, " ").trim();
});

// Источник "сейчас" — current, иначе dayData
const srcNow = computed(() => props.current ?? props.dayData);

// Температура и иконка
const temperature = computed(() => Math.round(srcNow.value?.temp ?? props.dayData?.temp ?? 0));
const apiIcon = computed(() => (srcNow.value?.icon || props.dayData?.icon || "").toLowerCase());

// Человеческий текст состояния
const conditionText = computed(() => {
  const icon = apiIcon.value;
  const map = {
    "clear-day": "Солнечно",
    "clear-night": "Ясно",
    "partly-cloudy-day": "Переменная облачность",
    "partly-cloudy-night": "Переменная облачность",
    "cloudy": "Облачно",
    "overcast": "Пасмурно",
    "rain": "Дождь",
    "showers": "Ливни",
    "drizzle": "Морось",
    "snow": "Снег",
    "sleet": "Мокрый снег",
    "hail": "Град",
    "thunderstorm": "Гроза",
    "fog": "Туман",
    "wind": "Ветрено"
  };
  if (map[icon]) return map[icon];

  const s = (srcNow.value?.conditions || props.dayData?.conditions || "").toLowerCase();
  if (s.includes("thunder")) return "Гроза";
  if (s.includes("rain") || s.includes("shower")) return "Дождь";
  if (s.includes("snow")) return "Снег";
  if (s.includes("sleet")) return "Мокрый снег";
  if (s.includes("drizzle")) return "Морось";
  if (s.includes("fog")) return "Туман";
  if (s.includes("overcast")) return "Пасмурно";
  if (s.includes("cloud")) return "Облачно";
  if (s.includes("clear")) return "Ясно";
  if (s.includes("wind")) return "Ветрено";
  return capitalizeFirst(srcNow.value?.conditions || "—");
});
</script>

<template>
  <div class="panel-left">
    <div class="panel-left__date">
      <div class="weekday">{{ weekdayText }}</div>
      <div class="date">{{ fullDateText }}</div>
      <div class="city">
        <IconLocation />
        <span>{{ city }}</span>
      </div>
    </div>

    <div class="panel-left__weather">
      <IconWeatherPicker :icon="apiIcon" :size="95" color="white" class="weather-icon" />
      <div class="weather-temp">
        {{ temperature }} <span class="degree">°C</span>
      </div>
      <div class="weather-desc">
        {{ conditionText }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel-left {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.panel-left__date { 
  color: #fff; 
}
.weekday { 
  font-size: 37px; 
  font-weight: 700; 
  line-height: 1.1; 
  margin-bottom: 16px; }
.date { 
  font-size: 22px; 
  font-weight: 500; 
  margin-bottom: 10px; }
.city { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  font-size: 20px; 
  font-weight: 600; 
}

.panel-left__weather {
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-top: 55px;
  
}

.weather-temp { 
  font-size: 50px; 
  font-weight: 700; 
  line-height: 1;
  margin-top: 8px;
  
 
}
.degree { 
  
  margin-left: 4px;
} 
  
.weather-desc { 
  font-size: 30px; 
  font-weight: 700; 
  
}
.weather-icon { 
    margin-left: 15px;
  }

@media (max-width: 460px) {
  .weather-temp { 
    font-size: 48px;
    
  }
  
}
</style>
