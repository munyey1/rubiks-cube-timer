<style scoped></style>

<template>
  <div className="container min-w-full grid grid-cols-3 mt-10">
    <div className="container col-span-2 flex flex-col items-center">
      <p>Best Time: {{ bestTime() }} seconds</p>
      <p>Worst Time: {{ worstTime() }} seconds</p>
      <Line :data="lineData" :options="options" className="ml-4"/>
      <button className="btn btn-outline mt-4" @click="test">View More Insights</button>
    </div>

    <div className="container ml-10">
      <p>Average of last 5: {{ calculateAverage(5) }}</p>
      <p>Average of last 12: {{ calculateAverage(12) }}</p>
      <p>Average of last 50: {{ calculateAverage(50) }}</p>
      <h2 className="text-lg mt-10 ">Times:</h2>
      <div className="mr-20 overflow-y-scroll max-h-80">
        <ol className="list-decimal list-inside">
          <li className="pb-2" v-for="(time, index) in times" :key="index">
            <p>{{ time.time }} seconds</p>
            <p>Scramble - {{ time.scramble }}</p>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import { calculateAverage } from "../composables/calcAvg";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default {
  props: {
    session: Object,
    times: Array,
  },
  components: {
    Bar,
    Line,
  },
  data() {
    return {
      lineData: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{ data: [40, 39, 10, 40, 39, 80, 40, 20, 40, 50, 60, 50], backgroundColor: "#FFFFFF", borderColor: "#FF0000" }],
      },
      testData: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{ data: [40, 39, 10, 40, 39, 80, 40, 20, 40, 50, 60, 50], backgroundColor: "#FFFFFF", borderColor: "#FF0000" }],
      },
      options: {
        responsive: true,
        plugins: {
          legend:{
            display: false,
          }
        },
      },
    };
  },
  methods: {
    calculateAverage(num) {
      return calculateAverage(num, this.times);
    },
    bestTime() {
      const parseTime = (time) => {
        if (time.includes("(+)")) {
          return Number(time.replace("(+)", ""));
        } else if (time === "DNF") {
          return Infinity;
        }
        return time;
      };
      const times = this.times.map((time) => parseTime(time.time));

      const bestTime = Math.min(...times);

      return bestTime === Infinity ? null : bestTime;
    },
    worstTime() {
      const parseTime = (time) => {
        if (time.includes("(+)")) {
          return Number(time.replace("(+)", ""));
        } else if (time === "DNF") {
          return -Infinity;
        }
        return time;
      };
      const times = this.times.map((time) => parseTime(time.time));

      const worstTime = Math.max(...times);
      return worstTime === -Infinity ? null : worstTime;
    },
    test() {
      const date = new Date(Date.now()).toISOString();
      console.log(this.times);
      console.log(date)
    },  
  },
};
</script>
 

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