<script setup>
import { computed } from "vue";

import { parseTime } from "../../composables/index";

import annotationPlugin from "chartjs-plugin-annotation";

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
import { Line } from "vue-chartjs";

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
  annotationPlugin
);

const props = defineProps({
  times: Array,
  lineFilter: Number,
});

const labels = computed(() => {
  return props.times.slice(-props.lineFilter).map((time) => {
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
  const times = props.times.slice(-props.lineFilter);

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
          borderDash: [6, 6],
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
</script>

<template>
  <Line
    :data="lineData"
    :options="lineOptions"
  />
</template>
