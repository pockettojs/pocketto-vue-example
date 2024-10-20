import { onDocChange, QueryBuilder, type BaseModel } from 'pocketto';
import type { ModelStatic } from 'pocketto/dist/src/definitions/Model';
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

export function useRealtimeList<T extends BaseModel>(type: ModelStatic<T>, config: {
  condition?: (query: QueryBuilder<T>) => QueryBuilder<T>;
  order?: "asc" | "desc";
  orderBy?: keyof T;
  disableAutoAppend?: boolean;
} = {}) {
  const {
    condition = (query) => query.orderBy('createdAt', 'desc'),
    order,
    orderBy,
    disableAutoAppend,
  } = config;
  const data = ref<Array<T>>([]);
  const changedDoc = ref<T | undefined>(undefined);

  const handleDocChange = async (id: string) => {
    if (!(data.value instanceof Array)) return;
    const doc = await new type().getClass().query().find(id) as T;
    const sameModelType = new type().cName === doc.cName;
    if (!sameModelType) return;
    changedDoc.value = doc;
  };

  onMounted(async () => {
    const docs = await condition(new type().getClass().query() as unknown as QueryBuilder<T>).get();
    data.value = docs as T[];
  });

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

      const sortBy = orderBy || 'createdAt';
      data.value.sort((a: any, b: any) => {
        if (a[sortBy] > b[sortBy]) {
          return order === "asc" ? 1 : -1;
        }
        if (a[sortBy] < b[sortBy]) {
          return order === "asc" ? -1 : 1;
        }
        return 0;
      });
    }
  });

  return data;
}