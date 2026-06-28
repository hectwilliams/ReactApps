import {top_level_list_container_container_cls, 
    player_container_cls, 
    player_container_plot_cls,
    meta_name_cls,
    meta_team_cls,
    playerChainContainer_cls,
    wrapperPlayerChainContainer, 
    playerDataContainer_cls, 
    img_cls
} from './static/css/playerlist.css';

import type {ServerRecordInterface} from './handlers';
import type { SimplePlayerProfileInterface } from './player';
import { dashboard } from './dashboard';
import { bookletInst } from "./pageShifter";
import { QuickPlot , } from './quickPlot';
import { binlog_container_cls } from './static/css/quickPlot.css';
import { storeInst } from './store';
import { quickHash } from './algo';

/*
    - PlayerCardContainer -> player_container_cls

        - picContainer -> 
        
        - plotContainer -> playerDataContainer_cls
            - wrapperPlayerChainContainer  ->  playerDataContainer2_child_wrapper_cls
                - plotsChainContainer  -> playerDataContainer2_child_cls
                    - name  -> meta_name_cls
                    - tean  -> meta_team_cls
*/

export const playerlist = document.createElement('div');
playerlist.className = top_level_list_container_container_cls;

// const imgPath = "/Users/hectorwilliams/Documents/Dev/repos/ReactApps/App_Bare/nba_app/client/src/static/images/faces/img.png"
const imgPath = "./client/src/static/images/faces/img.png";



 async function getPlayerDiv(record: SimplePlayerProfileInterface) {

    let mainElement = document.createElement('div');
    mainElement.className = player_container_cls;

    // add pic container 
    let picContainer = document.createElement('div');
    let picContainer_child = document.createElement('img');
    let src = "http://127.0.0.1:50215/src/static/images/faces/img.png" as string; //* 
    
    picContainer_child.src = src;
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
    nameElement.innerHTML= `<p> ${record.name} </p>`;
    nameElement.className = meta_name_cls;
    const teamElement = document.createElement('div');
    teamElement.innerHTML= `<p>National Basketball Association</p>`;
    teamElement.className = meta_team_cls;

    
    plotsContainer.append(nameElement);
    plotsContainer.append(teamElement);
    plotsContainer.append(wrapper_plotsData);
    
    if (!record.plots)
        return;

    if (record.plots?.length == 0) {
        return; 
    }
    // add 10 grapgs 
    for (let i = 0; i < record.plots.length; i++) {

        let barrierNode = document.createElement('div');
        let node = document.createElement('div');

        node.className = binlog_container_cls;

        barrierNode.className = player_container_plot_cls;
        barrierNode.append(node);

        plotsChainContainer.append(barrierNode);

        let qplot =  new QuickPlot(node);

        let numbers = record.plots[i] as number[];
        
        qplot.setPlot(numbers);

        let c = node.className;
        void node.offsetHeight;  // trigger reflow by evaluating (i.e. noop on DOM causing refresh of internals)
        node.className = c;
        
        let new_node = qplot.getPlot();
        // barrierNode.append(new_node);

    }

    playerlist.append(mainElement);

}

/* Reads data served from server and loads dashboard */
export async function processData (data: ServerRecordInterface): Promise<boolean>  {
    
    try {

        let stringArray = String(data?.players).toString()  + storeInst.service; // convert array to string 
        let newHash = quickHash(stringArray) as string;
        let code = String(data.players);

         if (storeInst.players === code) {
            console.log('request does not change gui state');
            throw new Error(""); 
        }  

        // clear list 
        dashboard.replaceChildren();
        playerlist.replaceChildren();


        // parse data from server 
        data.players.forEach((record, index) => {
            getPlayerDiv(record); // add value to list
            
        });

        if (data.players.length) {
            
            storeInst.hash = newHash;

            // update booket 
            
            bookletInst.enable();

            bookletInst.setFeed(data.page, data.numPages);

            storeInst.players = code;
            
            return true;

        } else {

            throw new Error(""); 
        }
    
    } catch(err) {

        return false

    }
}
