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
    ishot: false,
    isclu: true,
    isShow: false,
    typename: '',
    istypeandOther: false,
    hotMap: {
      title: '城市',
      id: '1',
      type: '1',
      key: '0-1',
      url:
        'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/0',
      outFields: ['areaname', 'capital', 'class', 'objectid', 'pop2000', 'st'],
      columns: [
        { name: 'areaname', alias: '名称', width: 400 },
        { name: 'capital', alias: 'capital', width: 120 },
        { name: 'class', alias: '类型', width: 100 },
        { name: 'objectid', alias: 'id', width: 100 },
        { name: 'pop2000', alias: '人口', width: 200 },
        { field: 'st', alias: 'st', width: 200 }
      ]
    },
    map: {},
    layersSele: '',
    layersSelect: [],
    layer: '10',
    featureSql: '',
    typeSql: '',
    healSql: ''
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
