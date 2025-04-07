<script setup>
import { computed } from "vue";

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
import { Doughnut } from "vue-chartjs";

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
);

const props = defineProps({
  times: Array,
});

const dnfs = computed(() => {
  return props.times.filter((time) => time.time === "DNF").length;
});

const plusTwos = computed(() => {
  return props.times.filter((time) => time.time.includes("(+)")).length;
});


const completeTimes = computed(() => {
  return props.times.length - dnfs.value - plusTwos.value;
});

const doughnutData = computed(() => ({
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

const doughnutOptions = {
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
</script>

<template>
  <Doughnut
    :data="doughnutData"
    :options="doughnutOptions"
  />
</template>
