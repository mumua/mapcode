import Vue from 'vue';
import Router from 'vue-router';
// import HelloWorld from '@/components/HelloWorld'
import headerTop from '@/components/HeaderTop';
import MapView from '@/components/IndexView';
import SpaceQuery from '@/components/SpaceQuery';
import LayerList from '@/components/LayerList';
import MapMenu from '@/components/MapMenu';
import Query from '@/components/Query';
import QueryFeature from '@/components/QueryFeature';
import login from '@/components/login';
import Register from '@/components/Register';
import UserManage from '@/components/UserManage';

Vue.use(Router);

export default new Router({
  base: '/mapcode/',
  routes: [
    {
      path: '/',
      redirect: '/index',
      name: 'header',
      components: {
        Headertop: headerTop,
        // LayerList: LayerList,
        MapMenu: MapMenu,
        default: QueryFeature
      },
      children: [
        {
          path: 'index',
          name: 'usermanage',
          component: LayerList
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/getlist',
      name: 'usermanage',
      component: UserManage
    }
  ]
});
