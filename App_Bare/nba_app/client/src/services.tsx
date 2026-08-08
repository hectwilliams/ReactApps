import { PowerButton, activePowerButtons} from './powerButton';
import {  activeViewButtons,  ViewButton} from './viewButton';

// import {
//     services_card_container_cls,
//     services_cls, services_cls_header,
// } from './static/css/services.css';

import * as services_css from './static/css/Services.module.css';
const services_css_eff :  Record<string, boolean | string | unknown > = services_css;


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

        console.log('errir, messag')
        return [];
    }

}

async function loadServicesDom(services: Array<string>, container: HTMLDivElement) {
    services.forEach(serviceName => {
        // TODO restrict name size 
        
        
        const cardContainer = document.createElement('div');
        cardContainer.className = services_css_eff.services_card_container_cls as string;
        
        
        const subContainer = document.createElement('div');
        cardContainer.append(subContainer);
        
        
        const cardName = document.createElement('span');
        cardName.innerHTML = `<p> ${serviceName} </p>`;
        
        
        const newPowerButton = new PowerButton(serviceName);
        activePowerButtons.push(newPowerButton);
        const clonePowerSwitch = newPowerButton.get(); //= powerSwitchInst.switch.cloneNode(true) as HTMLSpanElement; // create copy of power switch
        
        
        const newViewButton = new ViewButton(serviceName)
        activeViewButtons.push(newViewButton);
        const cloneMoreViewSymbol = newViewButton.get();
        
        // console.log(serviceName, __filename);
        
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
        // console.log(cardContainer)
        
    });
};

class Services  {

    header: HTMLDivElement;
    body: HTMLDivElement;
    root: HTMLDivElement;
    ready: boolean;

    constructor () {
        
        this.ready  = false;
        this.body = document.createElement('div');
        this.body.className = services_css_eff.services_cls as string;
        
        this.header = document.createElement('div');
        this.header.className = services_css_eff.services_cls_header as string;
        
        this.root =  document.getElementById('root') as HTMLDivElement;
        this.root.append(this.header);
        this.root.append(this.body);

        const headerIcon = document.createElement('span');
        const headerName = document.createElement('span');
        headerName.innerText = "Services";
        
        this.header.append(headerIcon);
        this.header.append(headerName);

        try {
                
            reqServicesMonitor() // first request waits ( asynchronously )
            .then( (data) => {
                
                const d = data;
                const body = this.body;

                loadServicesDom(d, body);

            })
            .catch(()=>{

                throw new Error("request service error");

            })

        } catch(err) {

            console.log(err);
            
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
            } else {
                console.log(response);
            }
            
            return true;

        } catch {

            throw new Error("HTTP Error!");

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
            })
        };
        
        try {

            const response = await fetch(path, method);

            if (!response.ok) {
                
                // error requesting to shutdown server

                throw new Error("HTTP Error!");
                
            }

            return true;

        } catch {
                
            // chained catch 
                
            throw new Error("HTTP Error!");

        }

    }

}

export const servicesInstr = new Services();

