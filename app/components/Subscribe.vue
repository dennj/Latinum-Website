<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useFetch } from '#app'

// Validation schema
const schema = v.object({
    email: v.pipe(v.string(), v.email('Please enter a valid email address')),
})

type Schema = v.InferOutput<typeof schema>

// State
const state = reactive<Schema>({
    email: '',
})

// Handle form submission
async function onSubmit(event: FormSubmitEvent<Schema>) {
    const { error } = await useFetch('/api/send-email', {
        method: 'POST',
        body: {
            email: event.data.email,
            message: "This guy want to subscribe to our newsletter!",
        },
    })


    if (error.value) {
        toast.error('Subscription failed. Please try again.')
        return
    }

    toast.success('Subscribed successfully!')
    state.email = ''
}
</script>

<template>
    <section class="p-16 text-white">
        <div class="container mx-auto max-w-xl">
            <div class="bg-zinc-800 bg-opacity-70 p-6 rounded-2xl shadow-md backdrop-blur-md">

                <h3 class="text-2xl font-bold mb-4 text-center">Subscribe</h3>

                <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
                    <UFormField label="Email Address" name="email">
                        <UInput v-model="state.email" type="email" placeholder="you@example.com"
                            class="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500" />
                    </UFormField>

                    <div class="flex justify-center">
                        <UButton type="submit"
                            class="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full text-white font-semibold transition">
                            Subscribe
                        </UButton>
                    </div>
                </UForm>
            </div>
        </div>
    </section>
</template>