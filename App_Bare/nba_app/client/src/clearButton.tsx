
import {clear_button_cls} from './static/clearButton.css'
import { findNodeByDataset } from './handlers';
import { start_button } from './startButton';
import { powerButton } from './powerButton';
import dashboards from './followers';
import { activePlayerList } from './main';
import { fetchPages } from './handlers';
import { loadPlayerData } from './handlers';
import {  folio } from './selectraw';

// block for rootDiv
const rootDiv = document.getElementById('root');
while(rootDiv== null){}

// function scopes variables (free bee)
var playerListNode = findNodeByDataset(rootDiv, 'name','leader') as HTMLElement;

export const clearDB = () => {
    
    // send request to server (or local system) to clear
    // let dbClearSuccess = true;

    // clear gui players list
    if (activePlayerList.childElementCount) {
        // let playerListNode = findNodeByDataset(rootDiv, 'name','leader') as HTMLElement;
        activePlayerList.replaceChildren(); // memory clean up 
        // cleared ram of database data
    } else {
        console.log('no data to delete ');
    }
    
}

const button = document.createElement('button');
button.className = clear_button_cls;
button.innerHTML = "<p> CLEAR STORAGE </p>"
button.dataset.name = "clear_button";

//add to browser canvas 
rootDiv.append(button);

// handler 
button.onclick = (event: MouseEvent) => {
    
    if (powerButton.dataset.isOn == "0") {
        console.log('database if off, skip clearing');
        return;
    }

    // clear log
    let logElement = dashboards.dashboard_1.children[2] as HTMLParagraphElement;
    if (logElement.children.length) {
        logElement.replaceChildren();
        console.log('cleared dashboard');
    }

    // clear player list 
    // let playerListNode = findNodeByDataset(rootDiv, 'name','leader') as HTMLElement;
    if (activePlayerList.childElementCount) {
        activePlayerList.replaceChildren(); // memory clean up 
        // console.log(playerListNode);
        console.log('cleared player list');
    }

    // load first page

    fetchPages().then ((data)=>{
        if (!data)
            return;
        folio.innerText = `${data.page} of ${data.numPages}`;
        loadPlayerData(data.players);
        console.log(data.players)
        console.log('hello world');

        // data.players.map((value, index) => {
        //     return     
        // })
    });
    
}


