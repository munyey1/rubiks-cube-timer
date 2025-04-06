<script setup>
import { ref, computed } from "vue";

import { calculateAverage, parseTime } from "../composables/index";

import TimeList from "./TimeList.vue";
import LineChart from "./charts/LineChart.vue";
import DoughnutChart from "./charts/DoughnutChart.vue";

const props = defineProps({
  session: Object,
  times: Array,
});

const lineFilter = ref(0);

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

const totalSolves = computed(() => {
  return props.times.length;
});

// Methods
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
  <div className="container min-w-full grid lg:grid-cols-3 sm:grid-cols-1">
    <div className="container lg:col-span-2 flex flex-col items-center">
      <p>Select Filter</p>
      <div>
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
      <LineChart
        :times="props.times"
        :lineFilter="Number(lineFilter)"
        className="mt-2"
      />
      <div className="w-full mt-10 lg:w-1/2">
        <DoughnutChart
          :times="props.times"
          className="justify-self-center mt-4"
        />
      </div>
    </div>

    <div className="flex">
      <div className="lg:fixed p-6">
        <p>Total Solves: {{ totalSolves }}</p>
        <p>Best Time: {{ bestTime() }} seconds</p>
        <p className="mb-4">Worst Time: {{ worstTime() }} seconds</p>
        <p>
          All Time Average: {{ calculateAverage(totalSolves, props.times) }}
        </p>
        <p>Average of last 5: {{ calculateAverage(5, props.times) }}</p>
        <p>Average of last 12: {{ calculateAverage(12, props.times) }}</p>
        <p>Average of last 50: {{ calculateAverage(50, props.times) }}</p>
        <p className="mt-4">DNF Rate {{ dnfRate.toFixed(2) }}%</p>
        <p>+2 Rate {{ plusTwoRate.toFixed(2) }}%</p>
        <h2 className="text-lg mt-6">Times:</h2>
        <TimeList className="overflow-y-auto h-96" :times="times" />
      </div>
    </div>
  </div>
</template>
