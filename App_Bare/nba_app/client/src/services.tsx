// import dashboard from './followers';
import {start_button_cls} from './static/css/startButton.css'
// import { writeLog } from './handlers';
// import type { LogInterface } from './followers';
import { setPowerSwitch ,statusCircleGrandParent} from './powerButton';
// import { readyStatus, folio } from './selectraw';
import { fetchPages } from './handlers';
// import { json } from 'node:stream/consumers';
// import { activePlayerList } from './main';
// import { loadPlayerData } from './handlers';
import { viewButton } from './handlers';
import {
    services_card_container_cls,
    services_cls, services_cls_header,
    viewer_grid_item__cls,
    services_power_cls
} from './static/css/services.css';
import { dashboard } from './dashboard';
import { viewButtonnInst } from './viewButton';

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

function servicesSwitchClick(event: MouseEvent) {
    let node = event.currentTarget as HTMLSpanElement;
    let s = node.dataset.status as string;
    
    if (s == 'off') {
        
        node.dataset.status = 'on';

    } else {
        
        node.dataset.status = 'off';
    
    } 
        
        

}

function loadServicesDom(services: Array<string>, container: HTMLDivElement) {
    services.forEach(serviceName => {
        // TODO restrict name size 
        
        let cardContainer = document.createElement('div');
        cardContainer.className = services_card_container_cls;
        
        let subContainer = document.createElement('div');
        cardContainer.append(subContainer);

        let cardName = document.createElement('span');
        cardName.innerHTML = `<p> ${serviceName} </p>`;

        let clonePowerSwitch = statusCircleGrandParent.cloneNode(true) as HTMLSpanElement;
        let cloneMoreViewSymbol = viewButtonnInst.moreViewSymbol.cloneNode(true) as HTMLSpanElement;
        
        cloneMoreViewSymbol.dataset.name = serviceName;

        if (serviceName == 'monitor') {
            
            clonePowerSwitch.dataset.status='on1';
            cloneMoreViewSymbol.dataset.on="1";

        } else {
            
            clonePowerSwitch.dataset.status='off';
            cloneMoreViewSymbol.dataset.on="0";

        }

        setPowerSwitch(clonePowerSwitch); // copies of power switches 
        viewButtonnInst.setEventMoreViewSymbol(cloneMoreViewSymbol); // copies of view symbols 
    
        /* order matters */
        subContainer.append(cardName);
        subContainer.append(cloneMoreViewSymbol);
        subContainer.append(clonePowerSwitch);

        container.append(cardContainer);
    });
};


// const services
const cardBody = document.createElement('div');
cardBody.className = services_cls;
// cardBody.dataset.ready='0';
const cardHeader = document.createElement('div');
cardHeader.className = services_cls_header;

// block for rootDiv
const rootDiv = document.getElementById('root');
// while(rootDiv== null){}
if (rootDiv) {
    rootDiv.append(cardHeader);
    rootDiv.append(cardBody);
}

const response = await loadServices()
loadServicesDom(response, cardBody);

// header 
const headerIcon = document.createElement('span');
const headerName = document.createElement('span');
headerName.innerText = "Services"
// const headerMore = document.createElement('span'); // TBD

cardHeader.append(headerIcon);
cardHeader.append(headerName);
// cardBody.dataset.ready='1';
