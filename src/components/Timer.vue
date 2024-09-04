<style scoped>
.read-the-docs {
  color: #888;
}
</style>

<script>
import { randomScrambleForEvent } from 'https://cdn.cubing.net/js/cubing/scramble';

export default {
  name: "Timer",
  data() {
    return {
      startTime: 0,
      elapsedTime: 0,
      timer: null,
      scramble: '',
      isRunning: false,
      isStopped: false,
      isInspection: true,
      times: [],
    };
  },
  methods: {
    start() {
      if (!this.isRunning) {
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
          this.getScramble();
          this.times.push({time: this.elapsedTime, scramble: this.scramble});
        } else{
          this.start();
        }
      }
    },
    async getScramble(){
      const scramble = await randomScrambleForEvent('333');
      this.scramble = scramble.toString();
    }
  },
  mounted() {
    window.addEventListener("keyup", this.onUpEvent);
    this.getScramble();
  },
  beforeUnmount() {
    window.removeEventListener("keyup", this.onUpEvent);
  },
};
</script>

<template>
  <h1 class="text-2xl">Scramble:</h1>
  <h1 class="text-2xl">{{ scramble }}</h1>
  <h2 class="text-xl">Time: {{ elapsedTime.toFixed(2) }} seconds</h2>
  <div>
    <p>Press the spacebar to start and stop the timer.</p>
  </div>
  <button @click="resetTimer" :disabled="isRunning">Reset</button>
  <h2 v-if="times.length > 0">Times:</h2>
  <ul>
    <li v-for="(time, index) in times" :key="index">
      {{ time.time.toFixed(2) }} seconds - {{ time.scramble }}
    </li>
  </ul>
</template>
