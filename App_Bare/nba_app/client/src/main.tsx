// import css modules 
import  {
    body_cls, 
    root_container_cls,
} from './static/module.css'; 

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

// block for rootDiv
const rootDiv = document.getElementById('root');
while(rootDiv== null){}

// set root div using .css declaration 
rootDiv.className  = root_container_cls;

// set html body using .css declaration
const body = document.body;
body.style.backgroundColor = 'gray';
body.className  = body_cls;


