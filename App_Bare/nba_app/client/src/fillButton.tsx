// import {fill_button_cls} from './static/css/fillButton.css';
// import { fetchBinny, findNodeByDataset } from './handlers';
// import dashboard from './followers';
// import { BINSIZE, runBun } from './follower';

// // const button = document.createElement('button');
// // const rootDiv = document.getElementById('root');

// // while(rootDiv == null) {}

// // button.className = fill_button_cls;

// // // set toggle variable 
// // button.dataset.isfull = "0";
// // button.dataset.running = "0";

// // // add button to DOM 
// // // rootDiv.append(button);

// // // meets async imports of main.tsx 
// // // setTimeout(()=>{
// //     // playerListNode = findNodeByDataset(rootDiv, 'name', 'leader');
// // // }, 10);


// // // playerListNode = activePlayerList;

// // export interface SimpleCaptureBins {
// //     date: string;
// //     size: number; 
// // };

// // function getRandomInt(min:number, max:number) {
// //   return Math.floor(Math.random() * (max - min + 1)) + min;
// // }

// // function genRandomNumbers(n: number): Array<number> {
// //     let list = [] as Array<number>;
// //     for( let i =0; i <n ; i++) {
// //         list.push(getRandomInt(0, BINSIZE));
// //     }
// //     return list;
// // }

// // button.onclick = (event: MouseEvent) => {

// //     button.disabled = true;
// //     let cells = [] as Array<HTMLSpanElement>;

// //     // TODO change gas icon to staircase button 
// //     fetchBinny()
// //     .then(x=>{
// //         // let test = [3, 7] as Array<number>;
// //         let graph = dashboard.children[3] as HTMLDivElement;
// //         genRandomNumbers(BINSIZE).forEach((r, c)=>{
// //             //flip r 
// //             r = BINSIZE**2 -  r * BINSIZE;
// //             r = Math.floor( r/ BINSIZE) ;
// //             while (r < BINSIZE) {
// //                 let pos = r * BINSIZE + c;
// //                 console.log(r,c, pos);
// //                 let binCell = graph.children[pos] as HTMLSpanElement;
// //                 binCell.dataset.on = '1';
// //                 cells.push(binCell);
// //                 r++;
// //             }
// //         })

// //         setTimeout(()=>{
// //             button.disabled = false;
// //         }, 0.5 /* seconds */);

// //         // setTimeout(()=>{
// //         //     // reset button 
// //         //     button.disabled = false;

// //         //     cells.forEach( (b)=>{
// //         //         let classname = b.className;
// //         //         // reflow block
// //         //         b.className = "";
// //         //         void b.offsetWidth; 
// //         //         b.className = classname;
// //         //         // turn element state off 
// //         //         b.dataset.on = '0';
// //         //     });

// //         // }, 1);
// //     })
// //     .catch(err=>{
// //         console.log('Request to Binny failed');
        

// //     })
// // }

