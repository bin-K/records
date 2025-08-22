import { createApp } from 'vue'
import router from './router'
import UedPlus from '@ued/ued-plus'
import './style.css'
import App from './App.vue'

createApp(App).use(UedPlus).use(router).mount('#app')
