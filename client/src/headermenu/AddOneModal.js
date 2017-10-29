import React from 'react';
import { Modal, Button } from 'antd';
import { Input} from 'antd';
import { Upload,Icon, message } from 'antd';
import $ from 'jquery';
import infodialog from '../infoDialog/infodialog';

class AddOneModal extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
        loading: false,
        visible: false,
        place:'',
        category:'',
        lon:'',
        lat:'',
        fileList:[],
        uploading:false
      };
  }
  showModal = () =>{this.setState({ visible: true})}
  placeChange=(e)=>{this.setState({place:e.target.value})};
  categoryChange=(e)=>{this.setState({category:e.target.value})};
  LonChange=(e)=>{this.setState({lon:e.target.value})};
  LatChange=(e)=>{this.setState({lat:e.target.value})};

  handleOk = () => {
    if(this.state.place!==''&&this.state.category!==''&&
      this.state.imagename!==''&&this.state.lon!==''&&this.state.lat!==''){
          var numLon=Number(this.state.lon);
          var numLat=Number(this.state.lat);
          if(!isNaN(numLon) && !isNaN(numLat)){
            //formData传参
            const formData = new FormData();
            formData.append('place',this.state.place);
            formData.append('category',this.state.category);
            formData.append('lon',this.state.lon);
            formData.append('lat',this.state.lat);

            //上传照片
            const { fileList } = this.state;
            fileList.forEach((file) => {
              formData.append('image', file);
            });
        
            this.setState({
              uploading: true,
            });
            fetch('http://localhost:3000/upload', {
              method: 'POST',
              body: formData
            }).then(res => res.json())
              .then((results) => {
                this.setState({
                  place:'',
                  category:'',
                  lon:'',
                  lat:'',
                  visible: false,
                  fileList: [],
                  uploading: false,
                });
                //message.success('upload successfully.');
                console.log(results);
                if(results.length===0){
                  infodialog('info','提示','所有影像添加成功，请刷新查看');
                }else{
                  var info='';
                  $.each(results,function(i,item){
                    info+=' '+item;
                  })
                  infodialog('info','提示',info+'已存在！')
                }
                
            }).catch(()=>{
                this.setState({
                  uploading: false,
                });
                //message.error('upload failed.');
                infodialog('info','提示','上传影像失败!');
            })
          }else{
            infodialog('info','提示','经纬度必须为数字！');
          }
          
    }else{
       infodialog('info','提示','输入项不能为空！')
    }
 
  }


  handleCancel = () => {
    this.setState({ 
      place:'',
      category:'',
      lon:'',
      lat:'',
      visible: false,
      fileList: [],
      uploading: false, 
    })
  }
  render() {
    const { uploading } = this.state;
    const props = {
      action: '//jsonplaceholder.typicode.com/posts/',
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    };

    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          {this.props.value}
        </Button>
        <Modal
          visible={this.state.visible}
          title="影像信息"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" size="large"  onClick={this.handleOk} disabled={this.state.fileList.length === 0} loading={uploading}>
              {uploading ? 'Uploading' : '添加' }
            </Button>
          ]} 
        >
          <div id='inputGroup'>
            <label>地点：</label><Input id="place" value={this.state.place} placeholder="place" onChange={this.placeChange}></Input>
            <label>类别：</label><Input id="category" value={this.state.category} placeholder="category" onChange={this.categoryChange}></Input>
            <label>经度：</label><Input id="longitude" value={this.state.lon} placeholder="longitude" onChange={this.LonChange}></Input>
            <label>纬度：</label><Input id="latitude" value={this.state.lat} placeholder="latitude" onChange={this.LatChange}></Input>
            <div>
              <Upload {...props}>
                <Button>
                  <Icon type="upload" />选择影像
                </Button>
              </Upload>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
export default AddOneModal;