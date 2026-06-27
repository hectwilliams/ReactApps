
import {
    page_shifer_cls, 
    arrow_left_cls, 
    arrow_right_cls, 
    arrows_cls,
    page_number_cls
} from './static/css/pageShifter.css';

import { viewButtonnInst } from './viewButton';

import { dashboard } from "./dashboard";

export const addBookletToDashboard  = async (booklet:HTMLDivElement) => {
    const refBooklet = booklet;
    return (dashboard: HTMLDivElement) => {
        // TODO - check if element exist in amongst dashboard children 
        dashboard.append(refBooklet);
    } 
}

/*  Booklet on bottom right corner   */

class Booklet {

    booklet: HTMLDivElement;
    pageNumbersMsg: HTMLDivElement;
    arrows: HTMLDivElement;
    left_arrow: HTMLDivElement;
    right_arrow: HTMLDivElement;
    prevPage: number;
    pages: number;

    constructor() {

       this.booklet = document.createElement('div'); 
       this.pageNumbersMsg = document.createElement('div');
       this.arrows = document.createElement('div');
       this.left_arrow = document.createElement('div');
       this.right_arrow = document.createElement('div');

        this.arrows.className = arrows_cls;
        this.pageNumbersMsg.className = page_number_cls;
        this.pageNumbersMsg.innerText = "...";
        this.left_arrow.className = arrow_left_cls;
        this.right_arrow.className = arrow_right_cls;
        this.arrows.append(this.left_arrow);
        this.arrows.append(this.right_arrow);
        this.booklet.append(this.pageNumbersMsg);
        this.booklet.append(this.arrows);
        this.booklet.className = page_shifer_cls;
        this.booklet.dataset.on = "0";
        
        this.prevPage = -1;
        this.pages = -1;

        this.left_arrow.onclick = () => {
            
            // viewButtonnInst
            console.log(' left');

         }

          this.right_arrow.onclick = () => {
            
            console.log('right');

         }

    }

    getBooklet() {

        return this.booklet;

    }

    enable() {
        
        this.booklet.dataset.on = "1";

    }

    disable() {
        
        this.booklet.dataset.on = "0";

    }

    setFeed(currPage:number, pages: string) {

        this.pageNumbersMsg.innerText = `${currPage} of ${pages}`;

    }
}

export const bookletInst = new Booklet();

dashboard.append(bookletInst.getBooklet())

