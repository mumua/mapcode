<template>
  <div>
    <div id="map" class="MapClass"></div>
    <input type="button" value="属性查询" id="Btn"/>
    <div id="divShowResult"></div>

        <!-- <router-view name="MapMenu"></router-view> -->

  </div>

</template>
<script>
import esriload from 'esri-loader';
export default{
  name: 'Query',
  data () {
    return {
      layers: [],
      map: {}
    }
  },
  methods: {
    createMap: function () {
      // const that = this;
      const options = {
        url: 'https://js.arcgis.com/3.25/'
      };
      esriload.loadModules([
        'esri/map',
        'esri/dijit/Basemap',
        'esri/dijit/BasemapLayer',
        'esri/dijit/BasemapGallery',
        'esri/arcgis/utils',
        'esri/dijit/LayerList',
        'esri/dijit/Scalebar',
        'esri/layers/WMTSLayerInfo',
        'esri/toolbars/draw',
        'esri/graphic',
        'esri/layers/ArcGISDynamicMapServiceLayer',
        'esri/layers/ArcGISTiledMapServiceLayer',
        'dojo/on',
        'dojo/dom',
        'esri/tasks/QueryTask',
        'esri/tasks/query',
        'esri/tasks/FindTask',
        'esri/tasks/FindParameters',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/SimpleLineSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/layers/GraphicsLayer',
        'esri/dijit/Popup',
        'esri/dijit/PopupTemplate',
        'dojo/dom-construct',
        'dijit/layout/BorderContainer',
        'dijit/layout/ContentPane',
        'dojo/domReady!',

        'dijit/registry',
        'dojo/parser'], options)
        .then(([Map,
          Basemap,
          BasemapLayer,
          BasemapGallery,
          arcgisUtils,
          LayerList,
          Scalebar,
          WMTSLayerInfo,
          Draw,
          Graphic,
          ArcGISDynamicMapServiceLayer,
          ArcGISTiledMapServiceLayer,
          on,
          dom,
          QueryTask,
          Query,
          FindTask,
          FindParameters,
          SimpleMarkerSymbol,
          SimpleLineSymbol,
          SimpleFillSymbol,
          GraphicsLayer,
          Popup,
          PopupTemplate,
          domConstruct,
          BorderContainer,
          ContentPane,
          domReady,
          registry,
          parser]) => {
          // create map with the given options at a DOM node w/ id 'mapNode'
          parser.parse();
          // var map = new Map('mapDiv');
          let map = new Map('map', {
            center: [108, 34.5],
            zoom: 3,
            basemap: 'dark-gray'
          });
          // 地图服务的URL
          var MapServer = 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer';
          var layer = new ArcGISDynamicMapServiceLayer(MapServer);
          // map.addLayer(layer);
          // 创建属性查询对象
          var findTask = new FindTask(MapServer);
          // 创建属性查询参数
          var findParams = new FindParameters();
          on(dom.byId('Btn'), 'click', function () {
            // 是否返回给我们几何信息
            findParams.returnGeometry = true;
            // 对哪一个图层进行属性查询
            findParams.layerIds = [1];
            // 查询的字段
            findParams.searchFields = ['name'];
            // searchText和searchFields结合使用，即查询name=J4
            findParams.searchText = 'y';
            // 执行查询对象
            findTask.execute(findParams, ShowFindResult);
          })
          function ShowFindResult (queryResult) {
            // 创建线符号
            var lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH);
            // 创建面符号
            var fill = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineSymbol);
            if (queryResult.length === 0) {
              dom.byId('divShowResult').innerHTML = '';
              return;
            }
            var htmls = '';
            if (queryResult.length >= 1) {
              htmls = htmls + '<table style="width: 100%">';
              htmls = htmls + '<tr><td>名称</td></tr>';
              for (var i = 0; i < queryResult.length; i++) {
                // 获得图形graphic
                var graphic = queryResult[i].feature;
                // 赋予相应的符号
                graphic.setSymbol(fill);
                // 将graphic添加到地图中，从而实现高亮效果
                map.graphics.add(graphic);
                // 获得教学楼名称（此处是和shp属性表对应的）
                var ptName = graphic.attributes['NAME'];
                if (i % 2 === 0) { htmls = htmls + '<tr>'; } else { htmls = htmls + '<tr bgcolor="#F0F0F0">'; }
                htmls = htmls + '<td><a href="#" ">' + ptName + '</a></td>';
                htmls = htmls + '</tr>';
              }
              htmls = htmls + '</table>';
              // 将属性绑定在divShowResult上面
              dom.byId('divShowResult').innerHTML = htmls;
            }
          }

          map.on('load', createToolbar);
          registry.forEach(function (d) {
          // d is a reference to a dijit
          // could be a layout container or a button
            if (d.declaredClass === 'dijit.form.Button') {
              d.on('click', activateTool);
            }
          });

          function queryGraphic (geometry) {
            // 创建查询对象，注意：服务的后面有一个编号，代表对那一个图层进行查询
            var queryTask = new QueryTask('http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/0');
            // 创建查询参数对象
            var query = new Query();
            // 空间查询的几何对象
            query.geometry = geometry;
            // 服务器给我们返回的字段信息，*代表返回所有字段
            query.outFields = ['*'];
            // 空间参考信息
            query.outSpatialReference = map.spatialReference;
            // 查询的标准，此处代表和geometry相交的图形都要返回
            query.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
            // 是否返回几何信息
            query.returnGeometry = true;
            // 执行空间查询
            queryTask.execute(query, ShowFindResult);
          }

          let toolbar;
          let graphic = new GraphicsLayer({ id: 'draw' });

          function activateTool () {
            // graphic.clear();

            var tool = this.label.toUpperCase().replace(/ /g, '_');
            toolbar.activate(Draw[tool]);
            map.hideZoomSlider();
          }

          function createToolbar (themap) {
            toolbar = new Draw(map);
            toolbar.on('draw-end', addToMap);
          }

          function addToMap (evt) {
            queryGraphic(evt.geometry);
            var symbol;
            toolbar.deactivate();
            map.showZoomSlider();
            switch (evt.geometry.type) {
              case 'point':
              case 'multipoint':
                symbol = new SimpleMarkerSymbol();
                break;
              case 'polyline':
                symbol = new SimpleLineSymbol();
                break;
              default:
                symbol = new SimpleFillSymbol();
                break;
            }
            // let graphic = new Graphic(evt.geometry, symbol);
            graphic.add(new Graphic(evt.geometry, symbol));
          }
          // that.$store.state.map = map;
          // that.map = map;
        })
    }
  },
  mounted: function () {
    if (!esriload.isLoaded) {
      esriload.bootstrap((err) => {
        if (err) {
          console.error(err);
        } else {
          this.createMap();
        }
      }, {
        url: 'https://js.arcgis.com/3.20/'
      })
    } else {
      this.createMap();
    }
  }

}
</script>
<style lang="less" scoped>
.MapClass {
  width: 100%;
  height: 600px;
  border: 1px solid #000;
}
</style>
