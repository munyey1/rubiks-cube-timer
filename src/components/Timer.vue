<style scoped>
.dark-overlay{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.z-10 {
  z-index: 10; /* Ensure the timer and controls are above the overlay */
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
      isStopped: true,
      isInspection: true,
      times: [],
    };
  },
  methods: {
    inspection() {
      this.startTime = 15;
      this.timer = setInterval(() => {
        this.elapsedTime = (this.startTime -= 0.01).toFixed(2).toString();
        this.isInspection = false;
        if (this.startTime <= 0) {
          clearInterval(this.timer);
          this.stop();
        }
      }, 10);
    },
    start() {
      this.isStopped = false;
      this.isRunning = true;
      this.startTime = Date.now() - this.elapsedTime * 1000;
      this.timer = setInterval(() => {
        this.elapsedTime = ((Date.now() - this.startTime) / 1000)
          .toFixed(2)
          .toString();
      }, 10);
    },
    stop() {
      this.getScramble();
      this.times.push({ time: this.elapsedTime, scramble: this.scramble });
      this.isStopped = true;
      this.isRunning = false;
      this.isInspection = true;
      clearInterval(this.timer);
    },
    resetTimes() {
      this.times = [];
    },
    onUpEvent(event) {
      if (event.code === "Space") {
        if (this.isStopped && this.isInspection) {
          // this.isStopped && !this.isRunning && this.isInspection
          this.inspection();
        }
        if (!this.isStopped && !this.isInspection) {
          // !this.isStopped && this.isRunning && !this.isInspection
          this.stop();
        }
        if (this.isStopped && !this.isInspection) {
          // this.isStopped && !this.isRunning && !this.isInspection
          this.elapsedTime = "0.00";
          clearInterval(this.timer);
          this.start();
        }
      }
    },
    async getScramble() {
      const scramble = await randomScrambleForEvent("333");
      this.scramble = scramble.toString();
      this.updateTwistyPlayer();
    },
    updateTwistyPlayer() {
      const twistyPlayer = this.$refs.twistyPlayer;
      twistyPlayer.alg = this.scramble;
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
  <div className="container min-w-full grid grid-cols-3">
    <div v-if="isRunning" class="dark-overlay">
    </div>
    <div className="container ml-10 pr-6">
      <button
        className="btn btn-outline mb-4"
        @click="resetTimes"
        :disabled="isRunning"
      >
        Reset Times
      </button>
      <h2 v-if="times.length > 0" className="text-lg mb-1">Times:</h2>
      <div>
        <ul>
          <li v-for="(time, index) in times" :key="index">
            {{ time.time }} seconds - {{ time.scramble }}
          </li>
        </ul>
      </div>
    </div>
    <div className="container span-2 min-w-full flex flex-col items-center">
      <div className="mb-6">
        <h1 className="text-2xl">{{ scramble }}</h1>
      </div>
      <h2 className="text-5xl mt-40" v-if="!isInspection && !isRunning">
        Inspection:
      </h2>
      <h2 className="text-5xl mt-40 z-10" v-if="isRunning || isInspection">
        Time:
      </h2>
      <h2 className="text-5xl mb-40 z-10">{{ elapsedTime }} seconds</h2>
      <div className="my-4">
        <button className="btn w-20" @click="plus2" :disabled="isRunning">
          +2
        </button>
        <button className="btn w-20" @click="dnf" :disabled="isRunning">
          DNF
        </button>
      </div>
      <twisty-player
        ref="twistyPlayer"
        background="none"
        controlPanel="none"
        visualization="2D"
      ></twisty-player>
    </div>
  </div>
</template>
