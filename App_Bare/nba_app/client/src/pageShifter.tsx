
import {
    page_shifer_cls, 
    arrow_left_cls, 
    arrow_right_cls, 
    arrows_cls,
    page_number_cls
} from './static/css/pageShifter.css';

import { dashboard } from "./dashboard";

export const addBookletToDashboard  = async (booklet:HTMLDivElement) => {
    const refBooklet = booklet;
    return (dashboard: HTMLDivElement) => {
        // TODO - check if element exist in amongst dashboard children 
        dashboard.append(refBooklet);
    } 
}

export const booklet = document.createElement('div'); 
booklet.className = page_shifer_cls;
booklet.dataset.on = "0";

export const pageNumbers = document.createElement('div');
export const arrows = document.createElement('div');
export const left_arrow = document.createElement('div');
export const right_arrow = document.createElement('div');

arrows.className = arrows_cls;
pageNumbers.className = page_number_cls;
pageNumbers.innerText = "1 of 238";
left_arrow.className = arrow_left_cls;
right_arrow.className = arrow_right_cls;
arrows.append(left_arrow, right_arrow);
booklet.append(pageNumbers);
booklet.append(arrows);

export const reloadBooklet = await addBookletToDashboard(booklet);

 reloadBooklet(dashboard);
