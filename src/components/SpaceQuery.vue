<template>
    <!-- <Tree :data="data1" show-checkbox></Tree> -->

    <div id="map" data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'center'">
      <div style="position:absolute; right:20px; top:80px; z-Index:999;">
        <span>Draw:<br /></span>
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

</template>
<script>

import esriload from 'esri-loader'
export default {
  name: 'SpaceQuery',
  data () {
    return {
      data1: [
        {
          title: 'parent 1',
          expand: true,
          children: [
            {
              title: 'parent 1-1',
              expand: true,
              children: [
                {
                  title: 'leaf 1-1-1'
                },
                {
                  title: 'leaf 1-1-2'
                }
              ]
            },
            {
              title: 'parent 1-2',
              expand: true,
              children: [
                {
                  title: 'leaf 1-2-1'
                },
                {
                  title: 'leaf 1-2-1'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    createMap: function () {
      let map, toolbar, symbol, geomTask;
      const options = {
        url: 'https://js.arcgis.com/3.25/'
      };
      esriload.loadModules(['esri/map',
        'esri/toolbars/draw',
        'esri/graphic',

        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/SimpleLineSymbol',
        'esri/symbols/SimpleFillSymbol',

        'dojo/parser', 'dijit/registry', 'dijit/layout/BorderContainer', 'dijit/layout/ContentPane',
        'dijit/form/Button', 'dijit/WidgetSet', 'dojo/domReady!'], options)
        .then(([Map,
          Draw, Graphic,
          SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
          parser, registry]) => {
          // create map with the given options at a DOM node w/ id 'mapNode'
          parser.parse();

          map = new Map('map', {
            basemap: 'streets',
            center: [-15.469, 36.428],
            zoom: 4
          });

          map.on('load', createToolbar);

          // loop through all dijits, connect onClick event
          // listeners for buttons to activate drawing tools
          debugger;
          registry.forEach(function (d) {
          // d is a reference to a dijit
          // could be a layout container or a button
            if (d.declaredClass === 'dijit.form.Button') {
              d.on('click', activateTool);
            }
          });

          function activateTool () {
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
            var graphic = new Graphic(evt.geometry, symbol);
            map.graphics.add(graphic);
          }
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
#map {
  min-height: 480px;
  position: relative;
}
</style>
