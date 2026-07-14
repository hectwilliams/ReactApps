import {top_level_list_container_container_cls, 
    player_container_cls, 
    player_container_plot_cls,
    meta_name_cls,
    meta_team_cls,
    playerChainContainer_cls,
    wrapperPlayerChainContainer, 
    playerDataContainer_cls, 
    img_cls,
    player_containerwrapper_cls, 
    meta_assoc_cls,
} from './static/css/playerlist.css';

import {statsChainContainer_cls} from  './static/css/stats.css';

import type {ServerRecordInterface} from './handlers';
import type { SimplePlayerProfileInterface } from './player';
import { dashboard } from './dashboard';
import { bookletInst } from "./pageShifter";
import { setBarCells, setPeakCells, QuickPlot , fillUnweightedCell} from './quickPlot';
import { binlog_cell_cls, binlog_container_cls , binlog_overlay__cls, binlog2_container_cls, test_cls, test_cls2} from './static/css/quickPlot.css';
import { storeInst } from './store';
import { quickHash } from './algo';
import { BINSIZE } from './main';
import {genStatsContainer} from './stats';

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

const imgPath = "./client/src/static/images/faces/img.png";

 async function getPlayerDiv(record: SimplePlayerProfileInterface, index?: number ) {

    let mainElementWrapper = document.createElement('div');
    mainElementWrapper.className = player_containerwrapper_cls;

    let mainElement = document.createElement('div');
    mainElement.className = player_container_cls;

    mainElementWrapper.append(mainElement)

    // add pic container 
    let picContainer = document.createElement('div');
    let picContainer_child = document.createElement('img');
    let effIndex =  (!index ? 0 : (index % 2)) as number;
    let src =   `http://127.0.0.1:50215/static/images/faces/${effIndex}_player.png`;
    picContainer_child.src  = src;
    record.tmpic = record.tmpic.replace("/src", "")
    picContainer_child.style = `--bg-img: url('${record.tmpic}'); background-size:cover`; // teams background
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

    let statsContainer = genStatsContainer(statsChainContainer_cls); 
    
    wrapper_plotsData.append(statsContainer);

    let plotsChainContainer = document.createElement('div'); 
    
    plotsChainContainer.className = playerChainContainer_cls;

    wrapper_plotsData.append(plotsChainContainer);

    mainElement.append(picContainer);

    mainElement.append(plotsContainer);


    const nameElement = document.createElement('div');
    nameElement.innerHTML= `<p> ${record.player} </p>`;
    nameElement.className = meta_name_cls;
    const teamElement = document.createElement('div');
    teamElement.innerHTML= `<p> ${record.tm} </p>`;
    teamElement.className = meta_team_cls;
   const teamAssoc = document.createElement('div');
    teamAssoc.innerHTML= `<p>National Basketball Association </p>`;
    teamAssoc.className = meta_assoc_cls;
    plotsContainer.append(nameElement);
    plotsContainer.append(teamElement);
    plotsContainer.append(teamAssoc);

    plotsContainer.append(wrapper_plotsData);
    
    playerlist.append(mainElementWrapper);

    const keys = ['pts', 'played'] ;

    keys.forEach( (x) => {
        let arr : string;

        if (x == 'pts' && record.pts)
            arr = record.pts;
        else if (x == 'played' && record.played)
            arr = record.played;
        else 
            return;

        let sReplaced = arr.replaceAll(";", ",") 
        
        let values = JSON.parse(sReplaced.trim()) as number[];

        // TODO truncate values
        
        if (  values.length  != BINSIZE ){
            values = values.slice(0,BINSIZE);
        }


            let barrierNode = document.createElement('div');
            let node = document.createElement('div');
            let node2 = document.createElement('div');
            let overlayNode = document.createElement('div');

            node.className = binlog_container_cls;
            node2.className = binlog2_container_cls;

            overlayNode.className = binlog_overlay__cls; 
            barrierNode.className = player_container_plot_cls; // barrier wraps bin log
            
            // nodde -> overlayNode -> barrier -> chain container 
            
            plotsChainContainer.append(barrierNode);

            barrierNode.append(overlayNode);

            overlayNode.append(node);
            overlayNode.append(node2);
            
            // fill 
            fillUnweightedCell(node, binlog_cell_cls);
            fillUnweightedCell(node2, test_cls);

            // let qplot =  new QuickPlot(node);

            let numbers = values;
            
            // qplot.setPlot(numbers);
            
            setPeakCells (node2, test_cls, numbers);
            setBarCells (node, numbers);

            let c = node.className;
            void node.offsetHeight;  // trigger reflow by evaluating (i.e. noop on DOM causing refresh of internals)
            node.className = c;

    });

}

/* Reads data served from server and loads dashboard */
export async function processData (data: ServerRecordInterface): Promise<boolean>  {
    
    try {

        let stringArray = String(data?.players).toString()  + storeInst.service; // convert array to string 
        let newHash = quickHash(stringArray) as string;
        let code = String(data.players);

         if (storeInst.players === code) {
            // console.log('request does not change gui state');
            throw new Error(""); 
        }  

        // clear list 
        dashboard.replaceChildren();
        playerlist.replaceChildren();
        
        // parse data from server 
        data.players.forEach((record, index) => {
            // add value to list
            getPlayerDiv(record, index); 
        });

        if (data.players.length) {
            
            storeInst.hash = newHash;

            // update booket 
            bookletInst.enable();
            // console.log('RETURNED')
            // console.log(data);
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
