import { initGlobalState } from "qiankun"; 
import store from "../store";
const initialState = store.state

// 初始化 state
const actions = initGlobalState(initialState);

actions.onGlobalStateChange(state => { // 监听公共状态的变化
  // 将共用信息存入到vuex中
  store.commit('setUser',state.user);
});

export default actions;
