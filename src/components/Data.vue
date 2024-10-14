<style scoped></style>

<template>
  <div className="container min-w-full grid grid-cols-3 mt-10">
    <div className="container col-span-2 flex flex-col items-center">
      <p>Best Time: {{ bestTime() }} seconds</p>
      <p>Worst Time: {{ worstTime() }} seconds</p>
      <div className="mt-2">
        <select v-model="lineFilter">
          <option value="" selected disabled>Please select</option>
          <option value="0">All</option>
          <option value="5">Last 5</option>
          <option value="12">Last 12</option>
          <option value="25">Last 25</option>
          <option value="50">Last 50</option>
          <option value="100">Last 100</option>
        </select>
      </div>
      <Line :data="lineData" :options="options" className="ml-4" />
    </div>

    <div className="container ml-10">
      <p>Average of last 5: {{ getAverage(5) }}</p>
      <p>Average of last 12: {{ getAverage(12) }}</p>
      <p>Average of last 50: {{ getAverage(50) }}</p>
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

<script setup>
import { computed, ref } from "vue";
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
  scales,
} from "chart.js";
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

const props = defineProps({
  session: Object,
  times: Array,
});

const lineFilter = ref(0);

const parseTime = (time) => {
  if (time.includes("(+)")) {
    return time.replace("(+)", "");
  }
  if (time === "DNF") {
    return 0;
  }
  return time;
};

const labels = computed(() => {
  return props.times.slice(-lineFilter.value).map((time) => {
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
});

const data = computed(() => {
  return props.times
    .slice(-lineFilter.value)
    .map((time) => parseTime(time.time));
});

const lineData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      data: data.value,
      backgroundColor: "#FFFFFF",
      borderColor: "#FF0000",
    },
  ],
}));

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: "Date",
        font: {
          size: 20,
        },
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: "Time",
        font: {
          size: 20,
        },
      },
    },
  },
};

// Methods
const getAverage = (num) => {
  return calculateAverage(num, props.times);
};

const bestTime = () => {
  const parsedTimes = props.times
    .map((time) => parseTime(time.time))
    .filter((t) => t > 0);
  const best = Math.min(...parsedTimes);
  return best === Infinity ? null : best;
};

const worstTime = () => {
  const parsedTimes = props.times.map((time) => parseTime(time.time));
  const worst = Math.max(...parsedTimes);
  return worst === -Infinity ? null : worst;
};
</script>
