import './init';

// import css modules 
import  {
    body_cls, 
    root_container_cls,
} from './static/css/module.css'; 


export const rootstyles = window.getComputedStyle(document.documentElement);
export const BINSIZE = parseInt(rootstyles.getPropertyValue('--BINSIZE').trim());

const body = document.body;
body.style.backgroundColor = 'gray';
body.className  = body_cls;

const rootDiv = document.getElementById('root');
if (rootDiv)
    rootDiv.className  = root_container_cls;



