import React, {Component} from 'react';
import cl from './Generator.css';
import gen1 from "./tones/wave2.csv";
import gen2 from "./tones/wave4.csv";
import gen3 from "./tones/wave6.csv";
import gen4 from "./tones/wave8.csv";
import gen5 from "./tones/wave10.csv";
import gen6 from "./tones/wave12.csv";
import gen7 from "./tones/wave14.csv";
import gen8 from "./tones/wave16.csv";
import gen9 from "./tones/wave18.csv";
import gen10 from "./tones/wave20.csv";
import gen11 from "./tones/gen1.csv";
import gen12 from "./tones/gen2.csv";
import wave from "./ocean.png";
import grid from "./grid.png";
import starsgif from "./stars.gif";
import next from './next.png';
import fileicon from './file-icon.png';
import playicon from './play-icon.png';
import stopplay from './stopplay.png';
import emptybox from './emptybox.png';

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
            intervalID: null,
            index: 0,
            csvs: [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8, gen9, gen10] ,     // [f`./tones/wave${}.csv` for i in  np.arange(0, 11, 2)  ]
            x: null,
            y: null,
            channels_svg: [ 
                {enabled: false, svg: null, svgbuffer: null, divwrapsvg: null, xaxis: null, yaxis: null , xy:{}  }, 
                {enabled: false, svg: null,  svgbuffer: null, divwrapsvg: null, xaxis: null, yaxis: null , xy:{} }, 
                {enabled: false, svg: null,  svgbuffer: null, divwrapsvg: null, xaxis: null, yaxis: null , xy:{} }, 
                {enabled: false, svg: null,  svgbuffer: null, divwrapsvg: null, xaxis: null, yaxis: null , xy:{} } 
            ],
            
            numChannels: 0,
            numChannels_len_3_alpha: '',
            timeoutID: false,
            channelModalSetup: null,
            channelNames: {list: 0 },
            swapblockLevel1: {},
            listChannels : JSON.stringify({names : ['','','',''] }),
            // indices: [0,1,2,3],
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
            
            playstop: playicon,

            downloadedFile: null,

            dataStore: [
                {name: "Received samples from active instrument 'A'" , meta : ['Static', '2D'] },
                {name: "Sensor data from sensor. Each frame length is 1024." , meta : ['Update', '2D'] }

            ],

            channelGear: [false, false, false ,false],

            

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
        this.runExample = this.runExample.bind(this);
        this.stopExample = this.stopExample.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
        this.clickButton = this.clickButton.bind(this);
        this.hoverTextEnterHandler = this.hoverTextEnterHandler.bind(this);
        this.hoverTextExitHandler = this.hoverTextExitHandler.bind(this);
        this.clickChannelGear = this.clickChannelGear.bind(this);
        this.clickChannelGearSelectMode = this.clickChannelGearSelectMode.bind(this);
    }
    
    componentDidMount() {
        addScript('https://d3js.org/d3.v4.js');
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
        
        var  this_ = this;

        var svg =  d3.select("#my_dataviz")
            .append("svg")
            .attr("style", "outline: 0.01px solid silver;")   
            .attr("data-name", index)
            .attr("data-channel", 'CH' + index)
            .attr("data-count", count )
            .append("g")
            .attr("transform",    "translate(" + (  rect.width) * 0.05 + ',' + (rect.height) * 0.05 + ")")  ; // margin left and top 
        
        d3.csv(this.state.csvs[this.state.index],

            function(d){
                return { data : d.data, value : d.value }
            },

            function(data) {
                
                // xaxis pre-configuration 

                var x =  ((rect) => {
                    
                    if ((count  == 1) || (count == 2) || (count == 2 && coount ==1 && indicesMap == null) ) {
                        return d3.scaleLinear() .domain(d3.extent(data, function(d) { return d.data; })) .range([ 0, rect.width* 0.90    ] )  
                    }
                    else if (count == 4) {
                        return d3.scaleLinear() .domain(d3.extent(data, function(d) { return d.data; })) .range([ 0, rect.width* 0.40    ] )  
                    }
                    else if (count == 3 ) { 

                           if ( (swapModeId == '' && indicesMap[index] == 2  )    ||   (swapModeId == 'b' && indicesMap[index] == 0  )  ) {
                              return d3.scaleLinear()  .domain(d3.extent(data, function(d) { return d.data; })) .range([ 0, rect.width* 0.90    ] )  
                           } 
                           else {
                                return d3.scaleLinear() .domain(d3.extent(data, function(d) { return d.data; }))  .range([ 0, rect.width * 0.40   ] )  
                           }
                    }

                })(rect)

                if (count == 1) {

                    svg.append("g")
                        .attr("transform", "translate(0," + ( rect.height * 0.87)  + ")")
                        .attr("data-xaxis", 'x')
                        .call(d3.axisBottom(x))
                }

                else if (count == 3 || count == 4 || count == 2) {

                      svg.append("g")
                        .attr("transform", "translate(0," + (  rect.height* 0.75/2  )  + ")")
                        .attr("data-xaxis", 'x')
                        .call(d3.axisBottom(x))
                }
                

                // yaxis pre-configuration 

                var y = ( (rect) => {

                    if (count == 1) { 
                        return d3.scaleLinear().domain([0, d3.max(data, function(d) { return d.value; })]).range([ ( rect.height * 0.87) , 0 ])
                    } 
                    else {
                        return d3.scaleLinear().domain([0, d3.max(data, function(d) { return d.value; })]).range([ ( rect.height * 0.75/2) , 0 ])
                    }
                })(rect)
                
                svg.append("g")
                    .attr("transform", "translate(0," + 0 + ")")
                    .attr("data-yaxis", 'y')
                    .call(d3.axisLeft(y))
                

                // add the area (draw)

                svg.append("path")
                .datum(data)
                .attr('data-signalID', 0)
                .attr("fill", "#cce5df")
                .attr("stroke", "#69b3a2")
                .attr("stroke-width", 1.5)
                .attr("d", d3.area()
                    .x(function(d) { return x(d.data) })
                    .y0(y(0))
                    .y1(function(d) { return y(d.value) })
                )

                
                // xlabel pre-configuration

                if ( ((count == 3)  && ((swapModeId == '' && indicesMap[index] == 2)  || (swapModeId == 'b' && indicesMap[index] == 0) ) ) || count == 2  || count == 1 )  {
                     svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("class", cl.plot_labels_hide)
                    .attr("x",  (  rect.width/2))
                    .attr("y", (  0))
                    .style("font-size", "12px")
                    .style("font-family", "Helvetica")
                    .text("Frequency")
                } 

                else {

                  svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("class", cl.plot_labels_hide)
                    .attr("x",  (  rect.width/4))
                    .attr("y", (  0))
                    .style("font-size", "12px")
                    .style("font-family", "Helvetica")
                    .text("Frequency")
                }

                // ylabel pre-configuration
                svg.append('text')
                    .attr("class", cl.plot_labels_hide)
                    .attr("text-anchor", "end")
                    .attr("y", -( count ==2 ? 35: 30 ) )
                    .attr("x", ( 0 ) )
                    .attr("transform", "rotate(-90)")
                    .style("font-size", "12px")
                    .style("font-family", "Helvetica")
                    .text("Magnitude")

                
                this_.state.channels_svg[index].xaxis = x;
                
                this_.state.channels_svg[index].yaxis = y;

                this_.state.channels_svg[index].svg = svg;

            }
        )
        
        this.setState({channels_svg: this_.state.channels_svg});
        
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
        let parentSwapContainer = Array.from(document.getElementsByClassName(cl.para));
        let indexNextTo = null;
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
        
        this.setState({numChannels: newCount, channels_svg: this.state.channels_svg, guiDiv: container});
        
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
        
        const this_ = this;
        var powerOnCommand = '';
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
            
            // enabled ch0 sense
            this.state.channels_svg[0].enabled = true;

            // if (this.state.channels_svg[0].svg == null ) {} // standby mode or memory TBD
            
            this.getSvg(0, 1)
            
            let movevableSVGElement = container.children[0];
            let div = getWrapperDiv();
            div.appendChild(movevableSVGElement); // moves svg into div
            container.appendChild(div); // append div to container 
             
            this.state.channels_svg[0].divwrapsvg = div

            // render loop 
            const test_interval_ID = setInterval( ()=> {});
            
            //  add updated states to event queue 
            this.setState({ numChannels: 1 ,channels_svg: this.state.channels_svg, dsp: 'startup', intervalID: test_interval_ID});


        } else {
            
            // disable svgs 
            let svgs = this.state.channels_svg;

            svgs.forEach( (svgRecord)=>{
            
                svgRecord.enabled = false;
                if (svgRecord.svg) {
                    svgRecord.svg.remove();
                    svgRecord.svg = null;
                    svgRecord.divwrapsvg = null;
                    svgRecord.buffer = null;

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

                // if ( c[0].getBoundingClientRect().height * c[0].getBoundingClientRect().width > c[2].getBoundingClientRect().height * c[2].getBoundingClientRect().width) {
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

    plotCsv(channelID, signalID=0, data, xdata, ydata) {

        /* 
            plots csv data to channel-id

            Args:

                channelID - identifies channel to be updated
                signalID - select waveform in channel to be updated 

        */

        let someElement = d3.select('path');
        let pathElement = someElement._groups[0][0];
        let paths = Array.from(document.getElementsByTagName('path'))
        
        if (!this.state.dsp) {
            return;
        }

        // find index of channelID
        let activeChannels = this.state.channels_svg.filter(x => x.enabled  );

        let effectiveChannelIndex = activeChannels.findIndex (x => parseInt(x.divwrapsvg.firstElementChild.getAttribute('data-name')) == channelID) ;

        if (effectiveChannelIndex == -1) {
            return;
        }

        let svgRecord = activeChannels[effectiveChannelIndex];
        let parent = svgRecord.divwrapsvg.firstElementChild.firstElementChild;
        let list = Array.from(svgRecord.divwrapsvg.firstElementChild.firstElementChild.childNodes)

        new Promise( (resolve, reject) => {
           /* update/add previous path */
            let x = svgRecord.xaxis;
            let y = svgRecord.yaxis;
            let svg = svgRecord.svg;

            svg.append("path")
            .datum(data)
            .attr('data-signalID', signalID)
            .attr("fill", "#cce5df")
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 1.5)
            .attr("d", d3.area()
            .x(function(d) { return x(d.x) })
            .y0(y(0))
            .y1(function(d) { return y(d.y) }))

            let id = setInterval( 
                () => {
                    if (list.length < svgRecord.divwrapsvg.firstElementChild.firstElementChild.childNodes.length) {
                        clearInterval(id);
                        resolve(Array.from(svgRecord.divwrapsvg.firstElementChild.firstElementChild.childNodes));
                    }
                }, 100)
        })
        .then ( (nodeslist) => {
            /*  delete previous path */
            let node = nodeslist.find( x => x.getAttribute('data-signalID') == signalID );
            if (node) {
                node.remove();
            }
        })

    }


    resizeGrid(id = 0) {
        /* 
            update channel id display 
        */
       
            let parentContainer = document.getElementById('my_dataviz');
 
        //    if (  (this.state.channels_svg.reduce( (acc, x) => +x.enabled + acc, 0 ) == 1 ) ) {

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
            updateAxisLabels(parentContainer, 1); 

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
      
            updateAxisLabels(parentContainer, 2); 

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

            console.log(svgNodes)
            
            ids = ids.map( (_, index) => parseInt(svgNodes[index].getAttribute('data-name') )); 
            
            ids.forEach( (x, index)  => {indicesMap[x] = index});
            
            console.log( 'ids => \t' , ids) ;

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
            
            updateAxisLabels(parentContainer, 3); 

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
            
            updateAxisLabels(parentContainer, 4); 

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

        if (this.state.infoButtonNode == null) {
            this.state.infoButtonNode = event.target;
            this.state.infoButtonNode.classList.add(cl.info_card);
        
            this.setState({infoButtonNode: this.state.infoButtonNode });
            
            let node = document.createElement('div')
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
            
            childNode2.onclick =  this.infoClickedClose; 

            node.appendChild(childNode1);
            node.appendChild(childNode2);
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
            
            console.log(parent)
            console.log(node)
            record.activeNode.classList.remove(cl.info_card)
            parent.innerHTML = "";
            parent.appendChild( list[0] );
            record.self.setState({ infoButtonNode: null});
        })

    }

    runExample() {
        // let d = {index:0 , len: this.state.csvs.length, csvs: this.state.csvs}         

        // let id = setInterval( (data) => {
        //     data.index = (data.index + 1 ) % data.len ;
        //     d3.csv( data.csvs[data.index], 
        //         (csvdata)=> { return { x: csvdata.data, y: csvdata.value}}, 
        //         (dataObject) => {
        //             this.plotCsv(0, 0, dataObject);  //  collection of objects housing x and y key-value pairs per sample
        //         }
        //     )
        // }, 100, d)  

        // this.setState( {intervalIDForChannels: id})
        // clickButton
        // this.plotCsv(0);
        let min = 0;
        let max = this.state.csvs.length; 
        let randIndex =  Math.floor(Math.random() * (max - min + 1)) + min;
        randIndex = randIndex % this.state.csvs.length
        
        let data = {index:0 , len: this.state.csvs.length, csvs: this.state.csvs}         

        d3.csv( data.csvs[ randIndex ], 
                (csvdata)=> { return { x: csvdata.data, y: csvdata.value}}, 
                (dataObject) => {
                    this.plotCsv(0, 0, dataObject);  //  collection of objects housing x and y key-value pairs per sample
                }
        )
    }

    stopExample() {
        if (this.state.intervalIDForChannels) {
            clearInterval(this.state.intervalIDForChannels);
        }
    }

    clickButton(event) {

        // check data store for csv  data 

        this.runExample()

        new Promise( (resolve ) => {
            resolve(this)
        })

        .then( (self) => {
            
            if (self.state.playstop == playicon) {
                
                self.state.playstop = stopplay;

            }

            else { 

                self.state.playstop = playicon;

            }
            
            self.setState({playstop: self.state.playstop});

        })
        
    }

    downloadFile() {

        // trigger browser download functionality 

    }

    hoverTextEnterHandler() {
        console.log('enter')
    }

    hoverTextExitHandler() {
        console.log('exit')
        
    }

    clickChannelGear (event) {
        let index = parseInt(event.target.getAttribute('data-key'));
        let bool_ = this.state.channelGear[index];
        
        if (bool_ == false && !event.target.classList.contains(cl.gear) ) {
            this.state.channelGear[index] = true;
        } 
        
        else if (bool_ == true && (event.target.hasAttribute('name') ) )  {
            this.state.channelGear[index] = false;

        }

        this.setState({channelGear: this.state.channelGear});
        
    }

    clickChannelGearSelectMode (event) {
        if (!event.target.hasAttribute('data-sel')) {
            let chidren = Array.from(event.target.parentNode.children);
            let index = chidren.findIndex(ele => ele.hasAttribute('data-sel')) ;
            if ( index >= 0 ) {
                chidren[index].removeAttribute('data-sel');
                event.target.setAttribute('data-sel', 'true')
            }
        }
    }

    render() {
        return (
            <div className={cl.component_grid}>

                <div className={cl.screen}>
                    
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

                    <div data-power={this.state.dsp + ''} className={cl.screenBase} >
                        
                        <div>
                            
                            {/* collection of waveforms */}

                            <div data-store_len={this.state.dataStore.length  + ''}>

                                {
                                    this.state.dataStore.length == 0 
                                    
                                    ?                                 
                                    //  render empty box if list is waveform store empty

                                    <img  src={emptybox}/> 
                                    
                                    :

                                    this.state.dataStore.map ( (record, index) => {return (
                                        <div key={index} className={cl.datalist_container}> 
                                            <div > 

                                                <label data-on={"false"} onClick={this.clickButton}  > {index==1?"PLOT": "PLOT"} </label>
                                            </div>
                                            
                                            <div> 
                                                
                                                <label data-text= { `${record.name}`  }> 
                                                    {`${record.name}`}
                                                </label>

                                            </div>
                                            
                                        </div>
                                    )})
                                }


                            </div>

                        </div>


                       <div className={cl.hoverText}>
                        {/* fixed buttons allow each channel to tranform the raw data from a list of operations */}
                        
                            <button data-key={'0'} onClick={this.clickChannelGear} data-channel_is_on={this.state.channels_svg[0].enabled + ""}>
                                {
                                 this.state.channelGear[0] ? 
                                    <div   data-key={'0'} onClick={this.clickChannelGear}  className={cl.gear}>  
                                         <div>    
                                            <ul>
                                                <li data-sel={"true"} onClick={this.clickChannelGearSelectMode} >Raw</li>
                                                <li onClick={this.clickChannelGearSelectMode} >FFT</li>
                                                </ul>
                                        </div>  
                                        <label  name={0 + ""} data-key={'0'} onClick={this.clickChannelGear}  > {  "\u{2716}"}  </label> 
                                    </div> 
                                :  
                                     <label  > 0</label>} 
                            </button>

                            <button data-key={'1'} onClick={this.clickChannelGear} data-channel_is_on={this.state.channels_svg[1].enabled + ""}>
                                {
                                 this.state.channelGear[1] ? 
                                    <div   data-key={'1'} onClick={this.clickChannelGear}  className={cl.gear}>  
                                         <div>    
                                            <ul>
                                                <li data-sel={"true"} onClick={this.clickChannelGearSelectMode} >Raw</li>
                                                <li onClick={this.clickChannelGearSelectMode} >FFT</li>
                                                </ul>
                                        </div>  
                                        <label  name={1 + ""} data-key={'1'} onClick={this.clickChannelGear}  > {  "\u{2716}"}  </label> 
                                    </div> 
                                :  
                                     <label  > 1</label>} 
                            </button>

                            <button data-key={'2'} onClick={this.clickChannelGear} data-channel_is_on={this.state.channels_svg[2].enabled + ""}>
                                {
                                 this.state.channelGear[2] ? 
                                    <div   data-key={'2'} onClick={this.clickChannelGear}  className={cl.gear}>  
                                         <div>    
                                            <ul>
                                                <li data-sel={"true"} onClick={this.clickChannelGearSelectMode} >Raw</li>
                                                <li onClick={this.clickChannelGearSelectMode} >FFT</li>
                                                </ul>
                                        </div>  
                                        <label  name={2 + ""} data-key={'2'} onClick={this.clickChannelGear}  > {  "\u{2716}"}  </label> 
                                    </div> 
                                :  
                                     <label  > 2</label>} 
                            </button>

                             <button data-key={'3'} onClick={this.clickChannelGear} data-channel_is_on={this.state.channels_svg[3].enabled + ""}>
                                {
                                 this.state.channelGear[3] ? 
                                    <div   data-key={'3'} onClick={this.clickChannelGear}  className={cl.gear}>  
                                         <div>    
                                            <ul>
                                                <li data-sel={"true"} onClick={this.clickChannelGearSelectMode} >Raw</li>
                                                <li onClick={this.clickChannelGearSelectMode} >FFT</li>
                                                </ul>
                                        </div>  
                                        <label  name={3 + ""} data-key={'3'} onClick={this.clickChannelGear}  > {  "\u{2716}"}  </label> 
                                    </div> 
                                :  
                                     <label  > 3</label>} 
                            </button>

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

                <div className={cl.screen_options}>
                           
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


const waitForChildNodesPromise =  (parentContainer, index) => {
    return  new Promise(  (resolve, _) => {

    let id = setInterval(() => {
        let childNodes = parentContainer.children[index].firstElementChild.childNodes[0].childNodes;
            if (Array.from( childNodes.length > 0 ) ) {
                resolve( {list: childNodes, intervalID: id} );
            }
        }, 200)
    });
};

const updateLabelPromises = (record, swapmode = null) => {
    return new Promise( (resolve) => {
        clearInterval(record.intervalID)

        let list = record.list;
        let xaxis  = list[0];
        let xlabel = list[ list.length-2 ];

        let yaxis  = list[1];
        let ylabel = list[list.length -  1];

        let delta = (yaxis.getBoundingClientRect().height - ylabel.getBoundingClientRect().height) / 2
        ylabel.setAttribute('x', -delta  ) ; // center ylabel
        ylabel.classList.remove(cl.plot_labels_hide);
        ylabel.classList.add(cl.plot_labels);

        delta = (xaxis.getBoundingClientRect().top - xlabel.getBoundingClientRect().top) 
        xlabel.setAttribute('y', delta + 20 ) ; // center ylabel
        xlabel.classList.remove(cl.plot_labels_hide);
        xlabel.classList.add(cl.plot_labels);
        resolve(record.list)
    })
};

const  updateAxisLabels = async (parentContainer, numOfChannels, swapMode=null)=> {
    let promises = [...Array(numOfChannels).keys()]
    let records = await Promise.all( promises.map( index => waitForChildNodesPromise(parentContainer, index)) );
    let resp = await Promise.all( records.map(record => updateLabelPromises(record, swapMode)) )
};

