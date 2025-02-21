<script setup>
import { ref } from "vue";

const props = defineProps({
  time: Object,
});

const modalRef = ref(null);

const showModal = ref(false);

const toggleModal = () => {
  showModal.value = !showModal.value;
  console.log(showModal.value);
};

</script>

<template>
  <div v-if="props.time">
    <div class="card">
      <div class="card-content">
        <p>{{ time.time }} seconds</p>
        <p>Scramble - {{ time.scramble }}</p>
      </div>
    </div>
    <button class="btn" @click="toggleModal">More Details</button>

    <dialog ref="modalRef" v-if="showModal" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">{{ time.time }} seconds</h3>
        <p class="py-4">Press ESC key or click outside to close</p>
        <p>Solved at - {{ time.solved_at }}</p>
        <twisty-player
          background="none"
          controlPanel="none"
          visualization="2D"
          :alg="time.scramble"
        ></twisty-player>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="toggleModal">close</button>
      </form>
    </dialog>
  </div>
</template>

<style scoped></style>
