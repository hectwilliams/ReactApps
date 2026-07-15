import {
    player_card_cls

} from './static/css/player.css';

export interface SimplePlayerProfileInterface {
    player: string;
    tm: string;
    tmpic: string;
    pts: string ;
    played: string;
    img: string;
}

/* 
    Capture player; record obtained from csv file 
*/
export const PlayerCard = ( player: SimplePlayerProfileInterface): HTMLDivElement =>  {
    const element = document.createElement('div');
    element.innerHTML = `<div src=${player.tmpic}> </div>  <div> ${player.player} </div>`;
    element.className = player_card_cls;
    return  element;
}


