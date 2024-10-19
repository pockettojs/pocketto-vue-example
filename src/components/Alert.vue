<template>
  <div
    v-motion
    v-if="show"
    :duration="500"
    :class="cn(
      'absolute top-4 right-4 px-4 py-2 min-w-[100px] rounded-md font-medium text-white',
      type === 'success' && 'bg-success',
      type === 'error' && 'bg-error',
      type === 'warning' && 'bg-warning',
      type === 'info' && 'bg-info',
      !type && 'bg-info'
    )"
    :initial="{
      opacity: 0,
      y: -200,
    }"
    :enter="{
      opacity: 1,
      y: 0,
    }"
    :leave="{
      opacity: 0,
      y: -200,
    }"
  >
    <div class="flex flex-row">
      <slot name="icon"></slot>
      <div>{{ title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/utils/cn';
import { defineProps } from 'vue';

defineProps<{
  title: string;
  show?: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
}>();

</script>