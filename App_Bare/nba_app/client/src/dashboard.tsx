// import {
//     dashboard_cls, 
//     dashboard_header_cls,
//     dashboard_name_cls,
//     dashboard_views_cls,
//     dashboard_more_cls,
//     dashboard_filter_cls,
//     dashboard_trashbin_cls, 
//     dashboard_compositionbook_cls
// } from './static/css/dashboard.css';

import * as dashboard_css from './static/css/Dashboard.module.css';
const dashboard_css_eff :  Record<string, any> = dashboard_css;

import { playerlist } from './playerlist';
import { storeInst } from './store';
import { bookletInst } from './pageShifter';
import { activeViewButtons, ViewButton } from './viewButton';
import { activePowerButtons, type PowerButton } from './powerButton';
import { logbookInst } from './logbook';

function  setHeaderFilerButton( node : HTMLSpanElement) {
    
    const ranges = [
        [3, 2, 8],
        [5, 3, 7],
        [7, 4, 6]
    ];
    
    ranges.forEach((record) => {

        const index = record[0] as number;
        const start = record[1] as number;
        const end = record[2] as number;

        for (let c = start; c < end; c++) {
            const nodeTest = node.children[index * 10 + c ] as HTMLSpanElement;
            nodeTest.style.backgroundColor = "white";
        }
    });
}

// block for rootDiv
const rootDiv = document.getElementById('root');
while(rootDiv== null){}

// dashboard header 
export const dashboard = document.createElement('div');
// dashboard.className =  dashboard_cls;
dashboard.className =  dashboard_css_eff.dashboard_cls as string;

// dashboard body 
const dashboardHeader = document.createElement('div');
dashboardHeader.className = dashboard_css_eff.dashboard_header_cls as string;

//dashboard icons (header)
const headerName = document.createElement('span');
headerName.className=dashboard_css_eff.dashboard_name_cls as string;
headerName.innerHTML = "<p> Dashboard </p>";
const headerViews = document.createElement('span');
headerViews.className=dashboard_css_eff.dashboard_views_cls as string ;
// headerViews.addEventListener( 'click', (event: MouseEvent) => {
//     // console.log(event);
// })

const headerMore = document.createElement('span');
headerMore.className=dashboard_css_eff.dashboard_more_cls as string;

const headerFilter = document.createElement('span');
headerFilter.className=dashboard_css_eff.dashboard_filter_cls as string;

export const headerTrash = document.createElement('span') as HTMLSpanElement;
headerTrash.className=dashboard_css_eff.dashboard_trashbin_cls as string;

export const headerComposition = document.createElement('span') as HTMLSpanElement;
headerComposition.className=dashboard_css_eff.dashboard_compositionbook_cls as string;
dashboard.append(logbookInst.get());

headerComposition.onclick = () => {
    
    if (logbookInst.isopen()) {
        logbookInst.close();
        headerComposition.dataset.on = "0";
        logbookInst.add(`Logger is hidden`);

    } else {
        logbookInst.open();
        headerComposition.dataset.on = "1";
        logbookInst.add(`Logger is visible`);

    }
}


// headerFilter.addEventListener( 'click', (event: MouseEvent) => {
//     console.log(event);
// })

// filter button 'color' slices 
for( let i = 0; i < 10*10; i++){ headerFilter.append( document.createElement('span') ); }
setHeaderFilerButton(headerFilter);

// spans 
headerMore.append(document.createElement('span'));
headerMore.append(document.createElement('span'));
headerMore.append(document.createElement('span'));

// append to header 
dashboardHeader.append(headerName, headerViews, headerMore, headerFilter, headerTrash, headerComposition);

// append to root div 
rootDiv.append(dashboardHeader);
rootDiv.append(dashboard);

// events 
headerTrash.onclick = ()=>{

    if (dashboard.childElementCount) {
        
        // console.log('deleting')

        storeInst.clear();
        bookletInst.clear();
        dashboard.replaceChildren();
        playerlist.replaceChildren();

        for (let i = 0; i < activeViewButtons.length; i++) {
            (activeViewButtons[i] as ViewButton).clear();
            (activePowerButtons[i] as PowerButton).clear();
        }

        dashboard.append(logbookInst.get());

        if (logbookInst.isopen()) {
            logbookInst.open();
        }

        // logbookInst.close();

        logbookInst.add(`Trash clicked`);



    } else {
        // console.log('nothing here')
    }

}

//composition log 
dashboard.onclick = (event: MouseEvent) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const logRect = logbookInst.rect();

    if (logbookInst.isopen()) {
        
        if (mouseX < logRect.left || mouseX > logRect.right || mouseY < logRect.top || mouseY > logRect.bottom ) {
            logbookInst.close();
            headerComposition.dataset.on = "0";
        }
        
    }

}