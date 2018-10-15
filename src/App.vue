<template>
  <div id="app">
    <div class="layout">
      <Layout>
          <router-view name="Headertop"></router-view>
          <!-- <router-view/> -->
        <!-- <layout> -->
          <!-- <router-view ></router-view> -->
          <Row>
            <Col span="23">
              <router-view ></router-view>
            </Col>
            <Col span="1">
              <router-view name="MapMenu"></router-view>
            </Col>
          </Row>
          <!-- <Content >
            <router-view ></router-view>
          </Content>
          <Sider>
              <router-view name="MapMenu"></router-view>
          </Sider> -->
        <!-- </layout> -->
      </Layout>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.ivu-layout-sider {
  width: 70px;
}
</style>
