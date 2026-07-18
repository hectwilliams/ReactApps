// import {
//     page_shifer_cls, 
//     arrow_left_cls, 
//     arrow_right_cls, 
//     arrows_cls,
//     page_number_cls
// } from './static/css/pageShifter.css';

import * as pagershifter_css from './static/css/PageShifter.module.css';
const pagershifter_css_eff :  Record<string, boolean | string | unknown > = pagershifter_css;

import { dashboard } from "./dashboard";
import { storeInst } from './store';
import type { ServerRecordInterface,  } from "./handlers";
import  { fetchPagesHelper } from "./handlers";

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
        this.arrows.className = pagershifter_css_eff.arrows_cls as string;
        this.pageNumbersMsg.className = pagershifter_css_eff.page_number_cls as string;
        this.pageNumbersMsg.innerText = "...";
        this.left_arrow.className = pagershifter_css_eff.arrow_left_cls as string ;
        this.right_arrow.className = pagershifter_css_eff.arrow_right_cls as string ;
        this.arrows.append(this.left_arrow);
        this.arrows.append(this.right_arrow);
        this.booklet.append(this.pageNumbersMsg);
        this.booklet.append(this.arrows);
        this.booklet.className = pagershifter_css_eff.page_shifer_cls as string;
        this.booklet.dataset.on = "0";
        this.prevPage = -1;
        this.pages = -1;
    
        

        // operates on current page  stored in store object 
        this.left_arrow.onclick =  () => {
            
            if (this.pageNumbersMsg.innerText  == '...' ) {
                return;
            }


            const name = storeInst.service;
            
            /* nothing is deleted out the store, so if name exist then we are safe to continue */
            const serverRecord = storeInst.get(name) as ServerRecordInterface;

            if (!serverRecord) {
                // console.log('record lost');
                return false;

            }
            
                const num = serverRecord.page;

                if (num - 1 <=0 ) {
                    return;
                }
                
                const prev = storeInst.players ; // save recent player list

                try {

                    this.hide();

                    storeInst.players = "";

                    const status =  fetchPagesHelper(name, num-1);

                    if (!status) {
                        
                        throw new Error("");
                        
                    }
                    
                    // console.log('arrow click  request, successful');
                    
                    this.show();      

                } catch(err) {
                    
                    console.log(err);
                    storeInst.players = prev;
                    this.show();      

                }


         }

          this.right_arrow.onclick =  () => {
            
            if (this.pageNumbersMsg.innerText  == '...' ) {
                return;
            }
            
            const name = storeInst.service;
            
            const serverRecord = storeInst.get(name) as ServerRecordInterface;
            
            if (!serverRecord) {
                // console.log('record lost');
                return false;
            }

            // if (name) {

            /* nothing is deleted out the store, so if name exist then we are safe to continue */

            const num = serverRecord.page;

            if (num +  1 >= parseInt(serverRecord.numPages) + 1 ) {
                return;
            }

            const prev = storeInst.players ; // save recent player list

            try {
                
                this.hide();

                storeInst.players = "";

                const status =  fetchPagesHelper(name, num + 1);
                
                if (!status) {
                    
                    throw new Error("");

                }

                // bookletInst.setFeed(serverRecord.page, serverRecord.numPages);
                // console.log('arrow click  request, successful');
                
                this.show();

            } catch(err) {
                
                console.log(err);
                storeInst.players = prev;
                
                // console.log('arrow click request, unsuccessful');

                this.show();

            }

         }

    }

    getBooklet() {

        return this.booklet;

    }

    hide() {
         this.booklet.dataset.hide="1";
    }

    show() {
         this.booklet.dataset.hide="0";
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
        this.prevPage = -1;
        this.pages = -1;
        this.booklet.dataset.on = "0";
    }

}

export const bookletInst = new Booklet();


