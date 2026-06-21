// import css modules 
import  {
    ul_cls,
    dashboard_1_cls,
    dashboard_2_cls,
    dashboard_3_cls,
    dashboard_4_cls,

} from './static/module.css'; 

import { setDashboardObjects } from './follower';

export interface LogInterface {
    date:string;
    message: string;
    dashboard?: HTMLDivElement; // optional
} 

const rootDiv = document.getElementById('root');
const num_dashboards = 4;

// block for rootDiv
while(rootDiv== null){}

const dashboard_1 = document.createElement('div');
const dashboard_2 = document.createElement('div');
const dashboard_3 = document.createElement('div');
const dashboard_4 = document.createElement('div');

dashboard_1.classList.add(dashboard_1_cls, ul_cls); 
dashboard_2.classList.add(dashboard_2_cls, ul_cls); 
dashboard_3.classList.add(dashboard_3_cls, ul_cls); 
dashboard_4.classList.add(dashboard_4_cls, ul_cls); 

dashboard_1.dataset.name = "dashboard_1";
dashboard_2.dataset.name = "dashboard_2";
dashboard_3.dataset.name = "dashboard_3";
dashboard_4.dataset.name = "dashboard_4";

// check if there are three 
rootDiv.append(dashboard_1);
rootDiv.append(dashboard_2);
rootDiv.append(dashboard_3);
rootDiv.append(dashboard_4);

// apply child objects to dashboard
setDashboardObjects(1, dashboard_1);
setDashboardObjects(2, dashboard_2);
setDashboardObjects(3, dashboard_3);
setDashboardObjects(4, dashboard_4);


const dashboards =  {dashboard_1, dashboard_2, dashboard_3, dashboard_4};
export default  dashboards;