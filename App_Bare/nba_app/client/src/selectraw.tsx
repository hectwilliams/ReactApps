import {buttons_cls, storage_status_cls, arrow_right_cls, arrow_left_cls, ready_status_cls} from './static/selectRaw.css';
import { powerButton } from './powerButton';
import {  folio } from './selectraw';
import { fetchPages } from './handlers';
import { loadPlayerData } from './handlers';
import { activePlayerList } from './main';

const rootDiv = document.getElementById('root');

// create div 
const selectRawNode = document.createElement('div');

// set class
selectRawNode.className = storage_status_cls;

// add grid-child root list 
rootDiv?.prepend(selectRawNode);

// create selectRawNode children 
const readyStatus = document.createElement('div');
const messageNode = document.createElement('p');
const leftButton = document.createElement('button');
const rightButton = document.createElement('button');
rightButton.innerHTML = `<div class= ${arrow_right_cls}>  </div>`;
leftButton.innerHTML = `<div class= ${arrow_left_cls}>  </div>`;

leftButton.className = buttons_cls;
rightButton.className = buttons_cls;

// init message queue 
messageNode.innerText = "...";

// initi db status 
readyStatus.className = ready_status_cls;
readyStatus.dataset.dbready = "0";

// load selectRawNode children 
[readyStatus, messageNode, leftButton, rightButton].forEach(element => {
    selectRawNode.append(element);
});

// handlers for left button 

leftButton.onclick = (event:MouseEvent) => {

    if (messageNode.innerText === "...") {

        return;
        
    } else if (powerButton.dataset.isOn == "1") {
        let s = messageNode.innerText.trim().split(' ')[0];
        if (s) {
            let num = parseInt(s) as number;
            if (num - 1 <=0 ) {
                return;
            }
            fetchPages(num - 1).then ((data)=>{
                if (!data)
                    return;
                folio.innerText = `${data.page} of ${data.numPages}`;
                
                // clear player list 
                activePlayerList.replaceChildren();

                // load new block
                loadPlayerData(data.players);
            });
            
        }
            
    } else {
        console.log('system is off');
    }
}
// handler for right button
rightButton.onclick = (event:MouseEvent) => {

    if (messageNode.innerText === "...") {

        return;
        
    }else if (powerButton.dataset.isOn == "1") {
        let arr = messageNode.innerText.trim().split(' ') as Array<string>;
        console.log(arr);
        let s = arr[0];
        let e = arr[2];

        console.log()
        if (s && e) {
            let num = parseInt(s) as number;
            let numE = parseInt(e) as number;
            if (num + 1 > numE) {
                return;
            }
            fetchPages(num + 1).then ((data)=>{
                if (!data)
                    return;
                folio.innerText = `${data.page} of ${data.numPages}`;
                
                // clear player list 
                activePlayerList.replaceChildren();

                // load new block
                loadPlayerData(data.players);

            });
            
        }
            
    } else {
        console.log('system is off');
    }
}
// view data change on click 

// handler for status of database (storage)


// export default selectRawNode;
export  {readyStatus as readyStatus};
export  {messageNode as folio };