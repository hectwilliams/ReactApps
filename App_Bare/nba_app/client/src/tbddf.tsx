
export const WATERFALL_US = 250;

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