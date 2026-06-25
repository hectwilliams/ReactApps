import {
    dashboard_cls, 
    dashboard_header_cls,
    dashboard_name_cls,
    dashboard_views_cls,
    dashboard_more_cls,
    dashboard_filter_cls
} from './static/css/dashboard.css';

// block for rootDiv
const rootDiv = document.getElementById('root');
while(rootDiv== null){}

// dashboard header 
const dashboard = document.createElement('div');
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

const headerMore = document.createElement('span');
headerMore.className=dashboard_more_cls;

const headerFilter = document.createElement('span');
headerFilter.className=dashboard_filter_cls;

// spans 
headerMore.append(document.createElement('span'));
headerMore.append(document.createElement('span'));
headerMore.append(document.createElement('span'));

// append to header 
dashboardHeader.append(headerName, headerViews, headerMore, headerFilter);

// append to root div 
rootDiv.append(dashboardHeader);
rootDiv.append(dashboard);
