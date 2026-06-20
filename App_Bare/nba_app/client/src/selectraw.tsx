import {storage_status_cls, arrow_right_cls, arrow_left_cls, ready_status_cls} from './static/selectRaw.css';

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

// init message queue 
messageNode.innerHTML = "Undefined";

// initi db status 
readyStatus.className = ready_status_cls;
readyStatus.dataset.dbstatus = "0";

// load selectRawNode children 
[readyStatus, messageNode, leftButton, rightButton].forEach(element => {
    selectRawNode.append(element);
});

// handlers for left button 

// handler for right button

// view data change on click 

// handler for status of database (storage)


export default selectRawNode;
