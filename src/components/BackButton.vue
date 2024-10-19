<template>
  <button 
    class="flex flex-row my-4 text-vue-700 font-medium py-2 px-4 active:scale-90 rounded"
    @click="$emit('click', $event)"
  >
    <chevron-left class="w-5 h-5 inline-block mr-1 mt-0.5" />
    <div>Back</div>
  </button>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import { ChevronLeft } from 'lucide-vue-next';

defineEmits(['click']);
</script>
