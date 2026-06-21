import {
    name_cls,
    logger_cls,
    timelog_cls,
    logname_cls
} from './static/follower.css';

type Allowed = 1 | 2 | 3 | 4;

export function setDashboardObjects(id: Allowed, node: HTMLDivElement){

    let label = document.createElement('label');
    label.className = name_cls;
    label.innerText = `DASHBOARD${id}`;
    
    let label2 = document.createElement('label');
    label2.className = logname_cls;
    label2.innerText = "Log";
    
    let log = document.createElement('ul');
    log.className = logger_cls;

    let time_log = document.createElement('div');
    time_log.className = timelog_cls;


    node.append(label);
    node.append(label2)
    node.append(log);
    node.append(time_log);

}