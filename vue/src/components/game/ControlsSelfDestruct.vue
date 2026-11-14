<template>
  <button class="self-destruct" type="button" disabled>
    Самоуничтожение
  </button>
</template>

<style scoped lang="scss">
.self-destruct {
  width: 100%;
  padding: 8px 10px;
  border: 0;
  border-radius: 6px;
  background: #a33b32;
  color: #fff;
  cursor: pointer;
  font-family: Arial, sans-serif;

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
}
</style>
