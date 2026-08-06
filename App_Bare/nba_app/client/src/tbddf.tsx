


import * as tbdd_css from './static/css/Tbdd.module.css';
const tbdd_css_eff :  Record<string, boolean | string | unknown > = tbdd_css;

export const tbddfconstants = {
    'table': `<table class= ${tbdd_css_eff.table_cls} >
    
    <colgroup>
        <col span="1" />
        <col span="1" />
        <col class="column-background" />
        <col class="column-fixed-width" />
        <col class="column-background" />
        <col class="column-background-border" />
        <col span="2" class="column-fixed-width" />
      </colgroup>
      
      <tr>
        <th>MNEN</th>
        <th>DATE</th>
        <th>MSG</th>
      </tr>
      
      <tr>
        <td>START</td>
        <td> ${ new Date().toISOString() }</td>
        <td> ${" \"timestamp\" \: \"2026-06-06T14:32:10Z\" } "} </td>
      </tr>

       <tr>
        <td>START</td>
        <td> ${ new Date().toISOString() }</td>
        <td> ${" \"timestamp\" \: \"2026-06-06T14:32:10Z\" } "} </td>
      </tr>


         <tr>
        <td>START</td>
        <td> ${ new Date().toISOString() }</td>
        <td> ${" \"timestamp\" \: \"2026-06-06T14:32:10Z\" } "} </td>
      </tr>


      


    </table>`
} 