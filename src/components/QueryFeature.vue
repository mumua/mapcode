<template>
  <div
    class="container"
    id="echartContainer"
    data-dojo-type="dijit/layout/BorderContainer"
    data-dojo-props="design:'headline',gutters:false"
  >
    <div id="map" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'center'">
      <!-- <div id="layerList" style="width:20%;position:absolute; right:20px; top:20px; z-Index:999;"></div> -->
      <!-- <div id="divShowResult"></div> -->
      <Icon v-show="isShow" class="closeTable" type="ios-close" @click="closeShow"/>
      <div id="divShowResult" v-show="isShow">
        <Table
          border
          height="180"
          :loading="loading"
          stripe
          :columns="columns5"
          :data="historyData"
          @on-row-click="clickOneList"
        ></Table>
        <Page
          :total="dataCount"
          :page-size="pageSize"
          show-elevator
          show-total
          @on-change="changepage"
          style="margin-top:4px"
        />
      </div>
    </div>
    <div class="fea-que"></div>
  </div>
</template>
<script>
import esriload from 'esri-loader';
import echarts from 'echarts';
import MapMenu from '@/components/MapMenu';
export default {
  name: 'QueryFeature',
  component: MapMenu,
  data () {
    return {
      // isShow: this.$store.state.isShow,
      treeLayer: [],
      ajaxHistoryData: [],
      dataCount: 0,
      // 每页显示多少条
      pageSize: 10,
      loading: true,
      columns5: [
        // {
        //   title: '种类',
        //   key: '种类',
        //   sortable: true
        // },
        // {
        //   title: '科属',
        //   key: '科属'
        // },
        // {
        //   title: '高度',
        //   key: '高度'
        // },
        // {
        //   title: '胸径',
        //   key: '胸径'
        // },
        // {
        //   title: '分支数',
        //   key: '分支数'
        // },
        // {
        //   title: '冠幅_m_m',
        //   key: '冠幅_m_m'
        // },
        // {
        //   title: '健康状',
        //   key: '健康状'
        // },
        // {
        //   title: '登记时',
        //   key: '登记时'
        // }
      ],
      featureList: [],
      feature: [],
      featureTable: 0,
      historyData: []
    };
  },
  watch: {
    featureListCha: function (ov, nv) {
      if (ov === nv) {
        this.handleListApproveHistory();
      } else {
        this.handleListApproveHistory();
      }
    }
  },
  computed: {
    arry () {
      return this.featureList;
    },
    featureListCha () {
      return this.featureList;
    },
    isShow () {
      return this.$store.state.isShow;
    }
  },
  created: function () {
    // this.treeLayer = this.$store.state.layersSelect;
    this.handleListApproveHistory();
  },
  methods: {
    createMap: function () {
      const options = {
        url: 'https://js.arcgis.com/3.26/'
      };
      esriload
        .loadModules(
          [
            'esri/map',
            'esri/config',
            'esri/Color',
            'esri/SpatialReference',
            'esri/dijit/Basemap',
            'esri/dijit/BasemapLayer',
            'esri/dijit/BasemapGallery',
            'esri/arcgis/utils',
            'esri/dijit/LayerList',
            'esri/dijit/Scalebar',
            'esri/layers/WMTSLayerInfo',
            'esri/toolbars/draw',
            'esri/geometry/Point',
            'esri/geometry/Polygon',
            'esri/graphic',
            'esri/layers/ArcGISDynamicMapServiceLayer',
            'esri/layers/ArcGISTiledMapServiceLayer',
            'esri/layers/TiledMapServiceLayer',
            'esri/layers/FeatureLayer',
            'esri/dijit/FeatureTable',
            'dojo/on',
            'dojo/dom',
            'esri/tasks/QueryTask',
            'esri/tasks/query',
            'esri/tasks/FindTask',
            'esri/tasks/FindParameters',
            'esri/tasks/GeometryService',
            'esri/tasks/BufferParameters',
            'esri/geometry/geometryEngine',
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
            'esri/renderers/ClassBreaksRenderer',
            'dojo/_base/array',
            'dojo/domReady!',

            'dijit/registry',
            'dojo/parser'
          ],
          options
        )
        .then(
          ([
            Map,
            esriConfig,
            Color,
            SpatialReference,
            Basemap,
            BasemapLayer,
            BasemapGallery,
            arcgisUtils,
            LayerList,
            Scalebar,
            WMTSLayerInfo,
            Draw,
            Point,
            Polygon,
            Graphic,
            ArcGISDynamicMapServiceLayer,
            ArcGISTiledMapServiceLayer,
            TiledMapServiceLayer,
            FeatureLayer,
            FeatureTable,
            on,
            dom,
            QueryTask,
            Query,
            FindTask,
            FindParameters,
            GeometryService,
            BufferParameters,
            geometryEngine,
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
            ClassBreaksRenderer,
            array,
            domReady,
            registry,
            parser
          ]) => {
            // create map with the given options at a DOM node w/ id 'mapNode'
            parser.parse();
            //          esriConfig.defaults.io.proxyUrl = '../../Proxy/Proxy/Web/proxy.ashx';
            //         esriConfig.defaults.io.alwaysUseProxy = true;
            const that = this;
            /**
             * 点线面的符号
             */
            let pointSymbolBlue = new PictureMarkerSymbol(
              './static/images/blueMarker.png',
              18,
              26
            ).setOffset(0, 5);
            let pointSymbolRed = new PictureMarkerSymbol(
              './static/images/redMarker.png',
              18,
              26
            ).setOffset(0, 0);
            let pointSymbol = new SimpleMarkerSymbol(
              SimpleMarkerSymbol.STYLE_CIRCLE,
              5,
              new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([0, 0, 0]),
                0.3
              ),
              new Color([135, 206, 250, 0.5])
            );
            let redPointSymbol = new SimpleMarkerSymbol(
              SimpleMarkerSymbol.STYLE_CIRCLE,
              5,
              new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([0, 0, 0]),
                0.3
              ),
              new Color([244, 98, 89, 0.6])
            );
            let bluePointSymbol = new SimpleMarkerSymbol(
              SimpleMarkerSymbol.STYLE_CIRCLE,
              5,
              new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([0, 0, 0]),
                0.3
              ),
              new Color([16, 149, 255, 1])
            );
            let lineSymbol = new SimpleLineSymbol(
              SimpleLineSymbol.STYLE_SOLID,
              new Color([255, 0, 0]),
              3
            );
            let fill = new SimpleFillSymbol(
              SimpleFillSymbol.STYLE_SOLID,
              lineSymbol,
              new Color([0, 191, 255])
            );
            var fills = new SimpleFillSymbol(
              'solid',
              null,
              new Color('#A4CE67')
            );
            var popup = new Popup(
              {
                fillSymbol: fills,
                titleInBody: false
              },
              domConstruct.create('div')
            );
            // 初始化热点图
            let heatmapRenderer = new HeatmapRenderer({
              colors: [
                'rgba(0, 0, 214, 0)',
                'rgb(136, 223, 129)',
                'rgb(255, 255,0)',
                'rgb(253, 101, 0)'
              ],
              // colors: ['rgba(0, 0, 255, 0)', 'rgb(127,210,118)', 'rgb(215, 221, 121)', 'rgb(207, 128, 72)'],
              // colors: ['rgba(0, 255, 255)', 'rgb(0, 110, 255)', 'rgb(100, 0, 255)'],
              // colors: ['rgba(0, 0, 255, 0)', 'rgba(131, 132, 225)', 'rgba(128, 166, 215)', 'rgba(142, 224, 222)', 'rgb(127,210,118)', 'rgb(215, 221, 121)', 'rgb(207, 128, 72)'],
              blurRadius: 8
              //  maxPixelIntensity: 30,
              //  minPixelIntensity: 2
            });
            let map = new Map('map', {
              center: [108, 34.5], // 中国,
              // center: [-103, 18],
              zoom: 3,
              minZoom: 1,
              maxZoom: 20,
              basemap: 'gray',
              infoWindow: popup,
              logo: false
            });
            let toolbar;
            // let graphic = new GraphicsLayer({ id: 'draw' });
            let graphic = new GraphicsLayer({ id: '1' });
            let graphicFeature = new GraphicsLayer({ id: 'feature' }, 1); // 属性定位
            let graphicQuery = new GraphicsLayer({ id: '2' }, 2); // 属性查询的绘制
            let Scalebar1 = new Scalebar({
              map: map,
              // "dual" displays both miles and kilometers
              // "english" is the default, which displays miles
              // use "metric" for kilometers
              scalebarUnit: 'metric'
            });
            map.addLayer(graphicQuery);
            map.addLayer(graphicFeature);
            let basemaps = [];
            // 第一个basemap
            var waterTemplateLayer = new BasemapLayer({
              url:
                'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer'
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
              url:
                'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer'
            });
            var publicSafetyBasemap = new Basemap({
              layers: [publicSafetyLayer],
              title: '土地利用专题图',
              thumbnailUrl: 'static/images/nuanse.jpg',
              width: '100px',
              float: 'left'
            });
            basemaps.push(publicSafetyBasemap);
            let basemapGallery = new BasemapGallery(
              {
                showArcGISBasemaps: false,
                basemaps: basemaps,
                map: map
              },
              'basemapGallery'
            );
            basemapGallery.startup();
            // let layerList = new LayerList()
            let demographicsLayerURL =
              'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer';
            var demographicsLayerOptions = {
              id: 'demographicsLayer',
              opacity: 0.8,
              showAttribution: false
            };
            let demographicsLayer = new ArcGISDynamicMapServiceLayer(
              demographicsLayerURL,
              demographicsLayerOptions
            );
            // demographicsLayer.setInfoTemplates({
            //   1: { infoTemplate: _blockGroupInfoTemplate },
            //   2: { infoTemplate: _countyCensusInfoTemplate }
            // });
            demographicsLayer.setVisibleLayers([1, 2]);

            let layer = [];
            var MapServer =
              'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer';
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
              fieldInfos: [
                {
                  // define field infos so we can specify an alias
                  fieldName: 'Number_Ent',
                  label: 'Entrants'
                },
                {
                  fieldName: 'Number_Sta',
                  label: 'Starters'
                },
                {
                  fieldName: 'Number_Fin',
                  label: 'Finishers'
                }
              ],
              mediaInfos: [
                {
                  // define the bar chart
                  caption: '',
                  type: 'barchart',
                  value: {
                    theme: 'Dollar',
                    fields: ['Number_Ent', 'Number_Sta', 'Number_Fin']
                  }
                }
              ]
            });
            var featureLayer = new FeatureLayer(
              'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Boston_Marathon/FeatureServer/0',
              {
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: ['*'],
                infoTemplate: template
              }
            );
            // map.addLayer(featureLayer);

            /**
             * 属性查询的样式
             */
            function selectSymbolStyle (type) {
              // let type = layer.geometryType;
              // let type = type;
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
                case 'polygon':
                  symbol = fill;
                  break;
                case 'point':
                  symbol = pointSymbolBlue;
                  break;
                case 'polyline':
                  symbol = fills;
                  break;
              }
              return symbol;
            }

            // 创建属性查询参数
            var findParams = new FindParameters();
            on(dom.byId('Btn'), 'click', function () {
              // that.isShow = true;
              that.$store.state.isShow = true;
              that.loading = true;

              // 获取maptool中选中的图层
              let layerid = that.$store.state.layer;

              // 通过获取的图层id找到该图层的地址
              let layer = map.getLayer(layerid);
              that.columns5 = getLayerFiled(layer).columns;
              layer.setSelectionSymbol(selectSymbolStyle(layer.geometryType));
              // let a = featureLayerQuery(layer)

              // a.startup();
              var query = new Query();
              query.where = '1=1';
              query.returnGeometry = true; // 返回图形
              // query.where = "种类 = '樟树'";
              layer.queryFeatures(query, ShowFindResult);
            });
            function ShowFindResult (queryResult) {
              // 创建线符号
              // var lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH);
              // 创建面符号
              //  var fill = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineSymbol);
              that.loading = false;
              that.featureList = [];
              graphicQuery.clear();
              if (queryResult.length === 0) {
                return;
              }
              if (queryResult.features.length >= 1) {
                for (let h = 0; h < queryResult.features.length; h++) {
                  queryResult.features[h].attributes.geometry =
                    queryResult.features[h].geometry;
                  //   queryResult.features[h].attributes.attributes = queryResult.features[h].attributes;
                  that.featureList.push(queryResult.features[h].attributes);
                }

                for (var i = 0; i < queryResult.features.length; i++) {
                  var graphic = queryResult.features[i];
                  graphic.setSelectionSymbol(
                    selectSymbolStyle(graphic.geometry.type)
                  );
                  // graphic.setSymbol(pointSymbol);
                  graphicQuery.add(graphic);
                }
              }
            }

            /**
             * 空间查询
             */
            function queryGraphic (geometry) {
              that.$store.state.isShow = true;
              let layer = map.getLayer(
                map.graphicsLayerIds[map.graphicsLayerIds.length - 1]
              );
              that.columns5 = getLayerFiled(layer).columns;
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
              that.loading = false;
              that.featureList = [];
              graphicQuery.clear();
              if (queryResult.features.length === 0) {
                //  dom.byId('divShowResult').innerHTML = '';
                return;
              }

              // that.feature = queryResult.features;
              if (queryResult.features.length >= 1) {
                for (var i = 0; i < queryResult.features.length; i++) {
                  queryResult.features[i].attributes.geometry = queryResult.features[i].geometry;
                  // queryResult.features[i].attributes.attributes = queryResult.features[i].attributes;
                  that.featureList.push(queryResult.features[i].attributes);
                  // 得到graphic
                  var graphic = queryResult.features[i];
                  // 给图形赋予符号
                  graphic.setSymbol(fill);
                  // 添加到地图从而实现高亮效果
                  graphicQuery.add(graphic);
                  // 获得教学楼的名称信息，此处应和shp的属性表对应
                  // var ptName = graphic.attributes['CITY_NAME'];
                  // let ptype = graphic.attributes['TYPE'];
                }
              }
            }

            Window.itemgra = function (i) {
              graphicFeature.clear();
              let geometry;
              let symbol;
              if (i.geometry.type === 'point') {
                geometry = new Point(i.geometry);
                symbol = selectSymbolStyle(i.geometry.type);
              } else if (i.geometry.type === 'polygon') {
                geometry = i.geometry;
                symbol = selectSymbolStyle(i.geometry.type);
                delete geometry.declaredClass;
                delete geometry.cache;
                delete geometry.type;
              }

              // let graphic = new Graphic(inPoint, pointSymbol, i.attributes, template);
              let graphic = new Graphic(
                geometry,
                symbol,
                i.attributes,
                template
              );
              // 添加到地图从而实现高亮效果
              graphicFeature.add(graphic);
              map.infoWindow.show(geometry);
              map.infoWindow.setFeatures([graphic]);
              // map.graphics.add(graphic);
              // map.infoWindow.show(inPoint);
              // map.infoWindow.setFeatures([graphic]);
              // map.centerAt(graphic.geometry)
              map.centerAndZoom(graphic.geometry, 6);
            };

            on(dom.byId('layerSelect'), 'click', function () {
              dom.byId('divShowResult');
            });

            /**
             * popup
             */
            let popupTemplate = new PopupTemplate({
              title: '基本信息',
              description: '名称：{state_name}，人口数：{pop2000}',
              content: '{pop2000}:  {st_area} of starters finished'
            });

            let visible = [];

            function getlayerlist (layer) {
              let infos = layer.layerInfos;
              let info;
              let items = [];
              for (var i = 0, j = infos.length; i < j; i++) {
                info = infos[i];
                if (info.defaultVisibility) {
                  visible.push(info.id);
                }
                items[i] =
                  "<input type='checkbox' class='list_item' checked='" +
                  (info.defaultVisibility ? 'checked' : '') +
                  "' id='" +
                  info.id +
                  "' onclick='updateLayerVisibility();'/><label for='" +
                  info.id +
                  "'>" +
                  info.name +
                  '</label>';
              }
              dom.byId('layer_list').innerHTML = items.join();

              layer.setVisibleLayers(visible);
              // map.addLayer(layer);
            }

            map.on('load', createToolbar);
            map.on('click', doBuffer);

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
              graphicFeature.clear();
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

              map.showZoomSlider();
              if (evt.geometry.type === 'point') {
                doBuffer(evt);
              } else {
                queryGraphic(evt.geometry);
                switch (evt.geometry.type) {
                  case 'point':
                    // symbol = new SimpleMarkerSymbol();
                    symbol = new PictureMarkerSymbol(
                      './static/images/marker.png',
                      25,
                      35
                    ).setOffset(0, 0);
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
              }
              // let graphic = new Graphic(evt.geometry, symbol);
              map.graphics.add(new Graphic(evt.geometry, symbol));
            }
            let gsvc = new GeometryService(
              'https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer'
            );

            function doBuffer (evt) {
              // map.graphics.clear();

              var params = new BufferParameters();
              let geometrie = new Point(evt.geometry);
              params.geometries = [geometrie];
              let resolution = map.getScale();
              let distances = (0.0254 / 96) * 10 * resolution; // 10像素的实际距离

              // buffer in linear units such as meters, km, miles etc.
              params.distances = [0.8, distances];
              params.unit = GeometryService.UNIT_KILOMETER; // 修改单位
              params.bufferSpatialReference = new SpatialReference({
                wkid: 102100
              });
              params.outSpatialReference = map.spatialReference;
              gsvc.buffer(params, showBuffer);

              // var bufferedGeometries = geometryEngine.geodesicBuffer(
              //   [geometrie],
              //   [10],
              //   'kilometers',
              //   showBuffer
              // );
            }
            function showBuffer (bufferedGeometries) {
              var symbol = new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(
                  SimpleLineSymbol.STYLE_SOLID,
                  new Color([0, 0, 255, 0.65]),
                  2
                ),
                new Color([0, 0, 255, 0.35])
              );
              array.forEach(bufferedGeometries, function (geometry) {
                graphicFeature.clear();
                var graphic = new Graphic(geometry, symbol);
                graphicFeature.add(graphic); // 缓冲范围
                getOneFeature(geometry);
              });
            }

            function getOneFeature (geometry) {
              let layer = map.getLayer(
                map.graphicsLayerIds[map.graphicsLayerIds.length - 1]
              );
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
              // layer.queryFeatures(query, showQueryResult);
              queryTask.execute(query, showOneResult);
            }

            function showOneResult (queryResult) {
              if (queryResult.features.length === 0) {
              } else {
                //  graphicFeature.clear();
                let inPoint;
                let graphic;
                let fet;
                if (queryResult.features.length > 1) {
                  for (
                    let index = 0;
                    index < queryResult.features.length - 1;
                    index++
                  ) {
                    if (
                      queryResult.features[index].attributes['高度'] >
                      queryResult.features[index + 1].attributes['高度']
                    ) {
                      fet = index;
                    } else {
                      fet = index + 1;
                    }
                  }
                  inPoint = new Point(queryResult.features[fet].geometry);
                  graphic = new Graphic(
                    inPoint,
                    pointSymbolBlue,
                    queryResult.features[fet].attributes,
                    template
                  );
                } else {
                  inPoint = new Point(queryResult.features[0].geometry);
                  graphic = new Graphic(
                    inPoint,
                    pointSymbolBlue,
                    queryResult.features[0].attributes,
                    template
                  );
                }

                // inPoint = new Point(queryResult.features[0].geometry)

                // let graphic = new Graphic(inPoint, pointSymbolBlue, queryResult.features[0].attributes, template);

                // 添加到地图从而实现高亮效果
                graphicFeature.add(graphic);
                map.infoWindow.show(inPoint);
                map.infoWindow.setFeatures([graphic]);
                // map.centerAt(graphic.geometry)
                map.centerAndZoom(graphic.geometry, 8);
              }
            }
            // let layerselect = [{name: map.layerIds[0]}, {name: map.layerIds[1]}]
            that.$store.state.layersSele = map.layerIds;
            that.$store.state.map = map;

            on(dom.byId('tree1'), 'click', function () {
              if (
                that.treeLayer.length < that.$store.state.layersSelect.length
              ) {
                // that.treeLayer.push();
                for (
                  let i = 0;
                  i < that.$store.state.layersSelect.length;
                  i++
                ) {
                  if (
                    JSON.stringify(that.treeLayer).indexOf(
                      JSON.stringify(that.$store.state.layersSelect[i])
                    ) === -1
                  ) {
                    console.log('不存在');
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
                  if (
                    JSON.stringify(that.$store.state.layersSelect).indexOf(
                      JSON.stringify(that.treeLayer[j])
                    ) === -1
                  ) {
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

            function getLayerFiled (layer) {
              let info;
              for (let i = 0; i < that.treeLayer.length; i++) {
                if (that.treeLayer[i].id === layer.id) {
                  info = that.treeLayer[i];
                }
              }
              return info;
            }
            var myFeatureTable = {};
            function featureLayerQuery (layer) {
              let info;
              for (let i = 0; i < that.treeLayer.length; i++) {
                if (that.treeLayer[i].id === layer.id) {
                  info = that.treeLayer[i];
                }
              }
              myFeatureTable = new FeatureTable(
                {
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
                },
                'myTableNode'
              );
              return myFeatureTable;
            }

            /**
             * featurelayer的空间查询
             */
            function featureLayerqueryGraphic (geometry) {
              that.$store.state.isShow = true;
              that.loading = true;
              let featurelayer = map.getLayer(
                map.graphicsLayerIds[map.graphicsLayerIds.length - 1]
              );
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
             *
             * 清除绘制
             */
            on(dom.byId('clearGraphics'), 'click', function () {
              // map.graphics.clear();
              // popup.show();
              myFeatureTable.clearSelection();
            });

            Window.clearKJ = function () {
              map.graphics.clear();
              graphicQuery.clear();
              graphicFeature.clear();
              map.infoWindow.hide();
              that.$store.state.isShow = false;
              that.$store.state.spaceTagShow = false;
              queryGraphic('');
            };

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
          }
        );
    },
    clickOneList: function (row) {
      let feature = {};
      feature.geometry = row.geometry;
      delete row.geometry;
      feature.attributes = row;
      feature.symbol = null;

      Window.itemgra(feature);
    },
    closeShow: function () {
      // this.isShow = !this.isShow;
      this.$store.state.isShow = this.isShow;
    },
    handleRowChange: function (currentRow, index) { },
    addEchart: function () { },
    handleListApproveHistory () {
      // 保存取到的所有数据
      this.ajaxHistoryData = this.featureList;
      this.dataCount = this.featureList.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if (this.featureList.length < this.pageSize) {
        this.historyData = this.ajaxHistoryData;
      } else {
        this.historyData = this.ajaxHistoryData.slice(0, this.pageSize);
      }
    },
    changepage (index) {
      var _start = (index - 1) * this.pageSize;
      var _end = index * this.pageSize;
      this.historyData = this.ajaxHistoryData.slice(_start, _end);
    }
  },
  mounted: function () {
    if (!esriload.isLoaded) {
      esriload.bootstrap(
        err => {
          if (err) {
            console.error(err);
          } else {
            this.createMap();
          }
        },
        {
          url: 'https://js.arcgis.com/3.20/'
        }
      );
    } else {
      this.createMap();
    }
  }
};
</script>
<style lang="less" scoped>
@import url("https://js.arcgis.com/3.26/dijit/themes/tundra/tundra.css");
@import url("https://js.arcgis.com/3.26/dijit/themes/claro/claro.css");
@import url("https://js.arcgis.com/3.26/esri/css/esri.css");
.container {
  height: ~"calc(100vh - 70px)";
}
#map {
  min-height: ~"calc(100vh - 70px)";
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
  height: 217px;
  overflow: auto;
  z-index: 99;
  background: #fff;
}
.fea-que {
  width: 100%;
}
.closeTable {
  position: absolute;
  right: 17px;
  bottom: 195px;
  z-index: 999;
  width: 20px;
  height: 20px;
}
.pop-img {
  width: 118px;
  height: 136px;
  vertical-align: top;
}
img:hover {
  transform: scale(3);
  position: absolute;
  z-index: 100;
}
</style>
