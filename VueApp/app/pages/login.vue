<template>
  <div class="hero min-h-[70vh] bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">Hello there</h1>
        <p class="py-6">
          Log in to sync your time entries across all your devices.
        </p>
        <button class="btn btn-primary" @click="login">Continue with Google</button>
        <p class="mt-4 text-sm text-base-content/60">
          (Auth integration coming in Phase 2)
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const login = () => {
  alert('Login flow will be implemented in Phase 2 with Dexie Cloud.');
};
</script>
