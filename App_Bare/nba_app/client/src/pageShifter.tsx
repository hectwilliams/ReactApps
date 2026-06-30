
import {
    page_shifer_cls, 
    arrow_left_cls, 
    arrow_right_cls, 
    arrows_cls,
    page_number_cls
} from './static/css/pageShifter.css';

import { dashboard } from "./dashboard";

import { storeInst } from './store';

import type { StoreDictionary } from './store';
import type { ServerRecordInterface,  } from "./handlers";
import  { fetchPagesHelper } from "./handlers";

// export const addBookletToDashboard  = async (booklet:HTMLDivElement) => {
//     const refBooklet = booklet;
//     return (dashboard: HTMLDivElement) => {
//         // TODO - check if element exist in amongst dashboard children 
//         dashboard.append(refBooklet);
//     } 
// }

/*  Booklet on bottom right corner   */

class Booklet {

    booklet: HTMLDivElement;
    pageNumbersMsg: HTMLDivElement;
    arrows: HTMLDivElement;
    left_arrow: HTMLDivElement;
    right_arrow: HTMLDivElement;
    prevPage: number;
    pages: number;
    exists: boolean;

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
        this.exists = false;
        this.prevPage = -1;
        this.pages = -1;


        // operates on current page  stored in store object 
        this.left_arrow.onclick =  () => {
            
            if (this.pageNumbersMsg.innerText  == '...' ) {
                return;
            }

            let name = storeInst.service;
            
            // if (name) {
                /* nothing is deleted out the store, so if name exist then we are safe to continue */
                let serverRecord = storeInst.get(name) as ServerRecordInterface;

                if (!serverRecord) {
                    console.log('record lost');
                    return false;

                }
                
                  let num = serverRecord.page;

                    if (num - 1 <=0 ) {
                        return;
                    }

                    try {

                        let status =  fetchPagesHelper(name, num-1);
                        
                        if (!status) {
                            
                            throw new Error("");

                        }

                        console.log('arrow click  request, successful');

                    } catch(err) {
                        
                        console.log('arrow click request, unsuccessful');

                    }

            // }
         }

          this.right_arrow.onclick =  () => {
        
            if (this.pageNumbersMsg.innerText  == '...' ) {
                return;
            }
            
            let name = storeInst.service;
            
            let serverRecord = storeInst.get(name) as ServerRecordInterface;


            if (!serverRecord) {
                console.log('record lost');
                return false;
            }

            // if (name) {

            /* nothing is deleted out the store, so if name exist then we are safe to continue */

            let num = serverRecord.page;

            if (num +  1 >= parseInt(serverRecord.numPages) + 1 ) {
                return;
            }

            try {

                let status =  fetchPagesHelper(name, num + 1);

                if (!status) {
                    
                    throw new Error("");

                }

                console.log('arrow click  request, successful');

            } catch(err) {
                
                console.log('arrow click request, unsuccessful');

            }

            // }

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

    load() {
        
        /* adds booklet to dashboard */
        
        dashboard.append(this.booklet);

    }

    clear() {

        this.pageNumbersMsg.innerText = "...";
        this.exists = false;
        this.prevPage = -1;
        this.pages = -1;
        this.booklet.dataset.on = "0";
    }

}

export const bookletInst = new Booklet();


