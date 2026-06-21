import type { LogInterface } from "./followers";

export function writeLog(id:number, record: LogInterface) {
    var liElement = document.createElement('li');
    // // set animation dataset 
    liElement.textContent = record.message;
    
    let node = record.dashboard?.children[2] as HTMLElement; 
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

export function wrPlayerList(node:HTMLElement, datasetName: string) {

}

export function wrDashboard(id: number, logMessage: string) {

}

export function Accumulator() {
//     console.log(dnode);
//     console.log('hellow world');

//     const img = "/Users/hectorwilliams/Documents/Dev/repos/ReactApps/App_Bare/nba_app/client/src/static/images/img.png";
//     const name = "Bob Lazar";
// // 28266

//     for (let i= 0; i <100; i++) {

//         // set Profile 
//         const profile :  SimplePlayerProfile = {
//             img: img,
//             name: name
//         }

//         // pass profile object to player card
//         const card =  PlayerCard(profile);

//         // append to leader 
//         dnode.append(card.cnode);
//     }

}

