<template>
  <div class="flex flex-col items-center">
    <button @click="loginWithGoogle" class="btn btn-primary">Sign in with Google</button>
    <GoogleLogin :callback="loginWithGoogle" />
  </div>
</template>

<script setup>
import { GoogleLogin } from 'vue3-google-login';
import { supabase } from '../supabase';

const loginWithGoogle = async (response) => {
  const { credential } = response;

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    idToken: credential,
  });

  if (error) {
    console.error('Error logging in:', error.message);
  } else {
    console.log('Login successful:', data);
  }
};

</script>

<style scoped>
</style>