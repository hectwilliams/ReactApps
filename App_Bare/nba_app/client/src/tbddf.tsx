

export const setButton = (node: HTMLButtonElement) => {
    const rd = node.dataset.enabled;

    const en = rd == "0" ? "1" : "0";

    node.dataset.enabled = en;

    node.onclick = buttonToggle;
}

const buttonToggle = (event: MouseEvent) => {
    const node = event.currentTarget as HTMLButtonElement;
    setButton(node);

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
                <th scope="col">MSG</th>
            </tr>
        </thead>

        <tbody>

            ${data}
         
        </tbody>

     
     
        </table>`

    return s3;

}

//    <tfoot>
//             <tr>
//             <th scope="row" colspan="2">Total albums</th>
//             <td colspan="2">77</td>
//             </tr>
        // </tfoot>

    // <colgroup>
        //     <col span="1" />
        //     <col span="1" />
        //     <col class=${tbdd_css_eff.background_column} />
        // </colgroup>



        // `<table><tr><th>MNEN</th><th>DATE</th><th>MSG</th></tr>${mock()} </table>`
export const tbddfconstants = {
    'table': mock()
} 