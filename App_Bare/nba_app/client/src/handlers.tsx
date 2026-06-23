
import type { SimplePlayerProfileInterface } from './player';
import  dashboard from './followers';
import { PlayerCard } from './player';
import { activePlayerList } from './main';

export function loadPlayerData(list:  Array<SimplePlayerProfileInterface>) {

    list.forEach((record)=>{
           // // set Profile 
            const profile :  SimplePlayerProfileInterface = {
                img: record.img,
                name: record.name
            }

            // set log message 
            const logRecord : LogInterface = {
                date: (new Date()).toLocaleString(),
                message: `Write/Add ${record.name} `,
                dashboard: dashboard
            }

            // pass profile object to player card
            const node =  PlayerCard(profile);

            // append to leader list 
            if (activePlayerList) {
                activePlayerList.append(node);
                // send to log
                let log: Element | null =  dashboard.children.item(2);
                writeLog(0, logRecord);
            }
    
        });
}


import type { LogInterface } from "./followers";
export function writeLog(id:number, record: LogInterface) {
    var liElement = document.createElement('li');
    // // set animation dataset 
    liElement.textContent = `Time: [${record.date}] Message: [${record.message}]`;
    
    let node = record.dashboard?.children[2] as HTMLElement; 
    console.log(node);
    node.append(liElement);
    
    // animation condition 
    liElement.dataset.noop = "1";
    setTimeout(()=>{
        liElement.dataset.noop = "0";
    }, 1000);

}

export function findNodeByDataset(parentNode: HTMLElement, datasetKey: string, datasetName: string) : HTMLElement | undefined {
    // let returnNode = undefined;
    
    let arr = Array.from(parentNode.childNodes.entries());
  

    let returnNode = (parentNode.childNodes.values().find((some_node)=>{
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
    img: string; 
}

export async function fetchPages(page?:number): Promise<ServerRecordInterface | undefined> {
    
    if (page == undefined) {
        page = 0;
    }
    
    const params = new URLSearchParams({page: `${page}`});

    const path = `${ window.location.origin}/${params}`;

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

import type { LoggerInterface } from './clearButton';

export async function updateLog(data: Array<string> ) : Promise<Boolean>{

    const path = `${window.location.origin}/log`;
    const method = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': '' TBD
        },
        body: JSON.stringify(data)
    };

    try {
        const response = await fetch(path, method);
        if (!response.ok) {
            throw new Error("Log Put Failed");
        }
        return true; 
    }catch {
        return false;;
    }
}

export async function fetchBinny(): Promise<Array<Number> | undefined> {
    
    const portBinny = 50216;
    const path = `http://127.0.0.1:${portBinny}/binny`;

    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error("Cannot reach Binny");
        }
        const data  = await response.json() as Array<Number>;
        return data;
    }catch {
        return undefined;
    }
   
  
}