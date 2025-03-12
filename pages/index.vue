<template>
  <div class="relative overflow-hidden bg-gray-950">
    <!-- Blurred Gradient Backgrounds -->
    <div
      class="absolute top-0 left-0 w-72 h-72 bg-blue-500 opacity-25 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2">
    </div>

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
            Latinum.ai enables seamless agent-to-agent (A2A) and business-to-agent (B2A) payments, fully compatible with
            <span class="text-yellow-500">MCP servers</span> for secure and efficient financial transactions.
          </p>
        </div>
        <div class="mt-10">
          <a href="https://agentstxt.dev">
            <span class="inline-block bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-sm">Using
              <span class="text-green-500">agent.txt</span></span>
          </a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="min-h-[100vh] py-20 relative overflow-hidden">
      <!-- Blurred Gradient Background -->
      <div class="absolute top-40 right-20 w-80 h-80 bg-yellow-400 opacity-10 rounded-full filter blur-[100px]">
      </div>

      <div class="container mx-auto">
        <h3 class="text-4xl font-bold text-white text-center mb-4">
          Revolutionize Payments for <span class="text-blue-500">AI Agents</span>
        </h3>
        <p class="text-center text-gray-300 mb-12">
          Safe, fast, and autonomous transactions between agents.
        </p>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature Cards -->
          <div v-for="feature in features" :key="feature.title"
            class="bg-gray-800 bg-opacity-70 p-6 rounded-xl shadow-lg backdrop-blur-md hover:scale-105 transition-transform duration-300">
            <h4 class="text-xl font-semibold text-white">{{ feature.title }}</h4>
            <p class="text-gray-300 mt-2">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Agentic AI Event Section -->
    <section class="bg-gray-900 text-white py-12 relative z-10 flex items-center justify-center min-h-[50vh]">
      <div class="container mx-auto text-center">
        <h3 class="text-3xl font-bold mb-4">Upcoming Event: Agentic AI in Dublin</h3>
        <p class="text-lg">Stay tuned for our Agentic AI event happening on 24 March in Dublin.</p>
        <p class="text-lg mb-6">Join our WhatsApp group to stay updated!</p>
        <a href="https://chat.whatsapp.com/Ever8ohOJRE3D6r5bLPViQ" target="_blank"
          class="inline-block px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition duration-300">
          Join WhatsApp Group
        </a>
      </div>
    </section>
  </div>
</template>

<script setup>
import Subscribe from '@/components/Subscribe.vue';

const features = [
  { title: 'Fully Agentic', description: 'Agents can exchange money autonomously.' },
  { title: 'Secure', description: 'Ensure safe and reliable transactions.' },
  { title: 'Micro-transactions', description: 'Enable microtransactions for less than 1 cent.' },
  { title: 'Seamless Integration', description: 'Easily integrates with MCP servers and existing APIs.' },
  { title: 'Fast Transactions', description: 'Immediate transactions validated by agents themselves.' },
  { title: 'Compliance Automation', description: 'Automated updates for effortless compliance.' },
];
</script>