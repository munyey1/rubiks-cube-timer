<style scoped></style>

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
    inspection(){
      this.startTime = 12;
      this.timer = setInterval(() => {
        this.elapsedTime = (this.startTime -= 0.01)
          .toFixed(2)
          .toString();
        if(this.startTime <= 0) {
          clearInterval(this.timer);
          this.isInspection = false;
        }
        this.isInspection = false;
      }, 10);
    },
    start() {
      if (!this.isRunning) {
        this.isStopped = false;
        this.isRunning = true;
        this.startTime = Date.now() - this.elapsedTime * 1000;
        this.timer = setInterval(() => {
          this.elapsedTime = ((Date.now() - this.startTime) / 1000)
            .toFixed(2)
            .toString();
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
        if(this.isInspection) {
          this.inspection();
        }
        if (this.isStopped) {
          this.resetTimer();
        }
        if (this.isRunning) {
          this.stop();
          this.getScramble();
          this.times.push({ time: this.elapsedTime, scramble: this.scramble });
        } else if(!this.isRunning && !this.isInspection) {
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
    <div className="container ml-10 pr-6">
      <h2 v-if="times.length > 0" className="mb-2">Times:</h2>
      <div>
        <ul>
          <li v-for="(time, index) in times" :key="index">
            {{ time.time }} seconds - {{ time.scramble }}
          </li>
        </ul>
      </div>
    </div>
    <div className="container span-2 min-w-full flex flex-col items-center">
      <h1 className="text-2xl">Scramble:</h1>
      <div className="mb-6">
        <h1 className="text-2xl">{{ scramble }}</h1>
      </div>
      <twisty-player
        ref="twistyPlayer"
        background="none"
        controlPanel="none"
        visualization="2D"
      ></twisty-player>
      <div>
        <h2 className="text-2xl my-2" >Time: {{ elapsedTime }} seconds</h2>
      </div>
      <div className="my-2">
        <button className="btn" @click="plus2" :disabled="isRunning">+2</button>
        <button className="btn" @click="dnf" :disabled="isRunning">DNF</button>
      </div>
      <div className="mb-4">
        <button
          className="btn btn-outline"
          @click="resetTimes"
          :disabled="isRunning"
        >
          Reset Times
        </button>
      </div>
    </div>
  </div>
</template>
