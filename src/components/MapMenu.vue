<template>
    <div class="map-model">

      <div class="tool-nev">
        <ul>
          <li @click="maptoolOpen(1)" v-bind:class="{ toolIndex:maptool.state==1}">
            <span>
              <Icon type="md-square" Number="18px"/>
            </span>
            底图
          </li>
          <li @click="maptoolOpen(2)" v-bind:class="{ toolIndex:maptool.state==2}">
             <span>
              <Icon type="md-albums" />
             </span>
            专题图
          </li>
          <li @click="openLayer(3)" v-bind:class="{ toolIndex:maptool.state==3}">
            <span>
              <Icon type="md-search" />
            </span>
            属性查询
          </li>
          <li @click="maptoolOpen(4)" v-bind:class="{ toolIndex:maptool.state==4}">
            <span>
              <Icon type="md-search" />
            </span>
            空间查询
          </li>
          <li @click="maptoolOpen(9)" v-bind:class="{ toolIndex:maptool.state==9}">
            <span>
              <img src="static/images/space.png" alt="" style="width:18px">
            </span>
            缓冲查询
          </li>
        </ul>
        <div class="tool-cont">
          <div v-show="maptool.state==1">
            <div  id="basemapGallery" ></div>
          </div>

          <div id="layerList" v-show="maptool.state==2" >
            <Tree  id="tree1" :data="data4" show-checkbox multiple ref="tree1" @on-check-change="getindex"></Tree>
          </div>
          <div v-show="maptool.state==3">
            <Tabs style="min-height:400px">
              <TabPane label="图层查询" >
                <div class="layer-query" style="min-height:400px" >
               图层<Select v-model="layer" id="layerSelect"  style="width:220px" >
                    <Option v-for="item in layers" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </div>
                <input type="button" value="属性查询" id="Btn" @click="getLayer"/>
                <input type="button" value="清除" id="clearGraphics" />
              </TabPane>
            </Tabs>
          </div>
          <div v-show="maptool.state==4">
                <div class="space_query" >
                  <!-- <button data-dojo-type="dijit/form/Button" value="Point">
                    <img src=" static/images/point.png" alt="">

                  <span>Click Me!</span>

                  </button> -->
                  <!-- <input type="text" data-dojo-type="dijit/form/Input" value="Point"> -->
                  <!-- <img src="../../../static/images/point.png" data-dojo-type="dijit/form/Button" alt="点"> -->
                  <!-- <button data-dojo-type="dijit/form/Button" value="MultiPoint">
                    <img src=" static/images/multipoint.png" alt="">
                  </button>
                  <button data-dojo-type="dijit/form/Button" value="Line">
                    <img src=" static/images/line.png" alt="">
                  </button>
                  <button data-dojo-type="dijit/form/Button" value="Polyline">
                    <img src=" static/images/multiline.png" alt="">
                  </button>
                  <button data-dojo-type="dijit/form/Button" value="Polygon">
                    <img src=" static/images/polygon.png" alt="">
                  </button> -->
                  <!-- <button data-dojo-type="dijit/form/Button">Freehand Polyline</button>
                  <button data-dojo-type="dijit/form/Button">Freehand Polygon</button>

                  <button data-dojo-type="dijit/form/Button">Arrow</button>
                  <button data-dojo-type="dijit/form/Button">Triangle</button> -->
                  <!-- <button data-dojo-type="dijit/form/Button" value="Circle">
                    <img src=" static/images/multipoint.png" alt="">
                  </button> -->
                  <button class="act-btn" id="polygonButton" type="button" data-dojo-type="dijit/form/Button"
                          title="多边形" value="Polygon" >
                      <span class=" action-button esri-icon-polygon"></span>
                    </button>
                    <button  id="rectangleButton" data-dojo-type="dijit/form/Button"
                      type="button" title="矩形" value="rectangle">
                        <span class="action-button esri-icon-checkbox-unchecked"></span>
                    </button>
                    <button  id="circleButton" data-dojo-type="dijit/form/Button"
                      type="button" title="圆" value="Circle">
                        <span class="action-button esri-icon-radio-unchecked"></span>
                    </button>
                    <!-- <button  type="button" data-dojo-type="dijit/form/Button"
                        @click="clearDrawKJ">
                      <span class="action-button esri-icon-trash"></span>
                    </button> -->
                    <button @click="clearDrawKJ" style="height: 28px;vertical-align: middle">
                      <span class="action-button esri-icon-trash"></span>
                    </button>
                  <!-- <button data-dojo-type="dijit/form/Button">Ellipse</button> -->
                </div>
          </div>
          <div v-show="maptool.state==9">
              <Form   :label-width="80"  >
                  <!-- <FormItem label="缓冲半径" prop="gender">
                                <Input  placeholder="输入最小数" />

                  </FormItem> -->
                  <FormItem label="" style="  margin-bottom: 5px;">
                      <div id="topbar" class="space_query" >
                        <button class="act-btn" id="point" type="button" data-dojo-type="dijit/form/Button"
                          title="缓冲点" value="point" style="padding:0">
                          <span class=" action-button " style="display:inline-block;width:20px;height:20px">.</span>
                        </button>
                      </div>
                  </FormItem>
                </Form>
          </div>
        </div>
      </div>

    </div>

</template>
<script>
import esriload from 'esri-loader';
export default {
  name: 'MapMenu',
  data () {
    return {
      theme3: 'light',
      maptool: {
        base: true,
        topic: true,
        feature: {
          state: 0
        },
        state: 0
      },
      layers: [],
      layer: '',
      data4: []

    }
  },
  computed: {
    map () {
      return this.$store.state.map;
    },
    isShow () {
      return this.$store.state.isShow;
    }
  },
  methods: {
    getLayer: function () {
      if (this.layer !== '') {
        this.$store.state.layer = this.layer;
      }
    },
    getlayerList: function () {
      if (this.layers.length !== this.$store.state.layersSelect.length) {
        this.layers = [];
        for (let i = 0; i < this.$store.state.layersSelect.length; i++) {
          let data = {};
          data.name = this.$store.state.layersSelect[i].title;
          data.id = this.$store.state.layersSelect[i].id;
          this.layers.push(data);
        }
      } else {

      }
    },
    openLayer: function (state) {
      if (this.maptool.state === state) {
        this.maptool.state = 0;
      } else {
        this.getlayerList();
        this.maptool.state = 3;
      }
    },
    getindex: function (data) {
      console.log(data);
      if (data.length === 1) {
        if (this.$store.state.layersSelect.length === 0) {
          this.$store.state.layersSelect.push(data[0]);
        } else if (this.$store.state.layersSelect.length === 1) {
          this.$store.state.layersSelect.splice(0, 1);
        } else {
          for (let k = 0; k < this.$store.state.layersSelect.length; k++) {
            if (JSON.stringify(data).indexOf(JSON.stringify(this.$store.state.layersSelect[k])) === -1) {
              console.log('不存在')
              this.$store.state.layersSelect.splice(k, 1);
            } else {
              // break;
            }
          }
        }
      } else if (data.length === 0) {
        if (this.$store.state.layersSelect.length === 0) {
          // this.$store.state.layersSelect.push(data);
        } else {
          this.$store.state.layersSelect.splice(0, 1);
        }
      } else {
        if (data.length > this.$store.state.layersSelect.length) {
          for (let i = 0; i < data.length; i++) {
            if (JSON.stringify(this.$store.state.layersSelect).indexOf(JSON.stringify(data[i])) === -1) {
              console.log('不存在')
              this.$store.state.layersSelect.push(data[i])
            } else {
              // break;
            }
          }
        } else {
          for (let j = 0; j < this.$store.state.layersSelect.length; j++) {
            if (JSON.stringify(data).indexOf(JSON.stringify(this.$store.state.layersSelect[j])) === -1) {
              console.log('不存在')
              this.$store.state.layersSelect.splice(j, 1);
            } else {
              // break;
            }
          }
        }
      }
    },
    maptoolOpen: function (state) {
      if (this.maptool.state === state) {
        this.maptool.state = 0;
      } else {
        this.maptool.state = state;
      }
    },
    clearDrawKJ: function () {
      Window.clearKJ()
    }
  },
  mounted: function () {
    // this.getlayer();
    this.$http.get('static/ServiceConfig.json').then(res => {
      for (let i = 0; i < res.data.service.length; i++) {
        this.data4.push(res.data.service[i]);
      }

      console.log('json数据为:' + res.body)// 此处的res对象包含了json的文件信息和数据，我们需要的json数据存在于body属性中
    })
  }
}
</script>
<style lang="less" scoped>
#mapMenu {
  width: 100%;
}

.tool-nev ul {
  li {
    padding: 18px 0px;
    list-style-type: none;
  }
  li span {
    display: block;
  }
}
.tool-nev ul li:hover {
  color: #2d8cf0;
}
.tool-cont {
  position: absolute;
  left: -242px;
  top: 0;
  width: 242px;

  background: #fff;
}
.dijitButtonContents {
  display: inline-block;
  padding: 5px;
}
.toolIndex {
  color: #2d8cf0;
  background: #f0faff;
  border-left: 2px solid #2d8cf0;
}
.space_query {
  background: transparent;
  text-align: left;
  button {
    padding: 5px;
    background: #fff;
    border: 1px solid #868282;
    margin: 2px;
  }
}
</style>
