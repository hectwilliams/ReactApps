

import dashboards from './followers';
import {start_button_cls} from './static/startButton.css'
import { writeLog } from './handlers';
import type { LogInterface } from './followers';

const button = document.createElement('button');
button.className = start_button_cls;

button.innerHTML = "<p> START DB </p>"
button.dataset.name = "start_button";


// block for rootDiv
const rootDiv = document.getElementById('root');
while(rootDiv== null){}
rootDiv.append(button);

// wait for button
while(button == null){}

// set handlers 
button.onclick = (event: MouseEvent)=>{

    // dashboards.dashboard_1.style.color= 'red';

    // create message
    // let date:string =  (new Date()).toLocaleString();
    // let msg: string = ;
    // let logMessage = `${date}\t\t\t\t${msg}`;
    
    // set log message 
    const logRecord : LogInterface = {
        date: (new Date()).toLocaleString(),
        message: "-\t Starting DB",
        dashboard: dashboards.dashboard_1
    }

    if (button.dataset.onRequest == null) {
        button.dataset.onRequest = "1";
    } else {
        console.log('request already sent') ;
        return;
    }
    
    // send to log
    writeLog(0, logRecord);

}


