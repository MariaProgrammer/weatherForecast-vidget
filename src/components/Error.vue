<script setup>
const props = defineProps({
  error: String,
})
</script>

<template>

<div class="error" v-if="props.error">{{ props.error }}</div>

</template>

<style scoped>
.error {
  background: var(--color-bg-card);
  margin-top: -50px;
  font-size: 18px;
  padding: 15px 50px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}
</style>