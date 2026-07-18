// import {
//     hidden_label_cls,
//     hidden_label_connector_cls, 
//     stat_table_cls,
//     table_header_cls,
//     table_body_cls,
//     dialog_cls
    
// } from  './static/css/stats.css';

import * as stats_css from './static/css/Stats.module.css';
const stats_css_eff :  Record<string, any> = stats_css;

const fields = [
       "played" ,  
       "opp" ,
       "result" ,
       "mp" ,
       "fg" ,
       "fga" ,
       "fpp" ,
       "trep" ,
       "trepa" ,
       "trepp" ,
       "ft" ,
       "fta" ,
       "ftp" ,
       "orb" ,
       "drb" ,
       "trb" ,
       "ast" ,
       "stl" ,
       "blk" ,
       "tov" ,
       "pf" ,
       "pts" ,
       "+/-" ,
       "gmsc" 
    ]

export function genStatsContainer(classname: string) {
    const container = document.createElement('div');
    container.className = classname;
    setContainer(container);
    return container;
}

async function  dbclickCallback(event: MouseEvent) {
    
    event.preventDefault();
    
    const eventNode = event.currentTarget as HTMLDivElement;

    const dialog = eventNode.nextElementSibling as HTMLDialogElement;
    
    const table = dialog.childNodes[0] as HTMLTableElement;

    const body = table.childNodes[1] as HTMLElement;

    try {

        const path = `${window.location.origin}/start_historyyear=2025&size=5`;

        const response = await fetch( path );

        if (!response.ok) {
            throw new Error('HTTP Error');
        }
        
        const resp = await  response.json();

        resp.data.forEach( (struct: Record<string, string>) => {
                
            const tr = document.createElement('tr');

                (['date'].concat (fields) ).forEach(e=>{

                    let eff = e;
                    if (eff == "+/-")
                        eff = "plusminus"
                    if (eff == "played") 
                        eff = "unnamed"
                            
                    const data = document.createElement('td');
                    
                    const x = struct[eff];
                    if (x) {
                        data.innerHTML = `<p> ${x} </p>`;
                    } else  {
                        data.innerHTML = `<p> ${""} </p>`;
                    }
                    tr.append(data);
                })

                body.append(tr);

        });

        dialog.dataset.modal = "1";

    } catch {

        console.log('error history');
        
    }

}

/* container containing player most recent stat */
function setContainer(container: HTMLDivElement) {
    const hidden1 = document.createElement('div');
    const hidden1_div = document.createElement('div');

    const hidden2 = document.createElement('div');
    const hidden2_div = document.createElement('div');
    
    const table = document.createElement('table');
    const tableHeader = document.createElement('thead');
    const tableBody = document.createElement('tbody');
    
    const dialog = document.createElement('dialog');
    dialog.className = stats_css_eff.dialog_cls as string;
    dialog.dataset.modal = "0";

    const diaspan = document.createElement('span');
    diaspan.innerHTML = "<p>X</p>";
    dialog.onclick = (event: MouseEvent)=> {
        const node = event.currentTarget as HTMLDialogElement;
        const table = node.childNodes[0]as HTMLTableElement;
        const body = table.childNodes[1]as HTMLElement;
        body.replaceChildren();
        node.dataset.modal = "0";
    }

    const diatable = document.createElement('table');
    const diatableHeader = document.createElement('thead');
    const diatablebody = document.createElement('tbody');
    const diatr = document.createElement('tr');

    (['date'].concat (fields) ).forEach(e=>{
    const diatableHeader = document.createElement('th');
        diatableHeader.innerHTML = `<p> ${e} </p>`;
        diatr.append(diatableHeader);
    })

    diatableHeader.append(diatr);
    diatable.append(diatableHeader);
    diatable.append(diatablebody);
    
    dialog.append(diatable);
    dialog.append(diaspan);

    tableHeader.className = stats_css_eff.table_header_cls as string;
    tableBody.className = stats_css_eff.table_body_cls as string;
    
    hidden1.className = stats_css_eff.hidden_label_cls as string;
    hidden2.className = stats_css_eff.hidden_label_connector_cls as string;
    
    for (let i = 0; i < 24; i++) {
        const s = document.createElement('div');
        hidden1_div.append(s);
        s.innerHTML = `<p>  </p>`;
        
    }
    hidden2_div.innerText = "Recent Game";
    
    hidden2.append(hidden2_div);
    hidden1.append(hidden1_div);

    table.className = stats_css_eff.stat_table_cls as string;

    table.onmouseenter = () => {
        // mouse over
        table.removeEventListener('dblclick', dbclickCallback);
    }

    table.onmouseleave = () => {
        // mouse exit 
        table.addEventListener('dblclick', dbclickCallback);
    }

    table.append(tableHeader);
    table.append(tableBody);

    // console.log(table);
    container.append(hidden1);
    container.append(hidden2);
    container.append(table);
    container.append(dialog);

    let tr = document.createElement('tr');
    fields.forEach(e=>{
        const header1 = document.createElement('th');
        header1.innerHTML = `<p> ${e} </p>`;
        tr.append(header1)
        
    })
    tableHeader.append(tr);
      
    tr = document.createElement('tr');
    
    fields.forEach(()=>{
        const data = document.createElement('td');
        data.innerHTML = `<p> ${1000} </p>`;
        tr.append(data)
        
    });
    
    tableBody.append(tr);

}
