import { bookletInst } from "./pageShifter";
import { storeInst } from './store';
import { servicesInstr } from "./services";
import { logbookInst } from './logbook';

const powerButtonClickHandler  = (event: MouseEvent)=>{

            const nodeTest = event.currentTarget as HTMLSpanElement;
            
            const parent = nodeTest.parentNode as HTMLDivElement;
            
            const powerStatus = nodeTest.dataset.status as string;
            
            const view = (nodeTest.parentNode?.childNodes[1] as HTMLSpanElement);

            const viewStatus = (nodeTest.parentNode?.childNodes[1] as HTMLSpanElement).dataset.on;
            
            const name = (nodeTest.parentNode?.childNodes[0] as HTMLSpanElement).innerText;

            if (viewStatus === "undef" && name == 'monitor') {

                if (powerStatus === 'on1') {
                        // console.log('shut down monitor');
                        // nodeTest.dataset.status = "off";
                } else {
                        nodeTest.dataset.status = "on1";
                        // console.log('start monitor server');
                }

                return;
            } 
            
            if (powerStatus === 'on') {
                
                parent.dataset.loading="1";

                // turn off server 
                servicesInstr.shutdown(name)
                .then(() => {
                    
                    // request to turn on server succeeded 
                    
                    nodeTest.dataset.status = "off";
                    
                    // turn off view 
                    view.dataset.on = "0";
                    
                    logbookInst.add(`Service ${name} shutdown`);
    
                    if (storeInst.service == name) {
                        // new view request
                        bookletInst.disable();
                    }
                
                    parent.dataset.loading="0";
                })

                .catch(()=>{
                    // request to turn on server on failed 
                    parent.dataset.loading="0";
                    nodeTest.dataset.status = "on"; // keep on

                })
                

            } else if (powerStatus == "off") {
                
                // view.dataset.on = "0";
                parent.dataset.loading="1";

                // turn on switch 
                servicesInstr.start(name)
                 .then(() => {
                    
                    nodeTest.dataset.status = "on";
                     
                     // turn on view
                     view.dataset.on = "1";

                    logbookInst.add(`Service ${name} powered on`);

                     if (storeInst.service == name) {
                         // new view request
                         bookletInst.enable();
                     }

                     parent.dataset.loading="0";
                })
                
                .catch(()=>{
                    parent.dataset.loading="0";
                    nodeTest.dataset.status = "off";

                })

            }

        }
export class PowerButton {
    
    switch: HTMLSpanElement;
    configured: boolean;
    name: string; 
    model: HTMLDivElement;

    constructor(name: string) {
        this.switch = document.createElement('span');
        this.configured = false ;        
        this.switch.append(document.createElement('span'));
        // this.configure.bind(this)(); // bind floating/lost object to method
        this.name = name;
        this.model = document.createElement('div');
    }

     configure() : void {

        // if(this.configured) {
        //     // console.log('already configured');
        //     return;
        // }

        this.switch.onmouseenter = (event: MouseEvent)=>{
            event.preventDefault();
            // add event listener 
            this.switch.addEventListener('click', powerButtonClickHandler);
        }

        this.switch.onmouseleave = (event: MouseEvent)=>{
            event.preventDefault();
            // remove event listener 
            this.switch.removeEventListener('click', powerButtonClickHandler);
        }

    }

    // return deep copy 
    get(): HTMLSpanElement {
        // return copy of switch
        return this.switch;
    }

    disable() {
        this.switch.dataset.status = "off";
    }

    enable () {
        if (this.name == 'monitor') {
            this.switch.dataset.status = "on1";
        } else {
            this.switch.dataset.status = "on";
        }
    }

    clear() {
        
        this.disable();

    }

}

export const activePowerButtons = [] as Array<PowerButton>;