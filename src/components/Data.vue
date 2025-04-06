<script setup>
import { ref, onMounted, onBeforeMount, computed } from "vue";

import { calculateAverage } from "../composables/calcAvg";
import TimeList from "./TimeList.vue";

import annotationPlugin from 'chartjs-plugin-annotation';

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
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
);

const props = defineProps({
  session: Object,
  times: Array,
});

const lineFilter = ref(0);
const screenWidth = ref(window.innerWidth);

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
  const plusTwo = props.times.filter((time) =>
    time.time.includes("(+)")
  ).length;
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

const completeTimes = computed(() => {
  return props.times.length - dnfs.value - plusTwos.value;
});

const labels = computed(() => {
  return props.times.slice(-lineFilter.value).map((time) => {
    const date = new Date(time.solved_at);
    let label =
      date.getHours() +
      ":" +
      date.getMinutes() +
      " " +
      date.getDate() +
      "/" +
      date.getMonth() +
      "/" +
      date.getFullYear();
    return label;
  });
});

const lineData = computed(() => {
  const times = props.times.slice(-lineFilter.value);

  return {
    labels: labels.value,
    datasets: [
      {
        label: "Normal",
        data: times.map((time) =>
          time.time.includes("(+)") || time.time === "DNF" ? null : parseTime(time.time)
        ),
        backgroundColor: "#03e3fc",
        borderColor: "#03e3fc",
      },
      {
        label: "+2",
        data: times.map((time) =>
          time.time.includes("(+)") ? parseTime(time.time) : null
        ),
        backgroundColor: "#eb8f34",
        borderColor: "#eb8f34",
        pointStyle: "triangle",
        pointRadius: 6,
      },
      {
        label: "DNF",
        data: times.map((time) => (time.time === "DNF" ? 0 : null)),
        backgroundColor: "#ff0000",
        borderColor: "#ff0000",
        pointStyle: "cross",
        pointRadius: 6,
      },
    ],
  };
});


const lineOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: "white",
      },
    },
    annotation: {
      annotations: {
        line1: {
          type: "line",
          yMin: 10,
          yMax: 10,
          borderColor: "white",
          borderWidth: 2,
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
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

const pieData = computed(() => ({
  labels: ["Normal","+2s", "DNFs"],
  datasets: [
    {
      label: "Count",
      data: [completeTimes.value, plusTwos.value,  dnfs.value],
      backgroundColor: ["#03e3fc", "#eb8f34", "#ff0000", ],
      borderColor: ["#03e3fc", "#eb8f34", "#ff0000"],
    },
  ],
}));

const pieOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: "white",
      },
    },
    title: {
      display: true,
      text: "Solve Type Count",
      color: "white",
      font: {
        size: 20,
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

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", updateScreenWidth);
});

onBeforeMount(() => {
  window.removeEventListener("resize", updateScreenWidth);
});
</script>

<template>
  <div
    className="container min-w-full grid lg:grid-cols-3 sm:grid-cols-1"
  >
    <div className="container lg:col-span-2 flex flex-col items-center">
      <p>Total Solves: {{ totalSolves }}</p>
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
      <Line :data="lineData" :options="lineOptions" className="mt-8" />
      <div className="w-full mt-10 lg:w-1/2">
        <Doughnut
          :data="pieData"
          :options="pieOptions"
          className="justify-self-center mt-4"
        />
      </div>
    </div>

    <div className="flex">
      <div className="lg:fixed p-6">
        <p>Average of last 5: {{ getAverage(5) }}</p>
        <p>Average of last 12: {{ getAverage(12) }}</p>
        <p>Average of last 50: {{ getAverage(50) }}</p>
        <p>All Time Average: {{ getAverage(totalSolves) }}</p>
        <p className="mt-4">DNF Rate {{ dnfRate.toFixed(2) }}%</p>
        <p>+2 Rate {{ plusTwoRate.toFixed(2) }}%</p>
        <h2 className="text-lg mt-6">Times:</h2>
        <TimeList className="overflow-y-auto h-96" :times="times" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
