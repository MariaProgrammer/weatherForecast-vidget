<script setup>
import { computed } from "vue";
import IconCloude from "./IconCloude.vue";
import IconSun from "./IconSun.vue";
import IconSnow from "./IconSnow.vue";
import IconRain from "./IconRain.vue";

const props = defineProps({
  icon: { type: String, default: "" },   // например: "clear-day", "partly-cloudy-day", "cloudy", "rain", "snow"
  size: { type: [Number, String], default: 54 },
  color: { type: String, default: "white" }
});

// Приводим значения к нижнему регистру и нормализуем
const normalized = computed(() => (props.icon || "").toLowerCase());

// Маппинг групп к компонентам
const componentName = computed(() => {
  const i = normalized.value;
  if (i === "clear-day" || i === "clear-night") return "sun";
  if (i === "rain" || i.includes("shower") || i.includes("drizzle")) return "rain";
  if (i === "snow" || i.includes("sleet") || i.includes("hail")) return "snow";
  if (i === "partly-cloudy-day" || i === "partly-cloudy-night" || i === "cloudy" || i === "overcast") return "cloud";
  // дефолт — солнце
  return "sun";
});
</script>

<template>
  <IconSun v-if="componentName === 'sun'" :size="size" :color="color" />
  <IconCloude v-else-if="componentName === 'cloud'" :size="size" :color="color" />
  <IconRain v-else-if="componentName === 'rain'" :size="size" :color="color" />
  <IconSnow v-else :size="size" :color="color" />
</template>
