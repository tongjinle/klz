
import request from '@/util/request.js'

// get请求方式示例
export function getApi(data){
    return request({
        url: '/sug',
        method: 'get',
        params: data
    })
}

// post请求方式示例
export function postApi(data){
    return request({
        url: '',
        method: 'post',
        data
    })
}

// get请求方式示例   拼接参数
export function getApiPingJie(data){
    return request({
        url: '' + '/' + data,
        method: 'get',
    })
}
