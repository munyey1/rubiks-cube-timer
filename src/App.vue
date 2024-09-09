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
import { onMounted, ref } from "vue";
import { supabase } from "./supabase";

import Account from "./components/Account.vue";
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

// https://supabase.com/docs/reference/javascript/auth-signinwithoauth use oauth instead
// will use google, and there should be an automatic verification
// i assume this is creating a session for the user, so the user will just get redirected to the timer page
// i'll check if the timer loads up correctly through oauth, but if i need another page for the timer then so be it

</script>

<template>
  <div v-if="session" className="font-mono container min-w-full max-h-full flex flex-col items-center">
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
  <div v-else class="container" style="padding: 50px 0 100px 0">
    <Auth />
  </div>
</template>

