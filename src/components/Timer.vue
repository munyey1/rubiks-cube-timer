<script setup>
import { ref, onMounted, onBeforeMount } from "vue";

import { randomScrambleForEvent } from "https://cdn.cubing.net/v0/js/cubing/scramble";
import { supabase } from "../supabase";

import { calculateAverage } from "../composables/calcAvg";

const props = defineProps({
  session: Object,
  times: Array,
});

const startTime = ref(0);
const elapsedTime = ref("0.00");
const timer = ref(null);
const scramble = ref("");
const isRunning = ref(false);
const isStopped = ref(true);
const isInspection = ref(true);

const getLastTime = async () => {
  const { data, error } = await supabase
    .from("solves")
    .select("*")
    .eq("user_id", props.session.user.id)
    .order("id", { ascending: false })
    .limit(1);
  if (error) {
    console.error("Error fetching last time", error);
  } else {
    return data;
  }
};

const getTimes = async () => {
  const { data, error } = await supabase
    .from("solves")
    .select("*")
    .eq("user_id", props.session.user.id);
  if (error) {
    console.error("Error fetching times", error);
  } else {
    for (let i = 0; i < data.length; i++) {
      props.times.push(data[i]);
    }
  }
};

const insertTimes = async () => {
  const { error } = await supabase.from("solves").insert([
    {
      user_id: props.session.user.id,
      time: elapsedTime.value,
      scramble: scramble.value,
    },
  ]);
  if (error) {
    console.error("Error inserting times", error);
  }
};

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
  const date = new Date(Date.now()).toISOString();
  getScramble();
  props.times.push({
    time: elapsedTime.value,
    solved_at: date,
    scramble: scramble.value,
  });
  insertTimes();
  isStopped.value = true;
  isRunning.value = false;
  isInspection.value = true;
  clearInterval(timer.value);
};

const resetTimes = () => {
  props.times = [];
};

const plus2 = async () => {
  const time = props.times[props.times.length - 1].time;
  if (time == "DNF") {
    return;
  } else {
    // Add 2 seconds to the last time
    // Format: time + 2(+)
    // Update the time in the database
    const plustwo = Number(time);
    props.times[props.times.length - 1].time = (plustwo + 2).toFixed(2);
    props.times[props.times.length - 1].time += "(+)";
    const solve = await getLastTime();
    const { error } = await supabase
      .from("solves")
      .update({
        time: props.times[props.times.length - 1].time,
        plus_two: true,
      })
      .eq("id", solve[0].id);
    if (error) {
      console.error("Error updating plus two", error);
    }
  }
};

const dnf = async () => {
  props.times[props.times.length - 1].time = "DNF";
  const solve = await getLastTime();
  const { error } = await supabase
    .from("solves")
    .update({ time: "DNF", dnf: true })
    .eq("id", solve[0].id);
  if (error) {
    console.error("Error updating DNF", error);
  }
};

const getScramble = async () => {
  const scrmblObj = await randomScrambleForEvent("333");
  scramble.value = scrmblObj.toString();
  updateTwistyPlayer();
};

const updateTwistyPlayer = () => {
  const twistyPlayer = document.querySelector("twisty-player");
  twistyPlayer.alg = scramble.value;
};

onMounted(() => {
  getTimes();
});

onBeforeMount(() => {
  window.addEventListener("keyup", onUpEvent);
  getScramble();
});

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
  return calculateAverage(num, props.times);
};
</script>

<template>
  <div className="container min-w-full grid grid-cols-3 mt-10">
    <div
      v-if="isRunning || (!isInspection && !isRunning)"
      class="dark-overlay"
    ></div>
    <div
      className="container flex-col items-center place-content-center mt-20 ml-20 "
    >
      <twisty-player
        ref="twistyPlayer"
        background="none"
        controlPanel="none"
        visualization="2D"
        scramble=""
      ></twisty-player>
    </div>
    <div className="container flex flex-col items-center">
      <h1 className="text-2xl mb-6">{{ scramble }}</h1>
      <h2 className="text-5xl mt-36 z-10" v-if="!isInspection && !isRunning">
        Inspection:
      </h2>
      <h2 className="text-5xl mt-36 z-10" v-if="isRunning || isInspection">
        Time:
      </h2>
      <h2 className="text-5xl mb-28 z-10">{{ elapsedTime }} seconds</h2>
      <div className="my-14">
        <button className="btn w-20" @click="plus2" :disabled="isRunning">
          +2
        </button>
        <button className="btn w-20" @click="dnf" :disabled="isRunning">
          DNF
        </button>
      </div>
    </div>
    <div className="container ml-10 pr-6">
      <p>Average of last 5: {{ calAvg(5) }}</p>
      <p>Average of last 12: {{ calAvg(12) }}</p>
      <p className="span-2 text-lg mt-10 ">Times:</p>
      <div className="span-2 mr-20 overflow-y-scroll max-h-80">
        <ol className="list-decimal list-inside">
          <ul
            className="pb-2"
            v-for="(time, index) in times.slice().reverse()"
            :key="index"
          >
            <p>{{ times.length - index }}.</p>
            <p>{{ time.time }} seconds</p>
            <p>Scramble - {{ time.scramble }}</p>
          </ul>
        </ol>
      </div>
      <button
        className="btn btn-outline mt-4"
        @click="resetTimes"
        :disabled="isRunning"
      >
        Reset Times
      </button>
    </div>
  </div>
</template>

<style scoped>
.dark-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.z-10 {
  z-index: 10;
}
</style>
