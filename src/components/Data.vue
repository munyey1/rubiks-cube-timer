<style scoped></style>

<template>
  <div className="container min-w-full grid grid-cols-3 mt-10">
    <div className="container col-span-2 flex flex-col items-center">
      <p>Best Time: {{ bestTime() }} seconds</p>
      <p>Worst Time: {{ worstTime() }} seconds</p>
      <LineChart
        :data="lineData"
        :options="options"
        className="ml-4"
      />
      <button className="btn btn-outline mt-4" @click="updateChart">
        Update Chart
      </button>
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
import LineChart from "./LineChart.vue";

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
import { ref } from "vue";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default {
  props: {
    session: Object,
    times: Array,
  },
  components: {
    Line,
    LineChart,
  },
  data() {
    const parseTime = (time) => {
      if (time.includes("(+)")) {
        return time.replace("(+)", "");
      }
      if (time === "DNF") {
        return 0;
      }
      return time;
    };

    const labels = this.times.map((time) => {
      const date = new Date(time.solved_at);
      return (
        date.getHours() +
        ":" +
        date.getMinutes() +
        " " +
        date.getDate() +
        "/" +
        date.getMonth() +
        "/" +
        date.getFullYear()
      );
    });

    const data = this.times.map((time) => parseTime(time.time));
    return {
      lineData: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: "#FFFFFF",
            borderColor: "#FF0000",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
      newlabel: labels,
      newdata: data,
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
      console.log(date);
      const list = this.times.map((time) => console.log(time.time));
      console.log(this.times);
    },
    updateChart() {
      const parseTime = (time) => {
        if (time.includes("(+)")) {
          return time.replace("(+)", "");
        }
        if (time === "DNF") {
          return 0;
        }
        return time;
      };

      const labelss = this.times.map((time) => {
        const date = new Date(time.solved_at);
        return (
          date.getHours() +
          ":" +
          date.getMinutes() +
          " " +
          date.getDate() +
          "/" +
          date.getMonth() +
          "/" +
          date.getFullYear()
        );
      });

      const datas = this.times.map((time) => parseTime(time.time));

      this.lineData.labels = {
        labels: labelss,
        datasets: [
          ...this.lineData.datasets,
          {
            data: datas,
            backgroundColor: "#FFFFFF",
            borderColor: "#FF0000",
          },
        ],
      };
    },
  },
  mounted() {
    this.updateChart();
  },
};
</script>
