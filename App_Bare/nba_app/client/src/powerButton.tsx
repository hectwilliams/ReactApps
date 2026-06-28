import { bookletInst } from "./pageShifter";
import { storeInst } from './store';

export class PowerButton {
    
    switch: HTMLSpanElement;
    configured: boolean;
    name: string; 

    constructor(name: string) {
        this.switch = document.createElement('span');
        this.configured = false ;        
        this.switch.append(document.createElement('span'));
        
        this.configure.bind(this)(); // bind floating/lost object to method
        this.name = name;
    }

     configure() : void {

        if(this.configured) {
            console.log('already configured');
            return;
        }

        let prev: string | null; // closure caches previous state
        let v_pres : HTMLElement | null; // cache view button element

        // add event listener 
        this.switch.addEventListener('click', (event: MouseEvent)=>{

            let nodeTest = event.currentTarget as HTMLSpanElement;
            
            let powerStatus = nodeTest.dataset.status as string;
            
            let view = (nodeTest.parentNode?.childNodes[1] as HTMLSpanElement);

            let viewStatus = (nodeTest.parentNode?.childNodes[1] as HTMLSpanElement).dataset.on;
            
            let name = (nodeTest.parentNode?.childNodes[0] as HTMLSpanElement).innerText;

            let v : HTMLElement;

            // console.log(powerStatus, viewStatus);
            
            if (viewStatus === "undef" && name == 'monitor') {

                if (powerStatus === 'on1') {
                        console.log('shut down monitor');
                        nodeTest.dataset.status = "off";
                } else {
                        nodeTest.dataset.status = "on1";
                        console.log('start monitor server');
                }

                return;
            } 
            
            if (powerStatus === 'on') {
                
                // turn off server 
                nodeTest.dataset.status = "off";
                
                // turn off view 
                view.dataset.on = "0";


                if (storeInst.service == name) {
                    // new view request
                    bookletInst.disable();
                }


            } else if (powerStatus == "off") {
                // view.dataset.on = "0";

                // turn on switch 
                nodeTest.dataset.status = "on";

                // turn on view
                view.dataset.on = "1";
                
                   if (storeInst.service == name) {
                    // new view request
                    bookletInst.enable();
                }

            }

        })

        this.configured = true; 

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
        if (this.name = 'monitor') {
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