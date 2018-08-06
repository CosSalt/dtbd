import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const activeForm = () => import('@/components/activeForm/index.vue')
import theHome from '@/views/theHome.vue'
import test from '@/views/test.vue'
const routes = [
  {path:'/', component: theHome, name: 'theHome'},
  {path:'/test', component: test, name: 'test'},
  {path:'/activeForm', component: activeForm, name: 'activeForm'}
]

const router = new Router({
  // mode: 'history',
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes
})

export default router