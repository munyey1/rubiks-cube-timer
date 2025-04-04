<script setup>
import { supabase } from '../supabase';

const loginWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) {
    console.error('Error logging in:', error.message);
  } else {
    console.log('Login successful:', data);
  }
};

</script>

<template>
  <div class="flex flex-col items-center">
    <button @click="loginWithGoogle" class="btn btn-primary">Sign in with Google</button>
  </div>
</template>

<style scoped>
</style>