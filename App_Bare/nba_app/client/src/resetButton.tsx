import {reset_button_cls} from './static/resetButton.css'
import { findNodeByDataset } from './handlers';
import { clearDB } from './clearButton';

const button = document.createElement('button');
button.className = reset_button_cls;
button.innerHTML = "<p> RESET DB </p>"
button.dataset.name = "reset_button";

// block for rootDiv
const rootDiv = document.getElementById('root');
while(rootDiv== null){}
//add to browser canvas 
rootDiv.append(button);

// set handlers 
button.onclick = (event: MouseEvent) => {

    /* Reset flag in START DB button */

    let curr = event.currentTarget as HTMLElement;
    let parent = curr.parentElement as HTMLElement;
    let startButtonNode = findNodeByDataset(parent, 'name', 'start_button' ) as HTMLElement;
    if (startButtonNode) {
        startButtonNode.dataset.onRequest = "0";
    }
    clearDB();

}
