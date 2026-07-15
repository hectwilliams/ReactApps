
import { binlog_cell_cls } from './static/css/quickPlot.css';
import { BINSIZE } from './main';

export function fillUnweightedCell(currentNode: HTMLDivElement, classname: string) {
  // load empty cells 
    for(let n = 0; n < BINSIZE**2; n++) {
        const e = document.createElement('span');
        e.className = classname;
        currentNode.append(e);
    }
}

export function setPeakCells (currentNode: HTMLDivElement, classname: string, numbers: number[]) {
    const posititons = []
    numbers.forEach( (amplitude, index) => {

        if (amplitude  <= 0 || amplitude > BINSIZE**2) 
            return;  

        const pos = ((10 - amplitude)*BINSIZE) + index as number;
        posititons.push([amplitude, index], pos);
        if (pos >= 0 && pos < 100) {
            (currentNode.childNodes[pos] as HTMLSpanElement).dataset.on="1";
        }

    });

}

export function setBarCells (currentNode: HTMLDivElement,  numbers: number[]) {
    
    numbers.forEach( (amplitude) => {
        const cells = [] as Array<HTMLSpanElement>;

        if (amplitude  <= 0 || amplitude > BINSIZE**2) 
            return;  

        numbers.forEach( (r, c) => { 
            r = BINSIZE - r;
            while (r < BINSIZE) {
                const pos = r * BINSIZE + c;
                const binCell = currentNode.childNodes[pos] as HTMLSpanElement;
                // binCell.dataset.on = '1';
                cells.push(binCell);
                r++;
            }
        });

        cells.forEach( (b)=>{
            const classname = b.className;
            // reflow block
            b.className = "";
            void b.offsetWidth; 
            b.className = classname;
            // turn element state off 
            b.dataset.on = '1';

        });
    });
    
}

/* Plots bin data  */
export class QuickPlot {
    
    // export so we can create new plots 
    bin_log: HTMLDivElement;

    constructor(wrapper :HTMLDivElement) {
        this.bin_log = wrapper;
        fillUnweightedCell(wrapper, binlog_cell_cls);
    }

    // get plot 
    getPlot(): HTMLDivElement {
        return this.bin_log;
    }

    // set plot  
    setPlot(numbers: number[]) {
        
        const cells = [] as Array<HTMLSpanElement>;
        
        numbers.forEach( (r, c) => { 
        //flip r 
            // r = BINSIZE**2 -  r * BINSIZE;
            // r = Math.floor( r/ BINSIZE) ;
            r = BINSIZE - r;
            while (r < BINSIZE) {
                const pos = r * BINSIZE + c;
                const binCell = this.bin_log.childNodes[pos] as HTMLSpanElement;
                // binCell.dataset.on = '1';
                cells.push(binCell);
                r++;
            }
        })

        cells.forEach( (b)=>{
            const classname = b.className;
            // reflow block
            b.className = "";
            void b.offsetWidth; 
            b.className = classname;
            // turn element state off 
            b.dataset.on = '1';

        })
    }

}