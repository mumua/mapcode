<template>
  <div>
    <div class="layout">
        <Layout>
            <Header>
                 <Menu mode="horizontal" theme="dark" active-name="1" @on-select="signout">
                    <div class="layout-logo">
                      <img src="../assets/image/logo-mediu.png" alt="logo">
                      {{logoname}}
                    </div>
                    <div class="layout-nav">
                        <MenuItem name="nologin" v-if="isLogin === false">
                            <Icon type="ios-paper"></Icon>
                            <router-link to="/login" tag="span">登陆</router-link>
                            <router-link to="/register" tag="span">注册</router-link>
                        </MenuItem>
                        <Submenu name="5" v-if="isLogin=== true">
                          <template slot="title">
                              <Icon type="ios-stats" />
                              {{user.name}}
                          </template>
                          <MenuGroup title="个人信息操作">
                              <MenuItem name="5-1" >退出</MenuItem>
                          </MenuGroup>
                          <!-- <MenuGroup title="个人信息操作">
                              <MenuItem name="5-4">个人信息</MenuItem>
                              <MenuItem name="5-5">修改密码</MenuItem>
                          </MenuGroup> -->
                        </Submenu>
                    </div>
                </Menu>
            </Header>
        </Layout>
    </div>
    <!-- <router-view class="content-hig"></router-view> -->
    </div>
</template>
<style lang="less" scoped>
.layout {
  background: #f5f7f9;
  position: relative;
}
.layout-logo {
  width: 800px;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 2px;
  color: #ffffff;
  text-align: left;
  font-size: 22px;
  letter-spacing: 3px;
  img {
    vertical-align: middle;
  }
}

.layout-nav {
  width: 580px;
  margin: 0 auto;
  margin-right: 20px;
}
.layout-nav::after {
  clear: both;
  content: '.';
  //overflow: hidden;
}
.claerboth {
  clear: both;
}
.layout-footer-center {
  text-align: center;
}
.content-hig {
  min-height: 500px;
}
.ivu-menu-horizontal .ivu-menu-item,
.ivu-menu-horizontal .ivu-menu-submenu {
  float: right;
}
</style>

<script>
export default {
  name: 'HeaderTop',
  data () {
    return {
      logoname: ''
    }
  },
  computed: {
    user () {
      // return {}
      return this.$store.state.user
    },
    isLogin () {
      // return true;
      return this.$store.state.isLogin
    }
  },
  methods: {
    signout (name) {
      switch (name) {
        case '5-1':
          // this.$store.state.isLogin = false
          // localStorage.removeItem('user')
          this.$router.push('/')
          break;
        case '5-2':
          break
        case '4':
          this.$router.push('/getlist')
          break;
        default:
      }
    },
    sing () {
      alert('ok')
    },
    getConfigInfo: function () {
      this.$http.get('./static/Config.json').then(response => {
        // response.status;
        // 响应成功回调
        // alert(response.body.logoName);
        this.logoname = response.data.logoName;
      }, response => {
        // 响应错误回调
        alert('服务器请求失败');
      });
    }
  },
  mounted: function () {
    this.getConfigInfo();
  },
  created () {
    // localStorage.getItem('user') && this.$store.replaceState(Object.assign(this.$store.state, JSON.parse(localStorage.getItem('user'))));
  }
}
</script>
