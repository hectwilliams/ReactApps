import {
    player_card_cls

} from './static/css/player.css';

interface Leader {
    dnode: HTMLDivElement;
}

interface PlayerElement {
    cnode: HTMLDivElement;
}

export interface SimplePlayerProfileInterface {
    img: string;
    name: string;
    plots?: Array<Array<number>>
}

/* 
    Capture player; record obtained from csv file 
*/
export const PlayerCard = ( player: SimplePlayerProfileInterface): HTMLDivElement =>  {
    
    /*
        player Interface :
            player.img 
            player.name 
    */

    let element = document.createElement('div');
    element.innerHTML = `<div src=${player.img}> </div>  <div> ${player.name} </div>`;
    element.className = player_card_cls;
    return  element;
}


