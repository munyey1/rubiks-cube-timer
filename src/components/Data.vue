<style scoped></style>

<template>
  <div className="container min-w-full grid grid-cols-3 mt-10">
    <div className="container col-span-2 flex flex-col items-center">
      <p>Best Time: {{ bestTime() }} seconds</p>
      <p>Worst Time: {{ worstTime() }} seconds</p>
      <Line :data="lineData" :options="options" className="ml-4" />
      <button className="btn btn-outline mt-4" @click="updateChart">
        Update Chart
      </button>
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
import { computed } from "vue";
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

const updateChart = () => {
  const labels = props.times.map((time) => {
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

  const data = props.times.map((time) => parseTime(time.time));

  lineData.value = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: "#FFFFFF",
        borderColor: "#FF0000",
      },
    ],
  };
};
</script>
