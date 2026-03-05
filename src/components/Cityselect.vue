<script setup>
import { ref } from "vue";
import IconLocation from "./icons/IconLocation.vue";
import Button from "./Button.vue";
import Input from "./Input.vue";

const emit = defineEmits({
  selectCity(payload) {
    console.log(`Validation payload: ${payload}`);
    return payload;
  },
});

let isEdited = ref(false);

function select() {
  isEdited.value = false;
  emit("selectCity", "London");
}

function edit() {
  isEdited.value = true;
}
</script>

<template>
  <div v-if="isEdited" class="city-input">
    <Input placeholder="Введите город" />
    <Button @click="select()"> Сохранить </Button>
  </div>

  <Button v-else @click="edit()">
    <IconLocation />
    Изменить город
  </Button>
</template>

<style scoped>
.city-input {
  display: flex;
  gap: 12px;
}

</style>
