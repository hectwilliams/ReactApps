import { dashboard } from "./dashboard";
import { playerlist, processData } from "./playerlist";
import { fetchPages } from "./handlers";
import type { SimplePlayerProfileInterface } from './player';
import {view_button_on} from './static/css/viewButton.css';
import { bookletInst } from "./pageShifter";
import { fetchPagesHelper } from "./handlers";

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
class  ViewButtonn {  

    prev: HTMLSpanElement;
    moreViewSymbol : HTMLSpanElement;
    //  document.createElement('span');

    constructor() {

        this.prev = document.createElement('span');
        this.moreViewSymbol = document.createElement('span');
        
        this.viewButton(this.moreViewSymbol);

        this.moreViewSymbol.dataset.on = "1";
        this.moreViewSymbol.className = view_button_on;
    }

    /* handler for view button clicks  */

    viewClick(node: HTMLSpanElement): any {
        let cacheNode = node;
        return (event: MouseEvent) => {
            let currentNode = event.currentTarget as HTMLSpanElement;

            if ( this.prev == currentNode) {
                // repeated clicks 
                return;
            } else {

                // clear dashboard 

                
                /* nothing is deleted out the store, so if name exist then we are safe to continue */
        
                let name = getServiceName(currentNode);

                if (name) {

                    try {

                        let status = fetchPagesHelper(name);

                        if (!status) {

                            throw new Error("fetch to server failed")
                        } 

                    } catch(err) {

                        console.log('unsuccessful request');

                    }
                }
            }

            this.prev = currentNode;
        }
    }

    /* bind listeners to view button objects  */    

    setEventMoreViewSymbol(node: HTMLSpanElement){
        node.addEventListener( 'click' ,  this.viewClick(node) , );
        
    }

    /* creates view button right adjacent to power button */
    viewButton(node: HTMLSpanElement) {


    for (let i = 0; i < 100; i++) {
        let viewButtonPixel = document.createElement('span');
        this.moreViewSymbol.append(viewButtonPixel);
    }


    let rows = [2, 5, 9] as Array<number>;
        rows.forEach((r, index)=>{
            let v = rows[3 - 1 - index];
            if (v) {
                console.log(v);
                for (let i = 0; i < v; i++) {
                    let pos = 10 * r + i; 
                    let ele = node.children[pos] as HTMLSpanElement;
                    ele.style.backgroundColor="white";
                }
            }
        })
    }

}

export const viewButtonnInst = new ViewButtonn(); 