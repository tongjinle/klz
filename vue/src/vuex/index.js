

import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app.js'
import user from './modules/user.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 
    number: '12345678',
    aaaa:true,
    test: '我是action测试',
    items:[
      {
        name:"张三",
        num:"1"
      },
      {
        name:"李四",
        num:"2"
      },
      {
        name:"王五",
        num:"3"
      }
    ]
  },
  mutations: {
    // 
    numChange(state){     //这里的state代表上面的State
      state.items.forEach(item=>{
        item.num+=100
      })
    },
    numberAdd(state){
      state.number+=10
    },
    actionTest(state,param){
      state.test = '我是最新action测试' + param
    },
  },
  actions: {
    // 
    action1({ commit }) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('numberAdd')
          resolve()
        }, 1000)
      })
    },
    action2({ commit }) {
      commit('numberAdd')
      console.log('action2')
    },
    action3 (context,param) {
      context.commit('actionTest',param)
    }
  },
  modules: {
    app,
    user,
  }
});

export default store;