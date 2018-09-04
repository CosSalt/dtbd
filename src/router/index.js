import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const activeForm = () => import('@/components/activeForm/index.vue')
import theHome from '@/views/theHome.vue'
import test from '@/views/test.vue'
import anKaList from '@/components/anKaList/demo.vue'
import formList from '@/components/formList/demo.vue'
import formInfo from '@/components/formInfo/demo.vue'
import anKaForm from '@/components/anKaForm/demo.vue'

const routes = [
  {path:'/', component: theHome, name: 'theHome'},
  {path:'/test', component: test, name: 'test'},
  {path:'/activeForm', component: activeForm, name: 'activeForm'},
  {path:'/anKaList', component: anKaList, name: 'anKaList'},
  {path:'/formList', component: formList, name: 'formList'},
  {path:'/formInfo', component: formInfo, name: 'formInfo'},
  {path:'/anKaForm', component: anKaForm, name: 'anKaForm'},
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