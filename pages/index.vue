<template>
  <div class="relative overflow-hidden bg-gray-950">
    <!-- Blurred Gradient Backgrounds -->
    <div class="absolute top-0 left-0 w-72 h-72 bg-blue-600 opacity-50 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
    <div class="absolute bottom-0 right-0 w-80 h-80 bg-yellow-500 opacity-30 rounded-full filter blur-3xl translate-x-1/3 translate-y-1/3"></div>

    <!-- Hero Section -->
    <section class="text-white min-h-[100vh] py-10 flex items-center relative z-10">
      <div class="container mx-auto flex flex-col items-center text-center">
        <!-- Hero Content -->
        <div class="max-w-3xl">
          <h1 class="text-6xl font-bold mb-4">
            <span class="text-blue-500">Latinum</span>.ai
          </h1>
          <h2 class="text-4xl font-semibold mb-6">Payments for Internet of Agents</h2>
          <p class="mb-8 text-lg text-gray-300">
            Latinum.ai enables seamless agent-to-agent (A2A) and business-to-agent (B2A) payments, fully compatible with MCP servers for secure and efficient financial transactions.
          </p>
        </div>
        <div class="mt-10">
          <span class="inline-block bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-sm">Built on <span class="text-yellow-500">Anthropic MCP</span></span>
        </div>
      </div>
    </section>

    <!-- Agentic AI Event Section -->
    <section class="bg-gray-900 text-white py-12 relative z-10">
      <div class="container mx-auto text-center">
        <h3 class="text-3xl font-bold mb-4">Upcoming Event: Agentic AI in Dublin</h3>
        <p class="text-lg">Stay tuned for our Agentic AI event happening on 24 March in Dublin.</p>
        <p class="text-lg mb-6">Join our WhatsApp group to stay updated!</p>
        <a href="https://chat.whatsapp.com/Ever8ohOJRE3D6r5bLPViQ" target="_blank" class="inline-block px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition duration-300">
          Join WhatsApp Group
        </a>
      </div>
    </section>
  </div>
</template>

<script setup>
import Subscribe from '@/components/Subscribe.vue';
</script>
