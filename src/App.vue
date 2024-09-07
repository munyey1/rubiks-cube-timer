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

// auth through magic link instead
// https://supabase.com/docs/reference/javascript/auth-admin-generatelink
// i think do this in auth.vue. 
// change signinwithotp with generateLink

// use verifyotp to get the session instead here
// https://supabase.com/docs/guides/auth/auth-email-passwordless?queryGroups=language&language=js scroll a bit down 


</script>

<template>
  <!--
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
  -->
  <div class="container" style="padding: 50px 0 100px 0">
    <Account v-if="session" :session="session" />
    <Auth v-else />
  </div>
</template>

