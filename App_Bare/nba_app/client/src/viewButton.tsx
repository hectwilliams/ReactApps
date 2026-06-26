import { dashboard } from "./dashboard";
import { playerlist, processData } from "./playerlist";
import { fetchPages } from "./handlers";
import type {ServerRecordInterface} from './handlers';
import type { SimplePlayerProfileInterface } from './player';
import { booklet, pageNumbers, reloadBooklet  } from "./pageShifter";
import {view_button_on} from './static/css/viewButton.css';

/* creates view button right adjacent to power button */
export function viewButton(node: HTMLSpanElement) {


    for (let i = 0; i < 100; i++) {
        let viewButtonPixel = document.createElement('span');
        moreViewSymbol.append(viewButtonPixel);
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

/* Handle clicking event of a view button */
export const setEventMoreViewSymbol = (node: HTMLSpanElement)=>{
    // click event 
    const name = node.dataset.name as string;
    
    node.addEventListener( 'click', (event:MouseEvent) => {
        
       fetchPages()

        .then( (data) => {

            if (data) {

                dashboard.innerHTML = "";

                processData(data);

                switch(name) {

                case "nba": 
                    dashboard.append(playerlist);
                    break;

                default:
                    return; 
                
                }
                
                reloadBooklet(dashboard);

                if (dashboard.childElementCount) {
                    // non empty list rcvd from server
                    booklet.dataset.on = "1";
                }
            }
        })

        .catch( (err)=>{

            console.log("err", err);

        })

    });

}

export const moreViewSymbol = document.createElement('span');

// datasets 
moreViewSymbol.dataset.on = "0";
moreViewSymbol.className = view_button_on;

viewButton(moreViewSymbol);