<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <h2 @click="routerToTest1">test1</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
    <div class="theme-chalk">
      <h2>{{ message }}</h2>
      <el-input type="text" size="mini" v-model="message"></el-input>
      <el-button type="primary">123</el-button>
    </div>
    
    <div class="router">
      <router-link to="/father">父子组件传参  --  插件封装</router-link>
      <router-link to="vuexDemo">vuex 状态管理工具 dome</router-link>
      <router-link to="forClick">v-for循环   点击事件  </router-link>
      <router-link to="digui">  递归  </router-link>
      <router-link to="forClass">v-for循环   添加不同类名  </router-link>
      <router-link to="jquery">   vue引入jquery使用  </router-link>
      <router-link to="orgChart">   组织架构图  </router-link>
      <router-link to="qrcode">   二维码  </router-link>
      <router-link to="QRCode2">   二维码2  </router-link>
      <router-link to="mockTest">   本地接口mock数据测试  </router-link>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      message: "theme-chalk",
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted () {
    let aaa = document.getElementsByTagName('h2');
    // console.log(aaa)
  },
  methods: {
    routerToTest1(){
      this.$router.push({path:'/father',query:{id:'我是大傻子'}})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>


.hello{
  margin: 0 auto;
  padding: 200px 0;
  font-size: 16px;
  .router{
    margin: 20px;
    a {
      margin: 20px;
    }
  }
  .theme-chalk{
    width: 200px;
    margin: 30px auto;
  }
  .el-input__inner{
    width: 120px;
  }
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
