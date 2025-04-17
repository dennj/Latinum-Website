<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useFetch } from '#app'


// 1. Schema definition using valibot
const schema = v.object({
  email: v.pipe(v.string(), v.email('Invalid email')),
  message: v.pipe(v.string(), v.minLength(20, 'Must be at least 20 characters')),
})

type Schema = v.InferOutput<typeof schema>

// 2. Form state
const state = reactive<Schema>({
  email: '',
  message: '',
})


// 3. Submission handler
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { error } = await useFetch('/api/send-email', {
    method: 'POST',
    body: {
      email: event.data.email,
      message: event.data.message,
    },
  })

  if (error.value) {
    toast.error('Failed to send message. Please try again.')
    return
  }

  toast.success('Your message has been sent!')
  state.email = ''
  state.message = ''
}
</script>

<template>
  <div class="container mx-auto max-w-2xl">
    <div class="bg-gray-800 bg-opacity-70 p-6 rounded-2xl shadow-lg backdrop-blur-md">
      <h3 class="text-3xl font-bold mb-4 text-center">Get in Touch</h3>

      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <!-- Email Field -->
        <UFormField label="Email" name="email">
          <UInput v-model="state.email" type="email" placeholder="you@example.com"
            class="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500" />
        </UFormField>

        <!-- Message Field -->
        <UFormField label="Message" name="message">
          <UTextarea v-model="state.message" placeholder="Write your message here..." :rows="6"
            class="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500" />
        </UFormField>

        <!-- Submit Button -->
        <div class="flex justify-center pt-2">
          <UButton type="submit"
            class="text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full font-semibold transition-colors">
            Send Message
          </UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>