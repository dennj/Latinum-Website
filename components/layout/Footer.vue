<script setup lang="ts">
import linkedinIcon from '~/assets/linkedin.svg';
import whatsappIcon from '~/assets/whatsapp.svg';
</script>

<template>
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
</template>
