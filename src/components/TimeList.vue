<script setup>
import { ref } from "vue";

const props = defineProps({
  times: Array,
});

const solve_modal = ref(null);
const selectedTime = ref(null);

const showModal = (time) => {
  selectedTime.value = time;
  solve_modal.value?.showModal();
};

const label = (time) => {
  const date = new Date(time);
  return (
    date.getHours() +
    ":" +
    date.getMinutes() +
    " " +
    date.getDate() +
    "/" +
    date.getMonth() +
    "/" +
    date.getFullYear()
  );
};
</script>

<template>
  <div>
    <ol className="list-decimal list-inside">
      <ul
        className="pb-4"
        v-for="(time, index) in times.slice().reverse()"
        :key="index"
      >
        <p>{{ times.length - index }}.</p>
        <p>{{ time.time }} seconds</p>
        <p>Scramble - {{ time.scramble }}</p>
        <button class="btn" @click="showModal(time)">More Details</button>
      </ul>
    </ol>
    <dialog ref="solve_modal" class="modal">
      <div v-if="selectedTime" class="modal-box">
        <h3 class="text-lg font-bold">{{ selectedTime.time }} seconds</h3>
        <p class="py-4">Press ESC key or click outside to close</p>
        <p>Solved at - {{ label(selectedTime.solved_at) }}</p>
        <twisty-player
          background="none"
          controlPanel="none"
          visualization="2D"
          :alg="selectedTime.scramble"
        ></twisty-player>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<style scoped></style>
