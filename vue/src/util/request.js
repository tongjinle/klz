import axios from 'axios';
import { Message } from 'element-ui'
import Vue from 'vue';
import { getToken ,getApi} from './requestFuntion';

Vue.components = { Message }
let Url = process.env.BASE_API
// 创建一个axios实例
const service = axios.create({
  baseURL: Url,
  timeout: 15000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    config.headers = {
      'Content-Type': 'application/json',
    } 
    
    // 每个请求都携带 token
    if(getToken()){
      config.headers['token'] = getToken();
    }
    // 切换api路径
    // console.log(config.url)
    // console.log(config.baseURL)
    // let inter = config.url.replace(config.baseURL,'');
    // let inter = config.url;
    // let newApi = getApi(inter);
    // config.baseURL = newApi;
    // config.url  = newApi+inter;
    return config;
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)


// 反应器
service.interceptors.response.use(
  response => {
    if(response.data.code == 0){
      return response.data
    }else if(response.data.code == 4){
      Message({
        message: response.data.msg,
        type: 'success',
      });
      return {};
    }else{
      Message({
        message: response.data.msg,
        type: 'error',
      });
      return {};
    }
  },
  error => {
    let tip = error.message;
    if(error.message === 'Network Error') tip = '网络错误，请稍后再试';
    if(error.message.indexOf('timeout') !== -1) tip = '请求超时，请稍后再试';
    Message({
      message: tip,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
