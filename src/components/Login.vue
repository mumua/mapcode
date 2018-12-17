<template>
  <div class="login-common">
    <div class="login-form">
      <img src="../assets/image/logo-mediu.png" alt="logo">
      <h1>{{ msg }}</h1>
      <ul>
        <li class="login-input">
          <!-- <span class="lxliconfont lxl-account" ></span>用户 -->
          <i class="lxliconfont lxl-account"></i>
          <Input class="login-name" v-model="user.login" placeholder="请输入用户名"/>

          <!-- <Input  class="login-input" type="text" v-model="login" /> -->
        </li>
        <li class="login-input login-margin">
          <!-- <Input class="login-password" type="text" v-model="password"> -->
          <i class="lxliconfont lxl-password"></i>
          <Input type="password" class="login-name" v-model="user.password" placeholder="请输入密码"/>
        </li>
        <li class="login-margin">
          <Button @click="sentLogin">登录</Button>
          <Button @click="send">取消</Button>
          <!--<Button @click="register">注册</Button>-->
        </li>
        <li></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      msg: '登录',
      user: {
        login: '',
        password: '',
        name: ''
      }
    };
  },
  methods: {
    send () {
      this.$http({
        method: 'GET',
        url: 'http://localhost:8081/static/china.json'
        // responseType: 'json',
      })
        .then(function (res) {
          console.log(res.data);
        })
        .catch(function (err) {
          console.log(err.messege);
        });
    },
    sentLogin () {
      const that = this;
      that
        .$http({
          method: 'post',
          data: JSON.stringify({
            login: this.user.login,
            password: this.user.password
          }),
          url: 'http://39.108.138.89:8080/user/user/login',
          headers: { 'Content-Type': 'application/json;charset=utf-8' }
          // responseType: 'json',
          // dataType: 'json'
        })
        .then(function (res) {
          if (res.data.statusCode === 200) {
            alert(res.data.messege);
            that.$store.state.user = res.data.data[0];
            that.$store.state.isLogin = true;
            that.$router.push('/');
          } else if (res.data.statusCode === 40001) {
            alert(res.data.messege);
            that.$router.push('/register');
          } else {
            alert(res.data.messege);
          }
        })
        .catch(function (res) {
          console.log(res.data);
        });
    },
    register () {
      this.$http
        .get('http://localhost:8009/static/china.json')
        .then(function (response) {
          console.log(response);
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }
};
</script >

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
}
a {
  color: #42b983;
}
.login-common {
  background: url("./../assets/image/login-bg.png");
  width: 100%;
  height: 100vh;
  position: relative;
}
.login-form {
  position: absolute;
  background-color: #002c5d5c;
  right: 50px;
  top: 50%;
  width: 350px;
  height: 220px;
  color: #fff;
  border: 1px solid #ffffff;
  margin-top: -110px;
}
.login-input {
  background-color: #fff;
  width: 300px;
  border-radius: 5px;
  i {
    color: #333;
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: middle;
  }
}
.login-name {
  border: none;
  height: 32px;
  width: 260px;
}
.ivu-input {
  border: none;
  outline: none;
}
.login-margin {
  margin-top: 20px;
}
</style>
