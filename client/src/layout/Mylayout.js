import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import HeaderMenuView from '../headermenu/HeaderMenuView';
import LeftMenuView from '../leftmenu/LeftMenuView';
import MapView from '../map/MapView';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;


class MyLayout extends React.Component{
    render(){
        return(
                <Layout>
                   <Header style={{height: 50}}> 
                        <HeaderMenuView style={{right:0,width:100}}></HeaderMenuView>
                     </Header> 
                    <Layout>
                        <Sider>
                            <LeftMenuView ></LeftMenuView>
                        </Sider>
                        <Content style={{background: '#fff', minHeight: 700}}>
                            <MapView ></MapView>
                        </Content>
                    </Layout>
                </Layout>
        )
    }
}
export default MyLayout;
