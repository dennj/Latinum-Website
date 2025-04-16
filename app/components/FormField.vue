<!-- FormField.vue (optional reusable input field) -->
<template>
    <div>
        <div class="font-medium mb-1">{{ label }}</div>
        <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" @blur="onBlur"
            class="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-50 focus:outline-none" />
    </div>
</template>

<script setup>
defineProps(['label', 'modelValue'])
defineEmits(['update:modelValue'])
const onBlur = () => useNuxtApp().$callHook?.('wallet:blur') // optional hook call
</script>