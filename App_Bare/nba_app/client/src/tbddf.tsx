
import { TBDD } from "./tbdd";
import type { RawInterfaceSub } from "./tbdd";

export const WATERFALL_US = 250;
const X_N_SAMPLES = 101
const Y_N_SAMPLES = 101



export const temperatureDB = async (node: HTMLDivElement) :Promise<RawInterfaceSub | null> => {
    node.replaceChildren();
    node.dataset.mode = "0";
    node.style.gridTemplateColumns = `repeat(101, ${101/101}fr)`;
    node.style.gridTemplateRows = `repeat(101, ${101/101}fr)`;

    const path = 'http://127.0.0.1:50214/binnytemp';
    
    try {
        
        const response = await fetch(path);
        
        if (!response.ok) {
            throw new Error("HTTP Error!");
        }
        const data = await response.json();


        
        for (let i = 0 ; i < X_N_SAMPLES; i++) {
            
            for (let j = 0; j < Y_N_SAMPLES ; j++) {
                const spanElement = document.createElement('span');
                node.append(spanElement);
                
                const amplitude = Math.floor(data.data[j]);

                if (i == (101 - amplitude)) {
                    spanElement.dataset.on = "1";
                    spanElement.dataset.hover = `amp ->  ${  amplitude} `;
                }

            }

        }
        
        return data;
        
    } catch(error) {
        
        console.log(error);

        return  null
    }


}

export const histogramDB = async  (node: HTMLDivElement) :Promise<boolean> => {
    node.replaceChildren();

    node.dataset.mode = "1";
    node.style.gridTemplateColumns = "repeat(101, 0.99fr)";
    node.style.gridTemplateRows = "repeat(100, 1fr)";

    const path = 'http://127.0.0.1:50214/binnyhisto';

    try {
        
        const response = await fetch(path);
        
        if (!response.ok) {
            throw new Error("HTTP Error!");
        }
        
        const data = await response.json();

        let minValue = 2**64;
        let maxValue = -( 2**64 ) ;
        let cnt = 1;

        for ( const key_index in data.msg )  {

            const record = data.msg[key_index];
            const id = record.bucket_id; 
            const count = record.record_count; 
            const lowest = record.lowest_in_bucket; 
            const highest = record.highest_in_bucket; 
            const spanElement = document.createElement('span');

            if (cnt != id) {
                
                const se = document.createElement('span');
                
                se.style.gridColumnStart = cnt + "";
                se.style.gridColumnEnd = "span 1";
                
                se.style.gridRowStart = `${-1}`;
                se.style.gridRowEnd = `${-1}`;
                
                se.dataset.hover = `${cnt} ->  [na] `;
                
                node.append(se);
                cnt++;

            }
            
            spanElement.style.gridColumnStart = id + "";
            spanElement.style.gridColumnEnd = "span 1";
            spanElement.style.gridRowStart = `${-count}`;
            spanElement.style.gridRowEnd = `${-1}`;
            spanElement.dataset.hover = `${cnt} ->  [ ${lowest} -- ${highest} ] `;
            
            cnt++;

            if (count > maxValue)
                    maxValue = count; 

            if (count < minValue)
                    minValue = count; 

            node.append(spanElement);
        }

        node.style.gridTemplateRows = `repeat(${maxValue}, ${maxValue/101}% )`;
         
        return true;

    } catch {
        // console.log(error)
        return false;
    }

}

export const setPlot = (node: HTMLDivElement,  tbdd: TBDD) : void => {

    const suboptions1 = document.createElement('div');
    const raw = document.createElement('button');
    const histo = document.createElement('button');

    suboptions1.append(raw);
    suboptions1.append(histo);

    raw.innerText = "Raw";
    histo.innerText = "Histo";

    const subplot1 = document.createElement('div');
    
    const rows = Y_N_SAMPLES;
    const cols = X_N_SAMPLES;









    for (let i = 0 ; i < rows; i++) {

        for (let j = 0; j < cols; j++) {
            
            const spanElement = document.createElement('span');

            subplot1.append(spanElement);

        }

    }

    node.append(suboptions1);

    node.append(subplot1);

    raw.onclick = async () => {
        
        const resp: RawInterfaceSub | null= await temperatureDB(subplot1);

        
        const parent = node.parentNode as HTMLDivElement;
        const optionContainer = parent.childNodes[2] as HTMLDivElement;
        const buttonAI = optionContainer.firstChild as HTMLButtonElement;
        
        if (resp) {
            
            tbdd.raw = resp;
            console.log('raw request successful');

            buttonAI.dataset.ai = "0";
            
        } else {
            
            console.log('raw request failed');

        }
        
    }

    histo.onclick = async () => {

        const resp: boolean = await histogramDB(subplot1);
        
        if (resp) {
            
            console.log('histo request successful');
            
        } else {

            console.log('histo request failed');

        }
        
        const parent = node.parentNode as HTMLDivElement;
        const optionContainer = parent.childNodes[2] as HTMLDivElement;
        const buttonAI = optionContainer.firstChild as HTMLButtonElement;
        buttonAI.dataset.ai = "";
    }

}

export const setButton = async (node_button: HTMLButtonElement, node_plot: HTMLDivElement | undefined , tbdd: TBDD): Promise<void> => {



        const parent = node_button.parentNode as HTMLDivElement;
    const rd = node_button.dataset.ai;

    node_button.onclick = (event: MouseEvent) =>  { 
        // buttonToggle() 
        const node = event.currentTarget as HTMLButtonElement;
        setButton(node, parent, tbdd); // ai button 
    };

    if (rd == "")
        return ;

    const en = rd == "0" ? "1" : "0";
    
    node_button.dataset.ai = en;

    const optionContainer = (node_plot?.parentNode as HTMLDivElement).childNodes[3] as HTMLDivElement;

    const plot_node = optionContainer.lastChild as HTMLButtonElement;
    
    if (!plot_node)
        return; 

    if (en == "1") {

        plot_node.style.gridTemplateColumns = `repeat(101, ${101/101}fr)`;
        plot_node.style.gridTemplateRows = `repeat(101, ${101/101}fr)`;
        plot_node.style.transition = "opacity 0.5s ease-in-out";
        plot_node.dataset.mode = "0";

        
        const s : RawInterfaceSub = tbdd.raw as RawInterfaceSub;   
        
        // const params = new URLSearchParams({predict: `${tbdd.raw}`});
        // const params = new URLSearchParams({predict: `${s}`});

        const path = `http://127.0.0.1:50214/predict`;
        
         const method = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                data: s.data,
            } 
        )};

    
        try {
            
            const response = await fetch(path, method);
            
            if (!response.ok) {
                throw new Error("HTTP Error!");
            }
            
            const record = await response.json();

            console.log(record.prediction);
            
            const est = record.prediction;
            
            const est_eff = Math.round(101 - est); 
            
            // ref_value.data = est ;
            tbdd.recent_prediction = est;
            
            let row = 0;

            while (row < 101) {
    
                const idx = row * 101 + (101 -1);
    
                const spanElement = (plot_node.childNodes[idx] as HTMLSpanElement)
    
                if (row == est_eff ){
                    
                    spanElement.dataset.on = "3";

                    spanElement.dataset.hover = `amp ->  ${  est} `;
                    
                    console.log('element', spanElement);
                }
                
                row++;
            }

        } catch(error) {

            console.log(error);

        }


    } 
    
    else if (en == "0") {

        plot_node.style.gridTemplateColumns = `repeat(101, ${100/101}fr)`;
        plot_node.style.gridTemplateRows = `repeat(101, ${100/101}fr)`;
        plot_node.style.transition = "opacity 0.5s ease-in-out";
        plot_node.dataset.mode = "0";

        let row = 0;
        
        for (let i = 100; i < 101 * 101 ; i+=101) {

            if (row == Math.round(101- tbdd.recent_prediction ) ){
                
                (plot_node.childNodes[i] as HTMLSpanElement).dataset.on = '0';
                
            }

            row++;

        }

    }

    

}

// node is raw plot 










export const ten_numbers = () => {
    const b = Array(10).fill('N/A');
    const out = {} as Record<number, boolean>;

    for (let i = 0; i < 10; i++) {
        
        b[i] = Math.floor(Math.random() * 100) as number;

        out[b[i]] = true ;

    }

    return out;

}

const rand_rbg = () : Array<number>  => {
    
    // const value = Math.floor(Math.random() * 2**24) ;
    const max = 33023;
    const min =15;
    const value =  Math.floor(Math.random() * (max - min + 1)) + min;
    const bytes_ones = (2**8) - 1; 

    const blue = bytes_ones & value;

    const green  =( (bytes_ones << 8  ) & value) >> 8;

    const red = (( bytes_ones  << 16 ) & value) >> 16;

    return [red, blue, green];

}

export const n_rand_rbg = (n: number = 1) : Array<Array<number>>  => {
    const out = Array(n).fill('N/A');

    for (let i = 0; i < n; i++) {
        out[i] = rand_rbg();
    }

    return out; 
}

const mock = () => {

    let data  = "";

    for (let i = 0; i < 5; i++) {
        
        const s = `<tr> 
            
            <td> ${i ==0 ? "START" : i == 1?  "EVENT" : i == 4 ? "STOP" : "EVENT" }  </td>

            <td> ${new Date().toISOString()}   </td>

            <td>Ever fallen in love (with someone you shouldn't've) </td> 

            </tr>`;

        data += s;

    }

    const s3 = `<table>

        <caption>
            System Logs
        </caption>

        <thead>
            <tr>
                <th scope="col">MNEM</th>
                <th scope="col">DATETIME</th>
                <th scope="col"> TEMP MSG </th>
            </tr>
        </thead>

        <tbody>

            ${data}
         
        </tbody>

     
     
        </table>`

    return s3;

}

export const tbddfconstants = {
    'table': mock()
} 