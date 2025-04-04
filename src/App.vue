<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "./supabase";

import Auth from "./components/Auth.vue";
import Login from "./components/Login.vue";
import Timer from "./components/Timer.vue";
import DataComponent from "./components/Data.vue";

const session = ref();
const times = ref([]);

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
  });

  if (window.location.hash.includes("access_token")) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  supabase.auth.onAuthStateChange((_, session) => {
    session.value = session;
  });
});

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Error logging out:", error.message);
  session.value = null;
};
</script>

<template>
  <div
    v-if="session"
    className="font-mono min-h-screen flex flex-col items-center"
  >
    <div
      role="tablist"
      className="container min-w-full mt-6 tabs tabs-bordered"
    >
      <input
        type="radio"
        name="my_tabs_1"
        role="tab"
        className="tab text-xl lg:ml-20 sm:ml-0"
        aria-label="Timer"
        defaultChecked
      />
      <div role="tabpanel" className="tab-content lg:p-10">
        <Timer :session="session" :times="times" />
      </div>

      <input
        type="radio"
        name="my_tabs_1"
        role="tab"
        className="tab text-xl"
        aria-label="Data"
      />
      <div role="tabpanel" className="tab-content lg:p-10">
        <DataComponent :session="session" :times="times" />
      </div>
    </div>
    <div>
      <button className="btn btn-outline mt-8 mb-2" @click="logout">
        Sign out
      </button>
    </div>
  </div>
  <div v-else className="font-mono container flex flex-col items-center mt-80">
    <Login />
  </div>
</template>

<style scoped></style>
