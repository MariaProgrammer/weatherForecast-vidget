<script setup>
//const { label, stat } = defineProps(['label', 'stat'])
const { label = "Не задано", stat } = defineProps({
  label: String,
  stat: String,
})

</script>

<template>
  <div class="stat">
    <div class="stat__name">{{ label }}</div>
    <div class="stat__value">{{ stat }}</div>
  </div>

</template>

<style scoped>
.stat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28px;
  gap: 16px;

}
.stat__name {
  font-weight: 700;
  text-transform: uppercase;
  
}

.stat__value {
  font-weight: 500;  
  text-align: right;
}

</style>