import React from 'react';
import { Menu, Icon } from 'antd';
import AddOneModal from './AddOneModal';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class HeaderMenuView extends React.Component {
  state = {
    theme: 'dark',
    current: 'mail',
  }
  
  handleDeleteClick = (e) => {
    this.setState({
      current: e.key,
    });
  }
  render() {
    return (
      <div>
      <Menu
        theme={this.state.theme}
        mode="horizontal"
      >
        <SubMenu key="add" title={<span>添加影像</span>}>
          <Menu.Item key="addone">
            <AddOneModal value="添加影像"></AddOneModal>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="delete" onClick={this.handleDeleteClick}>
          批量删除
        </Menu.Item>
      </Menu>
      </div>
    );
  }
}
export default HeaderMenuView;