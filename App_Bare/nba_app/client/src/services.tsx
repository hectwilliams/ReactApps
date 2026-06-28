import { powerButton} from './powerButton';
import {
    services_card_container_cls,
    services_cls, services_cls_header,
} from './static/css/services.css';
import { dashboard } from './dashboard';
import { viewButtonnInst } from './viewButton';


interface ServiceResponse {
    services: Array<string>
}

/*
    Generate a new paramterized card and add to cardBody 
*/
async function reqServicesMonitor () : Promise<Array<string>>  {
    
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


        let clonePowerSwitch =(new powerButton()).get(); //= powerSwitchInst.switch.cloneNode(true) as HTMLSpanElement; // create copy of power switch
        let cloneMoreViewSymbol = viewButtonnInst.moreViewSymbol.cloneNode(true) as HTMLSpanElement; // create copy of view object 
        
        // console.log(clonePowerSwitch.eve)
        cloneMoreViewSymbol.dataset.name = serviceName;


        if (serviceName == 'monitor') {
            
            clonePowerSwitch.dataset.status='on1';
            // cloneMoreViewSymbol.dataset.on="1";
            cloneMoreViewSymbol.dataset.on="undef";


        } else {
            
            clonePowerSwitch.dataset.status='off';
            cloneMoreViewSymbol.dataset.on="0";

        }

        // setPowerSwitch(clonePowerSwitch); // copies of power switches 
        viewButtonnInst.setEventMoreViewSymbol(cloneMoreViewSymbol); // copies of view symbols 
    
        /* order matters */
        subContainer.append(cardName);
        subContainer.append(cloneMoreViewSymbol);
        subContainer.append(clonePowerSwitch);

        container.append(cardContainer);
        
        console.log(cardContainer);
    });
};

class Services  {

    header: HTMLDivElement;
    body: HTMLDivElement;
    root: HTMLDivElement;

    constructor() {
        this.body = document.createElement('div');
        this.body.className = services_cls;
        
        this.header = document.createElement('div');
        this.header.className = services_cls_header;
        
        this.root =  document.getElementById('root') as HTMLDivElement;
        this.root.append(this.header);
        this.root.append(this.body);

        let headerIcon = document.createElement('span');
        let headerName = document.createElement('span');
        headerName.innerText = "Services";
        
        this.header.append(headerIcon);
        this.header.append(headerName);

        try {
                
            reqServicesMonitor()
            .then( (data) => {

                loadServicesDom(data, this.body);

            })
            .catch(()=>{

            })

        } catch(err) {

        }
    }

}

const servicesInstr = new Services();