import {power_button_cls} from './static/powerButton.css';
import type { LogInterface } from './followers';
import dashboard from './followers';
import { writeLog } from './handlers';
import optionNode from './options';
import { readyStatus } from './selectraw';
import { activePlayerList } from './main';

const button = document.createElement('button');

const rootDiv = document.getElementById('root');
while(rootDiv == null) {}

button.className = power_button_cls;

//set toggle variable 
button.dataset.isOn = "0";
// add button 
rootDiv.append(button);

//set handlers 
button.onclick = (event: MouseEvent) => {

    // prevent shut down if data in broswer
    if (activePlayerList.childElementCount) {
        console.log('data is memory, clear(or store) before shutting down');
        return;
    }

    if (button.dataset.isOn == "0") {

        //request server 

        button.dataset.isOn = "1";
        
        console.log('starting db...');
         const logRecord : LogInterface = {
        date: (new Date()).toLocaleString(),
        message: "-\t Starting DB",
        dashboard: dashboard
        }
        writeLog(0, logRecord);
        readyStatus.dataset.dbready ='1';

        console.log('db connected');
    } else {
        button.dataset.isOn = "0";
           const logRecord : LogInterface = {
        date: (new Date()).toLocaleString(),
        message: "-\t Shutting Down DB",
        dashboard: dashboard
        }
        writeLog(0, logRecord);
        console.log('turn off database');
        // prevent button clicks 

        // print messeg to console

        // confirm with database 

        // enable buttons 

        // update status 
        readyStatus.dataset.dbready ='0';

    }
}


export { button as powerButton };
