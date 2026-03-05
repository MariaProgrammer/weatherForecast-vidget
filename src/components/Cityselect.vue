<script setup>
import { ref } from 'vue';
import IconLocation from "./icons/IconLocation.vue"
import Button from "./Button.vue"

const emit = defineEmits({
  selectCity(payload) {
    console.log(`Validation payload: ${payload}`)
    return payload
  }
});

let isEdited = ref(false);


function select() {
  isEdited.value = false;
  emit ('selectCity', 'London');
}

function edit() {
  isEdited.value = true;

}

</script>

<template>
  
  <Button @click="edit()">
    <IconLocation /> 
    Изменить город
  </Button>
  <template v-if="isEdited">
    <input/>
  <Button @click="select()">
    Сохранить
  </Button>
  </template>
  
</template>

<style scoped></style>