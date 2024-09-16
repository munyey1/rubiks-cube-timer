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
TODO:

time to do the data side of the app
https://www.chartjs.org/

### 1. **Average Solve Time**
   - **Insight:** The average solve time for a user over a specific period (last week, month, or all time).
   - **How it helps:** Gives users a baseline for their performance and helps track improvement over time.

### 2. **Best Solve Time**
   - **Insight:** The fastest recorded solve time by a user.
   - **How it helps:** Motivates users by highlighting their personal best performance.

### 3. **Worst Solve Time**
   - **Insight:** The slowest solve time by a user.
   - **How it helps:** Helps users identify when they might have faced challenges and encourages analysis of what went wrong.

### 4. **Median Solve Time**
   - **Insight:** The middle value of all solve times, showing the typical performance (less affected by extreme outliers).
   - **How it helps:** Gives a more accurate representation of a user's usual solving time than the average (especially if they have a few very slow/fast solves).

### 5. **Standard Deviation of Solve Times**
   - **Insight:** The variation in a user's solve times.
   - **How it helps:** A low standard deviation indicates consistent solving times, while a high value shows more variability. This insight helps users understand their consistency.

### 6. **Solves Over Time (Trend Analysis)**
   - **Insight:** Track solve times across a period (e.g., daily, weekly, or monthly trends).
   - **How it helps:** Visualizing improvement over time, which is encouraging and can point out periods where users improved quickly or plateaued.

### 7. **Time to Improvement (Progress Rate)**
   - **Insight:** The number of solves or the amount of time between improvements in personal bests (e.g., time between milestones like reducing solve time by 10 seconds).
   - **How it helps:** Helps users see how quickly they're progressing and motivates them to keep practicing.

### 8. **Top 5 or 10 Solve Times**
   - **Insight:** Display the user’s top 5 or 10 best solve times.
   - **How it helps:** Gives users a quick glance at their top performances, useful for seeing if they're improving their best times over a short or long period.

### 10. **Number of Solves Per Day/Week**
   - **Insight:** The number of solves a user completes in a day or week.
   - **How it helps:** Encourages regular practice and helps identify how practice frequency correlates with improvements.

### 13. **Personal Best Over Time**
   - **Insight:** A chart showing how the user’s personal best has improved over time.
   - **How it helps:** A motivating tool to see improvement over the long term, showing when new personal bests were achieved.

### 14. **Average Time by Time of Day**
   - **Insight:** How solve times vary depending on when the user is solving (morning, afternoon, evening).
   - **How it helps:** Some users might perform better at specific times of the day, allowing them to optimize their practice schedule.

### 15. **DNF (Did Not Finish) Rate**
   - **Insight:** The percentage of solves marked as DNF (if applicable).
   - **How it helps:** Users can track how often they fail to complete a solve, which might indicate if they're taking too many risks or struggling with particular cases.

### 16. **Ao5, Ao12, Ao50 (Average of X Solves)**
   - **Insight:** Average of the best 5, 12, or 50 solves, often excluding outliers (e.g., the fastest and slowest solves).
   - **How it helps:** These are standard metrics used in the speedcubing community, giving users a common way to evaluate their performance.

### 17. **Time Reduction Milestones**
   - **Insight:** A timeline or chart showing when users hit specific time targets (e.g., sub-30, sub-25, sub-20 seconds).
   - **How it helps:** Provides users with clear milestones that motivate them to continue improving.

---

### Implementation Tips:
- Use visualizations (charts, graphs) to display trends, averages, and best times over time.
- Allow users to filter insights by date range (e.g., last 7 days, last 30 days) for better control over their performance analysis.
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
    async plus2() {
      const time = this.times[this.times.length - 1].time;
      if (time == "DNF") {
        return;
      } else {
        // Add 2 seconds to the last time
        // Format: time + 2(+)
        // Update the time in the database
        const plustwo = Number(time);
        this.times[this.times.length - 1].time = (plustwo + 2).toFixed(2);
        this.times[this.times.length - 1].time += "(+)";
        // Use await here to work with promises
        const solve = await this.getLastTime();
        const { error } = await supabase
          .from("solves")
          .update({ time: this.times[this.times.length - 1].time, plus_two: true })
          .eq("id", solve[0].id);
        if (error) {
          console.error("Error updating plus two", error);
        }
      } 
    },
    async dnf() {
      this.times[this.times.length - 1].time = "DNF";
      const solve = await this.getLastTime();
      const { error } = await supabase
        .from("solves")
        .update({ time: "DNF", dnf: true })
        .eq("id", solve[0].id);
      if (error) {
        console.error("Error updating DNF", error);
      }
    },
    calculateAverage(num) {
      if (this.times.length < num) {
        return "N/A";
      } else {
        // Get the last n times
        // Remove the max and min times
        // Calculate the average of the remaining times
        const times = this.times.slice(-num);
        // Get the max time
        // Add plus 2 and dnf checking
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
        // Get the minimum time
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
