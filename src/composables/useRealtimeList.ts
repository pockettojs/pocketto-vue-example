import { onDocChange, type BaseModel } from 'pocketto';
import type { ModelStatic } from 'pocketto/dist/src/definitions/Model';
import { ref, type Ref, watch, onMounted, onBeforeUnmount } from 'vue';

export function useRealtimeList<T extends BaseModel>(type: ModelStatic<T>, config: {
  value?: Ref<Array<T>>;
  order?: "asc" | "desc";
  orderBy?: keyof T;
  disableAutoAppend?: boolean;
} = {}) {
  const {
    value,
    order,
    orderBy,
    disableAutoAppend,
  } = config;
  const data = ref<Array<T>>(value?.value || []);
  const changedDoc = ref<T | undefined>(undefined);

  watch(() => value?.value, (newData) => {
    data.value = newData as any;
  });

  const handleDocChange = async (id: string) => {
    if (!(data.value instanceof Array)) return;
    const doc = await new type().getClass().query().find(id) as T;
    const sameModelType = new type().cName === doc.cName;
    if (!sameModelType) return;
    changedDoc.value = doc;
  };

  onMounted(() => {
    const event = onDocChange(handleDocChange);

    onBeforeUnmount(() => {
      event.off('docChange', handleDocChange);
    });
  });

  watch(() => changedDoc?.value, (newChangedDoc) => {
    const sameIdIndex = data.value.findIndex((d) => d.id === newChangedDoc.id);
    if (sameIdIndex !== -1) {
      data.value[sameIdIndex] = newChangedDoc;
    } else if (!disableAutoAppend) {
      if (!order || order === "desc") {
        data.value.unshift(newChangedDoc);
      } else if (order === "asc") {
        data.value.push(newChangedDoc);
      }

      if (orderBy) {
        data.value.sort((a: any, b: any) => {
          if (a[orderBy] > b[orderBy]) {
            return order === "asc" ? 1 : -1;
          }
          if (a[orderBy] < b[orderBy]) {
            return order === "asc" ? -1 : 1;
          }
          return 0;
        });
      }
    }
  });

  return data;
}