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
    player: string;
    tm: string;
    tmpic: string;
    plots?: Array<Array<number>>
}

/* 
    Capture player; record obtained from csv file 
*/
export const PlayerCard = ( player: SimplePlayerProfileInterface): HTMLDivElement =>  {
    let element = document.createElement('div');
    element.innerHTML = `<div src=${player.tmpic}> </div>  <div> ${player.player} </div>`;
    element.className = player_card_cls;
    return  element;
}


