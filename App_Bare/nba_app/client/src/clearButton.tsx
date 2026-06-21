
import {clear_button_cls} from './static/clearButton.css'
import { findNodeByDataset } from './handlers';

// block for rootDiv
const rootDiv = document.getElementById('root');
while(rootDiv== null){}

export const clearDB = () => {
    // send request to server (or local system) to clear
    let dbClearSuccess = true;

    // clear gui players list
    if (dbClearSuccess) {
        let playerListNode = findNodeByDataset(rootDiv, 'name','leader') as HTMLElement;
        playerListNode.replaceChildren(); // memory clean up 
    } 
    
}

const button = document.createElement('button');
button.className = clear_button_cls;
button.innerHTML = "<p> CLEAR DB </p>"
button.dataset.name = "clear_button";

//add to browser canvas 
rootDiv.append(button);

// handler 
button.onclick = (event: MouseEvent) => {
    clearDB();
}


