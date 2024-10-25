import { onBeforeUnmount, onMounted, ref, watch } from "vue";

export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

export function useColorScheme() {
  const theme = ref<ThemeMode>(ThemeMode.Light);

  const checkColorScheme = (event?: MediaQueryListEvent) => {
    const isDarkMode = event ? event.matches : window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme.value = isDarkMode ? ThemeMode.Dark : ThemeMode.Light;
  };

  onMounted(() => {
    checkColorScheme();
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', checkColorScheme);

    onBeforeUnmount(() => {
      darkModeMediaQuery.removeEventListener('change', checkColorScheme);
    });
  });

  return theme;
}
