
export const WATERFALL_US = 250;
const X_N_SAMPLES = 100
const Y_N_SAMPLES = 100

export const temperatureDB = async (node: HTMLDivElement) :Promise<boolean> => {
    node.replaceChildren();

    node.dataset.mode = "0";
    node.style.gridTemplateColumns = "repeat(100, 1fr)";
    node.style.gridTemplateRows = "repeat(100, 1fr)";

    const path = 'http://127.0.0.1:50214/binnytemp';
    
    try {
        
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error("HTTP Error!");
        }
        const data = await response.json();

        for (let i = 0 ; i < X_N_SAMPLES; i++) {
            for (let j = 0; j < Y_N_SAMPLES; j++) {
                let spanElement = document.createElement('span');
                node.append(spanElement);
                
                let amplitude = Math.floor(data.data[j]);

                if (i == amplitude) {
                    spanElement.dataset.on = "1";
                }
            }

        }

        return true;

    } catch {

        return false;
    }

}

interface HistogramInterface {
    bucket_id : number;
    record_count : string;
    lowest_in_bucket : string;

};
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

            let record = data.msg[key_index];
            let id = record.bucket_id; 
            let count = record.record_count; 
            let lowest = record.lowest_in_bucket; 
            let highest = record.highest_in_bucket; 
            let spanElement = document.createElement('span');

            if (cnt != id) {
                
                let se = document.createElement('span');
                
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

        return false;
    }

}

export const setPlot = (node: HTMLDivElement) : void => {

    const suboptions1 = document.createElement('div');
    const raw = document.createElement('button');
    const histo = document.createElement('button');

    suboptions1.append(raw, histo);

    raw.innerText = "Raw";

    histo.innerText = "Histo";

    const  subplot = document.createElement('div');

    const rows = Y_N_SAMPLES;
    const cols = X_N_SAMPLES
    for (let i = 0 ; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let spanElement = document.createElement('span');
            subplot.append(spanElement);
        }
    }

    const row = 5;

    const col = 5;

    const testNode = subplot.childNodes[row * Y_N_SAMPLES + col] as HTMLSpanElement;

    testNode.dataset.on = "1";

    node.append(suboptions1);

    node.append(subplot);

    raw.onclick = async () => {
        const resp: boolean = await temperatureDB(subplot);
        if (resp) {
            
            console.log('temp request successful');

        }
    }

    histo.onclick = async () => {
        const resp: boolean = await histogramDB(subplot);
        if (resp) {
            
            console.log('histo request successful');

        }

    }

}

export const setButton = (node: HTMLButtonElement): void => {
    const rd = node.dataset.enabled;

    const en = rd == "0" ? "1" : "0";

    node.dataset.enabled = en;

    node.onclick = buttonToggle;
}

const buttonToggle = (event: MouseEvent) : void => {
    const node = event.currentTarget as HTMLButtonElement;
    setButton(node);
}

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
        
        let s = `<tr> 
            
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