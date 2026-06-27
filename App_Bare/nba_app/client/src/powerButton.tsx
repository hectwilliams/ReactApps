import {power_button_cls} from './static/css/powerButton.css';
// import type { LogInterface } from './followers';
// import dashboard from './followers';
// import { writeLog } from './handlers';
import optionNode from './options';
import { bookletInst } from "./pageShifter";
import { dashboard } from './dashboard';
// import { readyStatus } from './selectraw';
// import { activePlayerList } from './main';

// const button = document.createElement('button');

// const rootDiv = document.getElementById('root');
// while(rootDiv == null) {}

// button.className = power_button_cls;

//set toggle variable 
// button.dataset.isOn = "0";
// add button 
// rootDiv.append(button);

// //set handlers 
// button.onclick = (event: MouseEvent) => {

//     // prevent shut down if data in broswer
//     if (activePlayerList.childElementCount) {
//         console.log('data is memory, clear(or store) before shutting down');
//         return;
//     }

//     if (button.dataset.isOn == "0") {

//         //request server 

//         button.dataset.isOn = "1";
        
//         console.log('starting db...');
//          const logRecord : LogInterface = {
//         date: (new Date()).toLocaleString(),
//         message: "-\t Starting DB",
//         dashboard: dashboard
//         }
//         writeLog(0, logRecord);
//         readyStatus.dataset.dbready ='1';

//         console.log('db connected');
//     } else {
//         button.dataset.isOn = "0";
//         const logRecord : LogInterface = {
//             date: (new Date()).toLocaleString(),
//             message: "-\t Shutting Down DB",
//             dashboard: dashboard
//         }
//         writeLog(0, logRecord);
//         console.log('turn off database');
//         // prevent button clicks 

//         // print messeg to console

//         // confirm with database 

//         // enable buttons 

//         // update status 
//         readyStatus.dataset.dbready ='0';

//     }
// }

// function setPowerSwitch(node: HTMLSpanElement) {
//     let some_parent = document.createElement('span');
//     let some_child = document.createElement('span');

//     some_parent.append(some_child);
    
//     node.append(some_parent);
    
// }

// export const powerSwitch = document.createElement('span');

// statusCircleGrandParent.append(statusCircleParent);
// statusCircleParent.append(statusCircleGrandChild);


// export const moreViewSymbol = document.createElement('span');
// for (let i = 0; i < 100; i++) {
//     let node = document.createElement('span');
//     moreViewSymbol.append(node);
// }

export const statusCircleGrandParent = document.createElement('span');
let node = document.createElement('span');
statusCircleGrandParent.append(node);

/* 
    Sets parameters for single circle power switch  
*/
export const setPowerSwitch = (node: HTMLSpanElement)=>{
    let prev: string | null; // closure caches previous state
    let v_pres : HTMLElement | null; // cache view button element

    // click event 
    node.addEventListener( 'click', (event:MouseEvent) => {
        let nodeTest = event.currentTarget as HTMLSpanElement;
        let status = nodeTest.dataset.status as string;
        let v : HTMLElement;
        
        if (!v_pres) {
            v_pres = nodeTest.parentElement;
        }
        v = v_pres?.childNodes[1] as HTMLElement; 

        if (status == 'off') {

            if (prev) {
                nodeTest.dataset.status = prev;
            } else {
                nodeTest.dataset.status = "on";
            }

            v.dataset.on = "1"; // enable viewwe button

            if (dashboard.childElementCount) {
                // players in dashboard s
                bookletInst.enable();
            }

            
            
        } else {
            
            if (prev == null) {
                // store on state
                prev = status;
            }
            nodeTest.dataset.status = "off";
            v.dataset.on = "0"; // disable viewwe button
            bookletInst.disable();

        }
        
        

    });
}

setPowerSwitch(statusCircleGrandParent);