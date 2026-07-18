// import {
//     player_card_cls

// } from './static/css/player.css';

import player_css from './static/css/Player.module.css';

const player_css_eff :  Record<string, any> = player_css;

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
    element.className = player_css_eff.player_card_cls as string;
    return  element;
}


