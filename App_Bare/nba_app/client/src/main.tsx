import mainCss from './main.module.css'; // import css module 


// const mainCss = require('./main.css');
const rootDiv = document.getElementById('root');
const body = document.body;



var node = document.createElement('p');
node.textContent = "just getting started";
node.className = "test-para";

// set background
body.style.backgroundColor = 'gray';

// set
if (rootDiv) {

    // add placeholder string
    rootDiv.append(node);

    rootDiv.className = mainCss['rootDiv'] ; //`${mainCss['rootDiv']}`; //  `${}`  ;
    // expand div size 
    // const w: number =  window.screen.availWidth; // window.screen.width ; 
    // const h: number = window.screen.availHeight;
    
    // // resize div
    // rootDiv.style.width  = w + `px` ;
    // rootDiv.style.height = h + `px`;
    // rootDiv.style.border =  "1px solid black";
    // rootDiv.style.color = 'green';
    // rootDiv.style.margin = '0';
    // rootDiv.style.padding = '0';
}

