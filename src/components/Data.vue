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
} from "chart.js";
import { Line, Bar } from "vue-chartjs";

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

const dnfRate = computed(() => {
  const dnf = props.times.filter((time) => time.time === "DNF").length;
  return (dnf / props.times.length) * 100;
});

const plusTwoRate = computed(() => {
  const plusTwo = props.times.filter((time) => time.time.includes("(+)")).length;
  return (plusTwo / props.times.length) * 100;
});

const dnfs = computed(() => {
  return props.times.filter((time) => time.time === "DNF").length;
});

const plusTwos = computed(() => {
  return props.times.filter((time) => time.time.includes("(+)")).length;
});

const totalSolves = computed(() => {
  return props.times.length;
});

const completeTimes = totalSolves.value - dnfs.value - plusTwos.value;

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
      label: "Solves",
      data: data.value,
      backgroundColor: "#FFFFFF",
      borderColor: "#03e3fc",
    },
  ],
}));

const barData = computed(() => ({
  labels: ["DNFs", "+2s", "Completed"],
  datasets: [
    {
      label: "Solve Type Count",
      data: [dnfs.value, plusTwos.value, completeTimes],
      backgroundColor: "#03e3fc",
    },
  ],
}));

const lineOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: "white",
      },
    },
  },
  scales: {
    x: {
      ticks:{
        color: "white",
      },
      display: true,
      title: {
        display: true,
        text: "Date",
        color: "white",
        font: {
          size: 20,
        },
      },
    },
    y: {
      ticks: {
        color: "white",
      },
      display: true,
      title: {
        display: true,
        text: "Time",
        color: "white",
        font: {
          size: 20,
        },
      },
    },
  },
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: "white",
      },
    },
  },
  scales: {
    x: {
      ticks:{
        color: "white",
      },
      display: true,
      title: {
        display: true,
        text: "DNFs, +2s and Completed Solves",
        color: "white",
        font: {
          size: 20,
        },
      },
    },
    y: {
      ticks: {
        color: "white",
      },
      display: true,
      title: {
        display: true,
        text: "Count",
        color: "white",
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
      <Line :data="lineData" :options="lineOptions" className="ml-4 mt-8" />
      <Bar :data="barData" :options="barOptions" className="ml-4 mt-10" />
    </div>

    <div className="container ml-10">
      <div className="fixed">
        <p>Total Solves: {{ totalSolves }}</p>
        <p>Average of last 5: {{ getAverage(5) }}</p>
        <p>Average of last 12: {{ getAverage(12) }}</p>
        <p>Average of last 50: {{ getAverage(50) }}</p>
        <p className="mt-10">DNF Rate {{ dnfRate.toFixed(2) }}%</p>
        <p>+2 Rate {{ plusTwoRate.toFixed(2) }}%</p>
        <h2 className="text-lg mt-10 ">Times:</h2>
        <div className="mr-20 overflow-y-scroll max-h-96">
          <ol className="list-decimal list-inside">
            <li className="pb-2" v-for="(time, index) in times" :key="index">
              <p>{{ time.time }} seconds</p>
              <p>Scramble - {{ time.scramble }}</p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>