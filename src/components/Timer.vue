<style scoped>
.read-the-docs {
  color: #888;
}
</style>

<script>
export default {
  name: "Timer",
  data() {
    return {
      startTime: 0,
      elapsedTime: 0,
      timer: null,
      isRunning: false,
      isStopped: false,
    };
  },
  methods: {
    start() {
      if (!this.isRunning) {
        // Use Date.now() to get the current time in milliseconds, more accurate
        this.isStopped = false;
        this.isRunning = true;
        this.startTime = Date.now() - this.elapsedTime * 1000;
        this.timer = setInterval(() => {
          this.elapsedTime = (Date.now() - this.startTime) / 1000;
        }, 10);
      }
    },
    stop() {
      this.isStopped = true;
      this.isRunning = false;
      clearInterval(this.timer);
    },
    resetTimer() {
      this.elapsedTime = 0;
      this.stop();
    },
    onUpEvent(event) {
      if (event.code === "Space") {
        if (this.isStopped) {
          this.resetTimer();
        }
        if (this.isRunning) {
          this.stop();
        } else{
          this.start();
        }
      }
    },
  },
  mounted() {
    window.addEventListener("keyup", this.onUpEvent);
  },
  beforeUnmount() {
    window.removeEventListener("keyup", this.onUpEvent);
  },
};
</script>

<template>
  <h1 class="text-2xl">Timer</h1>
  <h2 class="text-xl">Time: {{ elapsedTime.toFixed(2) }} seconds</h2>
  <div>
    <p>Press the spacebar to start and stop the timer.</p>
  </div>
  <button @click="resetTimer" :disabled="isRunning">Reset</button>
</template>
