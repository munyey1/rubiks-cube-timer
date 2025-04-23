<script setup>
import { ref, onMounted, onBeforeMount } from "vue";

import TimeList from "./TimeList.vue";
import ScrambleDisplay from "./ScrambleDisplay.vue";

import { calculateAverage } from "../composables/index";
import { useScramble } from "../composables/useScramble";
import { useSolveManager } from "../composables/useSolveManager";

const props = defineProps({
  session: Object,
});

const startTime = ref(0);
const elapsedTime = ref("0.00");
const timer = ref(null);
const isRunning = ref(false);
const isStopped = ref(true);
const isInspection = ref(true);
const is3D = ref(true);

const { scramble, getScramble, updateTwistyPlayer } = useScramble();
const { times, getTimes, insertTimes, plus2, dnf } = useSolveManager(
  props.session.user.id
);

const inspection = () => {
  startTime.value = 15;
  timer.value = setInterval(() => {
    elapsedTime.value = (startTime.value -= 0.01).toFixed(2).toString();
    isInspection.value = false;
    if (startTime.value <= 0) {
      clearInterval(timer.value);
      stop();
    }
  }, 10);
};

const start = () => {
  isStopped.value = false;
  isRunning.value = true;
  startTime.value = Date.now() - elapsedTime.value * 1000;
  timer.value = setInterval(() => {
    elapsedTime.value = ((Date.now() - startTime.value) / 1000)
      .toFixed(2)
      .toString();
  }, 10);
};

const stop = () => {
  isStopped.value = true;
  isRunning.value = false;
  isInspection.value = true;

  const date = new Date(Date.now()).toISOString();

  times.value.push({
    time: elapsedTime.value,
    solved_at: date,
    scramble: scramble.value,
  });

  clearInterval(timer.value);
  insertTimes(isStopped.value, elapsedTime.value, scramble.value).then(() => {
    refreshScramble();
  });
};

const onUpEvent = (event) => {
  if (event.code === "Space") {
    if (isStopped.value && isInspection.value) {
      inspection();
    }
    if (!isStopped.value && !isInspection.value) {
      stop();
    }
    if (isStopped.value && !isInspection.value) {
      elapsedTime.value = "0.00";
      clearInterval(timer.value);
      start();
    }
  }
};

const calAvg = (num) => {
  return calculateAverage(num, times.value);
};

const smTouch = () => {
  if (isStopped.value && isInspection.value) {
    inspection();
  }
  if (!isStopped.value && !isInspection.value) {
    stop();
  }
  if (isStopped.value && !isInspection.value) {
    elapsedTime.value = "0.00";
    clearInterval(timer.value);
    start();
  }
};

const changeScramble = () => {
  getScramble();
};

const toggle3D = () => {
  is3D.value = !is3D.value;
};

const refreshScramble = async () => {
  await getScramble();
  updateTwistyPlayer();
};

onMounted(() => {
  getTimes();
  refreshScramble();
  window.addEventListener("keyup", onUpEvent);
});

onBeforeMount(() => {
  window.removeEventListener("keyup", onUpEvent);
});
</script>

<template>
  <div className="container min-w-full grid lg:grid-cols-3 sm:grid-cols-1">
    <div
      v-if="isRunning || (!isInspection && !isRunning)"
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10"
    ></div>
    <ScrambleDisplay
      :scramble="scramble"
      :is3D="is3D"
      @toggle-3d="toggle3D"
      @update-twisty-player="updateTwistyPlayer"
    />
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-6">{{ scramble }}</h1>
      <h2 className="text-5xl mt-36 z-10" v-if="!isInspection && !isRunning">
        Inspection:
      </h2>
      <h2
        className="text-5xl lg:mt-36 mt-20 z-10"
        v-if="isRunning || isInspection"
      >
        Time:
      </h2>
      <h2 @click="smTouch" className="text-5xl mb-28 z-10 cursor-pointer">
        {{ elapsedTime }} seconds
      </h2>
      <button
        className="btn mt-4"
        @click="changeScramble"
        :disabled="isRunning"
      >
        Change Scramble
      </button>
      <div className="mt-12">
        <button className="btn w-20" @click="plus2" :disabled="isRunning">
          +2
        </button>
        <button className="btn w-20" @click="dnf" :disabled="isRunning">
          DNF
        </button>
      </div>
    </div>
    <div className="flex items-center">
      <div className="p-6">
        <p>Average of last 5: {{ calAvg(5) }}</p>
        <p>Average of last 12: {{ calAvg(12) }}</p>
        <p className="text-lg mt-10 ">Times:</p>
        <TimeList className="overflow-y-auto h-96" :times="times" />
      </div>
    </div>
  </div>
</template>
