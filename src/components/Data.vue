<script setup>
import { ref } from "vue";

import LineFilter from "./charts/LineFilter.vue";
import LineChart from "./charts/LineChart.vue";
import DoughnutChart from "./charts/DoughnutChart.vue";
import SummaryStats from "./SummaryStats.vue";
import TimeList from "./TimeList.vue";

const props = defineProps({
  session: Object,
  times: Array,
});

const lineFilter = ref(0);
</script>

<template>
  <div className="container min-w-full grid lg:grid-cols-3 sm:grid-cols-1">
    <div className="container lg:col-span-2 flex flex-col items-center">
      <LineFilter v-model="lineFilter" className="mt-2" />
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
        <SummaryStats className="mt-4" :times="props.times" />
        <h2 className="text-lg mt-6">Times:</h2>
        <TimeList className="overflow-y-auto h-96" :times="times" />
      </div>
    </div>
  </div>
</template>
