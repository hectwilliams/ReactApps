// import css modules 
import  {
    ul_cls,
    dashboard_1_cls


} from './static/css/module.css'; 

import { setDashboardObjects  } from './follower';

import {dbclone1_cls, dbclone2_cls} from './static/css/follower.css';

export interface LogInterface {
    date:string;
    message: string;
    dashboard?: HTMLDivElement; // optional
} 

const rootDiv = document.getElementById('root');
const num_dashboards = 1;

// block for rootDiv
while(rootDiv== null){}

const dashboard = document.createElement('div');
const dbCloneStatus1 = document.createElement('div');
const dbCloneStatus2 = document.createElement('div');

dbCloneStatus1.dataset.state="undefined"
dbCloneStatus2.dataset.state="undefined"

dashboard.classList.add(dashboard_1_cls, ul_cls); 

dashboard.dataset.name = "dashboard";

// check if there are three 
rootDiv.append(dashboard);

// apply child objects to dashboard
setDashboardObjects(dashboard);

export default  dashboard;