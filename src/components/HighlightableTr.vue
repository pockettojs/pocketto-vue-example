<template>
  <tr
    v-motion
    v-if="start"
    :class="['h-full w-full', className]"
    @click="handleClick"
    :initial="{ backgroundColor: color }"
    :enter="{ backgroundColor: initialColor }"
    :leave="{ backgroundColor: color }"
    :delay="500"
  >
    <slot />
  </tr>
  <tr
    v-else
  >
    <slot />
  </tr>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  start: {
    type: Boolean,
    required: true,
  },
  color: {
    type: String,
    default: '#00ff00',
  },
  className: {
    type: String,
    default: '',
  },
  click: {
    type: Function,
  },
});

const initialColor = ref('#ffffff');

const handleClick = () => {
  if (props.onClick) props.onClick();
};
</script>
