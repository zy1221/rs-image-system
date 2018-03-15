import React from 'react';
import ol from 'openlayers';
import 'openlayers/css/ol.css';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import infodialog from '../infoDialog/infodialog';


function featuresContains(arraylist,item){
    for(var i=0;i<arraylist.length;i++){
        if(arraylist[i].R.id===item.R.id){
            return true;
        }
    }
    return false;
}
class MyContextmenu extends React.Component {
    constructor(props){
        super(props);
        this.state={
            place:'',
            imageName:'',
            category:'',
            geoCoord:[]
        }
    }
    handleDeleteClick = (e) => {
        var parentKeyStr=e.target.parentElement.parentElement.parentElement.parentElement.id;
        var imageLocation=parentKeyStr.split('->');
        var imageCategory=imageLocation[1].split('$')[0];
        var imageName=e.target.parentElement.parentElement.innerText.split('\n')[0];
        var xhr=new XMLHttpRequest();        
        var url="http://localhost:3000/deleteImage?place="+imageLocation[0]+'&category='+imageCategory+'&imagename='+imageName;
        xhr.open("GET",url,false);
        xhr.send(null);
        var result=JSON.parse(xhr.responseText);
        if(result==='OK'){
            infodialog('info','提示','图片已删除');
        }
    }
   
    handleNoDisplayClick = (e) => {
        var parentKeyStr=e.target.parentElement.parentElement.parentElement.parentElement.id;
        var imageLocation=parentKeyStr.split('->');
        var imageCategory=imageLocation[1].split('$')[0];
        var imageName=e.target.parentElement.parentElement.innerText.split('\n')[0];

        var id=imageLocation[0]+'->'+imageCategory+'->'+imageName;
        var feature=window.vectorLayer.getSource().getFeatureById(id);
        window.vectorLayer.getSource().removeFeature(feature)
    }
    handleClick = (e) => {
        var parentKeyStr=e.target.parentElement.parentElement.parentElement.parentElement.id; 
        var imageLocation=parentKeyStr.split('->');
        var imageCategory=imageLocation[1].split('$')[0];
        var imageName=e.target.innerText;       
        //查询点坐标    
        var xhr=new XMLHttpRequest();        
        var url="http://localhost:3000/queryGeocoord?place="+imageLocation[0]+'&category='+imageCategory+'&imagename='+imageName;
        xhr.open("GET",url,false);
        xhr.send(null);
        var lonlat=JSON.parse(xhr.responseText);
        this.setState({
            place:imageLocation[0],
            imageName:e.target.innerText,
            category:imageLocation[1].split('$')[0],
            geoCoord:lonlat[0]
        });
        var id=imageLocation[0]+'->'+imageLocation[1].split('$')[0]+'->'+e.target.innerText;
        var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point([lonlat[0].LON, lonlat[0].LAT]),
            name: this.state.imageName,
            population: 4000,
            rainfall: 500
        });
        iconFeature.setId(id);
        var name=imageLocation[0]+'/'+imageCategory+'/'+imageName;
        var src='http://localhost:3000/static/'+name;
        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 46],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: src
            }))
        });
        iconFeature.setStyle(iconStyle);
    
        if(window.vectorLayer.getSource().getFeatureById(id)===null){
            window.vectorLayer.getSource().addFeature(iconFeature);
            window.view.animate({
                center:[lonlat[0].LON, lonlat[0].LAT],
                zoom: 4,
            })
        }else
        {
             infodialog('info','提示','图片已显示');
        }
    }
    render(){
         return (
            <div>
                <ContextMenuTrigger id={this.props.id}>         
                    <MenuItem  onClick={this.handleClick}>
                            {this.props.value}                                              
                    </MenuItem>
                </ContextMenuTrigger>  
                <ContextMenu id={this.props.id} >            
                    <MenuItem onClick={this.handleNoDisplayClick}>
                        隐藏
                    </MenuItem>
                    <MenuItem onClick={this.handleDeleteClick} >
                        删除
                    </MenuItem >
                </ContextMenu>
            </div>
        )
    }
   
}
export default MyContextmenu;