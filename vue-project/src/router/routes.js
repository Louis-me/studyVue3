

// import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/Login.vue'

import Home from '../components/home/home.vue'
import suite from '../components/home/son/suite/suite.vue'
import case1 from '../components/home/son/case/case.vue'
import order from '../components/home/son/order.vue'
import welcome from '../components/welcome.vue'
import fuzz from "../components/home/son/fuzz/fuzz.vue"
import ApiLogin from "../components/home/son/api/login.vue"
import ApiTest from "../components/home/son/api/test.vue"
import RealTimeTask from "../components/home/son/task/realTime.vue"
import RealtimeView from "../components/home/son/task/realTimeView.vue"
import TimingTask from "../components/home/son/task/timingTask.vue"
import TimingTaskView from "../components/home/son/task/timingTaskView.vue"
import Report from "../components/home/son/report/report.vue"
import ReportView from "../components/home/son/report/reportView.vue"
import GrapReport from "../components/home/son/report/graphReport.vue"
import ServerLog from "../components/home/son/log/log.vue"
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
                path: '/suite',
                name: 'suite',
                component: suite, 
              },
              {
                path: '/case',
                name: 'case',
                component: case1, 
              },
              {
                path: '/order',
                name: 'order',
                component: order, 
              },
              {
                path: '/fuzz',
                name: 'fuzz',
                component: fuzz, 
              },
              {
                path: '/ApiLogin',
                name: 'ApiLogin',
                component: ApiLogin, 
              },
              {
                path: '/ApiTest',
                name: 'ApiTest',
                component: ApiTest, 
              },
              {
                path: '/RealTimeTask',
                name: 'RealTimeTask',
                component: RealTimeTask, 
              },
              {
                path: '/RealtimeView/:id',
                name: 'RealtimeView',
                component: RealtimeView, 
              },
              {
                path: '/TimingTask:',
                name: 'TimingTask',
                component: TimingTask, 
              },
              {
                path: '/TimingTaskView/:id',
                name: 'TimingTaskView',
                component: TimingTaskView, 
              },
              {
                path: '/Report',
                name: 'Report',
                component: Report, 
              },
              {
                path: '/ReportView/:id',
                name: 'ReportView',
                component: ReportView, 
              },
              {
                path: '/GrapReport',
                name: 'GrapReport',
                component: GrapReport, 
              },
              {
                path: '/ServerLog',
                name: 'ServerLog',
                component: ServerLog, 
              },
        ]
    },

]
export default routes;
