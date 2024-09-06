<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

<script setup>
import Timer from "./components/Timer.vue";
</script>

<template>
  <div className="font-mono container min-w-full min-h-full flex flex-col items-center">
    <div role="tablist" className="container min-w-full mt-6 tabs tabs-bordered">
      <input
        type="radio"
        name="my_tabs_1"
        role="tab"
        className="tab text-xl ml-20"
        aria-label="Timer"
        defaultChecked
      />
      <div role="tabpanel" className="tab-content p-10">
        <Timer />
      </div>

      <input
        type="radio"
        name="my_tabs_1"
        role="tab"
        className="tab text-xl"
        aria-label="Data"
      />
      <div role="tabpanel" className="tab-content p-10"></div>
    </div>
  </div>
</template>
