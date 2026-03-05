<script setup>

</script>

<template>
  <button class="button">
    <div>
      <slot name="icon"></slot>
      <slot name="text"></slot>
    </div>

    <slot />
  </button>
</template>

<style scoped>
.button {
  border: none;
  border-radius: 10px;
  background: var(--gradient);
  padding: 14px;
  font-family: var(--font);
  font-size: 20px;
  font-weight: 600;
  color: var(--color-primary);
  cursor: pointer;
  transition: all 1s ease;
  display: flex;
  gap: 9px;
  align-items: center;
}
.button:hover {
   background: var(--gradient-inverted);
}
</style>
