import './init';

// import css modules 
import  {
    body_cls, 
    root_container_cls,
} from './static/css/module.css'; 

// import { findNodeByDataset } from './handlers';

export const rootstyles = window.getComputedStyle(document.documentElement);
export const BINSIZE = parseInt(rootstyles.getPropertyValue('--BINSIZE').trim());


// block for rootDiv

// set start
// set html body using .css declaration
const body = document.body;
body.style.backgroundColor = 'gray';
body.className  = body_cls;

const rootDiv = document.getElementById('root');
if (rootDiv)
    rootDiv.className  = root_container_cls;



