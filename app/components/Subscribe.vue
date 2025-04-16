<template>
    <!-- Subscribe Banner -->
    <div class="fixed bottom-0 left-0 w-full p-4 bg-blue-950 bg-opacity-80 backdrop-blur-sm text-white shadow-lg transition-transform duration-500 z-[1000]"
        :class="{ 'translate-y-0': showBanner, 'translate-y-full': !showBanner }">
        <div class="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div class="md:mr-6">
                <h1 class="text-xl font-bold">Stay Updated!</h1>
                <p class="text-gray-200">Subscribe to receive updates on the latest developments in agentic payments.
                </p>
            </div>
            <div class="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                <input v-model="email" type="email" placeholder="Enter your email"
                    class="p-2 border rounded-md text-white w-full md:w-auto">
                <button @click="subscribe"
                    class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Subscribe</button>
            </div>
        </div>

        <!-- Close Button -->
        <button @click="hideBanner" class="absolute top-2 right-2 text-gray-400 hover:text-gray-200">&times;</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { useSupabaseClient } from '#imports';

const supabase = useSupabaseClient();
const showBanner = ref(false);
const email = ref("");
const hasSubscribed = useLocalStorage("hasSubscribedLatinum", false);

// Show the banner on page load if user hasn't subscribed
onMounted(() => {
    if (!hasSubscribed.value) {
        setTimeout(() => {
            showBanner.value = true;
        }, 1000);
    }
});

// Hide banner function
const hideBanner = () => {
    showBanner.value = false;
};

// Subscribe function (Saves to Supabase)
const subscribe = async () => {
    if (!email.value || !validateEmail(email.value)) {
        alert("Please enter a valid email!");
        return;
    }

    const { data, error } = await supabase
        .from("subscribers")
        .insert([{ email: email.value }]);

    if (error) {
        console.error("Supabase Error:", error.message);
        alert("Subscription failed. Email might already be subscribed.");
    } else {
        alert("Thank you for subscribing!");
        hasSubscribed.value = true; // Prevents showing banner again
        hideBanner();
    }
};

// Email validation function
const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
};
</script>
