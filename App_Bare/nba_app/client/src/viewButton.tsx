// import {view_button_on} from './static/css/viewButton.css';
import * as view_button_css from './static/css/ViewButton.module.css';
import { fetchPagesHelper } from "./handlers";
import { logbookInst } from './logbook';
// import { activePowerButtons, PowerButton } from './powerButton';
import { storeInst } from './store';

const SPAN_PLACEHOLDER = document.createElement('span');

const view_button_css_eff :  Record<string, boolean | string | unknown > = view_button_css;

export function getServiceName(node: HTMLSpanElement) {
    if (!node) {
        return;
    }
    const parentNode = node.parentElement as HTMLDivElement;
    const targetParent = parentNode.childNodes[0] as HTMLSpanElement;
    const target = targetParent.childNodes[0] as HTMLParagraphElement; 
    const name = target.innerText;
    return name; 
}

/* Blueprint for view button object  */
export class  ViewButton {  

    prev: HTMLSpanElement;
    moreViewSymbol : HTMLSpanElement;
    name: string;

    constructor(name: string) {

        this.prev = document.createElement('span');
        this.moreViewSymbol = document.createElement('span');
        
        this.moreViewSymbol.dataset.on = "1";
        this.moreViewSymbol.className = view_button_css_eff.view_button_on as string;
        this.name = name;

        // onmousenter
         this.moreViewSymbol.onmouseenter = ()=> {
            // add event enter  
            this.moreViewSymbol.addEventListener( 'click' ,  this.viewClick()  );
         };

        // onmouseexit 
        this.moreViewSymbol.onmouseleave = ()=> {
            // add event exit  
            this.moreViewSymbol.removeEventListener( 'click' ,  this.viewClick()  );
         };

        // paint view button 
        for (let i = 0; i < 100; i++) {
            const viewButtonPixel = document.createElement('span');
            this.moreViewSymbol.append(viewButtonPixel);
        }
        const rows = [2, 5, 9] as Array<number>;
        rows.forEach((r, index)=>{
            const v = rows[3 - 1 - index];
            if (v) {
                // console.log(v);
                for (let i = 0; i < v; i++) {
                    const pos = 10 * r + i; 
                    const ele = this.moreViewSymbol.children[pos] as HTMLSpanElement;
                    ele.style.backgroundColor="white";
                }
            }
        })

  
    }


    /* handler for view button clicks  */
    viewClick() {
        // let cacheNode = node;
        return (event: MouseEvent) => {
            const currentNode = event.currentTarget as HTMLSpanElement;

            if ( this.prev == currentNode) {
                return;

            } else {

                const name = getServiceName(currentNode);

                // turn power switch and views off for others services 
                for(let i = 0; i < activeViewButtons.length; i++ ) {

                    // let powerRecord = activePowerButtons[i] as PowerButton;
                    const viewRecord = activeViewButtons[i] as ViewButton;
                    // let s = powerRecord.get();

                    if (name != viewRecord.name && viewRecord.name != 'monitor') {

                        viewRecord.prev = SPAN_PLACEHOLDER;

                        if (viewRecord.name == 'nba') {
                            // clear cached records 
                            storeInst.clear();
                        }
                        // viewRecord.disable();
                        
                        // // 2. Create a new native MouseEvent
                        // const clickEvent = new MouseEvent("click", {
                        //     bubbles: true,
                        //     cancelable: true,
                        //     view: window
                        // });

                        // const node = powerRecord.get() as HTMLSpanElement;
                        
                        // add event listener
                        // node.addEventListener('click', powerButtonClickHandler);
                        
                        // // remove event listener
                        // node.dispatchEvent(clickEvent);

                        // node.removeEventListener('click', powerButtonClickHandler)
                                

                        //         // if (powerRecord.is_on()) {
                                    
                        //         //     console.log(s);
                        //         //     console.log('server will be shutdown shortly');

                        //         // }


                        //         // powerRecord.disable();
                        
                    }
                }

                if (name) {
                
                    fetchPagesHelper(name)
                    .then( () => {

                        // console.log('successful request: ');
                            
                          logbookInst.add(`Requested ${name} successful}`);
                            
                    })
                    .catch(()=>{

                        // console.log('unsuccessful request');
                        
                        logbookInst.add(`Requested ${name} failed}`);

                    })

                }
            }

            this.prev = currentNode;
        }
    }

    disable() {
        this.moreViewSymbol.dataset.on = "0";
    }

    enable () {
        this.moreViewSymbol.dataset.on = "1";
    }

    get(): HTMLSpanElement{
        
        return this.moreViewSymbol;

    }

    clear() {
        this.disable();
        this.prev = document.createElement('span');
    }

}

export const activeViewButtons = [] as Array<ViewButton>;