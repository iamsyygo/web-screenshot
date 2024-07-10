<script setup lang="ts">
import { Screenshot } from './utils/screenshot';
import bd3aefcc4bb4c7cf8bd61f206b936525 from './assets/bd3aefcc4bb4c7cf8bd61f206b936525.jpg'



window.onload = () => {
  new Screenshot('canvas', bd3aefcc4bb4c7cf8bd61f206b936525)
}
function ontake() {
  // screenshot.takeScreenshot()
}
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <button type="button" @click="ontake">📷</button>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
