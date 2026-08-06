import { tbddfconstants, setButton, n_rand_rbg, ten_numbers, WATERFALL_US} from './tbddf';


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
        div.append(spanElement);
    }
    return div;
}

const sectionLogs = (): HTMLDivElement => {
    const div = document.createElement('div');

    div.className = tbdd_css_eff.logic_cls as string;

    const htmlString =  tbddfconstants['table'];

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

 function waterfall (this: TBDD): NodeJS.Timeout{
    const  n = 100;
    // const threshold  = 1000;
    // let counter = 0;

    const node: HTMLDivElement = this.sectionMeasure;

    const inner = ():  NodeJS.Timeout =>{

        this.measureRef  = setInterval( ()=>{
            
            let items = Array.from(node.childNodes).slice(-n) as Array<HTMLSpanElement>;
            let random_colors = n_rand_rbg(n);
    
            items.forEach ( (item) => {
                node.removeChild( item  );
            });
            
            const active_signatures = ten_numbers();
            for (let i =0; i < n; i++) {
                let spanElement = document.createElement('span');
                const c = random_colors[i] as number[];
                if (Math.random() < 0.5 &&  (i in active_signatures) ) {
                    spanElement.style.backgroundColor = `rgb(${ c[0] }, ${ c[1] }, ${ c[2] })`;
                }
                node.prepend(spanElement);
            }
            
            // counter++;
                // clearInterval(this.measureRef as NodeJS.Timeout );
    
        }, WATERFALL_US)
        
        return this.measureRef;
    }

    return inner();
}

export class TBDD {

    name: string
    main: HTMLDivElement;
    sectionLog: HTMLDivElement;
    sectionMeasure: HTMLDivElement;
    measureRef:  NodeJS.Timeout | null ;

    constructor() {
        this.name = "binny";
        this.main = document.createElement('div');
        this.measureRef = null;
        
        setMain(this.main);
        this.sectionLog = this.main.childNodes[1] as HTMLDivElement;
        this.sectionMeasure = this.main.childNodes[0] as HTMLDivElement;
        this.sectionMeasure.ondblclick = () =>{
            if (!this.measureRef ) {
                this.measureRef = waterfall.call(this);
            } else {

                clearTimeout(this.measureRef);
                this.measureRef = null;
            }
        }
    }

    get() {return this.main}
    
    getHtmlElement() {
        return this.get();
    }

}

export const tbdd = new TBDD();