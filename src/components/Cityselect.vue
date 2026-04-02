<script setup>
import { onMounted, ref } from "vue";
import IconLocation from "./icons/IconLocation.vue";
import Button from "./Button.vue";
import Input from "./Input.vue";

const API_ENDPOINT = 'https://api.gismeteo.net/v2/weather/forecast/'


const emit = defineEmits({
  selectCity(payload) {
    console.log(`Validation payload: ${payload}`);
    return payload;
  },
});

let isEdited = ref(false);
let city = ref('Санкт-Петербург')



onMounted(() => {
  emit("selectCity", city.value);

})
// watch(city, (newValue, oldValue) => {
//   console.log(`City old: ${oldValue}`)
//   console.log(`City new: ${newValue}`)
// })
// watch(city, () => {
//   console.log(city.value)
//   onWatcherCleanup(() => {
//     console.log('Cleanup')
//   })
// })

function select() {
  isEdited.value = false;
  emit("selectCity", city.value);
}

function edit() {
  isEdited.value = true;
}

// function updateCity(newCity) {
//   console.log(newCity)
//   city.value = newCity
// }
</script>

<template>
  <div class="city-select">
    <!-- {{ city }} -->
     <div v-if="isEdited" class="city-input">
    <!-- <Input placeholder="Введите город" :value="city" @update:value="updateCity"/> -->
    <Input  v-model="city" v-focus placeholder="Введите город" @keydown.enter="select"/>
    <Button @click="select()"> Сохранить </Button>
  </div>

  <Button v-else @click="edit()">
    <IconLocation />
    Изменить город
  </Button>

  </div>
 
</template>

<style scoped>
.city-input {
  display: flex;
  gap: 12px;
}
@media (max-width: 560px) {
  .city-input {
    flex-direction: column;
  }

}

</style>
