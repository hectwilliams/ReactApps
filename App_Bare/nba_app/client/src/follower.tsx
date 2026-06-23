import {
    name_cls,
    logger_cls,
    binlog_cls,
    logname_cls,
    dbclone1_cls,
    dbclone2_cls,
    dbclone1_label_cls,
dbclone2_label_cls,
binlog_cell_cls,
binlog_label_clas
} from './static/follower.css';
import './static/variables.css';

type Allowed = 1 | 2 | 3 | 4;
export const rootstyles = window.getComputedStyle(document.documentElement);
export const BINSIZE = parseInt(rootstyles.getPropertyValue('--BINSIZE').trim());
const binAnimateDelay = 500;
//close for binLogTimerRef
export const runBun  = ()=>{
    let binLogTimerRef : NodeJS.Timeout ;
    let prevEllement = null as HTMLSpanElement| null; 

    return (element: HTMLSpanElement) =>{
        if (binLogTimerRef != null) {
            // stop loop 
            clearInterval(binLogTimerRef);
            // clear span cell 
            if (prevEllement)
                prevEllement.dataset.on = "1";
        }
        
        // cache element 
        prevEllement = element; 
        binLogTimerRef = setInterval(()=>{
            let num = element.dataset.on as string;
            let binDigit = parseInt(num);
            element.dataset.on = "" + ( binDigit ? 0 : 1); // dynamic cast 
            element.className = "";
            void element.offsetHeight;  // trigger reflow by evaluating (i.e. noop on DOM causing refresh of internals)
            element.className = binlog_cell_cls;
        }, binAnimateDelay);
    }
}
export function setDashboardObjects(node: HTMLDivElement){

    let label = document.createElement('label');
    label.className = name_cls;
    label.innerText = `DASHBOARD`;
    
    let label2 = document.createElement('label');
    label2.className = logname_cls;
    label2.innerText = "LOG";
    
    let log = document.createElement('ul');
    log.className = logger_cls;

    
    let bin_log_label = document.createElement('label');
    bin_log_label.className = binlog_label_clas;
    bin_log_label.innerText = "BLOCKED REQUESTS";

    let bin_log = document.createElement('div');
    bin_log.className = binlog_cls  ;

    // load
    for(let n = 0; n < BINSIZE**2; n++) {
        let e = document.createElement('span');
        e.className = binlog_cell_cls;
        // bin_log.dataset.row="0";
        // bin_log.dataset.col="0";
        bin_log.dataset.on="0";
        bin_log.append(e);
    }

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
    node.append(bin_log);
    node.append(dbCloneStatus1);
    node.append(dbCloneStatus2);
    node.append(cloneLabel1);
    node.append(cloneLabel2);
    node.append(bin_log_label);

}