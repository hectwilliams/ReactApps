import {fill_button_cls} from './static/fillButton.css';
import type { SimplePlayerProfileInterface } from './player';
import { PlayerCard } from './player';
import { findNodeByDataset } from './handlers';
import { writeLog } from './handlers';
import dashboards from './followers';
import type { LogInterface } from './followers';
import { powerButton } from './powerButton';
import { activePlayerList } from './main';
// const img = "/Users/hectorwilliams/Documents/Dev/repos/ReactApps/App_Bare/nba_app/client/src/static/images/img.png";

var playerListNode: HTMLElement | undefined;
const img = './static/images/img.png';
const name = "Bob Lazar";
const button = document.createElement('button');

const rootDiv = document.getElementById('root');
while(rootDiv == null) {}
button.className = fill_button_cls;

//set toggle variable 
button.dataset.isfull = "0";

// add button to DOM 
rootDiv.append(button);

// meets async imports of main.tsx 
// setTimeout(()=>{
    // playerListNode = findNodeByDataset(rootDiv, 'name', 'leader');
// }, 10);
// playerListNode = activePlayerList;

button.onclick = (event: MouseEvent) => {
    // async event 

    // if (powerButton.dataset.isOn == '0') {
    //     console.log('database not on');
    //     return;
    // }

    // if (button.dataset.isfull == "0") {


    //     // get csv 
        
    //     // fiiling database 

    //     for (let i = 0; i < 1000; i++) {

    //         // // set Profile 
    //         const profile :  SimplePlayerProfileInterface = {
    //             img: img,
    //             name: name
    //         }

    //         // set log message 
    //         const logRecord : LogInterface = {
    //             date: (new Date()).toLocaleString(),
    //             message: `${name}`,
    //             dashboard: dashboards.dashboard_1
    //         }

    //         // pass profile object to player card
    //         const node =  PlayerCard(profile);

    //         // console.log('hellow world', playerListNode, dashboards.dashboard_1);

    //         // append to leader list 
    //         if (activePlayerList) {
    //             activePlayerList.append(node);
    //             // send to log
    //             let log: Element | null =  dashboards.dashboard_1.children.item(2);
    //             writeLog(0, logRecord);
    //         }
            
    //     }

    //     // confirmed databse complete 
    //     button.dataset.isfull = "1";
    
    // } else {

    //     console.log('database loading');

    //     // wait 
    //     console.log('writing loading database')
        
    //     setTimeout( ()=>{
    //         console.log('complete with writing to database')
    //     }, 10000);
        
        
    // }
}
