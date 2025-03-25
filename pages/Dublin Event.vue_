<template>
    <section class="bg-gray-900 text-white py-16 flex items-center justify-center min-h-screen relative z-10">
        <div class="container mx-auto text-center px-6 max-w-4xl">
            <h3 class="text-4xl font-bold mb-6">AI Agent Demo Night Mar 2025, Dublin</h3>
            <p class="mb-8 text-left  text-gray-300 leading-relaxed">
                📅 5:30–8:30pm, March 24th, 2025<br>
                📍 Qualtrics, Costello House, 1 Clarendon Row, Dublin 2, D02 TA43, Ireland<br>
                🆓 Free tickets
            </p>

            <p class="mb-4 text-left text-gray-300 leading-relaxed">
                Come along to this AI agent demo night to see what other people are building, enjoy some pizza and a
                drink or two, and maybe even jump up on stage and show off your own work.
            </p>
            <p class="text-left text-gray-300 leading-relaxed">
                Doors open at <strong>5:30 PM</strong> on Monday, <strong>March 24</strong>. Talks run from <strong>6:00
                    PM - 8:00 PM</strong>.
            </p>

            <p class="mb-4 text-left text-gray-300 leading-relaxed">
                This event is hosted by <strong>Jentic, Latinum AI, and Qualtrics</strong> and will be held at
                <strong>Qualtrics HQ near Stephen's Green</strong>.
            </p>

            <p class="text-left mb-8 text-gray-300 leading-relaxed">
                <strong><a href="https://jentic.com/">Jentic</a></strong> is a Dublin-based tech startup building a
                universal integration layer for AI agents.<br>
                <strong>Latinum AI</strong> is a startup working on an Agentic Payment technology.<br>
                <strong><a href="https://www.qualtrics.com/">Qualtrics</a></strong>, the global leader in experience
                management, leverages AI to uncover insights from vast amounts of data, prioritize actions, and drive
                results, thereby optimizing customer and employee experience outcomes for businesses worldwide.
            </p>

            <p class="text-left mb-8 text-gray-300 leading-relaxed">
                <strong>Important:</strong> This event is exclusively for people building AI agents. It's
                <strong>not</strong> for sales pitches or recruiters (unless you're actively building a recruiter
                agent!). <br>
                We have a hard limit of <strong>60 attendees</strong>.
            </p>

            <div class="mb-10 bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
                <h4 class="text-2xl font-semibold mb-4">Request a Ticket</h4>
                <p class="text-gray-400 text-md mb-6">
                    Due to limited space, we will select participants based on their AI involvement.
                </p>

                <!-- FormKit Form -->
                <FormKit type="form" @submit="register" submit-label="Request a Ticket"
                    :submit-attrs="{ inputClass: 'bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md transition' }"
                    class="space-y-4">
                    <!-- Email -->
                    <FormKit type="email" name="email" label="Email" validation="required|email"
                        placeholder="Enter your email" outer-class="mb-4"
                        input-class="p-3 border border-gray-600 rounded-md bg-gray-700 text-white w-full"
                        messages-class="text-red-500 text-sm mt-1" />

                    <!-- Company Name -->
                    <FormKit type="text" name="company" label="Company Name" validation="required"
                        placeholder="Enter your company name" outer-class="mb-4"
                        input-class="p-3 border border-gray-600 rounded-md bg-gray-700 text-white w-full"
                        messages-class="text-red-500 text-sm mt-1" />

                    <!-- Role -->
                    <FormKit type="text" name="role" label="Role" validation="required" placeholder="Your Role"
                        outer-class="mb-4"
                        input-class="p-3 border border-gray-600 rounded-md bg-gray-700 text-white w-full"
                        messages-class="text-red-500 text-sm mt-1" />

                    <!-- LinkedIn -->
                    <FormKit type="url" name="linkedin" label="LinkedIn Profile URL (starting with https://)"
                        validation="required|url" placeholder="LinkedIn Profile URL" outer-class="mb-4"
                        input-class="p-3 border border-gray-600 rounded-md bg-gray-700 text-white w-full"
                        messages-class="text-red-500 text-sm mt-1" />

                    <!-- AI/Agent Work -->
                    <FormKit type="textarea" name="aiProject" label="What are you building in the AI/Agent space?"
                        validation="required" placeholder="Describe your project..." outer-class="mb-4"
                        input-class="p-3 border border-gray-600 rounded-md bg-gray-700 text-white w-full h-24"
                        messages-class="text-red-500 text-sm mt-1" />

                    <!-- Networking Preferences -->
                    <FormKit type="textarea" name="networkingPreferences"
                        label="What kind of people would you like to meet at the event? Provide a detailed description, and we will match you with the most relevant people." validation="required"
                        placeholder="Describe the type of people you’d like to connect with..." outer-class="mb-4"
                        input-class="p-3 border border-gray-600 rounded-md bg-gray-700 text-white w-full h-24"
                        messages-class="text-red-500 text-sm mt-1" />
                </FormKit>

                <p class="text-gray-300 text-md mt-6">
                    An AI will match attendees based on their background and interests to suggest the best people to
                    connect with!
                </p>
            </div>

            <!-- Google Maps Embed -->
            <div class="mb-8">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2518.6248988037037!2d-6.265011323268773!3d53.34061117228763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNTPCsDIwJzI2LjIiTiA2wrAxNSc0NC44Ilc!5e1!3m2!1sit!2sie!4v1741908281671!5m2!1sit!2sie"
                    class="w-full h-80 rounded-lg" style="border:0;" allowfullscreen="" loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"></iframe>
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
