<script setup>
import { nextTick, computed, ref } from 'vue';
import Stat from "./components/Stat.vue"
import Cityselect from "./components/Cityselect.vue";

let data = ref({
  humidity: 90,
})

const dataModified = computed((prev) => {
  console.log(prev)
  return {
    label: "Влажность",
    stat: data.value.humidity+'%',

  }
})
  

let savedCity = ref("Moscow")
// let arr = ref([1])
// let map = ref(new Map([['1', 1]]))



async function getCity(city) {
  console.log(city)
  savedCity.value = city;
  await nextTick()
  data.value.humidity = 20;
  // arr.value.push(2)
  // map.value.set('2', 2)
}
</script>

<template>
  <main class="main">
    {{ savedCity }}
    
    <Stat v-bind="dataModified"/>
    <Stat label="Осадки" stat="0%" />
    <Cityselect @select-city="getCity"/>
  
  </main>  
</template>

<style scoped>
.main {
  background: var(--color-bg-main);
  padding: 50px 60px;
  border-radius: 25px;
}
</style>
