<script setup lang="ts">
import linkedinIcon from '~/assets/linkedin.svg';
import whatsappIcon from '~/assets/whatsapp.svg';
import Subscribe from '@/components/Subscribe.vue';
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

import { useRouter } from 'vue-router';

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
    <header>
      <div class="navbar bg-gray-950 text-white">
        <div class="flex-1">
          <a href="/" class="btn btn-ghost normal-case text-2xl">
            <span class="text-blue-500">Latinum</span>AI
          </a>
          <p v-if="user" class="text-lg">Hello, {{ user.user_metadata.full_name || 'Agent' }}!</p>
        </div>
        <div class="flex-none">
          <div class="dropdown dropdown-end md:hidden">
            <label tabindex="0" class="btn btn-ghost btn-circle">
              <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </label>
            <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 rounded-box w-52 bg-gray-800">
              <li v-for="link in navLinks" :key="link.path">
                <a :href="link.path">
                <!-- {{ link.name }} -->  
                </a>
              </li>
            </ul>
          </div>

          <ul class="menu menu-horizontal px-4 hidden md:flex">
            <li v-for="link in navLinks" :key="link.path">
              <!-- <a :href="link.path" class="hover:text-primary">{{ link.name }}</a> -->  
            </li>
          </ul>
        </div>
      </div>
    </header>

    <!-- Dynamic Page Content -->
    <main class="flex-grow">
      <NuxtPage />
    </main>

    <!-- Global Footer -->
    <footer class="bg-gray-950 text-white">
      <!-- Upper Bar -->
      <div class="py-5">
        <div class="container mx-auto flex items-center justify-between">
          <p class="text-lg font-bold"><span class="text-blue-500">Latinum</span>.ai</p>
          <div class="flex space-x-6">
            <a href="https://linkedin.com/company/latinum-ai" target="_blank"
              class="flex items-center space-x-2 text-white hover:text-primary">
              <img :src="linkedinIcon" alt="LinkedIn Button" class="w-7 h-7 filter invert" />
              <span>LinkedIn</span>
            </a>
            <a href="https://chat.whatsapp.com/Ever8ohOJRE3D6r5bLPViQ" target="_blank"
              class="flex items-center space-x-2 text-white hover:text-primary">
              <img :src="whatsappIcon" alt="WhatsApp Button" class="w-5 h-5 filter invert" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
  <Subscribe />
</template>
