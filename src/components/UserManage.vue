<template>
  <div>
    <div class="sea-div">
      <input type="text" class="ivu-input ivu-input-default" v-model="name" @keydown="search"><Button type="primary" icon="ios-search" @click="search">搜索</Button>
    </div>
    <div class="pageshow"><button class="ivu-btn ivu-btn-primary" @click="getPageList">分页显示</button></div>

    <Table border :columns="columns7" :data="list"></Table>
    <Page :total="pageInfo.total" show-total show-elevator show-sizer :page-size="pageInfo.size" @on-change="changePage" v-if="isPageShow==true"/>
    <!-- <table>
      <thead>
        <th>
          <td>名称</td>
          <td>登陆账号</td>
          <td>密码</td>
        </th>
      </thead>
      <tbody>
        <tr v-for="itema in list" :key="itema.index">
          <td>{{itema.name}}</td>
          <td>{{itema.login}}</td>
          <td>{{itema.password}}</td>
        </tr>
      </tbody>
    </table> -->
  </div>
</template>
<style lang="less" scoped>
.sea-div {
  width: 260px;
  input {
    display: inline-block;
    width: 65%;
    border-radius: 5px 0 0 5px;
  }
  button {
    border-radius: 0 5px 5px 0px;
  }
}
.pageshow {
  text-align: left;
  margin-left: 10px;
}
</style>

<script>
export default{
  name: 'UserManage',
  data () {
    return {
      users: [
        {message: 'Foo', name: 'll'},
        { message: 'Bar', name: '22' }
      ],
      list: [],
      pageInfo: {
        current: 0,
        size: 2,
        total: 10
      },
      isPageShow: false,
      name: name,
      columns7: [
        {
          title: 'Name',
          key: 'name',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('strong', params.row.name)
            ]);
          }
        },
        {
          title: '登陆账号',
          key: 'login'
        },
        {
          title: '密码',
          key: 'password'
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              // h('Button', {
              //   props: {
              //     type: 'primary',
              //     size: 'small'
              //   },
              //   style: {
              //     marginRight: '5px'
              //   },
              //   on: {
              //     click: () => {
              //       // this.show(params.index)
              //     }
              //   }
              // }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    // this.remove(params.index)
                    this.deleteuser(params.row);
                  }
                }
              }, '删除')
            ]);
          }
        }
      ]
    }
  },
  mounted: function () {
    this.getlist();
  },
  methods: {
    getlist: function () {
      const that = this;
      this.$http({
        method: 'post',
        data: JSON.stringify({name: this.name, id: ''}),
        url: 'http://localhost:8080/user/getAll',
        headers: {'Content-Type': 'application/json;charset=utf-8'}
      }).then(function (res) {
        if (res.data.statusCode === 210) {
          that.list = res.data.data;
        } else if (res.data.statusCode === 40001) {
          alert(res.data.messege);
          that.$router.push('/register');
        } else if (res.data.statusCode === 2001) {
          that.list = [];
        }
      }).catch(function (res) {
        console.log(res.data)
      })
    },
    getPageList: function () {
      const that = this;
      that.isPageShow = true;
      this.$http({
        method: 'post',
        data: JSON.stringify({user: {name: this.name}, pageInfo: {current: this.pageInfo.current, size: this.pageInfo.size}}),
        url: 'http://localhost:8080/user/getByPage',
        headers: {'Content-Type': 'application/json;charset=utf-8'}
      }).then(function (res) {
        if (res.data.statusCode === 200) {
          that.list = res.data.pageList.datasource;
          // that.pageInfo = res.data.pageList.pageInfo;
          // for (const key in res.data.pageList.pageInfo) {
          //   if (res.data.pageList.pageInfo.hasOwnProperty(key)) {
          //     if (res.data.pageList.pageInfo[key] != null) {
          //       res.data.pageList.pageInfo[key] = res.data.pageList.pageInfo[key].toString();
          //     }
          //   }
          // }
          that.pageInfo = res.data.pageList.pageInfo;
        } else if (res.data.statusCode === 40001) {
          alert(res.data.messege);
          that.$router.push('/register');
        } else if (res.data.statusCode === 2001) {
          that.list = [];
        }
      }).catch(function (res) {
        console.log(res.data)
      })
    },
    changePage: function (currentPage) {
      this.pageInfo.current = currentPage - 1;
      this.getPageList();
    },
    search () {
      this.getlist();
    },
    deleteuser (user) {
      const that = this;
      this.$http({
        method: 'get',
        url: 'http://localhost:8080/user/user/delete/' + user.id,
        headers: {'Content-Type': 'application/json;charset=utf-8'}
      }).then(function (res) {
        if (res.data.statusCode === 200) {
          alert('删除成功');
          that.getlist();
        } else if (res.data.statusCode === 2001) {
          that.list = [];
        }
      }).catch(function (res) {
        console.log(res.data)
      })
    }
  }
}
</script>
