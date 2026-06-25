import dashboard from './followers';
import {start_button_cls} from './static/css/startButton.css'
import { writeLog } from './handlers';
import type { LogInterface } from './followers';
import { powerButton } from './powerButton';
import { readyStatus, folio } from './selectraw';
import { fetchPages } from './handlers';
// import { json } from 'node:stream/consumers';
import { activePlayerList } from './main';
import { loadPlayerData } from './handlers';
import { viewButton } from './handlers';
import {
    services_card_container_cls,
    services_cls, services_cls_header,
    viewer_grid_item__cls
} from './static/css/services.css';
import { moreViewSymbol, setEventMoreViewSymbol } from './viewButton';

interface ServiceResponse {
    services: Array<string>
}
/*
    Generate a new paramterized card and add to cardBody 
*/
async function loadServices () : Promise<Array<string>>  {
    
    const path = 'http://127.0.0.1:50214/services';
    
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error("HTTP Error!");
        }
        const data = await response.json();
        
        return Object.keys(data.services);

    } catch {

        return [];
    }

}

function loadServicesDom(services: Array<string>, container: HTMLElement) {
    services.forEach(serviceName => {
        // TODO restrict name size 
        
        let cardContainer = document.createElement('div');
        cardContainer.className = services_card_container_cls;
        
        let subContainer = document.createElement('div');
        cardContainer.append(subContainer);

        let cardName = document.createElement('span');
        cardName.innerHTML = `<p> ${serviceName} </p>`;
        
        let clone = moreViewSymbol.cloneNode(true) as HTMLSpanElement;
        setEventMoreViewSymbol(clone);

        subContainer.append(cardName);
        subContainer.append(clone);

        container.append(cardContainer);
    });
};


// const services
const cardBody = document.createElement('div');
cardBody.className = services_cls;

const cardHeader = document.createElement('div');
cardHeader.className = services_cls_header;

// block for rootDiv
const rootDiv = document.getElementById('root');
while(rootDiv== null){}

rootDiv.append(cardHeader);
rootDiv.append(cardBody);

const response = await loadServices()
loadServicesDom(response, cardBody);

// header 
const headerIcon = document.createElement('span');
const headerName = document.createElement('span');
headerName.innerText = "Services"
// const headerMore = document.createElement('span'); // TBD

cardHeader.append(headerIcon);
cardHeader.append(headerName);