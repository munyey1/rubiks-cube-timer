<style scoped></style>

<template>
  <div className="container min-w-full grid grid-cols-3 mt-10">
    <div className="container col-span-2 flex flex-col items-center">
      <p>Best Time: {{ bestTime() }} seconds</p>
      <p>Worst Time: {{ worstTime() }} seconds</p>
      <div className="dropdown dropdown-hover">
        <div tabIndex={0} className="btn m-1" role="button">Filter Times</div>
        <ul
          tabIndex={0} className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          <li><a @click="changeLineFilter('All')">All</a></li>
          <li><a @click="changeLineFilter(100)">Last 100</a></li>
          <li><a @click="changeLineFilter(50)">Last 50</a></li>
          <li><a @click="changeLineFilter(12)">Last 12</a></li>
          <li><a @click="changeLineFilter(5)">Last 5</a></li>
        </ul>
      </div>
      <p>{{ lineFilter }}</p>
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

const lineFilter = ref("All");
const changeLineFilter = (filter) => {
  lineFilter.value = filter;
};

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
  return props.times.map((time) => {
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
  return props.times.map((time) => parseTime(time.time));
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
        text: "Time",
        font: {
          size: 20,
        },
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: "Date",
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