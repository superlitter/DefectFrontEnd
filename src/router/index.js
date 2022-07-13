import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
  }
]

const router = new VueRouter({
  routes
})

//防止用户未登录就进入主页面
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') {
//     next();
//   } else {
//     let token = sessionStorage.getItem('Authorization');
//     if (token === null || token === '') {
//       next('/login');
//     } else {
//       next();
//     }
//   }
// });

export default router
