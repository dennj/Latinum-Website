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
                Enjoy <strong>pizza, beer, and soft drinks</strong> courtesy of
                <a href="https://jentic.com" class="text-blue-400 underline">Jentic</a> and Qualtrics.
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

                <!-- FormKit Form -->
                <FormKit type="form" @submit="register" submit-label="Request a Ticket"
                    :submit-attrs="{ inputClass: 'bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md transition' }">
                    <!-- Email -->
                    <FormKit type="email" name="email" label="Email" validation="required|email"
                        validation-visibility="live" placeholder="Enter your email" outer-class="mb-4"
                        input-class="p-3 border border-gray-600 rounded-md bg-gray-700 text-white w-full"
                        messages-class="text-red-500 text-sm mt-1" />

                    <!-- Company Name -->
                    <FormKit type="text" name="company" label="Company Name" validation="required"
                        validation-visibility="live" placeholder="Enter your company name" outer-class="mb-4"
                        input-class="p-3 border border-gray-600 rounded-md bg-gray-700 text-white w-full"
                        messages-class="text-red-500 text-sm mt-1" />

                    <!-- Role -->
                    <FormKit type="text" name="role" label="Role" validation="required" validation-visibility="live"
                        placeholder="Your Role" outer-class="mb-4"
                        input-class="p-3 border border-gray-600 rounded-md bg-gray-700 text-white w-full"
                        messages-class="text-red-500 text-sm mt-1" />

                    <!-- LinkedIn -->
                    <FormKit type="url" name="linkedin" label="LinkedIn Profile URL starting with https://"
                        validation="required|url" validation-visibility="live" placeholder="LinkedIn Profile URL"
                        outer-class="mb-4"
                        input-class="p-3 border border-gray-600 rounded-md bg-gray-700 text-white w-full"
                        messages-class="text-red-500 text-sm mt-1" />

                    <!-- AI/Agent Work -->
                    <FormKit type="textarea" name="aiProject" label="What are you building in the AI/Agent space?"
                        validation="required" placeholder="Describe your project..." outer-class="mb-4"
                        input-class="p-3 border border-gray-600 rounded-md bg-gray-700 text-white w-full h-24"
                        messages-class="text-red-500 text-sm mt-1" />

                    <!-- Networking Preferences -->
                    <FormKit type="textarea" name="networkingPreferences"
                        label="What kind of people would you like to meet at the event?" validation="required"
                        placeholder="Describe the type of people you’d like to connect with..." outer-class="mb-4"
                        input-class="p-3 border border-gray-600 rounded-md bg-gray-700 text-white w-full h-24"
                        messages-class="text-red-500 text-sm mt-1" />
                </FormKit>

                <p class="text-gray-300 text-md mt-6">
                    An AI will match attendees based on their background and interests to suggest the best people to
                    connect with!
                </p>
            </div>
        </div>
    </section>
</template>

<script setup>
import { useSupabaseClient } from '#imports';
import { useRouter } from 'vue-router';

const supabase = useSupabaseClient();
const router = useRouter();

// Register function using FormKit
const register = async ({ email, company, role, linkedin, aiProject, networkingPreferences }) => {
    const { error } = await supabase
        .from("registered")
        .insert([{ email, company, role, linkedin, aiProject, networkingPreferences }]);

    if (error) {
        console.error("Supabase Error:", error.message);
        alert("Registration failed. Email might already be registered.");
    } else {
        alert("Thank you for registering! We will get back to you by email.");
        router.push("/");
    }
};
</script>
