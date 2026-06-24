

import dashboard from './followers';
import {start_button_cls} from './static/css/startButton.css'
import { writeLog } from './handlers';
import type { LogInterface } from './followers';
import { powerButton } from './powerButton';
import { readyStatus, folio } from './selectraw';
import { fetchPages } from './handlers';
// import { json } from 'node:stream/consumers';
import { activePlayerList } from './main';
import { loadPlayerData } from './handlers';

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
button.dataset.dbRunning = "0";

// set handlers 
button.onclick = (event: MouseEvent)=>{
    
    if (button.dataset.busy == "1") {
        // database already requested to start 
        return; 
        // setup a timeout mechanism in case no reply is sent (TBD)
    }

    button.dataset.busy = "1";
    
    // set log message 
    if (powerButton.dataset.isOn == "1") {
        console.log('database is on, no reason to start');
        button.dataset.busy = "0";
        return;
    }

    fetchPages().then ((data)=>{
        if (!data)
            return;
        folio.innerText = `${data.page} of ${data.numPages}`;
        folio.dataset.recentpage = data.page.toString();
        folio.dataset.numpages = data.numPages.toString();
        loadPlayerData(data.players);
    });


    const logRecord : LogInterface = {
        date: (new Date()).toLocaleString(),
        message: "\t Starting DB",
        dashboard: dashboard
    }
    console.log('starting db');
    // confirm db is running 
    
    // send to log
    writeLog(0, logRecord);
    
    // enable powerbutton
    powerButton.dataset.isOn = "1";
    readyStatus.dataset.dbready = '1';

    // if error occured turn off
    button.dataset.busy = "0";
}

export { button as start_button };


