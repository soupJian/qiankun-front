<template>
  <div id="app">
    <div class="layout-header">
      <div class="logo">QIANKUN-FRONT</div>
      <ul class="qiankun-micro">
        <li v-for="item in microApps" 
            :class="{active: item.name === current}" 
            :key="item.name" 
            @click="goto(item)">{{ item.name }}</li>
      </ul>
      <div>
        <span @click="changeName">
          {{user? user.name : ''}}
        </span>
        <span>{{user && user.age ? user.age : ''}}</span>
      </div>
    </div>
    <div id="container"></div>
  </div>
</template>

<script>
import microApps from './mirco-apps'
import actions from './action'
export default {
  data(){
    return {
      microApps,
      current: 'vue'
    }
  },
  computed:{
    user(){
      return this.$store.state.user || null
    }
  },
  methods:{
    goto(item){
      this.current = item.name
      history.pushState(null, item.activeRule, `/${item.name}`)
    },
    changeName(){
      // 修改全局信息
      actions.setGlobalState({
        user: {
          name: this.user.name == '张三' ? '李四' : '张三'
        }
      })
    }
  },
}
</script>

<style lang="less">
html, body{
  margin: 0 !important;
  padding: 0;
}
.layout-header{
  height: 50px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  line-height: 50px;
  display: flex;
  font-family: '微软雅黑';
  .logo {
    margin: 0 50px;
    font-size: 16px;
    color: #000;
  }
  .qiankun-micro {
    list-style: none;
    margin: 0;
    display: flex;
    li{
      list-style: none;
      display: inline-block;
      padding: 0 20px;
      cursor: pointer;
      font-size: 16px;
      color: #000 ;
      &.active{
        color: #42b983;
        text-decoration: underline;
      }
    }
  }
  .userinfo{
    position: absolute;
    right: 100px;
    top: 0;
  }
}
</style>
