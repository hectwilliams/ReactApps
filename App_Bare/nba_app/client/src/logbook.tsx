import {
    table_log_cls,
    log_header_cls,
    maindiv_log_cls,
    table_row_cls,
    log_message_cls,
    log_message_label_cls,
    log_header_cls2,
    log_header_cls1,
} from './static/css/logbook.css';

import {logbook_in_dashboad_cls} from './static/css/dashboard.css';
import { bookletInst } from './pageShifter';
import { dashboard } from './dashboard';

interface LogInterface {
    date: string;
    message: string;
}

const clickData = () => {
    let ison = true;
    return (event: MouseEvent) => {
        console.log('hell world');
    }
}

class LogBook {
    top : HTMLDivElement;
    exit: HTMLSpanElement;
    div: HTMLDivElement;
    table: HTMLTableElement;
    holding : boolean;
    setIntervalRef : NodeJS.Timeout | undefined;
    posY: number;
    posX: number;
    refMouseMove: Function;
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

        this.exit.onclick =  (event: MouseEvent) => {
            logbookInst.close();
        }

        this.table = document.createElement('table');
        this.table.className = table_log_cls;

        this.posX = 0;
        this.posY = 0;

        // header 
        let tr = document.createElement('tr');
        let header1 = document.createElement('th');
        let header2 = document.createElement('th');
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

        let tr = document.createElement('tr');
        tr.className = table_row_cls;
        
        let d1 = document.createElement('td');
        d1.className = log_message_cls;
        d1.innerText = (new Date()).toISOString()
        
        let d2 = document.createElement('td');
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
            console.log("hello");
            let rect = this.top.getBoundingClientRect() as DOMRect;
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

        console.log(dashboard.getBoundingClientRect().bottom, 'hello world', dashboard.getBoundingClientRect().right)

    }

    handleMouseMove (event:MouseEvent) {
        
        let deltaY = event.clientY - this.posY;
        let deltaX = event.clientX - this.posX;
        
        if (deltaY != 0 || deltaX != 0) {
            
            let top =  parseInt(this.top.style.top.slice(0, this.top.style.top.length - 2)) + deltaY;
            let bottom =  parseInt(this.top.style.bottom.slice(0, this.top.style.bottom.length - 2)) + deltaY;
            let left =  parseInt(this.top.style.left.slice(0, this.top.style.left.length - 2)) + deltaX;
            let right =  parseInt(this.top.style.right.slice(0, this.top.style.right.length - 2)) + deltaX;
            
            if (top >= dashboard.getBoundingClientRect().top && left > dashboard.getBoundingClientRect().left && bottom <= dashboard.getBoundingClientRect().bottom && right <= dashboard.getBoundingClientRect().right) {
                this.top.style.top = top + "px";
                this.top.style.left = left + "px";
                this.top.style.bottom = bottom + "px";
                this.top.style.right = right + "px";
            }

            this.posY = event.clientY;
            this.posX = event.clientX;
            
        }

    }
        
}

export const logbookInst = new LogBook();