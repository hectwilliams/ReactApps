

import {start_button_cls} from './static/startButton.css'

const button = document.createElement('button');
button.className = start_button_cls;

button.innerHTML = "<p> START DB </p>"

// block for rootDiv
const rootDiv = document.getElementById('root');
while(rootDiv== null){}

rootDiv.append(button);
