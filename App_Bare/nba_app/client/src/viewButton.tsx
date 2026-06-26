import { dashboard } from "./dashboard";
import { playerlist, processData } from "./playerlist";
import { fetchPages } from "./handlers";
import type {ServerRecordInterface} from './handlers';
import type { SimplePlayerProfileInterface } from './player';

export function viewButton(node: HTMLSpanElement) {
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

export const moreViewSymbol = document.createElement('span');
for (let i = 0; i < 100; i++) {
    let node = document.createElement('span');
    moreViewSymbol.append(node);
}

export const setEventMoreViewSymbol = (node: HTMLSpanElement)=>{
    // click event 
    const name = node.dataset.name as string;
    
    node.addEventListener( 'click', (event:MouseEvent) => {

       fetchPages()

        .then( (data) => {
            if (data)
                processData(data); 
        })
        .catch( (err)=>{
            console.log("err", err);
        })
    
        // console.log(data);
        dashboard.innerHTML = '';
        switch(name) {
            case "nba": 
                dashboard.append(playerlist);
            default:
                ;
        }

    });

}

viewButton(moreViewSymbol);