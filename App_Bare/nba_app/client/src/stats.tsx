import {
    hidden_label_cls,
    hidden_label_connector_cls, 
    stat_table_cls,
    table_header_cls,
    table_body_cls,
    dialog_cls
    
} from  './static/css/stats.css';

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
    let container = document.createElement('div');
    container.className = classname;
    setContainer(container);
    return container;
}

async function  dbclickCallback(event: MouseEvent) {
    
    event.preventDefault();
    
    let eventNode = event.currentTarget as HTMLDivElement;

    
    let dialog = eventNode.nextElementSibling as HTMLDialogElement;
    
    let table = dialog.childNodes[0] as HTMLTableElement;

    let body = table.childNodes[1] as HTMLElement;

    const params = new URLSearchParams({ start_history: '2025', size: '5'})

    console.log(params);

    try {

        const path = `${window.location.origin}/start_historyyear=2025&size=5`;

        const response = await fetch( path );

        if (!response.ok) {
            throw new Error('HTTP Error');
        }
        
        const resp = await  response.json();

        resp.data.forEach( (struct: Record<string, string>) => {
                
            let tr = document.createElement('tr');

                (['date'].concat (fields) ).forEach(e=>{

                    console.log(e);
                    let eff = e;
                    if (eff == "+/-")
                        eff = "plusminus"
                    if (eff == "played") 
                        eff = "unnamed"
                            
                    let data = document.createElement('td');
                    
                    let x = struct[eff];
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
    let hidden1 = document.createElement('div');
    let hidden1_div = document.createElement('div');

    let hidden2 = document.createElement('div');
    let hidden2_div = document.createElement('div');
    
    let table = document.createElement('table');
    let tableHeader = document.createElement('thead');
    let tableBody = document.createElement('tbody');
    
    let dialog = document.createElement('dialog');
    dialog.className = dialog_cls;
    dialog.dataset.modal = "0";

    let diaspan = document.createElement('span');
    diaspan.innerHTML = "<p>X</p>";
    dialog.onclick = (event: MouseEvent)=> {
        let node = event.currentTarget as HTMLDialogElement;
        let table = node.childNodes[0]as HTMLTableElement;
        let body = table.childNodes[1]as HTMLElement;
        body.replaceChildren();
        node.dataset.modal = "0";
    }

    let diatable = document.createElement('table');
    let diatableHeader = document.createElement('thead');
    let diatablebody = document.createElement('tbody');
    let diatr = document.createElement('tr');

    (['date'].concat (fields) ).forEach(e=>{
    let diatableHeader = document.createElement('th');
        diatableHeader.innerHTML = `<p> ${e} </p>`;
        diatr.append(diatableHeader);
    })

    diatableHeader.append(diatr);
    diatable.append(diatableHeader);
    diatable.append(diatablebody);
    
    dialog.append(diatable);
    dialog.append(diaspan);

    tableHeader.className = table_header_cls;
    tableBody.className = table_body_cls;
    
    hidden1.className = hidden_label_cls;
    hidden2.className = hidden_label_connector_cls;
    
    for (let i = 0; i < 24; i++) {
        let s = document.createElement('div');
        hidden1_div.append(s);
        s.innerHTML = `<p>  </p>`;
        
    }
    hidden2_div.innerText = "Recent Game";
    
    hidden2.append(hidden2_div);
    hidden1.append(hidden1_div);

    table.className = stat_table_cls;
    table.addEventListener('dblclick', dbclickCallback)

    table.append(tableHeader);
    table.append(tableBody);

    // console.log(table);
    container.append(hidden1);
    container.append(hidden2);
    container.append(table);
    container.append(dialog);

  
    
    let tr = document.createElement('tr');
    fields.forEach(e=>{
        let header1 = document.createElement('th');
        header1.innerHTML = `<p> ${e} </p>`;
        tr.append(header1)
        
    })
    tableHeader.append(tr);
      
    tr = document.createElement('tr');
    
    fields.forEach(e=>{
        let data = document.createElement('td');
        data.innerHTML = `<p> ${1000} </p>`;
        tr.append(data)
        
    });
    
    tableBody.append(tr);

}
