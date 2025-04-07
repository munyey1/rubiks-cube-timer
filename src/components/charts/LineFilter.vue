<script setup>
const model = defineModel();
</script>

<template>
  <div>
    <p>Select Filter</p>
    <select v-model="model">
      <option value="" selected disabled>Please select</option>
      <option value="0">All</option>
      <option value="5">Last 5</option>
      <option value="12">Last 12</option>
      <option value="25">Last 25</option>
      <option value="50">Last 50</option>
      <option value="100">Last 100</option>
    </select>
  </div>
</template>
