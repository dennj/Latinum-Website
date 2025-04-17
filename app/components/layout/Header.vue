<script setup>
const route = useRoute()

const items = computed(() => [
  {
    label: 'Home',
    to: '/',
    active: route.path === '/'
  },
  {
    label: 'Blog',
    to: '/writing',
    active: route.path === '/writing' || route.path.startsWith('/writing/')
  }
])
</script>

<template>
  <header
    class="flex items-center justify-between py-2 px-6 bg-gray-950 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
    <NuxtLink to="/" class="font-semibold text-2xl tracking-tight">
      <span class="text-blue-500">Latinum</span> AI
    </NuxtLink>

    <UNavigationMenu :items="items" class="font-medium text-red" />
  </header>
</template>