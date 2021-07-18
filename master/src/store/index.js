import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user:{
      name: '张三',
    }
  },
  mutations: {
    setUser(state,user){
      state.user = {...state.user,...user}
    }
  },
  actions: {
  },
  modules: {
  }
})
