import {view_button_on} from './static/css/viewButton.css';
import { fetchPagesHelper } from "./handlers";
import { logbookInst } from './logbook';
import { dashboard } from './dashboard';

export function getServiceName(node: HTMLSpanElement) {
    if (!node) {
        return;
    }
    let parentNode = node.parentElement as HTMLDivElement;
    let targetParent = parentNode.childNodes[0] as HTMLSpanElement;
    let target = targetParent.childNodes[0] as HTMLParagraphElement; 
    let name = target.innerText;
    return name; 
}

/* Blueprint for view button object  */
export class  ViewButton {  

    prev: HTMLSpanElement;
    moreViewSymbol : HTMLSpanElement;
    name: string;
    //  document.createElement('span');

    constructor(name: string) {

        this.prev = document.createElement('span');
        this.moreViewSymbol = document.createElement('span');
        
        this.moreViewSymbol.dataset.on = "1";
        this.moreViewSymbol.className = view_button_on;
        this.name = name;
        // paint view button 
        for (let i = 0; i < 100; i++) {
            let viewButtonPixel = document.createElement('span');
            this.moreViewSymbol.append(viewButtonPixel);
        }
        let rows = [2, 5, 9] as Array<number>;
        rows.forEach((r, index)=>{
            let v = rows[3 - 1 - index];
            if (v) {
                // console.log(v);
                for (let i = 0; i < v; i++) {
                    let pos = 10 * r + i; 
                    let ele = this.moreViewSymbol.children[pos] as HTMLSpanElement;
                    ele.style.backgroundColor="white";
                }
            }
        })

        // add event listener 
        this.moreViewSymbol.addEventListener( 'click' ,  this.viewClick()  );
    
    }


    /* handler for view button clicks  */
    viewClick(): any {
        // let cacheNode = node;
        return (event: MouseEvent) => {
            let currentNode = event.currentTarget as HTMLSpanElement;

            if ( this.prev == currentNode) {
                return;
            } else {

                let name = getServiceName(currentNode);

                if (name) {
                
                    fetchPagesHelper(name)
                    .then( (resp) => {

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