<script setup>
import { computed } from "vue";

import { calculateAverage, parseTime } from "../composables/index";

const props = defineProps({
  times: Array,
});

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
  <div>
    <p>Total Solves: {{ totalSolves }}</p>
    <p>Best Time: {{ bestTime() }} seconds</p>
    <p className="mb-4">Worst Time: {{ worstTime() }} seconds</p>
    <p>All Time Average: {{ calculateAverage(totalSolves, props.times) }}</p>
    <p>Average of last 5: {{ calculateAverage(5, props.times) }}</p>
    <p>Average of last 12: {{ calculateAverage(12, props.times) }}</p>
    <p>Average of last 50: {{ calculateAverage(50, props.times) }}</p>
    <p className="mt-4">DNF Rate {{ dnfRate.toFixed(2) }}%</p>
    <p>+2 Rate {{ plusTwoRate.toFixed(2) }}%</p>
  </div>
</template>
