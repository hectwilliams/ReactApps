import { tbddfconstants, setButton, n_rand_rbg, ten_numbers, WATERFALL_US, setPlot, aiButtonPredict} from './tbddf';


import * as tbdd_css from './static/css/Tbdd.module.css';
const tbdd_css_eff :  Record<string, boolean | string | unknown > = tbdd_css;

const X_N_SAMPLES = 100
const Y_N_SAMPLES = 100

const sectionPlot = (aibutton: HTMLButtonElement,  tbdd: TBDD): HTMLDivElement=> {
    const div = document.createElement('div');
    div.className = tbdd_css_eff.plot_cls as string;
    setPlot(div,   tbdd);

    setButton(aibutton, undefined, tbdd);
    return div;
}

const sectionOptions = (): HTMLDivElement=> {
    const div = document.createElement('div');
    div.className = tbdd_css_eff.options_cls as string;

    // const btn1 = document.createElement('button');
    // btn1.innerText = "LOGS";
    const btn = document.createElement('button');
    btn.innerText = "AI-PREDICT";
    btn.dataset.ai = "";
    btn.onclick = null;
    div.append(btn);
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

const setMain = (div: HTMLDivElement, tbdd: TBDD): void => {

    div.className = (tbdd_css_eff.main_cls as string); // set classname style componenet 
    div.append(sectionMeasure());
    div.append(sectionLogs());
    div.append(sectionOptions());
    div.append( 
        sectionPlot(  ( div.lastChild as HTMLDivElement ).firstChild as HTMLButtonElement , tbdd) 
    );
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

export interface RawInterfaceSub  {
            data: Array<number>,
            min: number,
            max: number
        };


export class TBDD {

    name: string
    main: HTMLDivElement;
    sectionLog: HTMLDivElement;
    sectionMeasure: HTMLDivElement;
    sectionplot: HTMLDivElement;
    sectionOptions: HTMLDivElement;
    measureRef:  NodeJS.Timeout | null ;
    raw: RawInterfaceSub | null;

    constructor() {
        this.name = "binny";
        this.main = document.createElement('div');
        this.measureRef = null;
        this.raw = null

        setMain(this.main,this);
        this.sectionOptions = this.main.childNodes[2] as HTMLDivElement;
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
        this.sectionplot = this.main.childNodes[3] as HTMLDivElement;

        // set up action clicking raw button
        // ((this.sectionplot.childNodes[0] as HTMLDivElement).childNodes[0] as HTMLButtonElement).onclick = ()=>{
                
        //     temperatureDB(this.sectionplot.childNodes[1] as HTMLDivElement);
        // }

        // // set up action clicking histo button
        // ((this.sectionplot.childNodes[0] as HTMLDivElement).childNodes[0] as HTMLButtonElement).onclick = ()=>{
                
        //     temperatureDB(this.sectionplot.childNodes[1] as HTMLDivElement);
        // }

        // if (true) {
        //      this.sectionOptions.dataset.ai = '1'; 
        // }

    }

    get() {return this.main}
    
    getHtmlElement() {
        return this.get();
    }

}

export const tbdd = new TBDD();