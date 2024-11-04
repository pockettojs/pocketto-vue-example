<template>
  <tr
    v-motion
    v-if="start"
    :class="['h-full w-full', className]"
    @click="handleClick"
    :initial="{ backgroundColor: color }"
    :enter="{ backgroundColor: '#ffffff' }"
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
import { ThemeMode, useColorScheme } from '@/composables/useColorScheme';
import { computed, ref, watch } from 'vue';

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

const theme = useColorScheme();
const initialColor = ref(theme === ThemeMode.Dark ? '#000000' : '#ffffff');
watch(() => theme.value, (newTheme) => {
  initialColor.value = newTheme === ThemeMode.Dark ? '#000000' : '#ffffff';
});


const handleClick = () => {
  if (props.onClick) props.onClick();
};
</script>
