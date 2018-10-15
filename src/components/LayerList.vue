<template>
    <div class="container" data-dojo-type="dijit/layout/BorderContainer"
data-dojo-props="design:'headline',gutters:false">

      <div id="map" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'center'">
        <!-- <div id="layerList" style="width:20%;position:absolute; right:20px; top:20px; z-Index:999;"></div> -->
      </div>
      Layer List: <span id="layer_list"></span><br />
    </div>

</template>
<script>
import esriload from 'esri-loader';
import MapMenu from '@/components/MapMenu';
export default{
  name: 'LayerList',
  data () {
    return {

    }
  },
  component: MapMenu,
  methods: {
    createMap: function () {
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
        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/SimpleLineSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/layers/GraphicsLayer',
        'esri/dijit/Popup',
        'esri/dijit/PopupTemplate',
        'dojo/dom-construct',
        'dijit/layout/BorderContainer',
        'dijit/layout/ContentPane',
        'esri/tasks/query',
        'dojo/domReady!',

        'dijit/registry',
        'dojo/dom',
        'dojo/on',
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
          SimpleMarkerSymbol,
          SimpleLineSymbol,
          SimpleFillSymbol,
          GraphicsLayer,
          Popup,
          PopupTemplate,
          domConstruct,
          BorderContainer,
          ContentPane,
          dom,
          on,
          query,
          domReady,
          registry,
          parser]) => {
          // create map with the given options at a DOM node w/ id 'mapNode'
          parser.parse();
          // arcgisUtils.createMap('f63fed3f87fc488489e27c026fa5d434', 'map').then(function (response) {
          //   var myWidget = new LayerList({
          //     map: response.map,
          //     layers: arcgisUtils.getLayerList(response)
          //   }, 'layerList');
          //   myWidget.startup();
          // });
          let map = new Map('map', {
            center: [108, 34.5],
            zoom: 3,
            basemap: 'dark-gray'
          });
          let toolbar;
          let graphic = new GraphicsLayer({ id: 'draw' });
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
          // map.addLayer(demographicsLayer);
          let tileUrl = 'http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer';
          let tileOptions = {
            'id': 'tilelayer',
            'showAttribution': false
          };
          let tileLayer = new ArcGISTiledMapServiceLayer(tileUrl, tileOptions);
          // map.addLayer(tileLayer);
          let layers = [
            {
              'id': 'defaultBasemap',
              'layer': {
                'id': 'defaultBasemap',
                'layerType': 'ArcGISMapServiceLayer',
                'url': 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer',
                'visibility': false,
                'opacity': 1,
                'title': 'Topographic'
              },
              // 'featureCollection': {
              //   // 'layerDefinition': null,
              //   // 'featureSet': {
              //   //   'features': [],
              //   //   'geometryType': 'esriGeometryPoint'
              //   // }
              //   'id': 'defaultBasemap',
              //   'layerType': 'ArcGISMapServiceLayer',
              //   'url': 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer',
              //   'visibility': false,
              //   'opacity': 1,
              //   'title': 'Topographic'
              // },
              'visible': false,
              'title': 'Topographic',
              'showLegend': true
            }
            // {
            //   'id': 'Census_6367',
            //   'layer': {
            //     'id': 'Census_6367',
            //     'url': 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer',
            //     'layerType': 'ArcGISMapServiceLayer',
            //     'visibility': false,
            //     'opacity': 1,
            //     'title': 'Census_6367'
            //   },

            //   'featureCollection': {
            //     // 'layerDefinition': null,
            //     // 'featureSet': {
            //     //   'features': [],
            //     //   'geometryType': 'esriGeometryPoint'
            //     // }
            //     'id': 'Census_6367',
            //     'url': 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer',
            //     'layerType': 'ArcGISMapServiceLayer',
            //     'visibility': false,
            //     'opacity': 1,
            //     'title': 'Census_6367'
            //   },
            //   'visible': false,
            //   'title': 'Census',
            //   'showLegend': true
            // },
            // {
            //   'id': 'oilAndGasLayer',
            //   'layer': {
            //     'id': 'oilAndGasLayer',
            //     'url': 'https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Petroleum/KGS_OilGasFields_Kansas/MapServer',
            //     'layerType': 'ArcGISMapServiceLayer',
            //     'visibility': false,
            //     'opacity': 1,
            //     'title': 'oilAndGasLayer'
            //   },
            //   'featureCollection': {
            //     // 'layerDefinition': null,
            //     // 'featureSet': {
            //     //   'features': [],
            //     //   'geometryType': 'esriGeometryPoint'
            //     // }
            //     'id': 'oilAndGasLayer',
            //     'url': 'https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Petroleum/KGS_OilGasFields_Kansas/MapServer',
            //     'layerType': 'ArcGISMapServiceLayer',
            //     'visibility': false,
            //     'opacity': 1,
            //     'title': 'oilAndGasLayer'
            //   },
            //   'visible': false,
            //   'title': 'oilAndGasLayer',
            //   'showLegend': true
            // }
          ];
          let la = [
            {
              id: 'USA_Population_Density_9382',
              layer: {
                arcgisProps: {title: 'USA Population Density'},
                attributionDataUrl: '',
                capabilities: 'Map,TilesOnly',
                cimVersion: undefined,
                className: undefined,
                copyright: 'HERE, Esri',
                credential: undefined,
                description: 'This map emphasizes areas with the highest population density (&gt;50,000 persons per square kilometer).',
                exclusionAreas: undefined,
                hasAttributionData: false,
                id: 'USA_Population_Density_9382',
                infoTemplates: null,
                isPNG32: false,
                loaded: true,
                maxImageHeight: undefined,
                maxImageWidth: undefined,
                maxRecordCount: undefined,
                maxScale: 9028,
                minScale: 692169,
                normalization: true,
                refreshInterval: 0,
                resampling: false,
                spatialReference: {wkid: 102100, latestWkid: 3857},
                supportsDynamicLayers: undefined,
                suspended: false,
                units: 'esriMeters',
                url: 'https://tiles.arcgis.com/tiles/nGt4QxSblgDfeJn9/arcgis/rest/services/USA_Population_Density/MapServer',
                version: 10.61,
                visibleAtMapScale: true,
                visible: false
              },
              title: 'USA Population Density',
              visibility: false
            }
            // {
            //   layer: {
            //     id: 'World Transportation',
            //     url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer'
            //   },
            //   title: 'World Transportation',
            //   visibility: false
            // }
          ];
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

          let layer = [];
          let layer1 = new ArcGISDynamicMapServiceLayer(
            'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer'
          )
          // let layer2 = new ArcGISDynamicMapServiceLayer({
          //   url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
          // })
          // map.addLayer(layer1);
          // layer.push(layer1);
          // // layer.push(layer2);
          // let infos = layer1.layerInfos;
          // let info;
          // let items = [];
          // for (let i = 0, j = infos.length; i < j; i++) {
          //   info = infos[i];
          //   if (info.defaultVisibility) {
          //     // visible.push(info.id);
          //   }
          //   items[i] = "<input type='checkbox' class='list_item' checked='" + (info.defaultVisibility ? 'checked' : '') + "' id='" + info.id + "' '/><label for='" + info.id + "'>" + info.name + '</label>';
          // }
          // dojo.byId('layerList').innerHTML = items.join();
          // let layerList = new LayerList({
          //   map: map,
          //   //layers: layer
          //   // showLegend: true,
          //   // showSubLayers: false,
          //   // showOpacitySlider: true
          // }, 'layerList');
          // layerList.startup();
          map.addLayer(layer1);
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

          map.on('load', getlayerlist);

          function updateLayerVisibility () {
            var inputs = query('.list_item');
            let input;
            visible = [];
            for (var i = 0, j = inputs.length; i < j; i++) {
              if (inputs[i].checked) {
                visible.push(inputs[i].id);
              }
            }
            layer1.setVisibleLayers(visible);
          }
          // registry.forEach(function (d) {
          // // d is a reference to a dijit
          // // could be a layout container or a button
          //   if (d.declaredClass === 'dijit.form.Button') {
          //     d.on('click', activateTool);
          //   }
          // });

          // function activateTool () {
          //   // graphic.clear();
          //   debugger;
          //   var tool = this.label.toUpperCase().replace(/ /g, '_');
          //   toolbar.activate(Draw[tool]);
          //   map.hideZoomSlider();
          // }

          // function createToolbar (themap) {
          //   toolbar = new Draw(map);
          //   toolbar.on('draw-end', addToMap);
          // }

          function addToMap (evt) {
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
@import url('https://js.arcgis.com/3.15/dijit/themes/tundra/tundra.css');
@import url('https://js.arcgis.com/3.20/esri/css/esri.css');
.container {
  height: 100vh;
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
</style>
