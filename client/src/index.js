import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MyLayout from './layout/Mylayout';
import registerServiceWorker from './registerServiceWorker';
import 'antd/dist/antd.css';

ReactDOM.render(<MyLayout/>, document.getElementById('root'));
registerServiceWorker();
