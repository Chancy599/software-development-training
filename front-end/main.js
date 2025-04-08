import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'

// 响应式全局变量（Vue2）
Vue.prototype.$globalData = Vue.observable({
  username: '',
  gender: '',
  contact_information: '',
  belong_information: [],
  manage_information: [],
  belongInfo_name: [],
  manageInfo_name: []
})

const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import { reactive } from 'vue'

export function createApp() {
  const app = createSSRApp(App)
  
  // 响应式全局变量（Vue3）
  app.config.globalProperties.$globalData = reactive({
    username: '',
    gender: '',
    contact_information: '',
    belong_information: [],
    manage_information: [],
    belongInfo_name: [],
    manageInfo_name: []
  })

  return { app }
}
// #endif