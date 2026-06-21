import {power_button_cls} from './static/powerButton.css';

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
    if (button.dataset.isOn == "0") {
        button.dataset.isOn = "1";
        console.log('turn on database');
    } else {
        button.dataset.isOn = "0";
        console.log('turn off database');
        // prevent button clicks 

        // print messeg to console

        // confirm with database 

        // enable buttons 

    }
}