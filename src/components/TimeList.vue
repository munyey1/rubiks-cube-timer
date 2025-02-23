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
</script>

<template>
  <div>
    <div className="mr-20 overflow-y-scroll max-h-96">
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
    </div>
    <dialog ref="solve_modal" class="modal">
      <div v-if="selectedTime" class="modal-box">
        <h3 class="text-lg font-bold">{{ selectedTime.time }} seconds</h3>
        <p class="py-4">Press ESC key or click outside to close</p>
        <p>Solved at - {{ selectedTime.solved_at }}</p>
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
