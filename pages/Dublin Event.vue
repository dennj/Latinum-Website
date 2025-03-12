<template>
    <!-- Agentic AI Event Section -->
    <section class="bg-gray-900 text-white py-12 relative z-10 flex items-center justify-center min-h-[100vh]">
        <div class="container mx-auto text-center px-6">
            <h3 class="text-3xl font-bold mb-4">Upcoming Event: Agentic AI in Dublin</h3>
            <p class="text-lg mb-6">
                Join us on <strong>March 24</strong> at the <strong>Qualtrics Dublin office</strong> (5:30 PM onwards)
                for an exciting event on AI Agents.
            </p>

            <p class="mb-2">
                Enjoy <strong>pizza, beer, and soft drinks</strong> courtesy of <a href="https://jentic.com"
                    class="text-blue-400 underline">Jentic</a> and Qualtrics.
            </p>
            <p class="mb-6">
                We’ll host <strong>lightning talks, live demos</strong>, and discussions on the latest work with AI
                agents. We’ll confirm the agenda soon, but we plan to include a slot to compare the latest coder agents
                (Claude Coder vs Windsurf vs Cursor), and to talk about MCP and how it can supercharge agents (such as
                Claude Desktop, Cursor, Windsurf, Claude Coder, Manus/Open Manus).
            </p>

            <div class="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-md">
                <h4 class="text-2xl font-semibold mb-4">Request a Ticket</h4>
                <p class="text-gray-300 text-md mb-6">
                    Due to limited space, we will need to select participants.
                </p>

                <div class="flex flex-col gap-6">
                    <!-- Email Input -->
                    <div class="text-left">
                        <label class="block text-gray-400 text-sm mb-1">Email <span class="text-red-500">*</span></label>
                        <input v-model="email" type="email" placeholder="Enter your email"
                            class="p-3 border border-gray-600 rounded-md bg-gray-700 text-white w-full">
                    </div>

                    <!-- Company Name -->
                    <div class="text-left">
                        <label class="block text-gray-400 text-sm mb-1">Company Name <span class="text-red-500">*</span></label>
                        <input v-model="company" type="text" placeholder="Company Name"
                            class="p-3 border border-gray-600 rounded-md bg-gray-700 text-white w-full">
                    </div>

                    <!-- Role -->
                    <div class="text-left">
                        <label class="block text-gray-400 text-sm mb-1">Role <span class="text-red-500">*</span></label>
                        <input v-model="role" type="text" placeholder="Your Role"
                            class="p-3 border border-gray-600 rounded-md bg-gray-700 text-white w-full">
                    </div>

                    <!-- LinkedIn -->
                    <div class="text-left">
                        <label class="block text-gray-400 text-sm mb-1">LinkedIn <span class="text-red-500">*</span></label>
                        <input v-model="linkedin" type="text" placeholder="LinkedIn Profile URL"
                            class="p-3 border border-gray-600 rounded-md bg-gray-700 text-white w-full">
                    </div>

                    <!-- AI/Agent Work -->
                    <div class="text-left">
                        <label class="block text-gray-400 text-sm mb-1">What are you building in the AI/Agent space? <span class="text-red-500">*</span></label>
                        <textarea v-model="aiProject" placeholder="Describe your project..."
                            class="p-3 border border-gray-600 rounded-md bg-gray-700 text-white w-full h-24"></textarea>
                    </div>

                    <!-- Networking Preferences -->
                    <div class="text-left">
                        <label class="block text-gray-400 text-sm mb-1">What kind of people would you like to meet at the event? <span class="text-red-500">*</span></label>
                        <textarea v-model="networkingPreferences"
                            placeholder="Describe the type of people you’d like to connect with..."
                            class="p-3 border border-gray-600 rounded-md bg-gray-700 text-white w-full h-24"></textarea>
                    </div>

                    <p class="text-gray-300 text-md mb-4">
                        An AI will match attendees based on their background and interests to suggest the best people to
                        connect with!
                    </p>

                    <button @click="register"
                        class="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition">
                        Request a Ticket
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { useSupabaseClient } from '#imports';
import { useRouter } from 'vue-router';

const supabase = useSupabaseClient();
const router = useRouter();
const showBanner = ref(false);
const email = ref("");
const company = ref("");
const role = ref("");
const linkedin = ref("");
const aiProject = ref("");
const networkingPreferences = ref("");
const hasRegistered = useLocalStorage("hasRegisteredDublinMarch", false);

// Show the banner on page load if user hasn't registered
onMounted(() => {
    if (!hasRegistered.value) {
        setTimeout(() => {
            showBanner.value = true;
        }, 1000);
    }
});

// Hide banner function
const hideBanner = () => {
    showBanner.value = false;
};

// Register function with Redirect
const register = async () => {
    if (!email.value || !validateEmail(email.value)) {
        alert("Please enter a valid email!");
        return;
    }
    if (!company.value.trim()) {
        alert("Please enter your company name!");
        return;
    }
    if (!role.value.trim()) {
        alert("Please enter your role!");
        return;
    }
    if (!linkedin.value.trim()) {
        alert("Please enter your LinkedIn profile URL!");
        return;
    }
    if (!aiProject.value.trim()) {
        alert("Please describe your AI/Agent work!");
        return;
    }
    if (!networkingPreferences.value.trim()) {
        alert("Please specify what kind of people you’d like to meet!");
        return;
    }

    const { data, error } = await supabase
        .from("registered")
        .insert([{
            email: email.value,
            company: company.value,
            role: role.value,
            linkedin: linkedin.value,
            aiProject: aiProject.value,
            networkingPreferences: networkingPreferences.value
        }]);

    if (error) {
        console.error("Supabase Error:", error.message);
        alert("Registration failed. Email might already be registered.");
    } else {
        alert("Thank you for registering! We will get back to you by email.");
        hasRegistered.value = true; // Prevents showing banner again
        hideBanner();
        router.push("/"); // Redirects to confirmation page
    }
};

// Email validation function
const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
};
</script>
