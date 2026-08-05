

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
    return div;
}

const sectionLogs = (): HTMLDivElement => {
    const div = document.createElement('div');
    div.className = tbdd_css_eff.logic_cls as string;
    return div;
}

const sectionMeasure = (): HTMLDivElement =>  {
    const div = document.createElement('div');
    div.className = tbdd_css_eff.measure_cls as string;
    return div;
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