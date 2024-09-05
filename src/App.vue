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

<script setup>
import { ref } from "vue";
import Timer from "./components/Timer.vue";

const showTimer = ref(false);
const toggleTimer = () => {
  showTimer.value = !showTimer.value;
};
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="py-6">
      <label class="switch">
        Show Timer
        <input type="checkbox" @click="toggleTimer" />
      </label>
    </div>
  </div>
  <div class="flex justify-center py-6">
    <div v-if="showTimer">
      <Timer />
    </div>
    <div v-if="!showTimer">
      <p>Test</p>
    </div>
  </div>
</template>
