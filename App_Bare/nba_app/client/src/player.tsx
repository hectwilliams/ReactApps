import {
    player_card_cls

} from './static/player.css';

interface Leader {
    dnode: HTMLUListElement;
}

interface PlayerElement {
    cnode: HTMLLIElement;
}

interface SimplePlayerProfile {
    img: string;
    name: string;
}

/* 
    Capture player; record obtained from csv file 
*/
const PlayerCard = ( player: SimplePlayerProfile): PlayerElement =>  {
    /*
        player Interface 
            player.img 
            player.name 
    */
    let element = document.createElement('li');
    element.innerHTML = `<div src=${player.img}> </div>  <div> ${player.name} </div>`;
    element.className = player_card_cls;
    return {cnode: element};
}

export function Accumulator( {dnode}: Leader   ) {
    console.log(dnode);
    console.log('hellow world');

    const img = "/Users/hectorwilliams/Documents/Dev/repos/ReactApps/App_Bare/nba_app/client/src/static/images/img.png";
    const name = "Bob Lazar";

    for (let i= 0; i <20; i++) {

        // set Profile 
        const profile :  SimplePlayerProfile = {
            img: img,
            name: name
        }

        // pass profile object to player card
        const card =  PlayerCard(profile);

        // append to leader 
        dnode.appendChild(card.cnode);
    }

}

