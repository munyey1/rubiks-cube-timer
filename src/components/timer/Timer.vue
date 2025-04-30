<script setup>
import { ref, onMounted, onBeforeMount } from "vue";

import TimeList from "../TimeList.vue";
import ScrambleDisplay from "./ScrambleDisplay.vue";
import TimerDisplay from "./TimerDisplay.vue";

import { calculateAverage } from "../../composables/index";
import { useScramble } from "../../composables/useScramble";
import { useSolveManager } from "../../composables/useSolveManager";
import { useTimer } from "../../composables/useTimer";

const props = defineProps({
  session: Object,
});

const is3D = ref(true);

const { scramble, getScramble, updateTwistyPlayer } = useScramble();
const { times, getTimes, insertTimes, plus2, dnf } = useSolveManager(
  props.session.user.id
);

const refreshScramble = async () => {
  await getScramble();
  updateTwistyPlayer();
};

const { elapsedTime, timer, isRunning, isStopped, isInspection, inspection, start, stop } =
  useTimer(times, insertTimes, scramble, refreshScramble);

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

const toggle3D = () => {
  is3D.value = !is3D.value;
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
    <TimerDisplay
      :scramble="scramble"
      :isInspection="isInspection"
      :isRunning="isRunning"
      :elapsedTime="elapsedTime"
      @get-scramble="getScramble"
      @plus-2="plus2"
      @dnf="dnf"
      @sm-touch="smTouch"
    />
    <div className="flex items-center">
      <div className="p-6">
        <p>Average of last 5: {{ calculateAverage(5, times) }}</p>
        <p>Average of last 12: {{ calculateAverage(12, times) }}</p>
        <p className="text-lg mt-10 ">Times:</p>
        <TimeList className="overflow-y-auto h-96" :times="times" />
      </div>
    </div>
  </div>
</template>
