// import css modules 
import  {
    body_cls, 
    root_container_cls,
} from './static/css/module.css'; 
import { findNodeByDataset } from './handlers';

// add buttons to board 
import './powerButton';
import './startButton';
import './resetButton';
import './clearButton';
import './fillButton';
import './randButton';

// turn on leader board 
import './leader';

// turn on follower board 
import './followers';

// turn on option board 
import './options';

// turn on selectraw board 
import './selectraw';

// services stack card 
import './services';

import './viewButton';

// dashboard 
import './dashboard';

// block for rootDiv
const rootDiv = document.getElementById('root');
while(rootDiv== null){}

// set root div using .css declaration 
rootDiv.className  = root_container_cls;

// set start
// set html body using .css declaration
const body = document.body;
body.style.backgroundColor = 'gray';
body.className  = body_cls;

export const activePlayerList = findNodeByDataset(rootDiv, 'name','leader') as HTMLElement;

