export const qiankun = {
  // 应用加载之前
  async bootstrap() {
    console.log('app1 bootstrap');
  },
  // 应用 render 之前触发
  async mount() {
    console.log('app1 mount');
  },
  // 应用卸载之后触发
  async unmount() {
    console.log('app1 unmount');
  },
};