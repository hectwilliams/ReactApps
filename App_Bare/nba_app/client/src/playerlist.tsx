import {top_level_list_container_container_cls, 
    player_container_cls, 
    player_container_plot_cls,
    player_container_meta_cls,
    playerDataContainer2_cls,
    playerDataContainer2_child_cls,
    meta_name_cls,
    meta_team_cls,
    playerDataContainer2_child_wrapper_cls,
    playerChainContainer_cls,
    wrapperPlayerChainContainer, 
    playerDataContainer_cls, 
    img_cls
    
    
} from './static/css/playerlist.css';
import type {ServerRecordInterface} from './handlers';


// const playerExample = document.createElement('div');
// const pic = document.createElement('div');
// const playerDataContainer = document.createElement('div');

/*
    - PlayerCardContainer -> player_container_cls

        - picContainer -> 
        
        - plotContainer -> playerDataContainer_cls
            - wrapperPlayerChainContainer  ->  playerDataContainer2_child_wrapper_cls
                - plotsChainContainer  -> playerDataContainer2_child_cls
                    - name  -> meta_name_cls
                    - tean  -> meta_team_cls




*/
// playerExample.className = player_container_cls;
// playerExample.append(pic);
// playerExample.append(playerDataContainer);
// playerlist.append(playerExample);


// const playerExample2 = document.createElement('div');
// const pic2 = document.createElement('div');
// const playerDataContainer2 = document.createElement('div');
// playerDataContainer2.className = playerDataContainer_cls;

// const wrapper_player2data = document.createElement('div');
// wrapper_player2data.className = wrapperPlayerChainContainer;

// const player2data = document.createElement('div');
// player2data.className = playerChainContainer_cls;
// wrapper_player2data.append(player2data); 

// playerExample2.className = player_container_cls;
// playerExample2.append(pic2);
// playerExample2.append(playerDataContainer2);
// pic2.src =
// 

// // meta to top level 
// const nameElement = document.createElement('div');
// nameElement.innerHTML= `<p>Nikola Tesla</p>`;
// nameElement.className = meta_name_cls;
// const teamElement = document.createElement('div');
// teamElement.innerHTML= `<p>Department of  Defense</p>`;
// teamElement.className = meta_team_cls;

// playerDataContainer2.append(nameElement);
// playerDataContainer2.append(teamElement);
// playerDataContainer2.append(wrapper_player2data);

// // add 10 grapgs 
// for (let i = 0; i < 3; i++) {
    //     let node = document.createElement('div');
    //     node.className = player_container_plot_cls;
    //     player2data.append(node);
    // }
    // playerlist.append(playerExample2);
    
    export const playerlist = document.createElement('div');
    playerlist.className = top_level_list_container_container_cls;
    
    // const imgPath = "/Users/hectorwilliams/Documents/Dev/repos/ReactApps/App_Bare/nba_app/client/src/static/images/faces/img.png"
const imgPath = "./client/src/static/images/faces/img.png";

async function getPlayerDiv() {

    let mainElement = document.createElement('div');
    mainElement.className = player_container_cls;

    // add pic container 
    let picContainer = document.createElement('div');
    let picContainer_child = document.createElement('img');
    let src ="http://127.0.0.1:50215/src/static/images/faces/img.png" as string;
    picContainer_child.src= src;
    picContainer_child.className = img_cls;
    picContainer.append(picContainer_child);
    // add plot container 
    let plotsContainer  = document.createElement('div');
    // let result = 

    // set css styles to plots window 
    plotsContainer.className = playerDataContainer_cls;

    // plot data wrapper 
    let wrapper_plotsData = document.createElement('div');
    wrapper_plotsData.className = wrapperPlayerChainContainer;

    

    let plotsChainContainer = document.createElement('div'); 
    
    plotsChainContainer.className = playerChainContainer_cls;

    wrapper_plotsData.append(plotsChainContainer);

    mainElement.append(picContainer);

    mainElement.append(plotsContainer);

    const nameElement = document.createElement('div');
    nameElement.innerHTML= `<p>Nikola Tesla</p>`;
    nameElement.className = meta_name_cls;
    const teamElement = document.createElement('div');
    teamElement.innerHTML= `<p>Department of  Defense</p>`;
    teamElement.className = meta_team_cls;

    plotsContainer.append(nameElement);
    plotsContainer.append(teamElement);
    plotsContainer.append(wrapper_plotsData);

        // add 10 grapgs 
    for (let i = 0; i < 3; i++) {
        let node = document.createElement('div');
        node.className = player_container_plot_cls;
        plotsChainContainer.append(node);
    }

    playerlist.append(mainElement);



    // plot data 
    // let plotsDataContainer = document.createElement('div');

    // wrapper_plotsData.append(plotsDataContainer); 

    // plotsDataContainer.className = playerDataContainer2_child_cls;
    // // playerCardContainer.className = player_container_cls;
    
    // // // append pic container and plot data container  to card 
    // // playerCardContainer.append(picContainer);
    // // playerCardContainer.append(plotsContainer);


    // // add wrapper plots container
    // plotsContainer.append(wrapper_plotsData);  // plot container - > wrapper-plot-data   ->  plotsDataContainer

    // // pic2.src ="/Users/hectorwilliams/Documents/Dev/repos/ReactApps/App_Bare/nba_app/client/src/static/images/faces/img.png";

    // return {forPlotNodes: plotsDataContainer, forDivPlots: plotsContainer   };

    




    // playerCardContainer.append()
    
}

export async function processData (data: ServerRecordInterface) {
    
    // update index ( pages select button;;;;TBD) 
    let k = 0;
    // create list 
    data.players.forEach((record) => {
        if (k ==0) {
            getPlayerDiv()
            .then(() => {
                
            })
        }

        k += 1;
    });

    // for (let i = 0; i < data.players.length; i++)



}