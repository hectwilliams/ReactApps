
import type { SimplePlayerProfileInterface } from './player';
import { dashboard } from './dashboard';
import { bookletInst } from "./pageShifter";
import { playerlist, processData } from "./playerlist";
import { storeInst } from './store';
import { logbookInst } from './logbook';

//     list.forEach((record)=>{
//            // // set Profile 
//             const profile :  SimplePlayerProfileInterface = {
//                 img: record.img,
//                 name: record.name
//             }

//             // set log message 
//             const logRecord : LogInterface = {
//                 date: (new Date()).toLocaleString(),
//                 message: `Write/Add ${record.name} `,
//                 dashboard: dashboard
//             }

//             // pass profile object to player card
//             const node =  PlayerCard(profile);

//             // append to leader list 
//             if (activePlayerList) {
//                 activePlayerList.append(node);
//                 // send to log
//                 let log: Element | null =  dashboard.children.item(2);
//                 writeLog(0, logRecord);
//             }
    
//         });
// }


// import type { LogInterface } from "./followers";
// export function writeLog(id:number, record: LogInterface) {
//     var liElement = document.createElement('li');
//     // // set animation dataset 
//     liElement.textContent = `Time: [${record.date}] Message: [${record.message}]`;
    
//     let node = record.dashboard?.children[2] as HTMLElement; 
//     node.append(liElement);
    
//     // animation condition for GUI write log 
//     liElement.dataset.noop = "1";
//     setTimeout(()=>{
//         liElement.dataset.noop = "0";
//     }, 1000);

// }




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
    plots?: Array< Array<number> >;
}

export async function fetchPages(page?:number): Promise<ServerRecordInterface | undefined> {
    
    if (page == undefined) {
        page = 0;
    }
    
    const params = new URLSearchParams({page: `${page}`});
    
    const path = `${window.location.origin}/${params}`;
    // const path = `${window.location.hostname}:50215/${params}`;
    console.log(path);
    try {
        const response = await fetch( path );
        // method: "GET", 
        // headers: {"Content-Type": "application/json"}     ,
        // body: JSON.stringify({id: page })
        
        if (!response.ok) {
            throw new Error("HTTP error! ");
        }
            console.log("retuned", path);
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
                
                let data = await fetchPages(page);

                if (!data) 
                    return false;
                
                processData(data) // clears dashboard and loads  playerlist variable 
                
                .then( () =>{

                    // players list in memory; load to dashboard 
                    dashboard.prepend(playerlist);

                    // csave succesful page
                    storeInst.load(name, data);

                    // add booklet 
                    bookletInst.load();

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

                console.log(name);

                return false; 

            default:

                return false; 
        }
        
    } catch(err) {

        return false

    }
}

// export async function updateLog(data: Array<string> ) : Promise<Boolean>{

//     const path = `${window.location.origin}/log`;
//     const method = {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//             // 'Authorization': '' TBD
//         },
//         body: JSON.stringify(data)
//     };

//     try {
//         const response = await fetch(path, method);
//         if (!response.ok) {
//             throw new Error("Log Put Failed");
//         }
//         return true; 
//     }catch {
//         return false;;
//     }
// }

// export async function fetchBinny(): Promise<Array<Number> | undefined> {
    
//     const portBinny = 50216;
//     const path = `http://127.0.0.1:${portBinny}/binny`; // Binny server :) 

//     try {
//         const response = await fetch(path);
//         if (!response.ok) {
//             throw new Error("Cannot reach Binny");
//         }
//         const data  = await response.json() as Array<Number>;
//         return data;
//     }catch {
//         return undefined;
//     }
   
  
// }

// export async function enableService(address:string, port: number) {
//     if (!address) {
//         address = "127.0.0.1"; // loop back
//     }
//     const path = `http://127.0.0.1:${port}/turn_on_nba`; // Binny server :) 

//     try {
//         const response = await fetch(path);
//         if (!response.ok) {
//             throw new Error("Unable to request service");
//         }
//         console.log(response.json);
//     }catch(err) {
//         console.log(err);
//     }
// }

 function viewButton(node: HTMLSpanElement) {
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

/* 
    Global closure used to capture every called instance of viewClick.

    Note: Don't run too many services, many instances will exist in memory 
*/
const globalViewVlick = (node: HTMLSpanElement) => {
    let ref = node;
    return () => {
        console.log('new node', node);
        return ref;
    }
}