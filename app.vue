<script setup lang="ts">
const user = useSupabaseUser()

useHead({
  title: 'Latinum AI',
  meta: [
    {
      name: 'description',
      content: 'Latinum.ai enables seamless agent-to-agent (A2A) and business-to-agent (B2A) payments, fully compatible with MCP servers for secure and efficient financial transactions.',
    },
    { name: 'theme-color', content: '#0057e7' }
  ],
  htmlAttrs: {
    lang: 'en',
  },
});

const router = useRouter();
const navLinks = router.options.routes
  .filter((route) => route.path !== '/' && !route.path.includes(':'))
  .map((route) => ({
    name: route.name || route.path.replace('/', ''),
    path: route.path,
  }));
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Global Header -->
    <LayoutHeader />

    <!-- Dynamic Page Content -->
    <main class="flex-grow">
      <NuxtPage />
    </main>

    <!-- Global Footer -->
    <LayoutFooter />
  </div>
</template>
