

import {reset_button_cls} from './static/resetButton.css'

const button = document.createElement('button');
button.className = reset_button_cls;
button.innerHTML = "<p> RESET DB </p>"

// block for rootDiv
const rootDiv = document.getElementById('root');
while(rootDiv== null){}
//add to browser canvas 
rootDiv.append(button);
