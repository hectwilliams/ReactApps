import {
    table_log_cls,
    maindiv_log_cls,
    table_row_cls,
    log_message_cls,
    log_message_label_cls,
    log_header_cls2,
    log_header_cls1,
} from './static/css/logbook.css';

import {logbook_in_dashboad_cls} from './static/css/dashboard.css';
import { dashboard } from './dashboard';

type  handleMouseMove =  (event:MouseEvent) => void;

class LogBook {
    top : HTMLDivElement;
    exit: HTMLSpanElement;
    div: HTMLDivElement;
    table: HTMLTableElement;
    holding : boolean;
    setIntervalRef : NodeJS.Timeout | undefined;
    posY: number;
    posX: number;
    refMouseMove: handleMouseMove;
    controller: AbortController;
    mouseDownEntered: boolean;
    a: string;
    b: string ;
    c: string;
    d: string;
    e: string; 
    f: string;

    constructor() {
        this.holding = false;  
        this.top = document.createElement('div');
        this.top.className = logbook_in_dashboad_cls;
        this.top.dataset.show="0";
        this.exit = document.createElement('span');
        this.div = document.createElement('div');
        this.div.className = maindiv_log_cls;
        this.top.append(this.exit);
        this.top.append(this.div);
        this.refMouseMove = this.handleMouseMove.bind(this)
        this.controller = new AbortController() as AbortController;
        this.mouseDownEntered = false;
        this.a = this.b = "";
        this.c = this.d = this.e = this.f = "";
        this.top.addEventListener('dblclick', this.handleDoubleClick.bind(this));
        this.top.addEventListener('mousedown', this.handleMouseDown.bind(this));

        this.exit.onclick =  () => {
            logbookInst.close();
        }

        this.table = document.createElement('table');
        this.table.className = table_log_cls;

        this.posX = 0;
        this.posY = 0;

        // header 
        const tr = document.createElement('tr');
        const header1 = document.createElement('th');
        const header2 = document.createElement('th');
        header1.className =log_header_cls1;
        header1.innerText = "Date";
        header2.className =log_header_cls2;
        header2.innerText = "Message";

        tr.append(header1, header2);
        tr.className = table_row_cls;
        
        let label = document.createElement('label');
        label.innerText = "Log"; 
        label.className = log_message_label_cls;
        this.div.append(this.table)
        
        this.table.append(label)
        this.table.append(tr);
    }

    isopen(): boolean {
        if (this.top.dataset.show=="0") {
            return false;
        }
        return true;
    }

    close () {
        this.top.dataset.show="0";
    }

    open () {
        this.top.dataset.show="1";
    }

    get()  : HTMLDivElement {
        return this.top;
    }

    rect(): DOMRect {
        return this.top.getBoundingClientRect();
    }


    add(message: string) {

        const tr = document.createElement('tr');
        tr.className = table_row_cls;
        
        let d1 = document.createElement('td');
        d1.className = log_message_cls;
        d1.innerText = (new Date()).toISOString()
        
        const d2 = document.createElement('td');
        d2.innerText = `${message}`;
        d2.className = log_message_cls;
        
        tr.append(d1);
        tr.append(d2);
        
        this.table.append(tr)

    }

    addTodashoard() {
        dashboard.append(this.top);
    }

    handleMouseDown (event: MouseEvent)  { 
        if ( this.mouseDownEntered ) {
            clearInterval(this.setIntervalRef);
            this.controller.abort(); // all listener 'connected' are aborted 
            this.controller =  new AbortController() as AbortController;
            this.mouseDownEntered = false;
        }
    }

    handleDoubleClick (event: MouseEvent)  {
        // set mouse move event 

        this.top.addEventListener('mousemove', this.handleMouseMove.bind(this), {signal: this.controller.signal});

        this.posY = event.clientY; // captured start position 
        this.posX = event.clientX; // captured start position 

        // re-set logbook style using DOMRect structure 
        if ( !this.mouseDownEntered ) {
            // console.log("hello");
            const rect = this.top.getBoundingClientRect() as DOMRect;
            this.top.style.width = (rect.width) + "px" ;
            // this.top.style.border = "5px silver solid";
            this.top.style.height = (rect.height)+ "px";
            // console.log(this.top.style.width  , this.top.style.height );
            this.top.style.padding= "0";
            this.top.style.margin = "0";
            // set position in gui
            this.top.style.top = (rect.top) + "px";
            this.top.style.bottom = (rect.bottom) + "px";
            this.top.style.left = (rect.left) + "px";
            this.top.style.right = (rect.right) + "px";
            this.mouseDownEntered = true;
            this.top.style.position = 'absolute';
        }

        // console.log(dashboard.getBoundingClientRect().bottom, 'hello world', dashboard.getBoundingClientRect().right)

    }

    handleMouseMove (event:MouseEvent) {
        const deltaY = event.clientY - this.posY;
        const deltaX = event.clientX - this.posX;
        
        // console.log(event.clientX , event.clientY )
        // console.log(event.clientX , event.clientY )
        
        if (deltaY != 0 || deltaX != 0) {
            
            const h = (parseInt(this.top.style.height.slice(0, this.top.style.height.length - 2)) ) ;
            
            const w = (parseInt(this.top.style.width.slice(0, this.top.style.width.length - 2)) ) ;

            const mid_h = h / 2;

            const mid_w = w / 2;

            const box_bottom = event.clientY  + mid_h ;
            
            const box_top = event.clientY - mid_h;

            const box_left = event.clientX - mid_w;

            const box_right = event.clientX + mid_w;

            if (box_top >= dashboard.getBoundingClientRect().top && box_left > dashboard.getBoundingClientRect().left && box_bottom <= dashboard.getBoundingClientRect().bottom && box_right <= dashboard.getBoundingClientRect().right) {
                this.top.style.top = box_top + "px";
                this.top.style.left = box_left + "px";
                this.top.style.bottom = box_bottom + "px";
                this.top.style.right = box_right + "px";
            }

            this.posY = event.clientY;
            this.posX = event.clientX;
            
        }

    }
        
}

export const logbookInst = new LogBook();