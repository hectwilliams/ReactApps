import { tbddfconstants, setButton } from './tbddf';


import * as tbdd_css from './static/css/Tbdd.module.css';
const tbdd_css_eff :  Record<string, boolean | string | unknown > = tbdd_css;

const sectionPlot = (): HTMLDivElement=> {
    const div = document.createElement('div');
    div.className = tbdd_css_eff.plot_cls as string;
    return div;
}

const sectionOptions = (): HTMLDivElement=> {
    const div = document.createElement('div');
    div.className = tbdd_css_eff.options_cls as string;

    const btn1 = document.createElement('button');
    btn1.innerText = "LOGS";
    const btn2 = document.createElement('button');
    btn2.innerText = "AI-PREDICT";
    div.append(btn1);
    div.append(btn2);
    setButton(btn1);
    setButton(btn2);
    return div;
}


const sectionMeasure = (): HTMLDivElement =>  {
    const div = document.createElement('div');
    div.className = tbdd_css_eff.measure_cls as string;
    const n = 100;
    for (let i = 0 ; i < n**2; i++) {
        let spanElement = document.createElement('span');
        if (i == 0)
            spanElement.dataset.init = '0';
        else 
            spanElement.dataset.init = '1';

        div.append(spanElement);
    }
    return div;
}

const sectionLogs = (): HTMLDivElement => {
    const div = document.createElement('div');

    div.className = tbdd_css_eff.logic_cls as string;

    // const htmlString = `<button id="dynamic-btn">Click Me</button>`;
    const htmlString =  tbddfconstants['table'];

    // // 1. Create the parser instance
    // const parser = new DOMParser();

    // // 2. Parse the string into a temporary DOM document
    // const doc = parser.parseFromString(htmlString, 'text/html');

    // // 3. Extract the element object from the temporary document
    // const newTable = doc.body.firstChild as HTMLTableElement;

    // div.append(newTable );

    div.innerHTML = htmlString;

    return  div;
}


const setMain = (div: HTMLDivElement): void => {

    div.className = (tbdd_css_eff.main_cls as string); // set classname style componenet 
    div.append(sectionMeasure());
    div.append(sectionLogs());
    div.append(sectionOptions());
    div.append(sectionPlot());
}

class TBDD {

    name: string
    main: HTMLDivElement;

    constructor() {
        this.name = "binny";
        this.main = document.createElement('div');
        
        setMain(this.main);
    }

    get() {return this.main}
    
    getHtmlElement() {
        return this.get();
    }

}

export const tbdd = new TBDD();