import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
// 注册定制组件
import * as fromComponents from '@/components/activeForm/config/formComponent'
for(let item of Object.values(fromComponents)) {
  Vue.component(item.name, item)
}
Vue.config.productionTip = false
const isDev = process.env.NODE_ENV === 'production'
if (isDev) {
  Vue.config.errorHandler = (err, vm, info) => { // eslint-disable-line
    console.error('err:\n', err) // eslint-disable-line
    console.error('info:\n', info) // eslint-disable-line
  }
}
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')