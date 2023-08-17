

// import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/Login.vue'

import Home from '../components/home/home.vue'
import son1 from '../components/home/son/son1.vue'
import son2 from '../components/home/son/son2.vue'
import son3 from '../components/home/son/son3.vue'
import order from '../components/home/son/order.vue'

import welcome from '../components/welcome.vue'

const routes = [
    {
        name: "login",
        path: "/login",
        component: Login,
    },
    {
        name: "home",
        path: "/home",
        redirect:"/welcome",
        component: Home,
        children: [
            {
                path:'/welcome',
                component: welcome
              
            },
            {
                path: '/son1',//默认显示页路径
                name: 'son1',
                component: son1, 
              },
              {
                path: '/son2',
                name: 'son2',
                component: son2, 
              },
              {
                path: '/order',
                name: 'order',
                component: order, 
              },

        ]
    },

]
export default routes;
