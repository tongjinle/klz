
import Vue from 'vue'
import Router from 'vue-router'
import { routes } from './routerIn.js'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes
})

// 判断是否登录
router.beforeEach((to, from, next) => {
  if(localStorage.getItem('token')){
    next();
  }else{
    next();
  }
})

export default router

