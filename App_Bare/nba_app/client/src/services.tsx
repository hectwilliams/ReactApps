import { PowerButton, activePowerButtons} from './powerButton';
import {
    services_card_container_cls,
    services_cls, services_cls_header,
} from './static/css/services.css';
import { dashboard } from './dashboard';
import {  activeViewButtons,  ViewButton} from './viewButton';

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

        let newPowerButton = new PowerButton(serviceName);
        activePowerButtons.push(newPowerButton);
        let clonePowerSwitch = newPowerButton.get(); //= powerSwitchInst.switch.cloneNode(true) as HTMLSpanElement; // create copy of power switch

        let newViewButton = new ViewButton(serviceName)
        activeViewButtons.push(newViewButton);
        let cloneMoreViewSymbol = newViewButton.get();
        
        cloneMoreViewSymbol.dataset.name = serviceName;


        if (serviceName == 'monitor') {
            
            clonePowerSwitch.dataset.status='on1';
            cloneMoreViewSymbol.dataset.on="undef";


        } else {
            
            clonePowerSwitch.dataset.status='off';
            cloneMoreViewSymbol.dataset.on="0";

        }

        /* order matters */
        subContainer.append(cardName);
        subContainer.append(cloneMoreViewSymbol);
        subContainer.append(clonePowerSwitch);

        container.append(cardContainer);
        
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
                
            reqServicesMonitor() // first request waits ( asynchronously )
            .then( (data) => {
                loadServicesDom(data, this.body);

            })
            .catch(()=>{

            })

        } catch(err) {

        }
    }

    async start(name: string) {

    //     if (!address) {
    //         address = "127.0.0.1"; // loop back
    //     }
    //     const path = `http://127.0.0.1:${port}/turn_on_nba`; // Binny server :) 

    // try {
    //     const response = await fetch(path);
    //     if (!response.ok) {
    //         throw new Error("Unable to request service");
    //     }
    //     console.log(response.json);
    // }catch(err) {
    //     console.log(err);
    // }

        const path = `http://127.0.0.1:50214/power`;
        const method = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                msg: `Turn on ${name} server`,
                name: name,
                enable: "1"
            } 
        )};

        try {

            const response = await fetch(path, method);
            
            if (!response.ok) {
                throw new Error("HTTP Error!");
            }
            
            const data = await response.json();
            return true;


        } catch {

            return false;

        }

    }
    
    async shutdown(name: string): Promise<boolean> { 
          

        const path = `http://127.0.0.1:50214/power`;
        
        const method = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                msg: `Turn off ${name} server`,
                name: name,
                enable: "0"
            } 
        )};
        
        try {

            const response = await fetch(path, method);

            if (!response.ok) {
                throw new Error("HTTP Error!");
            }

            const data = await response.json();

            return true;


        } catch {

            return false;

        }

    }

}

export const servicesInstr = new Services();