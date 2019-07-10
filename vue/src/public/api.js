
import _ from 'lodash'
import axios from 'axios'
import ApiList from './api.json'
import Vue from 'vue'
import { Message, MessageBox } from 'element-ui'
import routes from '../router'
Vue.component(MessageBox.name, MessageBox, Message)


const getUrl = (key) => {
    if (typeof ApiList[key] === 'undefined' || ApiList[key] === '') {
        return ''
    }
    var apiConfig = {
        "development": ApiList['dev-config'],
        "testing": ApiList['test-config'],
        "production": ApiList['master-config']
    }
    return apiConfig[process.env.NODE_ENV] + ApiList[key]
}
// 调用微信api
const getUrlWx = (key) =>{
    if (typeof ApiList[key] === 'undefined' || ApiList[key] === '') {
        return ''
    }
    return ApiList[key]
}
const axiosHeaders = (data) => {
    if (data && data !== '') {
        return axios.interceptors.request.use(
            config => {
                config.headers['X-AUTH-TOKEN'] = `${data}`
                return config
            },
            err => {
                return Promise.reject(err)
            })
    }
}

const newFetch = (type, url, data, isJson = false, headerparams) => {
    let param = data;
    param.ajax_login = true;
    let headers = new Headers(),
        body = new FormData();
    headers.append('Authorization',localStorage.getItem("Authorization"))
    if(headerparams){
        headers.append('type',headerparams.num)
    }
    if (!isJson) {
        for (let i in param) {
            body.append(i, param[i])
        }
    } else {
        headers.append('content-type', 'application/json')
        body = JSON.stringify(param)
    }

    return fetch(url, Object.assign({ credentials: "include", method: type }, { headers, body })).then(res => {
        return res.json()
    }).catch(error => {
        Message.error('链接超时，请稍后再试');
    });
}

const post = (state, url, data, dataType,) => {
    // console.log(url)
    const sec = 2000000
    let postData = {}
    let _data = _.assign({}, data)
    if(dataType == 'isJson'){
        postData = data
    }else{
        _.forEach(_data, (val, key) => {
            if (['timeout'].indexOf(key) === -1) {
                postData[key] = val
            }
        })
    }
    if (state === 'get') {
        let idx = 0
        if (postData && postData !== '') {
            for (var key in postData) {
                if (idx === 0) {
                    url += '?' + key + '=' + postData[key]
                } else {
                    url += '&' + key + '=' + postData[key]
                }
                idx++
            }
        }
    }
    let timeout = _data['timeout'] || 10 * sec
    var formData = new FormData();
    if (dataType == "formData") {
        for (var key in postData) {
            formData.append(key, postData[key])
        }

    }
    let promise = new Promise((resove, reject) => {
        return axios({
                method: state,
                url: url,
                data: dataType == "formData" ? formData : postData,
                timeout: timeout,
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("Authorization")
                },
            })
            .then(function(resp) {
                let json = resp.data;
                if (json.code == 20000) {
                    resove(json)
                } else if(json.code == 10005){
                  routes.push({ path: '/login', query:{ source: window.location.pathname }})
                } else {
                    Message.error(json.message || json.messageEnum);
                    reject(json)
                }
            }).catch(function(err) {
                Message.error(err.message);
                reject(err);
            })

    })

    return promise

}


const getCookies = function(name) {
    let cookies = document.cookie.split(';')
    let backVal = ''
    if (cookies.length > 0) {
        cookies.forEach((item, idx) => {
            item = item.split('=')
            let thisName = item[0].replace(/\s/g, '')
            if (thisName === name) {
                backVal = item[1]
            }
        })
        return backVal
    }
}


export default {
    getUrl,
    getUrlWx,
    post,
    newFetch,
    axiosHeaders,
    getCookies,
}