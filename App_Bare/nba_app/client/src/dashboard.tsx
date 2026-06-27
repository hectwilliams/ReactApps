import {
    dashboard_cls, 
    dashboard_header_cls,
    dashboard_name_cls,
    dashboard_views_cls,
    dashboard_more_cls,
    dashboard_filter_cls
} from './static/css/dashboard.css';

function  setHeaderFilerButton( node : HTMLSpanElement) {
    
    let ranges = [
        [3, 2, 8],
        [5, 3, 7],
        [7, 4, 6]
    ];
    
    ranges.forEach((record) => {

        let index = record[0] as number;
        let start = record[1] as number;
        let end = record[2] as number;

        for (let c = start; c < end; c++) {
            let nodeTest = node.children[index * 10 + c ] as HTMLSpanElement;
            nodeTest.style.backgroundColor = "white";
        }
    });
}

// block for rootDiv
const rootDiv = document.getElementById('root');
while(rootDiv== null){}

// dashboard header 
export const dashboard = document.createElement('div');
dashboard.className = dashboard_cls;

// dashboard body 
const dashboardHeader = document.createElement('div');
dashboardHeader.className = dashboard_header_cls;

//dashboard icons (header)
const headerName = document.createElement('span');
headerName.className=dashboard_name_cls;
headerName.innerHTML = "<p> Dashboard </p>";
const headerViews = document.createElement('span');
headerViews.className=dashboard_views_cls;
headerViews.addEventListener( 'click', (event: MouseEvent) => {
    console.log(event);
})

const headerMore = document.createElement('span');
headerMore.className=dashboard_more_cls;

const headerFilter = document.createElement('span');
headerFilter.className=dashboard_filter_cls;

headerFilter.addEventListener( 'click', (event: MouseEvent) => {
    console.log(event);
})

// filter button slices 
for( let i = 0; i < 10*10; i++){ headerFilter.append( document.createElement('span') ); }
setHeaderFilerButton(headerFilter);

// spans 
headerMore.append(document.createElement('span'));
headerMore.append(document.createElement('span'));
headerMore.append(document.createElement('span'));

// append to header 
dashboardHeader.append(headerName, headerViews, headerMore, headerFilter);

// append to root div 
rootDiv.append(dashboardHeader);
rootDiv.append(dashboard);

