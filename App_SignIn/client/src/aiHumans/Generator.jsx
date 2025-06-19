import React, {Component} from 'react';
import cl from './Generator.css';
import gen2 from "./tones/wave4.csv";
import gen6 from "./tones/wave12.csv";
import wave from "./ocean.png";
import grid from "./grid.png";
import starsgif from "./stars.gif";
import next from './next.png';
import fileicon from './file-icon.png';
import playicon from './play-icon.png';
import stopplay from './stopplay.png';
import emptybox from './emptybox.png';
import sinraw from "./tones/sinraw.csv";
import sinfft from "./tones/sinfft.csv";
import time from "./tones/time.csv"
import spectrum from "./tones/spectrum.csv"
// import axios from 'axios';

class Generator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            panelMovable: false,
            lastChildRect : null,
            secondToLastChildRect: null, 
            parentRect: null, 
            limit: null, 
            childPercentage: [[93, 5, 2] ,  [70, 5, 25] ],
            childPercentageIndex: 0, 
            pointer: [ '\u{1F513}' ,  '\u{1F512}' ],
            captured: false, 
            svg: null,
            dsp: null, 
            index: 0,
            x: null,
            y: null,
            channels_svg: [ 
                {id:0, enabled: false, svg: null,  divwrapsvg: null, xaxis: null, yaxis: null  , op: 'raw' , x:  [new Array(1024).fill(0)], y:  [new Array(1024).fill(1)] ,   waveselect:{}, maxLengthX:0, xlabel: "", ylabel: "" , simphash: [] , gearRef:null, samples: [] , xlimit:{min:Infinity, max:-Infinity}  , ylimit:{min:Infinity, max:-Infinity} , clone:[] }, 
                {id:1, enabled: false, svg: null,  divwrapsvg: null, xaxis: null, yaxis: null  , op: 'raw' , x:   [new Array(1024).fill(0)], y:  [new Array(1024).fill(1)],   waveselect:{},  maxLengthX:0,xlabel: "", ylabel: "" ,  simphash: [], gearRef:null,samples: [] , xlimit:{min:Infinity, max:-Infinity}  , ylimit:{min:Infinity, max:-Infinity} , clone:[]}, 
                {id:2, enabled: false, svg: null,  divwrapsvg: null, xaxis: null, yaxis: null  , op: 'raw' , x:   [new Array(1024).fill(0)], y:  [new Array(1024).fill(1) ],  waveselect:{},  maxLengthX:0,xlabel: "", ylabel: "" , simphash: [], gearRef:null,samples: [] , xlimit:{min:Infinity, max:-Infinity}  , ylimit:{min:Infinity, max:-Infinity}, clone:[] }, 
                {id:3, enabled: false, svg: null,  divwrapsvg: null, xaxis: null, yaxis: null  , op: 'raw' , x:   [new Array(1024).fill(0)], y:  [new Array(1024).fill(1) ],  waveselect:{},  maxLengthX:0, xlabel: "", ylabel: "" , simphash: [] , gearRef:null,samples: [] , xlimit:{min:Infinity, max:-Infinity}  , ylimit:{min:Infinity, max:-Infinity} , clone:[]}  
            ],
            
            numChannels: 0,
            numChannels_len_3_alpha: '',
            timeoutID: false,
            channelModalSetup: null,
            channelNames: {list: 0 },
            swapblockLevel1: {},
            listChannels : JSON.stringify({names : ['','','',''] }),
            swappableIndices:[0],
            size: 4, 
            cc2: [],
            dataSplit: '100',
            len_3_nonuniform_swap_sel: '0',
            guiDiv : null,
            width: 0,
            height: 0, 
            
            width_0: 0, 
            width_1: 0,
            width_2: 0, 
            width_3: 0, 

            height_0: 0,
            height_1: 0, 
            height_2: 0, 
            height_3: 0, 

            infoButtonNode: null ,

            intervalIDForChannels: -1,

            activeWavedescr: '',
            
            dataStore: {

                name: "data store",

                description: "--", 

                collection: [
                    {
                        
                        descr: "Received samples from active instrument 'A'" , 
                        paths: ["http://127.0.0.1:5000/static/assets/AiHumans/wave4.csv"]  ,
                        playback: 'none' ,
                        waveselectExclude: []

                    },

                     {
                        descr: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." , 
                        paths: [
                            "http://127.0.0.1:5000/static/assets/AiHumans/wave4.csv",
                            "http://127.0.0.1:5000/static/assets/AiHumans/wave12.csv",
                        ],
                        
                        playback: 'none' ,
                        waveselectExclude: []

                        
                    },

                    {
                        descr: "slightly noisy 900Hz sinusoid signal; sample time approx 488us." , 
                        paths: [
                            "http://127.0.0.1:5000/static/assets/AiHumans/sinraw.csv",
                            "http://127.0.0.1:5000/static/assets/AiHumans/sinfft.csv",
                        ], 
                        playback: 'none' ,
                        waveselectExclude: []


                    },

                          {
                        descr: "tone sweeps " , 
                        paths: [
                            "http://127.0.0.1:5000/static/assets/AiHumans/time.csv",
                            "http://127.0.0.1:5000/static/assets/AiHumans/spectrum.csv",
                        ], 
                        playback: 'yes',
                        sweepsize: 2048 ,
                        waveselectExclude: [0]

                    }

                ]
            },


            hideWaveList: true,

            indicesMap: {} ,

            lineStrokes: [ "#000000","#FF0000", "#00FFFF", "#0000FF", "#C0C0C0", "#808080", "#800000" ],

            opaquePage: false,

            currentStory: null,

            quiet: false,

            plotCounter: 0,
            plotCounterPrev: 0,

            plotCounterReal: 0,
            csvsRef: [],

            isPlaying: false,

            playbackIntervalID: false,

            workers: 0,

            workersStop: false

        }

        this.panelClick = this.panelClick.bind(this);
        this.dspClick = this.dspClick.bind(this);
        this.channelButtonHandle = this.channelButtonHandle.bind(this);
        this.channelFormat = this.channelFormat.bind(this);
        this.channelFormatOff = this.channelFormatOff.bind(this);
        this.swapped = this.swapped.bind(this);
        this.resizeGrid = this.resizeGrid.bind(this);
        this.getSvg = this.getSvg.bind(this);
        this.plotCsv = this.plotCsv.bind(this);
        this.infoClicked = this.infoClicked.bind(this);
        this.infoClickedClose= this.infoClickedClose.bind(this);
        this.stopExample = this.stopExample.bind(this);
        this.runWaveStory = this.runWaveStory.bind(this);
        this.clickWaveOptions = this.clickWaveOptions.bind(this);
        this.toggleWaveListMethod = this.toggleWaveListMethod.bind(this);
        // this.fft = this.fft.bind(this);
        this.selectWave = this.selectWave.bind(this);
        this.closeWaveOptions = this.closeWaveOptions.bind(this);
        this.handleWindowChange = this.handleWindowChange.bind(this);
        this.stopPlayback = this.stopPlayback.bind(this);
        this.runPlayback = this.runPlayback.bind(this);
        // this.playWaveStory = this.playWaveStory.bind(this);
        window.onresize = this.handleWindowChange;

    }
    
    componentDidMount() {
        addScript('https://d3js.org/d3.v4.js');
    }

    handleWindowChange = (event) => {
        console.log('window changed ')
    }

    panelClick(event) {

        /* Open/Locks hidden section */

        const lastChildRect = event.currentTarget.getBoundingClientRect(); 
            let index = this.state.childPercentageIndex ^ 1; 
            let p = this.state.childPercentage[ index  ];
            this.setState({childPercentageIndex: index});
            event.currentTarget.parentNode.parentNode.parentNode.parentNode.style.gridTemplateColumns = `${p[0]}% ${ p[1]}% ${ p[2]}%`;

        if (this.state.childPercentageIndex == 0) {
            event.currentTarget.parentNode.classList.remove(cl.dynamic_container_left);
            event.currentTarget.parentNode.classList.add(cl.dynamic_container_right);
        } else {
            event.currentTarget.parentNode.classList.remove(cl.dynamic_container_right);
            event.currentTarget.parentNode.classList.add(cl.dynamic_container_left);
        }

        new Promise( (resolve, reject)=> {
            resolve(  document.getElementById('my_dataviz').getBoundingClientRect().width != this.state.width ) 
        })
        .then( () => {this.resizeGrid()}   )

    }


    getSvg = (index, count, indicesMap = null, swapModeId = null ) => {

        let ele = document.getElementsByClassName(cl.screenGraphContainer)[0];

        let rect = ele.getBoundingClientRect(); 
        
        var svg =  d3.select("#my_dataviz")
            .append("svg")
            .attr("style", "outline: 0.01px solid silver;")   
            .attr("data-name", index)
            .attr("data-channel", 'CH' + index)
            .attr("data-count", count )
            .append("g")
            .attr("name", "g-align" )
            .attr("transform",    "translate(" + (  rect.width) * 0.05 + ',' + (rect.height) * 0.05 + ")")  ; // margin left and top 
        
        this.state.channels_svg[index].svg = svg;

        this.setState({channels_svg: this.state.channels_svg});
        
    }

    channelButtonHandle(event) {

        let name = event.currentTarget.getAttribute('name');
        let index = Number(name);
  
        if ( this.state.channels_svg[index].enabled == false) {
            this.state.channels_svg[index].enabled = true 
        }
        
        else if (  this.state.channels_svg[index].enabled == true) {
            this.state.channels_svg[index].enabled = false
        }

        let newCount = (+this.state.channels_svg[0].enabled) + (+this.state.channels_svg[1].enabled) + (+this.state.channels_svg[2].enabled) + (+this.state.channels_svg[3].enabled) ;
        let container = document.getElementById('my_dataviz');
        let new_node  = null; 
        let clist;
        let clickedChannelName = 'CH' + index;

        if (newCount > this.state.numChannels) { 

            if (this.state.channels_svg[index].divwrapsvg) { 
                
                clist = Array.from(container.children);
                
                new_node = this.state.channels_svg[index].divwrapsvg;
                
                clist.push(new_node);

                clist.sort( (a, b) => a.getAttribute('data-name').localeCompare( b.getAttribute('data-name') ) );

                container.innHTML = ""; 
                
                clist.forEach(element => {
                    container.appendChild(element);
                });
                
            } 
                
            else {
            
                this.getSvg(index,newCount)
                clist = Array.from(container.children);
                let svg = clist.pop(); 
                new_node = getWrapperDiv();
                new_node.appendChild(svg);
                
                clist.push(new_node);
                
                container.innerHTML = "";
                clist.forEach(element => {
                    container.appendChild(element);
                });
                
                this.state.channels_svg[index].divwrapsvg = new_node;
            }

        }

        else if (newCount < this.state.numChannels) {

            clist = Array.from(container.children);

            let indexToRemove = clist.findIndex( x => {  return x.getAttribute('data-channel')  === clickedChannelName } );

            if (indexToRemove != -1) {
                clist =  clist.slice(0, indexToRemove).concat( clist.slice(indexToRemove + 1)) ;
                container.innerHTML = "";
                clist.forEach(element => {
                    container.appendChild(element);
                });
            }

        }

        // update indicesMap table ( number of channels changed)
        let indicesMap = {} ;
        let svgNodes = Array(newCount).fill(null); 
        let ids = Array(newCount).fill(-1);

        svgNodes = svgNodes.map ( (_, index) =>   container.children[index].firstElementChild  );
        ids = ids.map( (_, index) => parseInt(svgNodes[index].getAttribute('data-name') )); 
        ids.forEach( (x, index)  => {indicesMap[x] = index});
        
        this.setState({numChannels: newCount, channels_svg: this.state.channels_svg, guiDiv: container, indicesMap: indicesMap});
        
        this.resizeGrid();

    }

    getWrapperDiv () {
        let container = document.getElementById('my_dataviz');
        let div = document.createElement('div');
        div.classList.add(cl.svg_wrapper);
        div.setAttribute('data-name', container.children[container.children.length-1].getAttribute('data-name'));
        div.setAttribute('data-count', container.children[container.children.length-1].getAttribute('data-count'));
        div.setAttribute('data-channel', container.children[container.children.length-1].getAttribute('data-channel'));
        return div;
    }

    dspClick(event) {
        
        let container = document.getElementById('my_dataviz');

        if (this.state.dsp == null) {
            
            // power on 
            container.classList.remove(cl.powerOff);
            container.classList.add(cl.powerOn);

            setTimeout(()=>{
                container.classList.remove(cl.powerOn);
            }, 1000);

            //  power dsp mode 
            event.currentTarget.classList.add(cl.dspOn);
           
            const test_interval_ID = setInterval( ()=> {});

            this.setState({ dsp: 'startup'});

        } else {
            
            // disable svgs 
            let svgs = this.state.channels_svg;

            svgs.forEach( (svgRecord)=>{
            
                svgRecord.enabled = false;
                if (svgRecord.svg) {
                    svgRecord.waveselect = {};
                    svgRecord.svg.remove();
                    svgRecord.svg = null;
                    svgRecord.raw = 'raw';
                    svgRecord.x = [];
                    svgRecord.y = [];
                    svgRecord.maxLengthX = -Infinity;
                    svgRecord.simphash = [];
                    svgRecord.xlabel = 0;
                    svgRecord.ylabel = 0;
                    svgRecord.xlimit = {min:Infinity, max:-Infinity}  
                    svgRecord.ylimit= {min:Infinity, max:-Infinity} 
                    if (svgRecord.divwrapsvg) {
                        svgRecord.divwrapsvg.remove();
                        svgRecord.divwrapsvg = null;
                    }

                    svgRecord.gearRef = null;
                    svgRecord.activeWavedescr = '';
                    
                }
            })
            

            container.innerHTML = "";
            
            // remove border on button 
            event.currentTarget.classList.remove(cl.dspOn);
            container.classList.remove(cl.powerOn);
            container.classList.add(cl.powerOff);

            // add new states to event queue 
            this.setState({channels_svg: svgs, dsp: null, numChannels: 0});
            
        }
        
        this.resizeGrid() 
    }


    swapped() {
    
        /*
            After swapping cells during swap mode, update attributes 
        */

        let ele = document.getElementById('my_dataviz');
        let c = Array.from(ele.children);
        this.setState({cc2: c.map( (x) => x.getAttribute('data-channel') )   });
    }

    channelFormat(event) { 
        /* 
            controls the plotter cells display configuration 
        */

        if (this.state.dsp) {

            let eleGui = document.getElementById('my_dataviz');
            let c = Array.from(eleGui.children);
            let element = document.getElementsByClassName(cl.before_channelFormatSandbox)[0];
            
            if (c.length <2)
                return 

            if (c.length == 1 ) {
                element.setAttribute('data-split', "100");
                this.state.dataSplit = "100";
            }

            else if (c.length == 2) {
                // equal split
                element.setAttribute('data-split', "50_50");
                this.setState({ channelModalSetup: true , cc2:  c.map( (x) => x.getAttribute('data-channel') ), numChannels_len_3_alpha: ''  }   ); 
            }

            else if (c.length == 3) {

                if (element.getAttribute('data-len_3_nonuniform_swap_sel') == '1')   {
                    this.state.dataSplit = "50_25_25"; 
                    this.state.numChannels_len_3_alpha = 'b'
                }
                
                else if (element.getAttribute('data-len_3_nonuniform_swap_sel') == '0')   {
                    this.state.dataSplit = "25_25_50";
                    this.state.numChannels_len_3_alpha = ''
                }
                
                this.setState({ channelModalSetup: true , cc2:  c.map( (x) => x.getAttribute('data-channel') )  ,  dataSplit: this.state.dataSplit , numChannels_len_3_alpha: this.state.numChannels_len_3_alpha }   );  

            }

            else if(c.length == 4)  {

                this.state.dataSplit = "25_25_25_25";
                this.setState({ channelModalSetup: true , cc2:  c.map( (x) => x.getAttribute('data-channel') )  ,  dataSplit: this.state.dataSplit , numChannels_len_3_alpha: '' }   );  

            }
        }
    }

    channelFormatOff(event) { 
        /* 
            exits/closes "swap mode" 
        */

        this.setState({channelModalSetup: null});
        if (this.state.swapblockLevel1.interface) {
            if (this.state.swapblockLevel1.interface.funckill) {
                this.state.swapblockLevel1.interface.funckill(null); // level 1 calls level 2 command  ( exits swap mode)
            }
        }
    }

    plotCsv(channelIDs, signalIDs) {

        /* 
            plots csv data to channel-id

            Args:

                channelID - identifies which of the 4 channels to plot
                signalID - list of wave identifier to be plot on channel 

        */

        if (!this.state.dsp) {
            return;
        }

        let ele = document.getElementsByClassName(cl.screenGraphContainer)[0];
        let rect = ele.getBoundingClientRect(); 
        let count = (+this.state.channels_svg[0].enabled) + (+this.state.channels_svg[1].enabled) + (+this.state.channels_svg[2].enabled) + (+this.state.channels_svg[3].enabled) ;
        let cellIndex;
        let offsetXAxis = count == 1 ? rect.height * 0.87 : rect.height* 0.75/2;
        
        channelIDs.forEach( (currentID, currentIDIndex, currentReadyOnly) => {
            
            let gElement = this.state.channels_svg[currentID].divwrapsvg.firstElementChild.firstElementChild;
            let x;
            let y;
            
            let xlimit = this.state.channels_svg[currentID].xlimit;
            let ylimit = this.state.channels_svg[currentID].ylimit;

            let placeholderX = linspace(xlimit.min, xlimit.max, this.state.channels_svg[currentID].maxLengthX);
            let placeholder = placeholderX.map( (xValue, i) => {return {x:xValue, y:0}})
            
            gElement.innerHTML = ""; // clears channel plot 
            this.state.channels_svg[currentID].clone = [];

            signalIDs.forEach( (signalid, signalidindex) => {

           
                let len = this.state.channels_svg[currentID].x[signalid].length;

                let trueXDomain = linspace(xlimit.min, xlimit.max, len);
                let trueYDomain = linspace(ylimit.min, ylimit.max, len);

                let extentx = d3.scaleLinear().domain( d3.extent(trueXDomain) ); 
                let extenty = d3.scaleLinear().domain(d3.extent(trueYDomain) );
                let result = [];

                if (signalidindex == 0) {

                    cellIndex = this.state.indicesMap[currentID]; // channel is mapped to cell 

                    result.push(   this.state.channels_svg[currentID].svg    )

                    if (count == 2 || count == 1) {
                        result.push(    extentx.range([ 0, rect.width* 0.90    ] )    )
                    }

                    else if (count == 3 ) { 
                        
                        if ( (cellIndex  == 2 && this.state.numChannels_len_3_alpha == '' )  || (cellIndex  == 0 && this.state.numChannels_len_3_alpha == 'b' )  ) {

                            result.push(    extentx.range([ 0, rect.width* 0.90    ] )    )

                        } 
                        else {
                        
                            result.push(    extentx.range([ 0, rect.width* 0.40    ] )    )

                        }

                    }

                    else if  (count == 4) {

                        result.push(    extentx.range([ 0, rect.width* 0.40    ] )    )

                    }
                    
                    x = result[1]  // required to create area plot
                    result[0].append("g")
                    .attr("transform", "translate(0," + ( offsetXAxis ) + ")")
                    .attr("data-xaxis", 'x')
                    .call(d3.axisBottom(result[1]))
                    result = [];

                    extenty = d3.scaleLinear().domain(d3.extent(trueYDomain) );

                    result.push(   this.state.channels_svg[currentID].svg  );
                    
                    if (count == 1) {
                        
                        result.push(extenty.range([ ( rect.height * 0.87) , 0 ]));

                    }

                    else {
                        
                        result.push(extenty.range([ ( rect.height * 0.75/2) , 0 ]));

                    }

                    y = result[1] // required to create area plot
                    result[0].append("g")
                    .attr("transform", "translate(0," + ( 0 ) + ")")
                    .attr("data-yaxis", 'y')
                    .call(d3.axisLeft(result[1]))

                }
                
                // DRAW SELECTED WAVES ON CHANNEL
                    this.state.channels_svg[currentID].svg
                    .append("path")
                    .datum(this.state.channels_svg[currentID].samples[signalid])
                    .attr('data-signalID', signalidindex)
                    .attr('class', ('false' === this.state.channels_svg[currentID].waveselect[signalidindex]) ? cl.hide_wave : '')
                    .attr('data-check', this.state.channels_svg[currentID].waveselect[signalidindex])
                    // .attr('class',  cl.hide_wave )
                    .attr("fill", "#cce5df")
                    .attr("stroke", this.state.lineStrokes[  (signalid % this.state.lineStrokes.length)  ])
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.area()
                    .x(function(d) { return x(d.x) })
                    .y0(y(0))
                    .y1(function(d) { return y(d.y) }))

                
            });

            // BLACK LINE ON X AXIS
            this.state.channels_svg[currentID].svg
            .append("path")
            .datum(placeholder)
            .attr('data-signalID', -1)
            .attr("fill", "#cce5df")
            .attr("stroke", "#000000")
            .attr("stroke-width", 1.5)
            .attr("d", d3.area()
            .x(function(d) { return x(d.x) })
            .y0(y(0))
            .y1(function(d) { return y(d.y) }))

            let divFactor;
            if ( ((count == 3)  && ((this.state.numChannels_len_3_alpha == '' && cellIndex== 2)  || (this.state.numChannels_len_3_alpha == 'b' && cellIndex== 0) ) ) || count == 2  || count == 1 )  {
                divFactor = 2;
            } else  {
                divFactor = 4;
            }

            // XLABEL 
            this.state.channels_svg[currentID].svg
            .append("text")
            .attr("text-anchor", "end")
            // .attr("class", cl.plot_labels_hide)
            .attr("x",  (  rect.width/divFactor))
            .attr("y", (  0))
            .attr("data-xaxis", 'x')
            .attr("name",'xlabel')
            .style("font-size", "12px")
            .style("font-family", "Helvetica")
            .text( this.state.channels_svg[currentID].xlabel )

            // YLABEL
            this.state.channels_svg[currentID].svg
            .append('text')
            // .attr("class", cl.plot_labels_hide)
            .attr("text-anchor", "end")
            .attr("y", -( count ==2 ? 35: 30 ) )
            .attr("x", ( 0 ) )
            .attr("transform", "rotate(-90)")
            .attr("name",'ylabel')
            .attr("data-yaxis", 'y')
            .style("font-size", "12px")
            .style("font-family", "Helvetica")
            .text(this.state.channels_svg[currentID].ylabel)
            
            let element =  this.state.channels_svg[currentID].divwrapsvg;
            let clist = Array.from(element.firstElementChild.firstElementChild.children);
            
            // CENTER XLABEL
            let xaxisData = clist.filter( ele => ele.hasAttribute('data-xaxis') )   ;
            let xlabel = xaxisData[1];
            let xaxis = xaxisData[0];
            let delta = (xaxis.getBoundingClientRect().top - xlabel.getBoundingClientRect().top) 
            xlabel.setAttribute('y', delta + 20 ) ; // center ylabel
            
            // CENTER XLABEL 
            let yaxisData = clist.filter( ele => ele.hasAttribute('data-yaxis') )   ;
            let ylabel = yaxisData[1];
            let yaxis = yaxisData[0];
            delta = (yaxis.getBoundingClientRect().height - ylabel.getBoundingClientRect().height) / 2
            ylabel.setAttribute('x', -delta  ) ; // center ylabel
            
            this.state.channels_svg[currentID].clone.push(element.firstElementChild.firstElementChild.outerHTML); // save most recent drawing
        })

        /// wave for paths to update div 
        let promises = Array(channelIDs.length).fill(Promise.resolve) ;

        let interval = setInterval( () => {

            // verfiy paths 
            let bool = channelIDs.reduce( (accumState, currentID) => {

                // verify 
                let cnt = Array.from(this.state.channels_svg[currentID].divwrapsvg.firstElementChild.firstElementChild.children).reduce( (count, currentEle) => {

                    if (  ( currentEle.hasAttribute('data-signalID')  )  ) {
                        return +(currentEle.getAttribute('data-signalID')  != '-1') + count;
                    }

                    return  count;
                } , 0);

                return +(cnt == this.state.channels_svg[currentID].waveselect.length) + accumState

            }, true)



            if (bool) {
                Promise.resolve({})
                .then(() => {
                    this.setState(  {plotCounterPrev: this.state.plotCounter, plotCounter: (this.state.plotCounter + 1) % 1024  , quiet: false , workers: this.state.workers -1}  );
                    clearInterval(interval);
                })
            }

        });

    }
    


    resizeGrid(id = 0) {
        /* 
            update channel id display 
        */
       
            let parentContainer = document.getElementById('my_dataviz');
 

        if (parentContainer.children.length == 1) {

            let svgNodeParent, svgNode ;
            let clist;
            let node; 

            svgNodeParent = parentContainer.children[id];

            svgNode = svgNodeParent.firstElementChild;
            
            svgNode.remove();

            this.getSvg(id, 1);

            clist  = Array.from(parentContainer.children) ;
            
            svgNode = clist.pop(); // remove first element 
            
            svgNodeParent = clist[0];

            parentContainer.innerHTML = "";

            parentContainer.appendChild(svgNodeParent);

            svgNodeParent.appendChild(svgNode);
            
            this.state.width_0 =  "100%";
            this.state.height_0 =  "100%";

            svgNodeParent.style.width = `${this.state.width_0}`;
            svgNodeParent.style.height = `${this.state.height_0}`;

            this.setState({  width_0:  this.state.width_0 , height_0:  this.state.height_0 ,  numChannels_len_3_alpha:  ""}) ;
                
        }
        

        else if (parentContainer.children.length == 2) {

            let svgNodeParent, svgNode ;
            let clist;
            let node; 
            let svgNodes = [null, null];
            let ids = [-1, -1]; 
            
            // clear and add svg componenet ( i.e. fresh display)

            svgNodes = svgNodes.map ( (_, index) =>   parentContainer.children[index].firstElementChild  ) 

            ids = ids.map( (_, index) => parseInt(svgNodes[index].getAttribute('data-name') )); 
            
            svgNodes.forEach(deadNode => {deadNode.remove(); });
            
            let indicesMap = {} 
            ids.forEach( (x, index)  => {indicesMap[x] = index});

            ids.forEach( (removedID, index) => { this.getSvg(removedID, 2 )}) // regenerate the following channels (i.e. IDs)
            
            clist = Array.from(parentContainer.children);

            parentContainer.innerHTML = ""; 

            for ( let i= 1; i > -1; i--) {
                let consumerNode = clist[i]
                consumerNode.appendChild(clist.pop()) 
                parentContainer.prepend(   consumerNode  )
            }

            // set dimensions 

            node = parentContainer.children[0];
            this.state.width_0 =  "100%";
            this.state.height_0 =  "100%";
            node.style.width = `${this.state.width_0}`;
            node.style.height = `${this.state.height_0}`;
            
            node = parentContainer.children[1];
            this.state.width_1 =  "100%";
            this.state.height_1 =  "100%";
            node.style.width = `${this.state.width_1}`;
            node.style.height = `${this.state.height_1}`;
      

            this.setState({  width_0:  this.state.width_0 , height_0:  this.state.height_0 , width_1:  this.state.width_1 , height_1:  this.state.height_1,  numChannels_len_3_alpha:  ""}) ;
            
        }


        else if (parentContainer.children.length == 3) {

            let svgNodeParent, svgNode ;
            let clist;
            let node; 
            let svgNodes = [null, null, null];
            let ids = [-1, -1, -1]; 
            let indicesMap = {};
            
            // clear and add svg componenet ( i.e. fresh display)

            svgNodes = svgNodes.map ( (_, index) =>   parentContainer.children[index].firstElementChild  ) 

            // console.log(svgNodes)
            
            ids = ids.map( (_, index) => parseInt(svgNodes[index].getAttribute('data-name') )); 
            
            ids.forEach( (x, index)  => {indicesMap[x] = index});
            
            // console.log( 'ids => \t' , ids) ;

            ids.forEach( (removedID, _) => { this.getSvg(removedID, 3, indicesMap,  this.state.numChannels_len_3_alpha  )}) // regenerate the following channels (i.e. IDs)
            
            clist = Array.from(parentContainer.children);
            
            svgNodes.forEach(deadNode => {deadNode.remove(); });
            
            clist = Array.from(parentContainer.children);

            parentContainer.innerHTML = ""; 

            for ( let i= 2; i > -1; i--) {
                let consumerNode = clist[i]
                let svgNode = clist.pop()
                consumerNode.appendChild(svgNode);
                parentContainer.prepend( consumerNode  );
            }

            clist = Array.from(parentContainer.children);
           


            if (this.state.numChannels_len_3_alpha == 'b' ) {
                // "50_25_25" configuration

                node = clist[0];
                this.state.width_0 =  "100%";
                this.state.height_0 =  "100%";
                node.style.width = `${this.state.width_0}`;
                node.style.height = `${this.state.height_0}`;

                node = clist[1];
                this.state.width_1 =  "100%";
                this.state.height_1 =  "100%";
                node.style.width = `${this.state.width_1}`;
                node.style.height = `${this.state.height_1}`;

                node = clist[2];
                this.state.width_2 =  "100%";
                this.state.height_2 =  "100%";
                node.style.width = `${this.state.width_2}`;
                node.style.height = `${this.state.height_2}`;
                
            }
            
            else if (this.state.numChannels_len_3_alpha == '' ) {
                // "25_25_50" configuration
            
                node = clist[0];
                this.state.width_0 =  "100%";
                this.state.height_0 =  "100%";
                node.style.width = `${this.state.width_0}`;
                node.style.height = `${this.state.height_0}`;

                node = clist[1];
                this.state.width_1 =  "100%";
                this.state.height_1 =  "100%";
                node.style.width = `${this.state.width_1}`;
                node.style.height = `${this.state.height_1}`;

                node = clist[2];
                this.state.width_2 =  "100%";
                this.state.height_2 =  "100%";
                node.style.width = `${this.state.width_2}`;
                node.style.height = `${this.state.height_2}`;

            }
            

            this.setState({  width_0:  this.state.width_0 , height_0:  this.state.height_0 , width_1:  this.state.width_1 , height_1:  this.state.height_1, width_2:  this.state.width_2 , height_2:  this.state.height_2}) ;
            
        } 

        else if (parentContainer.children.length == 4) {


            let svgNodeParent, svgNode, consumerNode ;
            let clist;
            let node; 
            let svgNodes = [null, null, null, null];
            let ids = [-1, -1, -1, -1]; 
            
            // clear and add svg componenet ( i.e. fresh display)

            svgNodes = svgNodes.map ( (_, index) =>   parentContainer.children[index].firstElementChild  ) ;

            ids = ids.map( (_, index) => parseInt(svgNodes[index].getAttribute('data-name') )); 
            
            svgNodes.forEach(deadNode => {deadNode.remove(); });
            
            ids.forEach( (removedID, index) => { this.getSvg(removedID, 4)}) // regenerate the following channels (i.e. IDs)
            
            clist = Array.from(parentContainer.children);

            parentContainer.innerHTML = ""; 

            for ( let i= 3; i > -1; i--) {
                consumerNode = clist[i]
                svgNode = clist.pop()
                consumerNode.appendChild(svgNode);
                parentContainer.appendChild( consumerNode  );
            }

            clist = Array.from(parentContainer.children);
            node = clist[0];
            this.state.width_0 =  "100%";
            this.state.height_0 =  "100%";
            node.style.width = `${this.state.width_0}`;
            node.style.height = `${this.state.height_0}`;

            node = clist[1];
            this.state.width_1 =  "100%";
            this.state.height_1 =  "100%";
            node.style.width = `${this.state.width_1}`;
            node.style.height = `${this.state.height_1}`;

            node = clist[2];
            this.state.width_2 =  "100%";
            this.state.height_2 =  "100%";
            node.style.width = `${this.state.width_2}`;
            node.style.height = `${this.state.height_2}`;

            node = clist[3];
            this.state.width_3 =  "100%";
            this.state.height_3 =  "100%";
            node.style.width = `${this.state.width_3}`;
            node.style.height = `${this.state.height_3}`;
            

            this.setState({  
                width_0:  this.state.width_0 , 
                height_0:  this.state.height_0 , 
                width_1:  this.state.width_1 , 
                height_1:  this.state.height_1, 
                width_2:  this.state.width_2 , 
                height_2:  this.state.height_2, 
                width_3:  this.state.width_3 , 
                height_3:  this.state.height_3,
                numChannels_len_3_alpha:  "" // sustains display configuration 
            });

        }

    }

    infoClicked(event) {

        /*

        */
       
        if (this.state.infoButtonNode == null) {

            let rect = document.getElementById('my_dataviz').getBoundingClientRect();
            this.state.infoButtonNode = event.target;
            // console.log(event.target.parentNode.parentNode.parentNode)
            this.state.infoButtonNode.classList.add(cl.info_card);
        
            this.setState({infoButtonNode: this.state.infoButtonNode });
            
            let node = document.createElement('div')
            node.style.width = rect.width + 'px';
            node.style.height = rect.height + 'px';
            node.style.top = rect.top + 'px' ;
            node.style.left = rect.left  + 'px';
            node.style.backgroundImage = `url(${starsgif})`;
            
            this.state.infoButtonNode.appendChild(node);

            let childNode1 = document.createElement('div');
            let childNode2 = document.createElement('div');
            
            let p = document.createElement('p')
            p.textContent= '\u2607';
            childNode1.appendChild(p);

            p = document.createElement('p')
            p.textContent= 'Hectron Scope';
            childNode1.appendChild(p );
            
            p = document.createElement('p')
            p.textContent= '© 2025';
            childNode1.appendChild(p);
            
            
            node.appendChild(childNode1);
            node.appendChild(childNode2);

            childNode2.onclick =  this.infoClickedClose; 
        }

    }

    infoClickedClose(event) {
        
        
        new Promise ( resolve => {
            
            
            let id = setTimeout( (this_)=> {
                
                let clist = this_.state.infoButtonNode.childNodes;
                
                if ( this_.state.infoButtonNode.classList.contains(cl.info_card)  ) {
                    clearInterval(id);
                    resolve( {list:clist, id:id, self:this_, activeNode: this_.state.infoButtonNode})
                }

            }, 10, this)

        })

        .then( (record) => {
            let list = Array.from(record.list);
            let node = record.list[0] ;
            let parent = node.parentNode; 
            
            // console.log(parent)
            // console.log(node)
            record.activeNode.classList.remove(cl.info_card)
            parent.innerHTML = "";
            parent.appendChild( list[0] );
            record.self.setState({ infoButtonNode: null});
        })

    }

    stopExample() {
        if (this.state.intervalIDForChannels) {
            clearInterval(this.state.intervalIDForChannels);
        }
    }

  

    stopPlayback = ()=> {

        /*
            waits for busy status and stops plotting
        
         */
        
        let activeChannels = this.state.channels_svg.filter( (someChannelSvg) => someChannelSvg.enabled);

        this.setState({isPlaying: false, workersStop: true});

        clearInterval(this.state.playbackIntervalID);
        
        // wait for workers count to equal 0
        
        
        let interval_ = setInterval( () => {
            

            // console.log(this.state.workers)
            
            if (this.state.workers <= 0) {    

                activeChannels.forEach( (ch, index) => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(ch.clone[index], 'text/html');
                    const node = doc.body.firstChild;
                    ch.divwrapsvg.firstElementChild.firstElementChild.innerHTML = node;
                })

                clearInterval(interval_);
                this.setState({workers: 0, workersStop: false});
                
            }
        },100) 

    } 

    runPlayback = (event)=> {

         let node = event.target;

            let intvalID = setInterval( () => {


                if (this.state.plotCounterPrev !=  this.state.plotCounter) {
                    
                    if (this.state.isPlaying) {
                        
                        this.setState( { plotCounterPrev: this.state.plotCounter, plotCounterReal: (this.state.plotCounterReal + 1) % 30 } );
                        
                        node.click();

                    }
                }

            }, 300);
            
            this.setState( { playbackIntervalID: intvalID } );
    } 


    runWaveStory(event) {

        /*
            Plot/Play one of list of wave stories.

        Args:

            event - button event handler 

            TODO - halt button 'clickness' for 200ms after click (debounce)

        */
        
    
        //  csv file locally on server 
        let csvs = JSON.parse(event.target.getAttribute('data-csv_paths'));
        let waveIds = [...Array(csvs.length).keys()] 
        let activeIds = this.state.channels_svg.filter(ele => ele.enabled).map( ele => ele.id) ;
        let minValueX = Infinity;
        let maxValueX = -Infinity;
        let minValueY = Infinity;
        let maxValueY = -Infinity;
        let tmpMin;
        let tmpMax;
        let activeChannels = this.state.channels_svg.filter( (someChannelSvg) => someChannelSvg.enabled);
        let promises = Array(activeIds.length   *  waveIds.length).fill(null);
        let tmp;
        let samples_y;
        let samples_x;
        let samples;
        let start;
        let end;

        if (this.state.workersStop) {
            return
        }

        if ( event.target.getAttribute('data-playback') == 'yes'  && !this.state.isPlaying )  {
            this.setState({isPlaying: true});
            this.runPlayback(event);
        }
        
        // user selects different story 
        if (this.state.currentStory != event.target) {

            this.state.currentStory = event.target;
                // reset wave selects 
                activeChannels.forEach( ch => {
                    ch.waveselect = [];
                // clear all canvas
                ch.divwrapsvg.firstElementChild.firstElementChild.innHTML = "";

            })

        }
        
        this.setState({quiet: true, currentStory: this.state.currentStory, workers: this.state.workers + 1})

        // reset x,y domain limits 
        activeChannels.forEach( ch => {
            ch.xlimit = {min:Infinity, max:-Infinity};
            ch.ylimit = {min:Infinity, max:-Infinity};
        })

        // write current-csv to all active channels 
        activeChannels.forEach( (ele, channelIndex, activeChannelsReadOnlyArr) => {
            
            ele.x = Array(csvs.length).fill([]);
            ele.y = Array(csvs.length).fill([]);
            ele.samples = Array(csvs.length).fill([]);
            ele.simphash = Array(csvs.length).fill([]); 
            ele.ylabel = "";
            ele.xlabel = "";
            ele.maxLengthX = -Infinity;
            tmp = {};

            // copy previous wave selects 
            for (let key in ele.waveselect) {
                tmp[key] = ele.waveselect[key]
            }
            
            // add new wave selects
            if (waveIds.length > Object.entries(ele.waveselect).length) {
                waveIds.filter( id =>{ return !(id in tmp) } ).forEach(id => {  
                    let attr = JSON.parse(event.target.getAttribute('data-waveselectfilter'))
                    
                    if ( attr.findIndex(excluded_id => excluded_id == id) != -1) {
                        tmp[id] = 'false';
                        
                    }
                    else {
                        tmp[id] = 'true';
                        
                    }
                })
            }

            else { 
                
                // remove wave ids lost 
                Object.keys(tmp).forEach( key=> { 
                    if (!(parseInt(key) in waveIds)) {
                        delete tmp[key]
                    }
                })
                
            }
            
            ele.waveselect = tmp ;

            csvs.forEach( (currentCSV, waveIndex, waveIndicesReadyOnly) => {

                // parse table, selects parse options based on filename info 
                // TODO - prefix x, and y label in filename
                // TODO - handle increase data dimensions large than 2 
                
                const parserD3CSV = (headers) => {
                    
                    if (csvs[waveIndex].indexOf('sinfft')  !==- 1   ){

                        return { x: headers.frequency, y:headers.normalized}

                    } 
                    
                    else if (csvs[waveIndex].indexOf('sinraw')  !==- 1 ) {
                    
                        return { x: headers.time, y:headers.amplitude}
                    
                    } 
                    
                    else if (csvs[waveIndex].indexOf('gen')  !==- 1 ) {

                        return {x: headers.date, y: headers.value }

                    } 
                    
                    else if (csvs[waveIndex].indexOf('time.csv')  !==- 1   ){

                        return { x: headers.time, y:headers.amplitude};

                    } 

                    else if (csvs[waveIndex].indexOf('spectrum.csv')  !==- 1   ){ 
                     
                        return { x: headers.frequency, y:headers.magnitude};
                        
                    }
                    
                    else {
                    
                        return { x: headers.data, y:headers.value}
                    }
                                       
                
                }

                
                d3.csv( currentCSV  , parserD3CSV, data => {

                    if (event.target.innerHTML.trim() == "PLAY" ) {
                        start = this.state.plotCounterReal * 2048;
                        end = (this.state.plotCounterReal+1) * 2048;
                    } else {
                        start = 0;
                        end = data.length;
                    }
                    
                    data = data.slice( start, end);
                    
                    samples_y = data.map( (xyRecord) => {return  parseFloat(xyRecord.y)    });
                    samples_x = data.map( (xyRecord) => {return  parseFloat(xyRecord.x)   });

                    samples = samples_x.map( (_ , index) => {return {x: samples_x[index] , y: samples_y[index]}} )
                    ele.x[waveIndex] = samples_x ;
                    ele.y[waveIndex] = samples_y ;
                    ele.samples[waveIndex] = samples;
                    ele.simphash[waveIndex] = JSON.stringify(samples);

                    if (ele.waveselect[waveIndex] === 'true') {
                        
                        tmpMin = Math.floor( getMin(samples_y));
                        tmpMax = getMax(samples_y);
                        
                        if (tmpMin < minValueY) {
                            minValueX = tmpMin;
                        }
                        
                        if (tmpMax > maxValueY) {
                            maxValueY = tmpMax;
                        }
                        
                        tmpMin = Math.floor( getMin(samples_x) ) ;
                        tmpMax =  Math.ceil(getMax(samples_x));
                        
                        if (tmpMin < minValueY) {
                            minValueY = tmpMin;
                        }
                    
                        if (tmpMax > maxValueY) {
                            maxValueX = tmpMax;
                        }

                        ele.xlimit = {min: minValueX, max: maxValueX}
                        ele.ylimit = {min: minValueY, max: maxValueY}

                        if (samples.length > ele.maxLengthX ) {
                            ele.maxLengthX = samples.length;
                        }
                    }

                    // update promises ( resolve promise at index 0 and move to end)
                    let promiseIndex = channelIndex * waveIndicesReadyOnly.length +  waveIndex ;
                    promises[promiseIndex] = Promise.resolve( { this: self, channels: activeIds , waves: waveIds} );
                
                });

            })

            // check if limits were set (if not add placeholder for limits)
            if (ele.maxLengthX = -Infinity) {
                ele.maxLengthX = 2048; // placeholder
            }
            if (ele.xlimit.min == Infinity) {
                ele.xlimit.min = 0
            }

            if (ele.xlimit.max == -Infinity) { 
                ele.xlimit.max = 1;
            }

            if (ele.ylimit.min == Infinity) { 
                ele.ylimit.min = 0;
            }
            
            if (ele.ylimit.max == -Infinity) { 
                ele.ylimit.max = 1;
            }

        })

        this.setState({channels_svg: this.state.channels_svg});

        let intervalID = setInterval( () => {

            Promise.all(promises)
                .then( (response) => {
                
                // wait for promise 
                if (response.reduce( (acc, promiseElement) => {return acc & (promiseElement != null)  }, true) ) {
                    
                    Promise.resolve(response)
                    .then( (response) => {
                        let resp = response[0];

                        (async (self, channelIDs, waveIDs ) => {
                            await plotCsvHelper(self, channelIDs, waveIDs)
                            .then()
                            clearInterval(intervalID);
                        })( this, resp.channels, resp.waves);
                    }) 

                }
            
            })

        } ,100)
        
        
    }

    selectWave (event) {
          /*
            handle changes to checklist 
         */

        let channelID = parseInt(event.target.getAttribute('data-channelid'));

        if (event.currentTarget.getAttribute('data-check') == 'true') {
            event.currentTarget.setAttribute('data-check', 'false');
        } else {
            event.currentTarget.setAttribute('data-check', 'true');
        }
                    
        // update wave selections 
        let clist = Array.from(event.target.parentNode.children);
        let buffer = {}
        
        clist.forEach( (li_element, i) => {
            let channelid = parseInt(li_element.getAttribute('data-channelid'));
            let waveid = parseInt(li_element.getAttribute('data-waveid'));
            buffer[waveid] = li_element.getAttribute('data-check')
            console.log('update wave selections', channelid, waveid, li_element.getAttribute('data-check'))
            this.state.channels_svg[channelid].waveselect[waveid] = li_element.getAttribute('data-check');
        });
        
        
        this.setState({channels_svg: this.state.channels_svg});
        
        let intervalID = setInterval( () => {

            let ready = clist.reduce( ( accumlator, li_element, i) => {
                let channelid = parseInt(li_element.getAttribute('data-channelid'));
                let waveid = parseInt(li_element.getAttribute('data-waveid'));

                return ( JSON.stringify(this.state.channels_svg[channelid].waveselect[waveid])  == JSON.stringify((buffer[waveid])) ) & accumlator;
                
            }, true) 
            
            if (ready) {
                    
                clearInterval(intervalID);
                
                this.state.currentStory.click();

            }
       

        }, 100);

    }

    closeWaveOptions(event) {

        /* 
            close wave checklist 
        */

        let channelID = parseInt(event.target.parentNode.getAttribute('data-channelid'));
       
        this.state.channels_svg[channelID].gearRef = event.target.parentNode;
       
        event.target.parentNode.setAttribute('data-visible', "false");
        
    }

    clickWaveOptions (event) {
        /*
            opens wave checklist 
        */
        
        let channelID = event.target.getAttribute("data-key");
        
        let div = this.state.channels_svg[channelID].divwrapsvg;
        
        let divRect = div.getBoundingClientRect();
        let d = div.firstElementChild.firstElementChild.children;

        let paths = Array.from(d).filter( (node) => parseInt(node.getAttribute( 'data-signalID' )  ) >=0 )
        let ul;

        if ( this.state.channels_svg[channelID].waveselect.length <=0) {
            return; 
        }
        
        if (!this.state.channels_svg[channelID].gearRef ) {
            
            let newDiv = document.createElement('div');
        
            newDiv.style.width = divRect.width*0.25  + 'px'
            newDiv.style.height = divRect.height*0.40 + 'px';
            newDiv.style.left = (divRect.left + divRect.width*0.70) +  'px';
            newDiv.style.top= (divRect.top + divRect.height*0.05) + 'px';
            newDiv.classList.add(cl.minibox);
            newDiv.setAttribute('data-visible', "true");
            newDiv.setAttribute('data-channelid', channelID);
            this.state.channels_svg[channelID].gearRef = newDiv;

            ul = document.createElement('ul');
            ul.classList.add(cl.minibox_ul);

            let waveSelectDiv = document.createElement('div')
            waveSelectDiv.onclick = this.closeWaveOptions;
          
            newDiv.appendChild(waveSelectDiv);
            newDiv.appendChild(ul);
            div.appendChild(newDiv);
      
        }

        else  {

            ul = this.state.channels_svg[channelID].gearRef.lastElementChild;
            // console.log(this.state.channels_svg[channelID].gearRef);
            this.state.channels_svg[channelID].gearRef.setAttribute('data-visible', 'true'); 
            this.setState({channels_svg:this.state.channels_svg ,opaquePage: false});

        }

        ul.innerHTML = "";

        paths.forEach ( (currentPathNode, index) => {
            let li = document.createElement('li');
            li.setAttribute('data-check', currentPathNode.getAttribute('data-check') ); // currentPathNode.classList.contains(cl.hide_wave) ? 'false': 'true');
            li.textContent = 'wave';
            li.style.color = currentPathNode.getAttribute('stroke');
            li.setAttribute('data-waveid', currentPathNode.getAttribute('data-signalID') );
            li.setAttribute('data-channelid', channelID);
            li.classList.add(cl.minibox_li);
            ul.appendChild(li);
            li.onclick  = this.selectWave;

        })

        this.setState({channels_svg: this.state.channels_svg, opaquePage: true});

    }


    
    toggleWaveListMethod(event) {
        this.setState({hideWaveList : !this.state.hideWaveList }) 
    }

    render() {
        return (
            <div className={cl.component_grid}>

                <div  className={cl.screen}>
                    
                    {/* screen top button */}

                    <div className={cl.screenTopContainer}>
                        
                        <div className={cl.screenTopContainerProtectLayer}>

                            <div onClick={this.dspClick}> <p> DSP </p> </div>

                            {/* <div> <p>  </p> </div> */}

                        </div>

                    </div>


                    {/* screen  */}

                    <div  className={cl.screenGraphContainer}>
                        <div id={"my_dataviz"}  data-width_0={this.state.width_0} data-width_1={this.state.width_1}  data-width_2={this.state.width_2} data-width_3={this.state.width_3}  data-height_0={this.state.height_0} data-height_1={this.state.height_1} data-height_2={this.state.height_2}  data-height_3={this.state.height_3} data-power={this.state.dsp + ''} data-count={this.state.numChannels + this.state.numChannels_len_3_alpha + ''} className={` ${cl.vizContainer}  ${cl.powerOff}   `}></div>
                    </div>

                    {/* screen bottom buutton  */}

                    <div data-quiet={this.state.quiet + 'xx' } data-power={ this.state.channels_svg.reduce( (bbool, v) => bbool || v.enabled, false) } className={cl.screenBase} >
                        
                        <div>
                            
                            {/* collection of waveforms */}

                            <div  data-hide={(this.state.dataStore.collection.length == 0 || this.state.hideWaveList) + ""} data-store_len={this.state.dataStore.collection.length  + ''}>

                                {
                                    this.state.dataStore.collection.length == 0 || this.state.hideWaveList
                                    
                                    ?                                 
                                        //  render empty box if list is waveform store empty
                                        <>
                                            <label> {`Summary:`}  </label>
                                            <p> {`Collection Size = ${this.state.dataStore.collection.length}`}  </p>
                                        </>
                                    
                                    :

                                    this.state.dataStore.collection.map ( (record, index) => {return (
                                        <div key={index} className={cl.datalist_container}> 
                                            <div> 

                                                <label onClick={ record.playback =="yes"? this.runWaveStory:this.runWaveStory}   data-waveselectfilter={JSON.stringify(record.waveselectExclude)} data-playback={record.playback} data-descr={record.descr} data-csv_paths = {JSON.stringify(record.paths)} data-index ={index} data-on={"false"}   > {record.playback=='yes' ? "PLAY": "PLOT"} </label>     
                                                
                                                {
                                                    record.playback =="yes"?
                                                        <label onClick={this.stopPlayback}> STOP</label>
                                                    : ''

                                                }

                                            </div>
                                            
                                            <div> 
                                                
                                                <label data-text= { `${record.descr}`  }> 
                                                    {`${record.descr}`}
                                                </label>

                                            </div>
                                            
                                        </div>
                                    )})
                                }

                            </div>

                        </div>


                       <div className={cl.hoverText}>
                        {/* BUTTONS ALLOW WAVE SELECTIONS PER CHANNEL */}
                            
                            <button onClick={this.toggleWaveListMethod} data-key={'hide'}></button>

                            <button data-key={'0'} onClick={this.clickWaveOptions} data-channel_is_on={this.state.channels_svg[0].enabled + ""}></button>

                            <button data-key={'1'} onClick={this.clickWaveOptions} data-channel_is_on={this.state.channels_svg[1].enabled + ""}></button>

                            <button data-key={'2'} onClick={this.clickWaveOptions} data-channel_is_on={this.state.channels_svg[2].enabled + ""}></button>

                             <button data-key={'3'} onClick={this.clickWaveOptions} data-channel_is_on={this.state.channels_svg[3].enabled + ""}></button>

                        </div> 

                    </div>



                    <div  data-mode={this.state.channelModalSetup + ''}  className={cl.channel_reorg}>
                            <div className={cl.exitchannelFormat}>
                                <p onClick= {this.channelFormatOff} >{  "\u{2716}"}</p> 
                            </div>
                            <SandBox channelFormatOff={this.channelFormatOff}  swapblockLevel1= {this.state.swapblockLevel1} channelModalSetup={this.state.channelModalSetup}  channelNames= {this.state.channelNames }   cc2={this.state.cc2}  swapped={this.swapped}  channelFormat = {this.channelFormat} dataSplit= {this.state.dataSplit}  />
                    </div>


                </div>

                {/* front panel buttons */}

                <div   className={cl.screen_options}>
                           
                    <div className={cl.screen_options_ele_container}>
                        <div className={cl.screen_options_ele} onClick={this.infoClicked} > <p>INFO</p>  </div>
                    </div>

                    <div className={cl.screen_options_ele_container}>
                        <div data-name={"CH0"} name= "0" data-button={this.state.dsp + ''}  onClick ={this.channelButtonHandle} className={`${cl.screen_options_ele} ${cl.buttons_ch}`} > <p data-on={this.state.channels_svg[0].enabled ? 'true' : 'false' }>CH0</p> </div>
                    </div>
                    
                    <div className={cl.screen_options_ele_container}>
                        <div data-name={"CH1"} name= "1" data-button={this.state.dsp + ''}  onClick ={this.channelButtonHandle} className={`${cl.screen_options_ele} ${cl.buttons_ch}`}> <p data-on={this.state.channels_svg[1].enabled  ? 'true' : 'false'}> CH1</p>  </div>
                    </div>

                     <div className={cl.screen_options_ele_container}>
                        <div data-name={"CH2"} name= "2" data-button={this.state.dsp + ''}  onClick ={this.channelButtonHandle} className={`${cl.screen_options_ele} ${cl.buttons_ch}`}> <p data-on={this.state.channels_svg[2].enabled ? 'true' : 'false'}>CH2</p>  </div>
                    </div>

                    <div className={cl.screen_options_ele_container}>
                        <div data-name={"CH3"} name= "3" data-button={this.state.dsp + ''}  onClick ={this.channelButtonHandle} className={`${cl.screen_options_ele} ${cl.buttons_ch}`}> <p data-on={this.state.channels_svg[3].enabled ? 'true' : 'false'} >CH3</p>  </div>
                    </div>
                    
                    <div className={cl.screen_options_ele_container}>
                        <div  onClick={this.channelFormat}  className={cl.screen_options_ele}> <img src={grid}/> </div>
                    </div>
                    
                </div>

                {/* extra helper panel */}

                <div className={`${cl.dynamic_container}  `}>

                        <div className={cl.dynamic_container_grid_container}>

                            <div   className={cl.dynamic_container_left}>
                                {

                                    [1].map((value, index)  => {return (<div key={index} onClick={this.panelClick} ><p  > {this.state.pointer[this.state.childPercentageIndex]} </p></div>)} )
                                
                                }
                            </div>


                            <div className={cl.dynamic_container_nope2}>
                            
                            </div>

                        </div>

                </div>



            </div>
        )
    }
}


export default Generator;


class SandBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parentBox: {},
            swapblockLevel2: {},
            childProperty: {}
        }
        this.clicked = this.clicked.bind(this);
        this.outerClicked = this.outerClicked.bind(this);

    }
    
    clicked(event) {}

    outerClicked(event) {

        let elelayer3 = document.getElementsByClassName(cl.channelFormatSandbox)[0];
        let boxlayer3 = (elelayer3.getBoundingClientRect());
        
        let elelayer1 = document.getElementsByClassName(cl.before_channelFormatSandbox)[0];
        let boxlayer1 = (elelayer1.getBoundingClientRect());

        this.state.parentBox.bottom = boxlayer3.bottom;
        this.state.parentBox.left = boxlayer3.left;
        this.state.parentBox.right = boxlayer3.right;
        this.state.parentBox.top = boxlayer3.top;
        
        if (event.clientX  < boxlayer3.left || event.clientX > boxlayer3.right || event.clientY < boxlayer3.top || event.clientY > boxlayer3.bottom   ) {
            this.props.channelFormatOff(); 

            if (this.state.swapblockLevel2.activeElement){
                this.state.swapblockLevel2.func(this.state.swapblockLevel2.event);   
            }

        }

        else if ((event.clientX > boxlayer3.left && event.clientX < boxlayer1.left) || (event.clientX > boxlayer1.right && event.clientX < boxlayer3.right ) || (event.clientY < boxlayer1.top && event.clientY > boxlayer3.top) || (event.clientY < boxlayer3.bottom && event.clientY > boxlayer1.bottom) ) {
            
            if (this.state.swapblockLevel2.activeElement){
                this.state.swapblockLevel2.func(this.state.swapblockLevel2.event);
            }
        }

        
        // interface or connects Generator to SwapBlock
        this.props.swapblockLevel1.interface = this.state.swapblockLevel2;
        // }

    }

    render() {
        return (

            <div onClick= {this.outerClicked}  data-mode={this.props.channelModalSetup + ''}  className={cl.channel_reorg}>
                <div className={cl.exitchannelFormat}>
                    <p onClick= {this.props.channelFormatOff} >{  "\u{2716}"}</p> 
                </div>

                                
                <div className={cl.channelFormatSandbox}>
                    <div className={cl.before_channelFormatSandboxMessage}> Swap Mode</div>
                        <div  data-len_3_nonuniform_swap_sel="0" data-split={this.props.dataSplit} className={cl.before_channelFormatSandbox}>  
                            {
                                this.props.cc2 .map( (value, index, array)=>{ return(  <SwapBlock  swapblockLevel2={this.state.swapblockLevel2}  clickedOuter={this.clicked } key={index}     value={ value }   cc2={this.props.cc2}   channelFormat = {this.props.channelFormat}   swapped={this.props.swapped}  dataSplit={this.props.dataSplit}/> )})

                            }
                        </div>
                </div>
            
                        {/* <SandBox channelCount={this.state.channelCount} channelNames={this.state.channelNames}/> */}
            </div>
        )
    }
}

class SwapBlock extends Component {
    constructor (props) {
        super(props);
        this.state = {
            showPrompt: true,
            draggable: false,
            offset: {x: '', y:''}, 
            width:'',
            height: '',
            bottom: '',
            left: '', 
            top: '', 
            right: '',
            margin: '',
            padding: '',
            border: '', 
            offsetTop: '',
            offsetLeft: '',
            offsetBottom: '', 
            offsetRight: '', 
            top_delta: '',
            parentWidth: '', 
            parentHeight: '',
            box: {},
            session: false, 
            x: '',
            y:  '',
            data : {},
            fromIndex: '', 
            toIndex: '',
            listOfChannel: ['','','',''],
            indexOrder : [], 
            len_3_nonuniform_swap_sel: null 
            // indices: []
        }
        this.clicked = this.clicked.bind(this);
        this.moved = this.moved.bind(this);
        this.resetCell = this.resetCell.bind(this);
        this.fkill = this.fkill.bind(this);
    }

    componentDidMount() {}


    resetCell (event) {
        const box = event.target.getBoundingClientRect();
        event.target.classList.remove(cl.moveme);
        Array.from(event.target.parentNode.children).forEach( (p) => {
            p.classList.remove(cl.err);
        });
        this.setState({draggable: false});
    }

    fkill (event) {
        this.setState({draggable: false});
    }

    clicked (event) {

        // During "swap mode" process clicking a cell releases the cell making it movable on gui plane 
        
        let parent = document.getElementsByClassName(cl.para)[0] .parentNode
        
        if (!this.state.draggable) {
            /* Detach  cell */
            
            const box = event.target.getBoundingClientRect();

            event.target.classList.add(cl.moveme);

            event.target.style.top = `${box.top}px` ;
            event.target.style.left = `${box.left}px` ;
            event.target.style.right = `${box.right}px`;
            event.target.style.bottom = `${box.bottom}px`;
            event.target.style.width =  `${box.width}px`;
            event.target.style.height =`${box.height}px`;
            event.target.style.y =`${box.y}px`;
            event.target.style.offsetLeft =`${0}px`;
            event.target.style.padding = 0;
            event.target.style.margin = 0;
                
            this.setState({

                session: true, 
                
                draggable: true, 

                offsetLeft_ :  event.clientX - event.target.offsetLeft, 

                offsetTop_:  event.clientY - event.target.offsetTop,

                width: box.width, 

                height: box.height, 

                right: box.right, 

                left: box.left,

                top:  box.top, 
                
                bottom: box.bottom, 

                margin: 0, 

                padding: 0, 

                confirmSwap: 0,
                
                parent: parent

            });

            Array.from(event.target.parentNode.children).forEach((x, i)=> {
                x.setAttribute('data-effIndex', i);
            })
                
            if (event.target == event.target.parentNode.children[0] ) {
                this.props.swapblockLevel2.activeIndex = 0;
            } else {
                this.props.swapblockLevel2.activeIndex = 1;
            }

            /* note: this.props.swapblockLevel2 equals this.props.swapblockLevel1.interface */
            this.props.swapblockLevel2.activeElement = event.target;
            this.props.swapblockLevel2.event = event;
            this.props.swapblockLevel2.func = this.resetCell;
            this.props.swapblockLevel2.funckill = this.fkill;
        }

        else {
            //  Sntaches  cell  back to container 

            if (this.state.confirmSwap) {

                let temp = document.createComment('');
                let parent = document.getElementsByClassName(cl.before_channelFormatSandbox)[0];
                let children = Array.from(parent.children);
                let parentgui = document.getElementById('my_dataviz');
                
                if (this.state.len_3_nonuniform_swap_sel) {
                    this.state.len_3_nonuniform_swap_sel.element.setAttribute('data-len_3_nonuniform_swap_sel', this.state.len_3_nonuniform_swap_sel.id)
                }

                if (this.state.fromIndex == -1 && this.state.toIndex == -1 ) {
                    let childrenofgui = Array.from(parentgui.children);
                    let divsReordered = this.state.indexOrder.map( idx => childrenofgui[idx])  ;
                    // reorder  gui modify
                    parentgui.innerHTML = "";
                    divsReordered.forEach( (div) => {
                        parentgui.appendChild(div);
                    });   
                    this.props.channelFormat(); 
                    
                }
                
                else {

                    // swapped

                    let childrenofgui = Array.from(parentgui.children);
                    temp = childrenofgui[this.state.fromIndex];
                    childrenofgui[this.state.fromIndex] = childrenofgui[this.state.toIndex];
                    childrenofgui[this.state.toIndex] = temp;
                    parentgui.innerHTML = "";
                    childrenofgui.forEach((div)=> {
                        parentgui.appendChild(div);
                    });            

                }
                
                event.target.classList.remove(cl.moveme);

                children.forEach((p, index)=> {
                    p.removeAttribute('data-swap');
                    p.removeAttribute('style');
                });

                this.resetCell(event);

                this.props.swapped();

                this.setState({confirmSwap: 0, len_3_nonuniform_swap_sel: null });

            } 
            
        }

    }

    moved(event) {

        let box = (event.target.getBoundingClientRect())
        let numParas = event.target.parentNode.length;
        let paras = Array.from(event.target.parentNode.children);

        if (this.state.draggable) {

                /* handle popped cell moving **/

                let deltaToLeft = event.clientX - box.left;
                let deltaToRight = box.right - event.clientX ;
                
                let deltaToTop = event.clientY - box.top;
                let deltaToBottom = box.bottom - event.clientY

                if (deltaToLeft < box.width/2) {
                    let leftColumn = deltaToLeft;
                    let secondToLeftColumn = (box.width/2) - deltaToLeft
                    event.target.style.left = `${(event.clientX  - ( leftColumn +  secondToLeftColumn) ) }px`;
                } 

                else if (deltaToRight < box.width/2) {
                    let rightColumn = deltaToRight;
                    let secondToRightColumn = (box.width/2) - deltaToRight
                    event.target.style.left = `${(event.clientX  - (rightColumn + secondToRightColumn) ) }px`;
                }

                if (deltaToTop < box.height/2) {
                    let topRow = deltaToTop;
                    let secondToTopRow = (box.height/2) - topRow;
                    event.target.style.top = `${(event.clientY  - ( topRow +  secondToTopRow) ) }px`;
                }

                else if (deltaToBottom < box.height/2) {
                    let bottomRow = deltaToBottom;
                    let secondBottomRow = (box.height/2) - bottomRow;
                    event.target.style.top = `${(event.clientY  - ( bottomRow +  secondBottomRow) ) }px`;
                }

                const parentbox = event.target.parentNode.getBoundingClientRect();
                
                if (box.right > parentbox.right + 100    ||  box.left  < parentbox.left - 100 ||  box.top  < parentbox.top - 100  ||  box.bottom  > parentbox.bottom + 100  ) {
                    event.target.classList.add(cl.err);
                }
                else {
                    event.target.classList.remove(cl.err);
                }
                
                if (paras.length == 2) {

                    /* handle possible swap */

                    if (event.target == paras[0] ) {
                        
                        if (event.target.getBoundingClientRect().bottom  > paras[1].getBoundingClientRect().top  + (paras[1].getBoundingClientRect().height/2) ) {
                            paras[1].setAttribute('data-swap', 'yes')
                            this.setState({confirmSwap: 1, fromIndex: 0, toIndex: 1})
                        } 
                        
                        else {

                            paras[1].setAttribute('data-swap', 'no');

                        }

                    }

                    else if (event.target == paras[1]) {
                        if ( event.target.getBoundingClientRect().top < (paras[0].getBoundingClientRect().bottom -  paras[0].getBoundingClientRect().height/2) ) {
                            paras[0].setAttribute('data-swap', 'yes')
                            this.setState({confirmSwap: 1, fromIndex: 1, toIndex: 0})
                        }
                        
                        else {
                        
                            paras[0].setAttribute('data-swap', 'no')

                        }

                    }
   
                }

                else if (paras.length == 3) {

                    /* handle possible swap */
                    
                    if (this.props.dataSplit == "25_25_50" ) {

                        if (event.target == paras[0]) {

                            if ( (event.target.getBoundingClientRect().right > paras[1].getBoundingClientRect().left +  paras[1].getBoundingClientRect().width/2)   &&   (event.target.getBoundingClientRect().top < paras[1].getBoundingClientRect().bottom -  paras[1].getBoundingClientRect().height/2)  ) {
                                paras[1].setAttribute('data-swap', 'yes')
                                this.setState({confirmSwap: 1, fromIndex: 0, toIndex: 1})

                            }

                            else if ( (event.target.getBoundingClientRect().bottom > paras[2].getBoundingClientRect().bottom -  paras[2].getBoundingClientRect().height/2)  ) {
                                paras[2].setAttribute('data-swap', 'yes')
                                this.setState({confirmSwap: 1, fromIndex: 0, toIndex: 2})
                            }
                            else {
                                paras[1].setAttribute('data-swap', 'no')
                                paras[2].setAttribute('data-swap', 'no')

                            }
                        }

                        else if (event.target == paras[1]) {

                            if ((event.target.getBoundingClientRect().left < paras[0].getBoundingClientRect().right -  paras[0].getBoundingClientRect().width/2)  &&   (event.target.getBoundingClientRect().top <  paras[0].getBoundingClientRect().bottom  -  paras[0].getBoundingClientRect().height/2   ) ) {
                                paras[0].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: 1, toIndex: 0});
                            }

                            else if (event.target.getBoundingClientRect().bottom  > paras[2].getBoundingClientRect().top + paras[2].getBoundingClientRect().height/2  ) {
                                paras[2].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: 2, toIndex: 1});
                            }

                            else {
                                paras[0].setAttribute('data-swap', 'no');
                                paras[2].setAttribute('data-swap', 'no');
                            }
                        
                        }


                        else if (event.target == paras[2]) {

                            if ( (event.target.getBoundingClientRect().top < paras[0].getBoundingClientRect().bottom - paras[0].getBoundingClientRect().height/10  ) && ( event.target.getBoundingClientRect().right < paras[0].getBoundingClientRect().right -paras[0].getBoundingClientRect().width/10  )) {
                                paras[0].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: 2, toIndex: 0});
                            }

                            else if ( (event.target.getBoundingClientRect().top < paras[1].getBoundingClientRect().bottom - paras[1].getBoundingClientRect().height/2  ) && ( event.target.getBoundingClientRect().left > paras[1].getBoundingClientRect().left + paras[1].getBoundingClientRect().width/10  ) ) {
                                paras[1].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: 2, toIndex: 1});
                            }

                            else if (  (event.target.getBoundingClientRect().top < paras[1].getBoundingClientRect().bottom - paras[1].getBoundingClientRect().height/2  ) &&  (   event.target.getBoundingClientRect().left >= paras[0].getBoundingClientRect().left- 20  )    &&    (  event.target.getBoundingClientRect().right <= paras[1].getBoundingClientRect().right + 20 )       ) {
                                let element = document.getElementsByClassName(cl.before_channelFormatSandbox)[0];
                                paras[0].setAttribute('data-swap', 'yes');
                                paras[1].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: -1, toIndex: -1 , indexOrder: [ 2, 0, 1] , len_3_nonuniform_swap_sel: {id:1, element: element}  } );
                            }

                            else {
                                paras[0].setAttribute('data-swap', 'no');
                                paras[1].setAttribute('data-swap', 'no');
                                paras[2].setAttribute('data-swap', 'no');
                                this.setState({confirmSwap: 0, len_3_nonuniform_swap_sel: null } );
                            }
                            
                        }

                    }

                    else if (this.props.dataSplit == "50_25_25" ) { 

                        if (event.target == paras[0]) {

                            if ( (event.target.getBoundingClientRect().left > paras[2].getBoundingClientRect().left +  paras[2].getBoundingClientRect().width/50)  &&  (event.target.getBoundingClientRect().top > paras[2].getBoundingClientRect().top + paras[2].getBoundingClientRect().height/50) ) {
                                paras[2].setAttribute('data-swap', 'yes');

                                this.setState({confirmSwap: 1, fromIndex: 0, toIndex: 2});
                            }

                            else if ( (event.target.getBoundingClientRect().right < paras[1].getBoundingClientRect().right -  paras[1].getBoundingClientRect().width/50)  &&  (event.target.getBoundingClientRect().bottom > paras[1].getBoundingClientRect().top + paras[2].getBoundingClientRect().height/50) ) {
                                paras[1].setAttribute('data-swap', 'yes');
                                // paras[2].setAttribute('data-swap', 'no');
                                // paras[0].setAttribute('data-swap', 'no');
                                this.setState({confirmSwap: 1, fromIndex: 0, toIndex: 1});
                            }

                            else if ( (event.target.getBoundingClientRect().bottom  > paras[1].getBoundingClientRect().bottom - paras[1].getBoundingClientRect().height/2  )   && (event.target.getBoundingClientRect().left >= paras[1].getBoundingClientRect().left - 10)  && (event.target.getBoundingClientRect().right <= paras[2].getBoundingClientRect().right + 10) ) {
                                let element = document.getElementsByClassName(cl.before_channelFormatSandbox)[0];
                                paras[1].setAttribute('data-swap', 'yes');
                                paras[2].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: -1, toIndex: -1 , indexOrder: [ 1, 2, 0] , len_3_nonuniform_swap_sel: {id:0, element: element} } );
                            }
                            
                            else {

                                paras[2].setAttribute('data-swap', 'no');
                                paras[1].setAttribute('data-swap', 'no');
                                paras[0].setAttribute('data-swap', 'no');
                                this.setState({confirmSwap: 0, len_3_nonuniform_swap_sel: null } );

                            }
                        }

                        else if (event.target == paras[1]) {

                            if ( (event.target.getBoundingClientRect().right > paras[2].getBoundingClientRect().left +  paras[2].getBoundingClientRect().width/2   ) &&  (event.target.getBoundingClientRect().bottom > paras[2].getBoundingClientRect().bottom - paras[2].getBoundingClientRect().height/3)  ) {
                                paras[2].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: 1, toIndex: 2});

                            }

                            else if (event.target.getBoundingClientRect().top < paras[0].getBoundingClientRect().bottom - paras[0].getBoundingClientRect().height/2   ) {
                                paras[0].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: 1, toIndex: 0});
                            }

                            else {
                                paras[0].setAttribute('data-swap', 'no');
                                paras[1].setAttribute('data-swap', 'no');
                                paras[2].setAttribute('data-swap', 'no');
                                this.setState({confirmSwap: 0, len_3_nonuniform_swap_sel: null } );

                            }

                        }

                        else if (event.target == paras[2]) {

                            if (event.target.getBoundingClientRect().top < paras[0].getBoundingClientRect().bottom - paras[0].getBoundingClientRect().height/2) {
                                paras[0].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: 2, toIndex: 0});
                            }

                            else if ( (event.target.getBoundingClientRect().left < paras[1].getBoundingClientRect().right - paras[1].getBoundingClientRect().width/2)  && (event.target.getBoundingClientRect().bottom > paras[1].getBoundingClientRect().bottom - paras[1].getBoundingClientRect().height/3) ) {
                                paras[1].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: 2, toIndex: 1});
                            }

                            else {
                                
                                paras[0].setAttribute('data-swap', 'no');
                                paras[1].setAttribute('data-swap', 'no');
                                paras[2].setAttribute('data-swap', 'no');
                                this.setState({confirmSwap: 0, len_3_nonuniform_swap_sel: null } );

                            }



                        }

                    }

                }

                else if (paras.length == 4) {
                    
                    /* handle possible swap */
                    if (this.props.dataSplit == "25_25_25_25" ) { 

                        if (event.target == paras[0]) {
                            
                            if ( (event.target.getBoundingClientRect().right > paras[1].getBoundingClientRect().left + paras[1].getBoundingClientRect().width/20 ) &&  (event.target.getBoundingClientRect().bottom < paras[1].getBoundingClientRect().bottom - paras[1].getBoundingClientRect().height/20 ) ) {
                                paras[1].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: 0, toIndex: 1});

                            }

                            else if ( (event.target.getBoundingClientRect().bottom > paras[2].getBoundingClientRect().bottom + paras[2].getBoundingClientRect().height/20 )  && (event.target.getBoundingClientRect().right <  paras[2].getBoundingClientRect().right - paras[2].getBoundingClientRect().width/20   )  ) {
                                paras[2].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: 0, toIndex: 2});

                            }

                            else if ( (event.target.getBoundingClientRect().bottom > paras[3].getBoundingClientRect().bottom + paras[3].getBoundingClientRect().height/20 )  && (event.target.getBoundingClientRect().right >  paras[3].getBoundingClientRect().left + paras[3].getBoundingClientRect().width/20   )  ) {
                                paras[3].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: 0, toIndex: 3});
                            }

                            else {

                                paras[0].setAttribute('data-swap', 'no');
                                paras[1].setAttribute('data-swap', 'no');
                                paras[2].setAttribute('data-swap', 'no');
                                paras[3].setAttribute('data-swap', 'no');
                                this.setState({confirmSwap: 0, len_3_nonuniform_swap_sel: null });

                            }
                        }

                        else if (event.target == paras[1]) {
                            
                            if ( (event.target.getBoundingClientRect().left < paras[0].getBoundingClientRect().right -  paras[0].getBoundingClientRect().width/10) && (event.target.getBoundingClientRect().bottom < paras[0].getBoundingClientRect().bottom  - paras[0].getBoundingClientRect().height/50  ) ) {
                                paras[0].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: 1, toIndex: 0});
                            }

                            else if ( (event.target.getBoundingClientRect().right < paras[2].getBoundingClientRect().right -  paras[2].getBoundingClientRect().width/10) && (event.target.getBoundingClientRect().top > paras[2].getBoundingClientRect().top  + paras[2].getBoundingClientRect().height/50  ) ) {
                                paras[2].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: 1, toIndex: 2});
                            }

                            else if ( (event.target.getBoundingClientRect().left > paras[3].getBoundingClientRect().left +  paras[3].getBoundingClientRect().width/10) && (event.target.getBoundingClientRect().top > paras[3].getBoundingClientRect().top  - paras[3].getBoundingClientRect().height/50  ) ) {
                                paras[3].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: 1, toIndex: 3});
                            }
                            
                            else {

                                paras[0].setAttribute('data-swap', 'no');
                                paras[1].setAttribute('data-swap', 'no');
                                paras[2].setAttribute('data-swap', 'no');
                                paras[3].setAttribute('data-swap', 'no');
                                this.setState({confirmSwap: 0, len_3_nonuniform_swap_sel: null });

                            }

                        }

                        else if (event.target == paras[2]) {

                            if ( (event.target.getBoundingClientRect().right < paras[0].getBoundingClientRect().right -  paras[0].getBoundingClientRect().width/30   ) &&  (event.target.getBoundingClientRect().bottom < paras[0].getBoundingClientRect().bottom  - paras[0].getBoundingClientRect().height/30  )  ) {
                                
                                paras[0].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: 2, toIndex: 0});
                            }

                            else if ( (event.target.getBoundingClientRect().right > paras[1].getBoundingClientRect().left +  paras[1].getBoundingClientRect().width/30   ) &&  (event.target.getBoundingClientRect().bottom < paras[1].getBoundingClientRect().bottom  - paras[1].getBoundingClientRect().height/30  )  ) {
                                
                                paras[1].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: 2, toIndex: 1});
                                
                            }

                            else if ( (event.target.getBoundingClientRect().left > paras[3].getBoundingClientRect().left +  paras[3].getBoundingClientRect().width/30   ) &&  (event.target.getBoundingClientRect().top > paras[3].getBoundingClientRect().top  +  paras[3].getBoundingClientRect().height/30  )  ) {
                                
                                paras[3].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: 2, toIndex: 3});
                                
                            }

                            else {

                                paras[0].setAttribute('data-swap', 'no');
                                paras[1].setAttribute('data-swap', 'no');
                                paras[2].setAttribute('data-swap', 'no');
                                paras[3].setAttribute('data-swap', 'no');
                                this.setState({confirmSwap: 0, len_3_nonuniform_swap_sel: null });

                            }


                        }

                        else if (event.target == paras[3]) {

                            
                            if ( (event.target.getBoundingClientRect().right < paras[0].getBoundingClientRect().right -  paras[0].getBoundingClientRect().width/30   ) &&  (event.target.getBoundingClientRect().bottom < paras[0].getBoundingClientRect().bottom  - paras[0].getBoundingClientRect().height/30  )  ) {
                                
                                paras[0].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: 3, toIndex: 0});
                                
                            }
                            
                            else if ( (event.target.getBoundingClientRect().left > paras[1].getBoundingClientRect().left +  paras[1].getBoundingClientRect().width/30   ) &&  (event.target.getBoundingClientRect().bottom < paras[1].getBoundingClientRect().bottom  - paras[1].getBoundingClientRect().height/30  )  ) {
                                
                                paras[1].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: 3, toIndex: 1});
                                
                            }

                            else if ( (event.target.getBoundingClientRect().right < paras[2].getBoundingClientRect().right -  paras[2].getBoundingClientRect().width/30   ) &&  (event.target.getBoundingClientRect().top > paras[2].getBoundingClientRect().top + paras[2].getBoundingClientRect().height/30  )  ) {
                                
                                paras[2].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: 3, toIndex: 2});
                            }

                            else {

                                paras[0].setAttribute('data-swap', 'no');
                                paras[1].setAttribute('data-swap', 'no');
                                paras[2].setAttribute('data-swap', 'no');
                                paras[3].setAttribute('data-swap', 'no');
                                this.setState({confirmSwap: 0, len_3_nonuniform_swap_sel: null });


                            }

                        }

                    }

                }

        }
    }

    render() {
        return (
            <p onClick={this.clicked} onMouseMove={this.moved} className={cl.para} >
                {  this.props.value  }
            </p>
        )
    }
}

const addScript = (src) => {
    let some_script_ele = document.createElement('script');
    some_script_ele.setAttribute('src', src );
    document.head.appendChild(some_script_ele);
};

const getWrapperDiv = () => {
    let container = document.getElementById('my_dataviz');
    let div = document.createElement('div');
    div.classList.add(cl.svg_wrapper);
    div.setAttribute('data-name', container.children[container.children.length-1].getAttribute('data-name'));
    div.setAttribute('data-count', container.children[container.children.length-1].getAttribute('data-count'));
    div.setAttribute('data-channel', container.children[container.children.length-1].getAttribute('data-channel'));
    return div;
};

const linspace =  (start, stop, num) => {
    const props = { length: num } 
    
    if (num <= 1) {
        return 1;
    }
    
    let step = (stop - start) / (num - 1);
    return Array.from(props, (_, i) => start + step*i );
};

const getMin = (numbers) => {
    if (numbers.length == 0)
        return null; 
    
    return( numbers.reduce( (prev, curr)  => Math.min(prev, curr), Infinity) ) ;
}

const getMax = (numbers) => {
    if (numbers.length == 0)
        return null; 

    return ( numbers.reduce( (prev, curr)  => Math.max(prev, curr), -Infinity) ) ;
}


 const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};


const plotCsvHelper = async (self, activeChannelIds, WaveIDsList) => {
    
    /*
        Verify changes in state using simple hash
    */    

    return new Promise ((resolve)=> {
        
        let id = setInterval( (self, activeChannelIds, waveIds)=>{

            // calculate layman hash channel
            let isStateUpdated = activeChannelIds.reduce( (boolState, channelId) => {

                let simphash = 0;
                
                self.state.channels_svg[channelId].simphash.forEach( (hashData) => { simphash += +((typeof hashData) == 'string')})

                return (simphash === waveIds.length) & boolState;

            }, true);

            if (isStateUpdated) { 

                Promise.resolve( { id:id, self: self, activeIds: activeChannelIds, waveIds: waveIds} )
                .then(record => {
                    resolve(record);
                }) 
                
            }
            
        }, 10, self, activeChannelIds, WaveIDsList);

    })
    
    .then( (record)=> {

        record.self.plotCsv(record.activeIds, record.waveIds );  // plot axis and data 
        clearInterval(record.id );

    })

    .catch( (err) => {

        console.log('plotCsvHelper() error_message', err);

    })
}
