
import {clear_button_cls} from './static/clearButton.css'

const button = document.createElement('button');
button.className = clear_button_cls;
button.innerHTML = "<p> CLEAR DB </p>"

// block for rootDiv
const rootDiv = document.getElementById('root');
while(rootDiv== null){}

//add to browser canvas 
rootDiv.append(button);
