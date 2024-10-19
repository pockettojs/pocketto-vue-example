import { onDocChange, type BaseModel } from 'pocketto';
import { ref, type Ref, watch, onMounted, onBeforeUnmount } from 'vue';

export function useRealtimeValue<T extends BaseModel>(value: Ref<T>) {
  const data = ref<T>(value.value);
  const changedDoc = ref<T | undefined>(undefined);

  const handleDocChange = async (id: string) => {
    if (id !== data.value.id) return;
    const doc = await data.value.getClass().query().find(id) as T;
    changedDoc.value = doc;
  };

  onMounted(() => {
    const event = onDocChange(handleDocChange);

    onBeforeUnmount(() => {
      event.off('docChange', handleDocChange);
    });
  });

  watch(() => value?.value, async (doc) => {
    data.value = doc;
  });

  watch(() => changedDoc?.value, (newChangedDoc) => {
    if (newChangedDoc) {
      data.value = newChangedDoc;
    }
  });

  return data as T;
}
