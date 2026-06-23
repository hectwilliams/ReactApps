import {
    name_cls,
    logger_cls,
    timelog_cls,
    logname_cls,
    dbclone1_cls,
    dbclone2_cls,
    dbclone1_label_cls,
dbclone2_label_cls
} from './static/follower.css';


type Allowed = 1 | 2 | 3 | 4;

export function setDashboardObjects(node: HTMLDivElement){

    let label = document.createElement('label');
    label.className = name_cls;
    label.innerText = `DASHBOARD`;
    
    let label2 = document.createElement('label');
    label2.className = logname_cls;
    label2.innerText = "Log";
    
    let log = document.createElement('ul');
    log.className = logger_cls;

    let time_log = document.createElement('div');
    time_log.className = timelog_cls;
    
    let dbCloneStatus1 = document.createElement('div');
    let dbCloneStatus2 = document.createElement('div');
    dbCloneStatus1.className = dbclone1_cls ;
    dbCloneStatus2.className = dbclone2_cls ;
    dbCloneStatus1.dataset.status = "undefined";
    dbCloneStatus2.dataset.status = "undefined";

    let cloneLabel1 = document.createElement('label');
    cloneLabel1.innerText = 'Clone A';
    cloneLabel1.className = dbclone1_label_cls;

    let cloneLabel2 = document.createElement('label');
    cloneLabel2.innerText = 'Clone B';
    cloneLabel2.className = dbclone2_label_cls;
    node.append(label);
    node.append(label2)
    node.append(log);
    node.append(time_log);
    node.append(dbCloneStatus1);
    node.append(dbCloneStatus2);
    node.append(cloneLabel1);
    node.append(cloneLabel2);

}