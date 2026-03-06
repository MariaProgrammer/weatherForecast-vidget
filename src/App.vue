<script setup>
import { nextTick, computed, ref } from "vue";
import Stat from "./components/Stat.vue";
import Cityselect from "./components/Cityselect.vue";

let data = ref({
  humidity: 90,
  rain: 0,
  wind: 3,
});

// const arr1 = ref(['Антон', 'Вася', 'Марина'])
// const obj1 = ref({
//   userName: 'Anton',
//   userAge: 18
// })
const dataModified = computed((prev) => {
  console.log(prev);
  return [
    {
      label: "Влажность",
      stat: data.value.humidity + "%",
    },
    {
      label: "Осадки",
      stat: data.value.rain + "%",
    },
    {
      label: "Ветер",
      stat: data.value.wind + "м/ч",
    },
  ];
});

let savedCity = ref("Moscow");
// let arr = ref([1])
// let map = ref(new Map([['1', 1]]))

async function getCity(city) {
  console.log(city);
  savedCity.value = city;
  await nextTick();
  data.value.humidity = 20;
  // arr.value.push(2)
  // map.value.set('2', 2)
}
</script>

<template>
  <main class="main">
    <!-- <ul >
      <li v-for="(item, index) in arr1" :key="item">
        {{index}} {{item}}
      </li>
    </ul> -->
    <!-- <ul>
      <li v-for="(value, key, index) in obj1" :key="key">
        {{ index }}: {{ key }}, {{ value }}
      </li>
    </ul> -->
    <div id="city">{{ savedCity }}</div>

    <Stat v-for="item in dataModified" v-bind="item" :key="item.label"/>
    <Cityselect @select-city="getCity" />
  </main>
</template>

<style scoped>
.main {
  background: var(--color-bg-main);
  padding: 50px 60px;
  border-radius: 25px;
}
</style>
