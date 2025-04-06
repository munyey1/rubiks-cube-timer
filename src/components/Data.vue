<script setup>
import { ref } from "vue";

import TimeList from "./TimeList.vue";
import LineChart from "./charts/LineChart.vue";
import DoughnutChart from "./charts/DoughnutChart.vue";
import SummaryStats from "./SummaryStats.vue";

const props = defineProps({
  session: Object,
  times: Array,
});

const lineFilter = ref(0);
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
        <SummaryStats :times="props.times" className="mt-4" />
        <h2 className="text-lg mt-6">Times:</h2>
        <TimeList className="overflow-y-auto h-96" :times="times" />
      </div>
    </div>
  </div>
</template>
