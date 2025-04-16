<template>
  <div class="relative overflow-hidden bg-gray-950">
    <!-- Blurred Gradient Backgrounds -->
    <div class="absolute top-0 left-0 w-72 h-72 bg-blue-500 opacity-25 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

    <!-- Hero Section -->
    <section class="text-white min-h-[100vh] py-16 flex items-center relative z-10">
      <div class="container mx-auto flex flex-col items-center text-center">
        <!-- Hero Content -->
        <div class="max-w-3xl">
          <h1 class="text-6xl font-bold mb-4">
            <span class="text-blue-500">Latinum</span>.ai
          </h1>
          <!-- Mission Statement -->
          <p class="text-xl text-gray-300 italic mb-4">
            “We believe conversations shouldn’t end in answers — they should end in action.”
          </p>
          <p class="text-lg text-blue-400 font-semibold mb-8">
            Latinum is the connection between AI agents and the real-world economy.
          </p>

          <p class="text-gray-400 mb-10">
            We power transactions between personal AI agents and real-world sellers — including service search & orchestration, catalog access, identity, payment, rating and communication.
          </p>
        </div>

        <!-- Backers -->
        <div class="mt-12 flex flex-col items-center w-full max-w-6xl">
          <h3 class="text-base font-semibold text-white">Backed by</h3>
          <div class="mt-4 flex space-x-8">
            <NuxtImg src="/images/dpl.avif" alt="DogPatch Labs" class="h-12" draggable="false" />
            <NuxtImg src="/images/ndrc.avif" alt="NDRC" class="h-12" draggable="false" />
            <a href="https://agentstxt.dev">
              <span class="inline-block bg-gray-800 text-green-500 px-3 py-1 rounded-full text-sm">agent.txt</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="min-h-[100vh] py-20 relative overflow-hidden">
      <!-- Blurred Background -->
      <div class="absolute top-40 right-20 w-80 h-80 bg-yellow-400 opacity-10 rounded-full filter blur-[100px]"></div>

      <div class="container mx-auto">
        <h3 class="text-4xl font-bold text-white text-center mb-4">
          Built for the <span class="text-blue-500">Internet of Agents</span>
        </h3>
        <p class="text-center text-gray-300 mb-12">
          Safe, fast, and autonomous transactions between AI agents and the services they trust.
        </p>

        <!-- Feature Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title"
            class="bg-gray-800 bg-opacity-70 p-6 rounded-xl shadow-lg backdrop-blur-md hover:scale-105 transition-transform duration-300">
            <h4 class="text-xl font-semibold text-white">{{ feature.title }}</h4>
            <p class="text-gray-300 mt-2">{{ feature.description }}</p>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="text-center mt-16">
          <p class="text-gray-400 mb-4">Start offering your service to personal AI agents — and be part of the next wave of commerce.</p>
          <a href="mailto:dennj.osele@gmail.com"
            class="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition">
            Join the Seller Network
          </a>
        </div>
      </div>
    </section>
  </div>
  <Subscribe />
</template>

<script setup>
const features = [
  { title: 'Agent-Native Wallet', description: 'Identity, payment, location, and approval flows for AI agents.' },
  { title: 'Merchant Wallet', description: 'One integration for catalog, identity, payment, and fulfillment.' },
  { title: 'Trust & Orchestration', description: 'Built-in engine to route requests based on geography, price, and reliability.' },
  { title: 'Seamless Integration', description: 'Allow trasnsactions with Claude and ChatGPT and wraps around existing seller APIs.' },
  { title: 'No Human UI Required', description: 'Optimized for agent-to-service communication with no front-end needed.' },
  { title: 'Real-World Business Ready', description: 'Built to support e-commerce, ride-hailing, food delivery, and service providers with online bookings.' },
];
</script>
