import {rand_button_cls} from './static/randButton.css';

const button = document.createElement('button');

const rootDiv = document.getElementById('root');
while(rootDiv == null) {}

button.className = rand_button_cls;

//set toggle variable 
// button.dataset. = "0";
// add button 
rootDiv.append(button);

//set handlers 
button.onclick = (event: MouseEvent) => {

    // running transactions

    console.log('transactions running ');
  
}