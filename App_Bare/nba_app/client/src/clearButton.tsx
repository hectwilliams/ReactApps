
import {clear_button_cls} from './static/clearButton.css'
import { findNodeByDataset, updateLog } from './handlers';
import { start_button } from './startButton';
import { powerButton } from './powerButton';
import dashboard from './followers';
import { activePlayerList } from './main';
import { fetchPages } from './handlers';
import { loadPlayerData } from './handlers';
import {  folio } from './selectraw';
import type { LogInterface } from "./followers";
import { writeLog } from './handlers';

// log 
const logRelPathRoot = './static/log'
// block for rootDiv
const rootDiv = document.getElementById('root');
while(rootDiv== null){}

// function scopes variables (free bee)
var playerListNode = findNodeByDataset(rootDiv, 'name','leader') as HTMLElement;

export const clearDB = () => {
    
    // send request to server (or local system) to clear
    // let dbClearSuccess = true;

    // clear gui players list
    if (activePlayerList.childElementCount) {
        // let playerListNode = findNodeByDataset(rootDiv, 'name','leader') as HTMLElement;
        activePlayerList.replaceChildren(); // memory clean up 
        // cleared ram of database data
    } else {
        console.log('no data to delete ');
    }
    
}

export interface LoggerInterface {
    dashboard_1: string[];
    dashboard_2: string[];
    dashboard_3: string[];
    dashboard_4: string[];
}

const button = document.createElement('button');
button.className = clear_button_cls;
button.innerHTML = "<p> CLEAR DASHBOARDS </p>"
button.dataset.name = "clear_button";

//add to browser canvas 
rootDiv.append(button);

// handler 
button.onclick = (event: MouseEvent) => {

    // stat(logRelPathRoot)
    // .then((stats)=>{
    //     console.log(stats.isDirectory());
    // })
    // .catch((err)=>{
    //     console.log('does not exist')
    // })
    
    // set log message 
    const logRecord : LogInterface = {
        date: (new Date()).toLocaleString(),
        message: `Cleared list`,
        dashboard: dashboard
    }
    writeLog(0, logRecord);

    // POST dashboard data to http webserver 
    let data :  Array<string> = [];
    let clearableEle = [] as Element[];

    let arr = dashboard.children[2];

    if (arr) {
        
        clearableEle.push(arr);
        data = Array.from(arr.children).map((x)=>{
            return x.textContent;
        })
        updateLog(data);
    
    }

    setTimeout(()=>{
        arr?.replaceChildren();
    }, 3000);

    // Object.entries(dashboards).forEach( (entry, index) =>{
    //     let db = entry[1];
    //     let key = entry[0];
    //     let arr = db.children[2];
    //     if (arr) {
             
    //     }    
    // });    

    // clearableEle[0]?.replaceChildren();
    // clearableEle[1]?.replaceChildren();
    // clearableEle[2]?.replaceChildren();
    // clearableEle[3]?.replaceChildren();

    
}


