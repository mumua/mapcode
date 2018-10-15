<template>
    <div class="container"  id="echartContainer" data-dojo-type="dijit/layout/BorderContainer"
data-dojo-props="design:'headline',gutters:false">
      <div id="map" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'center'">
        <!-- <div id="layerList" style="width:20%;position:absolute; right:20px; top:20px; z-Index:999;"></div> -->
        <!-- <div id="divShowResult"></div> -->
        <div id="divShowResult" v-show="isShow" >
          <img src="" alt="" >
          <Icon class="closeTable" type="ios-close" @click="isShow=!isShow" />
          <div id="myTableNode"></div>
        </div>
      </div>
      <div class="fea-que">

        </div>
    </div>

</template>
<script>
import esriload from 'esri-loader';
import echarts from 'echarts'
import MapMenu from '@/components/MapMenu';
export default{
  name: 'QueryFeature',
  component: MapMenu,
  data () {
    return {
      isShow: false,
      featureList: [],
      treeLayer: [],
      columns1: [
        {
          title: '名称',
          key: 'CITY_NAME'
        },
        {
          title: '类型',
          key: 'TYPE'
        }
      ],
      feature: [],
      featureTable: 0
    }
  },
  methods: {
    createMap: function () {
      const options = {
        url: 'https://js.arcgis.com/3.26/'
      };
      esriload.loadModules([
        'esri/map',
        'esri/Color',
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
        'esri/layers/FeatureLayer',
        'esri/dijit/FeatureTable',
        'dojo/on',
        'dojo/dom',
        'esri/tasks/QueryTask',
        'esri/tasks/query',
        'esri/tasks/FindTask',
        'esri/tasks/FindParameters',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/SimpleLineSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/symbols/PictureMarkerSymbol',
        'esri/layers/GraphicsLayer',
        'esri/dijit/Popup',
        'esri/dijit/PopupTemplate',
        'dojo/dom-construct',
        'dijit/layout/BorderContainer',
        'dijit/layout/ContentPane',
        'esri/renderers/HeatmapRenderer',
        'dojo/domReady!',

        'dijit/registry',
        'dojo/parser'], options)
        .then(([Map,
          Color,
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
          FeatureLayer,
          FeatureTable,
          on,
          dom,
          QueryTask,
          Query,
          FindTask,
          FindParameters,
          SimpleMarkerSymbol,
          SimpleLineSymbol,
          SimpleFillSymbol,
          PictureMarkerSymbol,
          GraphicsLayer,
          Popup,
          PopupTemplate,
          domConstruct,
          BorderContainer,
          ContentPane,
          HeatmapRenderer,
          domReady,
          registry,
          parser]) => {
          // create map with the given options at a DOM node w/ id 'mapNode'
          parser.parse();
          const that = this;
          /**
           * 点线面的符号
           */
          let pointSymbol = new PictureMarkerSymbol('./static/images/marker.png', 25, 35).setOffset(0, 0);
          let lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255, 0, 0]), 3);
          let fill = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineSymbol);
          var fills = new SimpleFillSymbol('solid', null, new Color('#A4CE67'));
          var popup = new Popup({
            fillSymbol: fills,
            titleInBody: false
          }, domConstruct.create('div'));
          let map = new Map('map', {
            // center: [108, 34.5], 中国
            center: [-103, 18],
            zoom: 3,
            minZoom: 1,
            maxZoom: 20,
            basemap: 'gray', // 'dark-gray',
            infoWindow: popup
          });
          let toolbar;
          let graphic = new GraphicsLayer({ id: 'draw' });
          let basemaps = [];
          // 第一个basemap
          var waterTemplateLayer = new BasemapLayer({
            url: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer'
          });
          var waterBasemap = new Basemap({
            layers: [waterTemplateLayer],
            title: '土地现状专题图',
            thumbnailUrl: 'static/images//caise.jpg',
            width: '100px',
            float: 'left'
          });
          basemaps.push(waterBasemap);

          // 第二个basemap
          var publicSafetyLayer = new BasemapLayer({
            url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer'
          });
          var publicSafetyBasemap = new Basemap({
            layers: [publicSafetyLayer],
            title: '土地利用专题图',
            thumbnailUrl: 'static/images/nuanse.jpg',
            width: '100px',
            float: 'left'
          });
          basemaps.push(publicSafetyBasemap);
          let basemapGallery = new BasemapGallery({
            showArcGISBasemaps: false,
            basemaps: basemaps,
            map: map
          }, 'basemapGallery');
          basemapGallery.startup();
          // let layerList = new LayerList()
          let demographicsLayerURL = 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer';
          var demographicsLayerOptions = {
            'id': 'demographicsLayer',
            'opacity': 0.8,
            'showAttribution': false
          };
          let demographicsLayer = new ArcGISDynamicMapServiceLayer(demographicsLayerURL, demographicsLayerOptions);
          // demographicsLayer.setInfoTemplates({
          //   1: { infoTemplate: _blockGroupInfoTemplate },
          //   2: { infoTemplate: _countyCensusInfoTemplate }
          // });
          demographicsLayer.setVisibleLayers([1, 2]);

          let layer = [];
          var MapServer = 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer';
          var layer1 = new ArcGISDynamicMapServiceLayer(MapServer);
          // let layer2 = new ArcGISDynamicMapServiceLayer({
          //   url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
          // })

          // map.addLayer(layer1);

          /**
           * popup查询
           */
          var template = new PopupTemplate({
            title: 'Boston Marathon 2013',
            description: '{STATE_NAME}:  {Percent_Fi} of starters finished',
            fieldInfos: [{ // define field infos so we can specify an alias
              fieldName: 'Number_Ent',
              label: 'Entrants'
            }, {
              fieldName: 'Number_Sta',
              label: 'Starters'
            }, {
              fieldName: 'Number_Fin',
              label: 'Finishers'
            }],
            mediaInfos: [{ // define the bar chart
              caption: '',
              type: 'barchart',
              value: {
                theme: 'Dollar',
                fields: ['Number_Ent', 'Number_Sta', 'Number_Fin']
              }
            }]
          });
          var featureLayer = new FeatureLayer('https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Boston_Marathon/FeatureServer/0', {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ['*'],
            infoTemplate: template
          });
          // map.addLayer(featureLayer);

          /**
         * 属性查询的样式
         */
          function selectSymbolStyle (layer) {
            let type = layer.geometryType;
            let symbol;
            switch (type) {
              case 'esriGeometryPoint':
                symbol = pointSymbol;
                break;
              case 'esriGeometryPolyline':
                symbol = lineSymbol;
                break;
              case 'esriGeometryPolygon':
                symbol = fill;
                break;
            }
            return symbol;
          }

          // 创建属性查询参数
          var findParams = new FindParameters();
          on(dom.byId('Btn'), 'click', function () {
            that.isShow = true;
            // 判断属性表里面是否有值
            if (dom.byId('myTableNode') === null) {
              dom.byId('divShowResult').innerHTML = ''
              let div = document.createElement('div');

              // 设置 div 属性，如 id
              div.setAttribute('id', 'myTableNode');
              dom.byId('divShowResult').appendChild(div);
            } else if (dom.byId('myTableNode').getAttribute('class')) {
            //  dom.byId('').destroy();
              // 销毁id =myTableNode的div，即销毁上一个myFeatureTable的时候，先将myFeatureTable的选中项清除
              myFeatureTable.clearSelection();
              registry.byId('myTableNode').destroy();

              let div = document.createElement('div');

              // 设置 div 属性，如 id
              div.setAttribute('id', 'myTableNode');
              dom.byId('divShowResult').appendChild(div);

              // dom.byId('myTableNode').innerHTML = '';
              // dom.byId('myTableNode').removeAttribute('class');
              // dom.byId('myTableNode').removeAttribute('widgetid');
            } else {

            }
            // 获取maptool中选中的图层
            let layerid = that.$store.state.layer;
            // 通过获取的图层id找到该图层的地址
            let layer = map.getLayer(layerid);
            layer.setSelectionSymbol(selectSymbolStyle(layer));
            let a = featureLayerQuery(layer)

            a.startup();

            // dom.byId('myTableNode').innerHTML = '';
            // dom.byId('myTableNode').removeAttribute('class');
            // dom.byId('myTableNode').removeAttribute('widgetid');

            // 获取该图层的图层列，并选中其中一个图层
            // var findTask = new FindTask(layer._url.path);
            // // 是否返回给我们几何信息
            // findParams.returnGeometry = true;
            // // 对哪一个图层进行属性查询
            // findParams.layerIds = [1];
            // // 查询的字段
            // findParams.searchFields = ['name'];
            // // searchText和searchFields结合使用，即查询name=J4
            // findParams.searchText = 'y';
            // // 执行查询对象
            // findTask.execute(findParams, ShowFindResult);
          })
          function ShowFindResult (queryResult) {
            // 创建线符号
            // var lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH);
            // 创建面符号
          //  var fill = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineSymbol);
            if (queryResult.length === 0) {
              dom.byId('divShowResult').innerHTML = '';
              return;
            }
            var htmls = '';
            if (queryResult.length >= 1) {
              htmls = htmls + '<table style="width: 100%">';
              htmls = htmls + '<tr><td>名称</td></tr>';
              that.featureList = queryResult;
              for (var i = 0; i < queryResult.length; i++) {
                // 获得图形graphic
                var graphic = queryResult[i].feature;

                // 赋予相应的符号
                graphic.setSymbol(fill);
                // 将graphic添加到地图中，从而实现高亮效果
                map.graphics.add(graphic);
                // 获得教学楼名称（此处是和shp属性表对应的）
                //
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

          /**
           * 空间查询
           */
          function queryGraphic (geometry) {
            that.isShow = true;
            let layer = map.getLayer(map.graphicsLayerIds[map.graphicsLayerIds.length - 1]);
            // 创建查询对象，注意：服务的后面有一个编号，代表对那一个图层进行查询
            var queryTask = new QueryTask(layer._url.path);
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
            queryTask.execute(query, showQueryResult);
          }

          /**
           * 空间查询的结果解析
           */
          function showQueryResult (queryResult) {
            // 创建线符号
            // var lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255, 0, 0]), 3);
            // 创建面符号
          //  var fill = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineSymbol);
            if (queryResult.features.length === 0) {
            //  dom.byId('divShowResult').innerHTML = '';
              return;
            }
            var htmls = '';
            // that.feature = queryResult.features;
            if (queryResult.features.length >= 1) {
              // for 循环出属性名称

              htmls = htmls + '<table style="width: 100%">';
              htmls = htmls + '<thead><tr>';

              for (const key in queryResult.features[0].attributes) {
                htmls = htmls + '<td>' + key + '</td>';
              }
              htmls = htmls + '</tr></thead>';
              // that.feature = queryResult.features;
              for (var i = 0; i < queryResult.features.length; i++) {
                // 得到graphic
                var graphic = queryResult.features[i];
                // 给图形赋予符号
                graphic.setSymbol(fill);
                // 添加到地图从而实现高亮效果
                map.graphics.add(graphic);
                // 获得教学楼的名称信息，此处应和shp的属性表对应
                // var ptName = graphic.attributes['CITY_NAME'];
                // let ptype = graphic.attributes['TYPE'];
                if (i % 2 === 0) {
                  htmls = htmls + '<tbody><tr>';
                } else {
                  htmls = htmls + '<tr bgcolor="#F0F0F0" onclick=\'itemgra("' + graphic + '" )\'>';
                }
                for (const key in queryResult.features[0].attributes) {
                  htmls = htmls + '<td>' + queryResult.features[0].attributes[key] + '</td>';
                }

                htmls = htmls + '</tr>';
              }
              htmls = htmls + '</tbody></table>';
              // 将教学楼的名称信息和divShowResult绑定
              dom.byId('divShowResult').innerHTML = htmls;
            }
          }

          on(dom.byId('layerSelect'), 'click', function () {
            dom.byId('divShowResult')
          })

          function itemgra (graphic) {
            alert('ok');

            graphic.setSymbol(fill);
            // 添加到地图从而实现高亮效果
            map.graphics.add(graphic);
          }

          /**
           * popup
           */
          let popupTemplate = new PopupTemplate({
            title: '基本信息',
            description: '名称：{state_name}，人口数：{pop2000}',
            content: '{pop2000}:  {st_area} of starters finished'

          });

          let visible = []

          function getlayerlist (layer) {
            let infos = layer.layerInfos;
            let info;
            let items = [];
            for (var i = 0, j = infos.length; i < j; i++) {
              info = infos[i];
              if (info.defaultVisibility) {
                visible.push(info.id);
              }
              items[i] = "<input type='checkbox' class='list_item' checked='" + (info.defaultVisibility ? 'checked' : '') + "' id='" + info.id + "' onclick='updateLayerVisibility();'/><label for='" + info.id + "'>" + info.name + '</label>';
            }
            dom.byId('layer_list').innerHTML = items.join();

            layer.setVisibleLayers(visible);
            // map.addLayer(layer);
          }

          map.on('load', createToolbar);

          function updateLayerVisibility () {
            var inputs = Query('.list_item');
            let input;
            visible = [];
            for (var i = 0, j = inputs.length; i < j; i++) {
              if (inputs[i].checked) {
                visible.push(inputs[i].id);
              }
            }
            layer1.setVisibleLayers(visible);
          }
          registry.forEach(function (d) {
          // d is a reference to a dijit
          // could be a layout container or a button
            if (d.declaredClass === 'dijit.form.Button') {
              d.on('click', activateTool);
            }
          });

          function activateTool () {
            // graphic.clear();
            // popupTemplate.hide();
            map.graphics.clear();
            var tool = this.value.toUpperCase().replace(/ /g, '_');
            toolbar.activate(Draw[tool]);
            map.hideZoomSlider();
          }

          function createToolbar (themap) {
            toolbar = new Draw(map);
            toolbar.on('draw-end', addToMap);
          }

          function addToMap (evt) {
            var symbol;
            toolbar.deactivate();
            queryGraphic(evt.geometry);
            map.showZoomSlider();
            switch (evt.geometry.type) {
              case 'point':
                // symbol = new SimpleMarkerSymbol();
                symbol = new PictureMarkerSymbol('./static/images/marker.png', 25, 35).setOffset(0, 0);
                break;
              case 'multipoint':
                symbol = new SimpleMarkerSymbol();
                break;
              case 'polyline':
                symbol = new SimpleLineSymbol();
                break;
              default:
                symbol = new SimpleFillSymbol();
                symbol.setColor(new Color([0, 191, 255, 0.2]));
                symbol.outline.setColor(new Color([255, 0, 0, 1]));
                break;
            }
            // let graphic = new Graphic(evt.geometry, symbol);
            map.graphics.add(new Graphic(evt.geometry, symbol));
          }
          // let layerselect = [{name: map.layerIds[0]}, {name: map.layerIds[1]}]
          that.$store.state.layersSele = map.layerIds;
          that.$store.state.map = map;

          on(dom.byId('tree1'), 'click', function () {
            if (that.treeLayer.length < that.$store.state.layersSelect.length) {
              // that.treeLayer.push();
              for (let i = 0; i < that.$store.state.layersSelect.length; i++) {
                if (JSON.stringify(that.treeLayer).indexOf(JSON.stringify(that.$store.state.layersSelect[i])) === -1) {
                  console.log('不存在')
                  that.treeLayer.push(that.$store.state.layersSelect[i]);
                  if (i !== 0) {
                    addLayer(that.$store.state.layersSelect[i]);
                  } else {
                    addLayer(that.$store.state.layersSelect[i]);
                  }
                } else {
                  // break;
                }
              }
            } else {
              for (let j = 0; j < that.treeLayer.length; j++) {
                if (JSON.stringify(that.$store.state.layersSelect).indexOf(JSON.stringify(that.treeLayer[j])) === -1) {
                  console.log('不存在');
                  if (j !== 0) {
                    deleteLayer(that.treeLayer[j]);
                  } else {
                    deleteLayer(that.treeLayer[j]);
                  }

                  that.treeLayer.splice(j, 1);
                } else {
                  // break;
                }
              }
            }

            // let MapServer = 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer';
            // // var MapServer = 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer';
            // let options = {
            //   id: 1
            // }
            // let layer1 = new ArcGISDynamicMapServiceLayer(MapServer, options);
            // // let layer2 = new ArcGISDynamicMapServiceLayer({
            // //   url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
            // // })

            // map.addLayer(layer1);
          })

          // 初始化热点图
          let heatmapRenderer = new HeatmapRenderer({

          });
          /**
           * 加载图层
           */
          function addLayer (layerinfo) {
            let options;
            if (layerinfo.type === '1' || layerinfo.type === '3') {
              options = {
                id: layerinfo.id,
                // layer: layerinfo.title,
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: ['*']
                //  infoTemplate: popupTemplate
              };
            } else if (layerinfo.type === '2') {
              options = {
                id: layerinfo.id,
                mode: FeatureLayer.MODE_SNAPSHOT,
                outFields: ['*']
              };
            }

            // let heatmapFeatureLayerOptions =
            let layer = new FeatureLayer(layerinfo.url, options);
            if (layerinfo.type === '1') {

            } else if (layerinfo.type === '2') {
              layer.setRenderer(heatmapRenderer);
            } else if (layerinfo.type === '3') {
              layer.setFeatureReduction({
                type: 'cluster'
              });
              layer.enableFeatureReduction();
            }
            map.addLayer(layer);
          }

          /**
           * 删除图层
           */
          function deleteLayer (layerinfo) {
            let layer = map.getLayer(layerinfo.id);
            map.removeLayer(layer);
          }

          /**
           * featurelayer的属性查询
           */
          var myFeatureTable = {};
          function featureLayerQuery (layer) {
            let info;
            for (let i = 0; i < that.treeLayer.length; i++) {
              if (that.treeLayer[i].id === layer.id) {
                info = that.treeLayer[i];
              }
            }
            myFeatureTable = new FeatureTable({
              featureLayer: layer,
              map: map,
              showAttachments: false,
              // only allows selection from the table to the map
              syncSelection: true,
              zoomToSelection: true,
              gridOptions: {
                allowSelectAll: true,
                allowTextSelection: true
              },
              editable: true,
              dateOptions: {
              // set date options at the feature table level
              // all date fields will adhere this
                datePattern: 'MMMM d, y'
              },
              // define order of available fields. If the fields are not listed in 'outFields'
              // then they will not be available when the table starts.
              outFields: info.outFields,
              // use fieldInfos property to change field's label (column header),
              // the editability of the field, and to format how field values are displayed
              fieldInfos: info.columns
              // [
              //   {
              //     name: 'areaname',
              //     alias: '名称',
              //     editable: false,
              //     width: 400
              //   },
              //   {
              //     name: 'capital',
              //     alias: '首都'

              //   },
              //   {
              //     name: 'class',
              //     alias: 'Available Size'

              //   }
              // ]
            }, 'myTableNode');
            return myFeatureTable;
          }

          /**
           * featurelayer的空间查询
           */
          function featureLayerqueryGraphic (geometry) {
            that.isShow = true;
            let featurelayer = map.getLayer(map.graphicsLayerIds[map.graphicsLayerIds.length - 1]);
            let info;
            for (let i = 0; i < that.treeLayer.length; i++) {
              if (that.treeLayer[i].id === layer.id) {
                info = that.treeLayer[i];
              }
            }
            // 创建查询对象，注意：服务的后面有一个编号，代表对那一个图层进行查询
            // var queryTask = new QueryTask(layer._url.path);
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
            // queryTask.execute(query, showQueryResult);
            featurelayer.queryFeatures(query, showQueryResult);
          }

          /**
           * 点击表格中的tr的触发事件
           */
          function start () {
            myFeatureTable.on('show-attachments', function (evt) {
              alert('22')
              console.log('show-attachments', evt);
            });
          }

          // myFeatureTable.on('row-select', function (evt) {
          //   popup.show();
          //   alert('33')
          //   console.log('select event - ', evt.rows[0].data);
          // });
          /**
           *
           * 清除绘制
           */
          on(dom.byId('clearGraphics'), 'click', function () {
            // map.graphics.clear();
            // popup.show();
            myFeatureTable.clearSelection();
          })

          //           function buildLayerList(layer) {
          // 30             let infos = layer.layerInfos, info;
          // 31             let items = [];
          // 32             for (var i=0,j=infos.length;i<j;i++) {
          // 33                 info = infos[i];
          // 34                 if (info.defaultVisibility) {
          // 35                     visible.push(info.id);
          // 36                 }
          // 37                 items[i] = "<input type='checkbox' class='list_item' checked='" + (info.defaultVisibility ? "checked" : "") + "' id='" + info.id +"' onclick='updateLayerVisibility();'/><label for='" +info.id+ "'>" +info.name+ "</label>";
          // 38             }
          // 39             dojo.byId("layer_list").innerHTML = items.join();
          // 40
          // 41             layer.setVisibleLayers(visible);
          // 42             map.addLayer(layer);
          // 43
          // 44         }
        })
    },
    handleRowChange: function (currentRow, index) {

    },
    itemgra: function () {
      alert('no');
    },
    addEchart: function () {}
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
@import url('https://js.arcgis.com/3.26/dijit/themes/tundra/tundra.css');
@import url('https://js.arcgis.com/3.26/dijit/themes/claro/claro.css');
@import url('https://js.arcgis.com/3.26/esri/css/esri.css');
.container {
  height: ~'calc(100vh - 70px)';
}
#map {
  min-height: 480px;
  width: 100%;
  position: relative;
}
#layerListPane {
  width: 25%;
}
.esriLayer {
  background-color: #fff;
}
#layerList {
  width: 20%;
}
.esriLayerList .esriList {
  border-top: none;
}
.esriLayerList .esriTitle {
  background-color: #fff;
  border-bottom: none;
}
.esriLayerList .esriList ul {
  background-color: #fff;
}
#divShowResult {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 200px;
  overflow: auto;
  z-index: 99;
  background: #fff;
}
.fea-que {
  width: 100%;
}
.closeTable {
  position: absolute;
  right: 3px;
  top: 1px;
}
</style>
