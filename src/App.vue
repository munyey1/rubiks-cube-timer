<style scoped></style>

<script setup>
import { onMounted, ref } from "vue";
import { supabase } from "./supabase";

import Auth from "./components/Auth.vue";
import Timer from "./components/Timer.vue";

const session = ref();

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
  });
  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session;
  });
});
</script>

<template>
  <div
    v-if="session"
    className="font-mono container min-w-full max-h-full flex flex-col items-center"
  >
    <div
      role="tablist"
      className="container min-w-full mt-6 tabs tabs-bordered"
    >
      <input
        type="radio"
        name="my_tabs_1"
        role="tab"
        className="tab text-xl ml-20"
        aria-label="Timer"
        defaultChecked
      />
      <div role="tabpanel" className="tab-content p-10">
        <Timer :session="session"/>
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
  <div v-else className="font-mono container flex flex-col items-center">
    <Auth />
  </div>
</template>
