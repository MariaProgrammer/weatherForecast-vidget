<script setup>
// const emit = defineEmits(['update:value'])
// const props = defineProps(['value'])
const model = defineModel()
</script>

<template>
  <!-- <input type="text" class="input"
  :value="model"
  @input="model=$event.target.value" /> -->
  <input v-model="model" class="input"
   />
</template>

<style scoped>
.input {
  color: var(--color-primary);
  width: 260px;
  font-size: 18px;
  border: none;  
  border-radius: 10px;
  background: var(--color-bg-card);
  box-shadow: 1px 2px 4px 0px var(--color-bg-main);
  padding: 15px 20px;
}
.input::placeholder {
  color: var(--color-text-placeholder);
  font-weight: 400;
  font-size: 18px;  
}

.input:focus {
  outline: none;
  border: 1px solid #586576;
  background: var(--color-bg-card);
}
</style>
