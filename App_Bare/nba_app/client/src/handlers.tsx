
import type { SimplePlayerProfileInterface } from './player';
import { dashboard } from './dashboard';
import { bookletInst } from "./pageShifter";
import { playerlist, processData } from "./playerlist";
import { storeInst } from './store';
import { logbookInst } from './logbook';

export function findNodeByDataset(parentNode: HTMLElement, datasetKey: string, datasetName: string) : HTMLElement | undefined {
    // let returnNode = undefined;
    
    const returnNode = (parentNode.childNodes.values().find((some_node)=>{
        if( some_node instanceof HTMLElement) {
                // console.log(some_node);
            if ( datasetKey in some_node.dataset) {
                    // console.log(datasetKey);

                if (some_node.dataset.name == datasetName) {
                    return true;
                }
            }
        }
    })) as HTMLElement; // find returns a HTML ELEMENT
    return returnNode;
}

export interface ServerRecordInterface {
    page: number;
    start: number;
    numPages: string;
    players: Array<SimplePlayerProfileInterface>;
    plots?: Array< Array<number> >;
}

export async function fetchPages(page?:number): Promise<ServerRecordInterface | undefined> {
    
    if (page == undefined) {
        page = 0;
    }
    
    const params = new URLSearchParams({page: `${page}`});
    
    const path = `${window.location.origin}/${params}`;
    
    try {
        const response = await fetch( path );
        // method: "GET", 
        // headers: {"Content-Type": "application/json"}     ,
        // body: JSON.stringify({id: page })
        
        if (!response.ok) {
            throw new Error("HTTP error! ");
        }
            const data : ServerRecordInterface = await response.json();
            return data;
    } catch {
            return undefined;
    }
}

export async function fetchPagesHelper( name: string, page?: number) : Promise<boolean>{

    try {
        
        switch(name) {
            
            case "monitor":
                
                throw new Error("do nothing, monitor metrics not available yet");
                
            case "nba": 
                
                const data = await fetchPages(page);

                if (!data) 
                    throw new Error("do nothing, monitor metrics not available yet");
                
                processData(data) // clears dashboard and loads  playerlist variable 
                
                .then( () =>{
                    
                    // players list in memory; load to dashboard 
                    dashboard.prepend(playerlist);

                    // csave succesful page
                    storeInst.load(name, data);

                    // add booklet 
                    bookletInst.load();

                    // set booklet 
                    bookletInst.setFeed(data.page, data.numPages);

                    // save name 
                     storeInst.service = name;
                     
                    //  resets pages selector 
                    bookletInst.enable();

                    // add logbook to dom 
                     logbookInst.addTodashoard();

                }).catch((err)=>{

                    console.log(err, "Process data failed ");

                })

                // non empty list rcvd from server

                return true;
            
            case "binny":

                throw new Error("do nothing, monitor metrics not available yet");

            default:

                throw new Error("do nothing, monitor metrics not available yet");
        }
        
    } catch(err) {
        
        console.log(err);

        return false

    }
}


/* 
    Global closure used to capture every called instance of viewClick.

    Note: Don't run too many services, many instances will exist in memory 
*/
const globalViewVlick = (node: HTMLSpanElement) => {
    const ref = node;
    return () => {
        return ref;
    }
}