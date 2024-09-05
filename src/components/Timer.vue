<style scoped>
.read-the-docs {
  color: #888;
}
</style>

<script>
import { randomScrambleForEvent } from "https://cdn.cubing.net/js/cubing/scramble";

export default {
  name: "Timer",
  data() {
    return {
      startTime: 0,
      elapsedTime: "0.00",
      timer: null,
      scramble: "",
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
          this.elapsedTime = ((Date.now() - this.startTime) / 1000).toFixed(2).toString();
        }, 10);
      }
    },
    stop() {
      this.isStopped = true;
      this.isRunning = false;
      clearInterval(this.timer);
    },
    resetTimer() {
      this.elapsedTime = "0.00";
      this.stop();
    },
    resetTimes() {
      this.times = [];
    },
    onUpEvent(event) {
      if (event.code === "Space") {
        if (this.isStopped) {
          this.resetTimer();
        }
        if (this.isRunning) {
          this.stop();
          this.getScramble();
          this.times.push({ time: this.elapsedTime, scramble: this.scramble });
        } else {
          this.start();
        }
      }
    },
    async getScramble() {
      const scramble = await randomScrambleForEvent("333");
      this.scramble = scramble.toString();
    },
    plus2() {
      this.times[this.times.length - 1].time += "(+2)";
    },
    dnf() {
      this.times[this.times.length - 1].time = "DNF";
    },
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
  <div class="container min-w-full flex flex-col items-center">
    <div class="pb-6">
      <h1 class="text-2xl">
        Scramble:
        {{ scramble }}
      </h1>
    </div>
    <div>
      <h2 class="text-2xl my-2">Time: {{ elapsedTime }} seconds</h2>
    </div>
    <div className="my-2">
      <button className="btn" @click="plus2" :disabled="isRunning">+2</button>
      <button className="btn" @click="dnf" :disabled="isRunning">DNF</button>
    </div>
    <div>
      <button
        className="btn btn-outline"
        @click="resetTimes"
        :disabled="isRunning"
      >
        Reset Times
      </button>
    </div>
    <div>
      <h2 v-if="times.length > 0">Times:</h2>
      <ul>
        <li v-for="(time, index) in times" :key="index">
          {{ time.time }} seconds - {{ time.scramble }}
        </li>
      </ul>
    </div>
  </div>
</template>
