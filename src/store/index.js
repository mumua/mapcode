import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
// select中选中的图层
export default new Vuex.Store({
  state: {
    user: {},
    show: false,
    count: 1,
    isLogin: false,
    map: {},
    layersSele: '',
    layersSelect: [],
    layer: '10'
  },
  mutations: {
    // inscreas (state) {
    //   state.count++;
    // },
    // storeUser (state, user) {
    //   state.user = user;
    // },
    // storeIsLogin (state, isLogin) {
    //   state.isLogin = isLogin;
    // }
  }
});
