import { notification } from 'antd';



function infodialog(type,message,diacription){
    const openNotificationWithIcon =(type) => {
        notification[type]({
            message: message,
            description: diacription,
        });
    };
    return  openNotificationWithIcon(type);
}


export default infodialog;