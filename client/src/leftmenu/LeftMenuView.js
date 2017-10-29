import { Menu, Icon, Switch } from 'antd';
import React from 'react';
import $ from 'jquery';
import MyContextmenu from './MyContextmenu';

function contains(arraylist,item){
    for(var i=0;i<arraylist.length;i++){
        if(arraylist[i]===item){
            return true;
        }
    }
    return false;
}
function processData(data){
    var place=[];
    var treeData=[];
    $.each(data,function(i,item){
        if(contains(place,item.PLACE_NAME)===false){
           place.push(item.PLACE_NAME);
        }
    })
    $.each(place,function(i,item){
        var object=new Object();
        object.PLACE_NAME=item;
        object.CATEGORY=[];
        treeData.push(object);
    })

    $.each(data,function(i,itemi){
        $.each(treeData,function(j,itemj){
            if(itemi.PLACE_NAME===itemj.PLACE_NAME){
                var quChong=[];
                $.each(itemj.CATEGORY,function(k,itemk){
                    quChong.push(itemk.CATEGORY_NAME);
                })
                if(contains(quChong,itemi.CATEGORY)===false){
                    var object=new Object();
                    object.CATEGORY_NAME=itemi.CATEGORY;
                    object.IMAGE_NAME=[];
                    itemj.CATEGORY.push(object);
                }  
            }
            
        })
    })
    $.each(data,function(i,itemi){
        $.each(treeData,function(j,itemj){
           if(itemi.PLACE_NAME===itemj.PLACE_NAME){
               $.each(itemj.CATEGORY,function(k,itemk){
                   if(itemi.CATEGORY===itemk.CATEGORY_NAME){
                       itemk.IMAGE_NAME.push(itemi.IMAGE_NAME)
                   }
               })
           } 
        })
    })

  return treeData;

}

class LeftMenuView extends React.Component{
    state = {
        theme: 'dark',
        data:[]
    }
    componentDidMount(){
        var xhr=new XMLHttpRequest();        
        xhr.open("GET","http://localhost:3000/",true);
        xhr.onreadystatechange=()=>{
            if(xhr.readyState===4){
                if(xhr.status===200){
                    let data = JSON.parse(xhr.responseText)
                    var treeData=processData(data);  
                    console.log(treeData);       
                    this.setState({
                        data:treeData
                    })
                }
            }
        }
        xhr.send(null);
    }
    render(){
        return(
            <div>              
                <Menu 
                theme={this.state.theme}
                style={{ width: 200 }}
                selectedKeys={[this.state.current]}
                mode="inline"> 
                {
                    this.state.data.map(parent =>  
                    <Menu.SubMenu key={parent.PLACE_NAME} title={parent.PLACE_NAME} >   
                        {
                            parent.CATEGORY.map(child =>        
                                <Menu.SubMenu key={parent.PLACE_NAME+"->"+child.CATEGORY_NAME} title={child.CATEGORY_NAME}>                                   
                                        {
                                            child.IMAGE_NAME.map(childofchild=>
                                                <Menu.Item key={parent.PLACE_NAME+"->"+child.CATEGORY_NAME+"->"+childofchild}>
                                                   <MyContextmenu value={childofchild} id={parent.PLACE_NAME+"->"+child.CATEGORY_NAME+"->"+childofchild+"menuitem"}></MyContextmenu>      
                                                </Menu.Item>
                                            )
                                            
                                        }                     
                                </Menu.SubMenu> )
                        }   
                    </Menu.SubMenu>)
                    }
                </Menu>
            </div>
        )
    }
}
export default LeftMenuView;
