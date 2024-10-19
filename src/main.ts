import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { DatabaseManager, p } from 'pocketto'
import { MotionPlugin } from '@vueuse/motion'

p.setEnvironment('browser');
p.setIdMethod('timestamp');
DatabaseManager.connect('default', {
  dbName: 'default',
}).then(async (localDb) => {
  const remoteDb = await DatabaseManager.connect('http://localhost:5984/test', {
    dbName: 'test',
    adapter: 'http',
    auth: {
      username: 'admin',
      password: 'qwer1234',
    }
  });
  localDb.sync(remoteDb, {
    live: true,
    retry: true,
  });
  p.setRealtime(true);
});

const app = createApp(App)

app.use(MotionPlugin)
app.use(router)

app.mount('#app')
