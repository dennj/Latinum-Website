<template>
    <div class="relative border border-gray-200 rounded-md p-2 text-center space-y-2">
        <!-- ❌ Remove button (only if removable) -->
        <button v-if="removable" @click="() => onRemove?.(item.id)"
            class="absolute top-1 right-1 text-red-500 hover:text-red-700 text-xs">
            ❌
        </button>

        <img v-if="item.image" :src="item.image" alt="Product image" class="w-full h-20 object-cover rounded" />
        <div class="text-sm font-medium">{{ item.title }}</div>
        <div class="text-xs text-gray-600">€{{ item.price }}</div>
        <div v-if="item.created_at" class="text-xs text-gray-500">
            {{ formattedDate }}
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    item: Object,
    removable: Boolean,
    onRemove: Function,
})

const formattedDate = computed(() => {
    if (!props.item.created_at) return ''
    const date = new Date(props.item.created_at)
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date)
})
</script>