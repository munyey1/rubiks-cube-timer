<style scoped>
.read-the-docs {
  color: #888;
}
</style>

<script>
export default {
  name: 'Timer',
  data() {
    return {
      time: 0,
      timer: null,
      isRunning: false,
    };
  },
  methods: {
    start() {
      this.isRunning = true;
      this.timer = setInterval(() => {
        this.time++;
      }, 1000);
    },
    stop() {
      this.isRunning = false;
      clearInterval(this.timer);
    },
    resetTimer() {
      this.time = 0;
      this.stop();
    },
    onPressEvent(event) {
      if (event.code === 'Space') {
        if (this.isRunning) {
          this.stop();
        } else {
          this.start();
        }
      }
    },
  },
  mounted() {
    window.addEventListener('keydown', this.onPressEvent);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onPressEvent);
  },
};
</script>

<template>
  <h1 class="text-2xl">Timer</h1>
  <h2 class="text-xl">Time: {{ time }} seconds</h2>
  <div>
    <p>Press the spacebar to start and stop the timer.</p>
  </div>
  <button @click="resetTimer" :disabled="isRunning">Reset</button>
</template>
