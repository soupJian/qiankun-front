<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>主应用user信息: 
      <span @click="handleChangeMasterInfo">{{ user.name }}</span>
    </h2>
    <p>
      新增主应用年龄属性  <input type="number" v-model="user.age">
    </p>
  </div>
</template>

<script>
import actions from '../actions'//导入实例
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data(){
    return {
      user:{
        name: '',
        age: ''
      },
    }
  },
  mounted(){
    actions.onGlobalStateChange((state) => { //监听全局状态
      this.user = state.user
    }, true);
  },
  methods:{
    handleChangeMasterInfo(){
      actions.setGlobalState({
        user: {
          name: this.user.name == '张三' ? '李四' : '张三'
        }
      })//改变全局状态
    }
  },
  computed:{
    age(){
      return this.user.age
    }
  },
  watch:{
    age(){
      actions.setGlobalState({
        user:{
          ...this.user,
          age: this.age
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
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
