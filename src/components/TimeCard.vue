<script setup>

const props = defineProps({
  time: Object,
});

</script>

<template>
  <div>
    <div class="card">
      <div class="card-content">
        <p class="title is-4">{{ time.time }}</p>
        <p class="subtitle is-6">{{ time.scramble }}</p>
        <p class="subtitle is-6">{{ time.solved_at }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
