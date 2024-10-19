import { onDocChange, type BaseModel } from 'pocketto';
import type { ModelStatic } from 'pocketto/dist/src/definitions/Model';
import { ref, watch, onMounted, onBeforeUnmount, type Ref } from 'vue';

export function useRealtime<T extends BaseModel>(type: ModelStatic<T>, id?: string) {
  const data = ref<T>(new type() as T);
  const changedDoc = ref<T | undefined>(undefined);

  const handleDocChange = async (newId: string) => {
    const modelName = new type().getClass().collectionName as string + '.';
    newId = newId.replace(modelName, '');
    if (newId !== data.value.id) return;
    const doc = await data.value.getClass().query().find(newId) as T;
    changedDoc.value = doc;
  };

  onMounted(() => {
    const event = onDocChange(handleDocChange);

    onBeforeUnmount(() => {
      event.off('docChange', handleDocChange);
    });
  });

  onMounted(async () => {
    if (id) {
      const doc = await new type().getClass().query().find(id) as T;
      data.value = doc;
    }
  });

  watch(() => id, async (newId) => {
    if (newId) {
      const doc = await new type().getClass().query().find(newId) as T;
      data.value = doc;
    }
  });

  watch(() => changedDoc?.value, (newChangedDoc) => {
    if (newChangedDoc) {
      data.value = newChangedDoc;
    }
  });

  return data as Ref<T>;
}
