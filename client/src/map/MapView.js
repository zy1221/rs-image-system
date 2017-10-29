import React from 'react';
import ol from 'openlayers';
import 'openlayers/dist/ol.css';
import $ from 'jquery';


class MapView extends React.Component{
  componentDidMount(){
    var baseLayer=new ol.layer.Tile({
        source: new ol.source.OSM()      
        });
    window.view = new ol.View({
        center: [115.94, 40.52],
        zoom: 6,
        minZoom:3,
        projection: 'EPSG:4326',
        });   
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
      });    

    window.map = new ol.Map({
            layers: [baseLayer],
            target:"mapView",
            view: window.view,
            overlays: [overlay],
        });   
    window.vectorLayer= new ol.layer.Vector({
            source:new ol.source.Vector({
                features: []
            }),
            map:window.map
        });
    window.map.on('pointermove', function(evt) {
        var feature =window.map.forEachFeatureAtPixel(evt.pixel,
            function(feature, layer) {
                return feature;
            });
        if (feature) {
            var geometry = feature.getGeometry();
            var coord = geometry.getCoordinates();  
            var idArray=feature.get('id').split('->');
            content.innerHTML = '地点：'+idArray[0]+'；类别：'+idArray[1]+'；影像名：'+idArray[2];
            overlay.setPosition(coord);
        } else {
            overlay.setPosition(undefined)
        }
    });
  
  }
  render(){
      return(<div id='mapView' style={{minHeight: 700 }}></div>)
  }
}
export default MapView;