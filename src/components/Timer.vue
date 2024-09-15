<style scoped>
.dark-overlay {
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
import { supabase } from "../supabase";

/*
  how to code +2 and dnf?

  maybe add another column to the table for +2 and dnf?
  ^this might be redundant

  when the user presses either, im gonna have to get the latest solve and update it.
  not sure, i could just get a single solve and update it through ordering the ids
  https://supabase.com/docs/reference/javascript/order
  ^this is probably the best way to do it

  for cstimer, a +2 is time+2(+) 
  i could just add 2 to the time and have a +2 flag

  as for dnf, i could just have a dnf flag, then if the user presses dnf, i could just set the time to DNF
*/

export default {
  props: {
    session: Object,
  },
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
    async getLastTime() {
      const { data, error } = await supabase
        .from("solves")
        .select("*")
        .eq("user_id", this.session.user.id)
        .order("id", { ascending: false })
        .limit(1);
      if (error) {
        console.error("Error fetching last time", error);
      } else {
        return data;
      }
    },
    async getTimes() {
      const { data, error } = await supabase
        .from("solves")
        .select("*")
        .eq("user_id", this.session.user.id);
      if (error) {
        console.error("Error fetching times", error);
      } else {
        this.times = data;
      }
    },
    async insertTimes() {
      const { error } = await supabase
        .from("solves")
        .insert([
          {
            user_id: this.session.user.id,
            time: this.elapsedTime,
            scramble: this.scramble,
          },
        ]);
      if (error) {
        console.error("Error inserting times", error);
      }
    },
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
      this.insertTimes();
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
      const time = this.times[this.times.length - 1].time;
      if (time == "DNF") {
        return;
      } else {
        const plustwo = Number(time);
        time = (plustwo + 2).toFixed(2);
        time += "(+)";
        console.log(this.getLastTime());
        const solve = this.getLastTime();
        console.log(solve);
      }
    },
    dnf() {
      this.times[this.times.length - 1].time = "DNF";
      const solve = this.getLastTime();
      console.log(solve);
    },
    calculateAverage(num) {
      if (this.times.length < num) {
        return "N/A";
      } else {
        // Get the last n times
        // Remove the max and min times
        // Calculate the average of the remaining times
        const times = this.times.slice(-num);
        const max = Math.max(
          ...times.map((time) => {
            if (time.time.includes("(+)")) {
              return time.time.replace("(+)", "");
            }
            if (time.time == "DNF") {
              return 0;
            }
            return time.time;
          })
        );
        const min = Math.min(
          ...times.map((time) => {
            if (time.time.includes("(+)")) {
              return time.time.replace("(+)", "");
            }
            if (time.time == "DNF") {
              return 0;
            }
            return time.time;
          })
        );
        const sum = times.reduce((acc, time) => {
          if (time.time.includes("(+)")) {
            const plus2 = time.time.replace("(+)", "");
            return acc + Number(plus2);
          }
          if (time.time == "DNF") {
            return acc;
          }
          return acc + Number(time.time);
        }, 0);
        console.log(sum, max, min, times.length - 2);
        const average = ((sum - max - min) / (times.length - 2)).toFixed(2);
        return average;
      }
    },
  },
  mounted() {
    window.addEventListener("keyup", this.onUpEvent);
    this.getScramble();
    this.getTimes();
  },
  beforeUnmount() {
    window.removeEventListener("keyup", this.onUpEvent);
  },
};
</script>

<template>
  <div className="container min-w-full grid grid-cols-3 mt-10">
    <div
      v-if="isRunning || (!isInspection && !isRunning)"
      class="dark-overlay"
    ></div>
    <div className="container ml-10 pr-6">
      <button
        className="btn btn-outline mb-4"
        @click="resetTimes"
        :disabled="isRunning"
      >
        Reset Times
      </button>
      <h2 className="span-2 text-lg">
        Average of last 5: {{ calculateAverage(5) }}
      </h2>
      <h2 className="span-2 text-lg">
        Average of last 12: {{ calculateAverage(12) }}
      </h2>
      <h2 className="span-2 text-lg mt-10 ">Times:</h2>
      <div className="span-2 pr-20 overflow-y-scroll max-h-80">
        <ol className="list-decimal list-inside">
          <li v-for="(time, index) in times" :key="index">
            {{ time.time }} seconds - {{ time.scramble }}
          </li>
        </ol>
      </div>
    </div>
    <div className="container flex flex-col items-center">
      <h1 className="text-2xl mb-6">{{ scramble }}</h1>
      <h2 className="text-5xl mt-36 z-10" v-if="!isInspection && !isRunning">
        Inspection:
      </h2>
      <h2 className="text-5xl mt-36 z-10" v-if="isRunning || isInspection">
        Time:
      </h2>
      <h2 className="text-5xl mb-28 z-10">{{ elapsedTime }} seconds</h2>
      <div className="my-4">
        <button className="btn w-20" @click="plus2" :disabled="isRunning">
          +2
        </button>
        <button className="btn w-20" @click="dnf" :disabled="isRunning">
          DNF
        </button>
      </div>
    </div>
    <div className="container flex-col items-center place-content-center mt-20">
      <twisty-player
        ref="twistyPlayer"
        background="none"
        controlPanel="none"
        visualization="2D"
      ></twisty-player>
    </div>
  </div>
</template>
