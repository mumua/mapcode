<template>
  <div>

        <div id="map">
          <div style="position:absolute; right:20px; top:10px; z-Index:999;">

                <div id="basemapGallery"></div>

          </div>
          <div style="position:absolute; right:20px; top:80px; z-Index:999;">
            <button data-dojo-type="dijit/form/Button">Point</button>
          <button data-dojo-type="dijit/form/Button">Multi Point</button>
          <button data-dojo-type="dijit/form/Button">Line</button>
          <button data-dojo-type="dijit/form/Button">Polyline</button>
          <button data-dojo-type="dijit/form/Button">Polygon</button>
          <button data-dojo-type="dijit/form/Button">Freehand Polyline</button>
          <button data-dojo-type="dijit/form/Button">Freehand Polygon</button>

          <button data-dojo-type="dijit/form/Button">Arrow</button>
          <button data-dojo-type="dijit/form/Button">Triangle</button>
          <button data-dojo-type="dijit/form/Button">Circle</button>
          <button data-dojo-type="dijit/form/Button">Ellipse</button>
          </div>
        </div>

    <button @click="getinfo"> dianji</button>
  </div>
</template>
<script>

import esriload from 'esri-loader'
export default{
  name: 'IndexView',
  data () {
    return {
      // map: '111',
      // toolbar: '',
      // basemapGallery: '',
      // graphic: '',
      // registry: ''
    }
  },
  create: {},
  methods: {
    createMap: function () {
      // esriload.dojoRequire(['esri/map', 'dojo/domReady!'], (Map) => {
      //   let map = new Map('map', {
      //     center: [-118, 34.5],
      //     zoom: 8,
      //     logo: false,
      //     basemap: 'top'
      //   })
      // })
      const options = {
        url: 'https://js.arcgis.com/3.25/'
      };
      esriload.loadModules(['esri/map',
        'esri/dijit/BasemapGallery',
        'esri/arcgis/utils',
        'esri/dijit/LayerList',
        'esri/dijit/Scalebar',
        'esri/layers/WMTSLayerInfo',
        'esri/toolbars/draw',
        'esri/graphic',

        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/SimpleLineSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/layers/GraphicsLayer',
        'esri/dijit/Popup',
        'esri/dijit/PopupTemplate',
        'dojo/dom-construct',

        'dijit/registry',
        'dojo/parser'], options)
        .then(([Map,
          BasemapGallery,
          arcgisUtils,
          LayerList,
          Scalebar,
          WMTSLayerInfo,
          Draw,
          Graphic,
          SimpleMarkerSymbol,
          SimpleLineSymbol,
          SimpleFillSymbol,
          GraphicsLayer,
          Popup,
          PopupTemplate,
          domConstruct,
          registry,
          parser]) => {
          // create map with the given options at a DOM node w/ id 'mapNode'
          parser.parse();
          let popup = new Popup(null, domConstruct.create('div'))
          let map = new Map('map', {
            center: [108, 34.5],
            zoom: 3,
            basemap: 'dark-gray',
            infoWindow: popup
          });
          let toolbar;
          let graphic = new GraphicsLayer({ id: 'draw' });

          map.addLayer(graphic);
          map.on('load', createToolbar);

          // 点击地图响应
          map.on('click', function (e) {
            // 点击空白处隐藏popup
            if (e.graphic === undefined) {
              popup.hide();
            }
          });
          this.scalebar = new Scalebar({
            map: this.map,
            // "dual" displays both miles and kilometers
            // "english" is the default, which displays miles
            // use "metric" for kilometers
            scalebarUnit: 'metric'
          });

          let basemapGallery = new BasemapGallery({
            showArcGISBasemaps: true,
            map: map
          }, 'basemapGallery');
          basemapGallery.startup();

          basemapGallery.on('error', function (msg) {
            console.log('basemap gallery error:  ', msg);
          });
          debugger;
          registry.forEach(function (d) {
          // d is a reference to a dijit
          // could be a layout container or a button
            if (d.declaredClass === 'dijit.form.Button') {
              d.on('click', activateTool);
            }
          });

          function activateTool () {
            graphic.clear();
            debugger;
            var tool = this.label.toUpperCase().replace(/ /g, '_');
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
        })
    },
    // gettypeForSpase: function (d) {
    //   if (d.declaredClass === 'dijit.form.Button') {
    //     //     debugger;
    //     d.on('click', this.activateTool);
    //   }
    // },
    // activateTool: function () {
    //   var tool = this.label.toUpperCase().replace(/ /g, '_');
    //   toolbar.activate(Draw[tool]);
    //   map.hideZoomSlider();
    // },
    getinfo: function () {
      this.$http.get('./static/Config.json').then(response => {
        // response.status;
        // 响应成功回调
        alert(response.body.logoName);
      }, response => {
        // 响应错误回调
        alert('服务器请求失败');
      });
    }
    // addMap: function (servicetype) {
    //   esriload.loadModules(['esri/map', 'esri/layers/WMSLayer','esri/layers/WMSLayerInfo','esri/layers/WMTSLayerInfo',
    //     'dojo/parser'], options)
    //     .then(([Map, WMSLayer, WMSLayerInfo, WMTSLayerInfo, parser]) => {
    //       switch (servicetype) {
    //         case 'WMTSLayer':
    //           var wmsLayer = new WMSLayer('http://host/geoserver/wms', {
    //             format: 'png',
    //             resourceInfo: {
    //               copyright: 'GeoServer',
    //               description: 'Africa Wind Data',
    //               extent: new Extent(-180, -90, 180, 90, {wkid: 4326}),
    //               featureInfoFormat: 'text/html',
    //               getFeatureInfoURL: 'http://host/geoserver/ows',
    //               getMapURL: 'http://host/geoserver/ows',
    //               layerInfos: [
    //                 new WMSLayerInfo({
    //                   name: 'AFG_Wind:AFG_WindGenAnnualEnergy',
    //                   title: 'Mean annual generalized wind power density',
    //                   queryable: true,
    //                   showPopup: true
    //                 })
    //               ],
    //               spatialReferences: [3857, 42303],
    //               version: '1.3.0'
    //             },
    //             version: '1.3.0',
    //             visibleLayers: [
    //               'AFG_Wind:AFG_WindGenAnnualEnergy'
    //             ]
    //           });

    //           wmsLayer.on('error', function (response) {
    //             console.log('Error: %s', response.error.message);
    //           });
    //           map.addLayer(wmsLayer);
    //         case 'WMTSLayerInfo':
    //           let layerInfo = new WMTSLayerInfo({
    //             identifier: 'world',
    //             tileMatrixSet: 'EPSG:4326',
    //             format: 'gif'
    //           });
    //           let options = {
    //             serviceMode: 'KVP',
    //             layerInfo: layerInfo
    //           };

    //           var wmtsLayer = new WMTSLayer('http://v2.suite.opengeo.org/geoserver/gwc/service/wmts', options);
    //       }
    //     }
    // },
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
#map {
  min-height: 480px;
  position: relative;
}
</style>
