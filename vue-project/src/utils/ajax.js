import axios from 'axios'

const ajax = axios.create({
    baseURL: 'http://127.0.0.1:8100/testModel',
    timeout: 10000,
    withCredentials: true
  })

ajax.interceptors.response.use(
    response => {
      //拦截响应，如果发现接口返回400做统一处理跳转到登陆
      if (response.data.code) {
        switch (response.data.code) {
          case 400:
            window.location.href='/login/'
            
        }

      }
      // const headers = response.headers

      return response
    },
    //接口错误状态处理，也就是说无响应时的处理
    error => {
        console.log("Please check your internet connection.");
        console.log(error)
        return Promise.reject(error) // 返回接口返回的错误信息
    })
 

//导出我们建立的axios实例模块，ES6 export用法
export default ajax;