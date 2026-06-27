
import { binlog_cell_cls } from './static/css/quickPlot.css';
import { BINSIZE } from './main';

/* Plots bin data  */
export class QuickPlot {
    
    // export so we can create new plots 
    bin_log: HTMLDivElement;

    constructor(wrapper :HTMLDivElement) {
        this.bin_log = wrapper;

        
        // load empty cells 
        for(let n = 0; n < BINSIZE**2; n++) {
            // console.log(n);
            let e = document.createElement('span');
            e.className = binlog_cell_cls;
            // this.bin_log.dataset.row="0";
            // this.bin_log.dataset.col="0";
            this.bin_log.dataset.on="0";
            this.bin_log.append(e);
        }
    }

    // get plot 
    getPlot(): HTMLDivElement {
        return this.bin_log;
    }

    // set plot  
    setPlot(numbers: number[]) {
        
        let cells = [] as Array<HTMLSpanElement>;
        
        numbers.forEach( (r, c) => { 
        //flip r 
            // r = BINSIZE**2 -  r * BINSIZE;
            // r = Math.floor( r/ BINSIZE) ;
            r = BINSIZE - r;
            while (r < BINSIZE) {
                let pos = r * BINSIZE + c;
                let binCell = this.bin_log.childNodes[pos] as HTMLSpanElement;
                // binCell.dataset.on = '1';
                cells.push(binCell);
                r++;
            }
        })

        cells.forEach( (b)=>{
            let classname = b.className;
            // reflow block
            b.className = "";
            void b.offsetWidth; 
            b.className = classname;
            // turn element state off 
            b.dataset.on = '1';

        })
    }

}

