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
            numChannelsAlpha: '',
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
            dataSplit2: '0',
            guiDiv : null,
            width: 0,
            height: 0, 
            
            width_0: 0, 
            width_1: 0 ,
            width_2: 0, 
            
            height_0: 0,
            height_1: 0, 
            height_2: 0, 

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

    getSvg = (index, count) => {

        const margin = {
            left: 15,
            right: 15, 
            top: 10, 
            bottom:30
        }

        let ele = document.getElementsByClassName(cl.screenGraphContainer)[0];

        let rect = ele.getBoundingClientRect(); 
        
        var  this_ = this;

        var svg =  d3.select("#my_dataviz")
                    .append("svg")
                    // .attr("width", `${rect.width-50}px`)
                    // .attr("height", `${rect.height-50}px` )
                    .attr("style", "outline: thin solid red;")   
                    .attr("data-name", index)
                    .attr("data-channel", 'CH' + index)
                    .attr("data-count", count )
                    // .attr("class", cl.channelName)
                    .append("g")
                    .attr("transform", "translate(" + (margin.left + margin.right) * 2 + ',' + (margin.top + 40 ) + ")")  ;
                    // margin left abd nargin bottom

        d3.csv(this.state.csvs[this.state.index],

            function(d){
                return { data : d.data, value : d.value }
            },

            function(data) {
                
                var x = d3.scaleLinear()
                    .domain(d3.extent(data, function(d) { return d.data; }))
                    .range([ 0, rect.width - 30 ]);
                    svg.append("g")
                    .attr("transform", "translate(0," + (rect.height-210)  + ")")
                    .attr("data-xaxis", 'x')

                    .call(d3.axisBottom(x))

                var y = d3.scaleLinear()
                    .domain([0, d3.max(data, function(d) { return d.value; })])
                    .range([ rect.height - 220, 0 ]);
                    svg.append("g")
                    .attr("transform", "translate(0," + 0 + ")")
                    // .text('Y Axis Label')
                    .attr("data-yaxis", 'y')
                    .call(d3.axisLeft(y))
                

                // Add the area
                svg.append("path")
                .datum(data)
                .attr("fill", "#cce5df")
                .attr("stroke", "#69b3a2")
                .attr("stroke-width", 1.5)
                .attr("d", d3.area()
                    .x(function(d) { return x(d.data) })
                    .y0(y(0))
                    .y1(function(d) { return y(d.value) })
                )

                //ylabel 
                svg.append('text')
                    .attr("class", "y label")
                    .attr("text-anchor", "end")
                    .attr("y", -35)
                    .attr("x", -185)
                    .attr("dy", "0.0em")
                    .attr("transform", "rotate(-90)")
                    .style("font-size", "12px")
                    .text("Magnitude")

                svg.append("text")
                    .attr("class", "x label")
                    .attr("text-anchor", "end")
                    .attr("x", rect.width/2)
                    .attr("y", rect.height-215)
                    .attr("transform", "translate(0," + 30 + ")")
                    .style("font-size", "12px")
                    .text("Frequency");

                
                this_.state.channels_svg[index].xaxis = x;
                
                this_.state.channels_svg[index].yaxis = y;

                this_.state.channels_svg[index].svg = svg;

            }
        )
        
        this_.setState({channels_svg: this.state.channels_svg});
        
    }

    channelButtonHandle(event){

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
                    console.log(svgRecord.svg , 'svg')
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
        
        console.log('finsiehd swapping', c)
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
                this.setState({ channelModalSetup: true , cc2:  c.map( (x) => x.getAttribute('data-channel') ), numChannelsAlpha: ''  }   ); 
            }

            else if (c.length == 3) {

                // if ( c[0].getBoundingClientRect().height * c[0].getBoundingClientRect().width > c[2].getBoundingClientRect().height * c[2].getBoundingClientRect().width) {
                if (element.getAttribute('data-split2') == '1')   {
                    this.state.dataSplit = "50_25_25"; 
                    this.state.numChannelsAlpha = 'b'
                }
                
                else if (element.getAttribute('data-split2') == '0')   {
                    this.state.dataSplit = "25_25_50";
                    this.state.numChannelsAlpha = ''
                }
                
                this.setState({ channelModalSetup: true , cc2:  c.map( (x) => x.getAttribute('data-channel') )  ,  dataSplit: this.state.dataSplit , numChannelsAlpha: this.state.numChannelsAlpha }   );  

            }

            else if(c.length == 4)  {

                this.state.dataSplit = "25_25_25_25";
                this.setState({ channelModalSetup: true , cc2:  c.map( (x) => x.getAttribute('data-channel') )  ,  dataSplit: this.state.dataSplit , numChannelsAlpha: '' }   );  

            }
        }
    }

    channelFormatOff(event) { 
        // exits/closes "swap mode "

        this.setState({channelModalSetup: null});
        if (this.state.swapblockLevel1.interface) {
            if (this.state.swapblockLevel1.interface.funckill) {
                this.state.swapblockLevel1.interface.funckill(null); // level 1 calls level 2 command  ( exits swap mode)
            }
        }

        console.log('closing system');
    }

    plotCsv(id) {

        let someElement = d3.select('path');
        let pathElement = someElement._groups[0][0];
        let paths = Array.from(document.getElementsByTagName('path'))
        const this_= this;
        
        Promise.resolve()
        .then( () => {
            while (paths.length > 2) {
                let currentPath = paths.pop();
                currentPath.remove(); 
            }
        })

        .finally( () => {

            d3.csv(this.state.csvs[this.state.index],

                function(d){
                    return { data : d.data, value : d.value }
                },

                function(data) {
                    
                    // Add the area
                    // Promise.resolve( this_.state.channels_svg[id].enabled) 
                    // .then( () => {

                        // this_.state.channels_svg[id].svg.remove();

                        var x = this_.state.channels_svg[0].xaxis; 
                        var y = this_.state.channels_svg[0].yaxis; 
                        var svg = this_.state.channels_svg[id].svg;
                        svg.append("path")
                        .datum(data)
                        .attr("fill", "#cce5df")
                        .attr("stroke", "#69b3a2")
                        .attr("stroke-width", 1.5)
                        .attr("d", d3.area()
                                    .x(function(d) { return x(d.data) })
                                    .y0(y(0))
                                    .y1(function(d) { return y(d.value) }))
                    // });
                }
            )

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

            this.getSvg(id);

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

            this.setState({  width_0:  this.state.width_0 , height_0:  this.state.height_0 }) ;
                
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
            
            ids.forEach( (removedID, index) => { this.getSvg(removedID, 2)}) // regenerate the following channels (i.e. IDs)
            
            clist = Array.from(parentContainer.children);

            parentContainer.innerHTML = ""; 

            for ( let i= 1; i > -1; i--) {
                let consumerNode = clist[i]
                consumerNode.appendChild(clist.pop()) 
                parentContainer.appendChild(   consumerNode  )
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
                

            this.setState({  width_0:  this.state.width_0 , height_0:  this.state.height_0 , width_1:  this.state.width_1 , height_1:  this.state.height_1}) ;

        }


        else if (parentContainer.children.length == 3) {

            let svgNodeParent, svgNode ;
            let clist;
            let node; 
            let svgNodes = [null, null, null];
            let ids = [-1, -1, -1]; 
            
            // clear and add svg componenet ( i.e. fresh display)

            svgNodes = svgNodes.map ( (_, index) =>   parentContainer.children[index].firstElementChild  ) 

            ids = ids.map( (_, index) => parseInt(svgNodes[index].getAttribute('data-name') )); 
            
            svgNodes.forEach(deadNode => {deadNode.remove(); });
            
            ids.forEach( (removedID, index) => { this.getSvg(removedID, 3)}) // regenerate the following channels (i.e. IDs)
            
            clist = Array.from(parentContainer.children);

            parentContainer.innerHTML = ""; 

            for ( let i= 2; i > -1; i--) {
                let consumerNode = clist[i]
                let svgNode = clist.pop()
                consumerNode.appendChild(svgNode);
                parentContainer.appendChild( consumerNode  );
            }


            clist = Array.from(parentContainer.children);
            
            console.log('data split', this.state.dataSplit )

            // if ( this.state.dataSplit == "50_25_25" ) {
            if (this.state.numChannelsAlpha == 'b' ) {

                node = clist[0];
                this.state.width_0 =  "100%";
                this.state.height_0 =  "100%";
                node.style.width = `${this.state.width_0}`;
                node.style.height = `${this.state.height_0}`;
                console.log('node', node)

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
            
            else if (this.state.numChannelsAlpha == '' ) {
            
            // else if ( this.state.dataSplit == "25_25_50") {

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
            
            console.log('node----it', node)

            this.setState({  width_0:  this.state.width_0 , height_0:  this.state.height_0 , width_1:  this.state.width_1 , height_1:  this.state.height_1, width_2:  this.state.width_2 , height_2:  this.state.height_2}) ;
            
        } 

        else if (parentContainer.children.length == 4) {


            let svgNodeParent, svgNode ;
            let clist;
            let node; 
            let svgNodes = [null, null, null, null];
            let ids = [-1, -1, -1, -1]; 
            
            // clear and add svg componenet ( i.e. fresh display)

            svgNodes = svgNodes.map ( (_, index) =>   parentContainer.children[index].firstElementChild  ) ;

            ids = ids.map( (_, index) => parseInt(svgNodes[index].getAttribute('data-name') )); 
            
            svgNodes.forEach(deadNode => {deadNode.remove(); });
            
            ids.forEach( (removedID, index) => { this.getSvg(removedID, 3)}) // regenerate the following channels (i.e. IDs)
            
            clist = Array.from(parentContainer.children);

            parentContainer.innerHTML = ""; 

            for ( let i= 3; i > -1; i--) {
                let consumerNode = clist[i]
                let svgNode = clist.pop()
                consumerNode.appendChild(svgNode);
                parentContainer.appendChild( consumerNode  );
            }

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

            node = parentContainer.children[2];
            this.state.width_2 =  "100%";
            this.state.height_2 =  "100%";
            node.style.width = `${this.state.width_2}`;
            node.style.height = `${this.state.height_2}`;

            node = parentContainer.children[3];
            this.state.width_3 =  "100%";
            this.state.height_3 =  "100%";
            node.style.width = `${this.state.width_3}`;
            node.style.height = `${this.state.height_3}`;

            this.setState({  width_0:  this.state.width_0 , height_0:  this.state.height_0 , width_1:  this.state.width_1 , height_1:  this.state.height_1, width_2:  this.state.width_2 , height_2:  this.state.height_2, width_3:  this.state.width_3 , height_3:  this.state.height_3}) ;

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

                            <div> <p> CATS </p> </div>

                        </div>

                    </div>


                    {/* screen  */}

                    <div  className={cl.screenGraphContainer}>
                        <div id={"my_dataviz"}  data-width_0={this.state.width_0} data-width_1={this.state.width_1}  data-height_0={this.state.height_0} data-height_1={this.state.height} data-power={this.state.dsp + ''} data-count={this.state.numChannels + this.state.numChannelsAlpha + ''} className={` ${cl.vizContainer}  ${cl.powerOff}   `}></div>
                    </div>

                      {/* screen  */}

                    <div  className={cl.screenBase}>
                        a
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
                        <div className={cl.screen_options_ele}> <p>INFO</p>  </div>
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
    
    clicked(event) {
        console.log('inner')
    }

    outerClicked(event) {
        console.log('inner')

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
                        <div  data-split2="0" data-split={this.props.dataSplit} className={cl.before_channelFormatSandbox}>  
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
            dataSplit2: null 
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
                
                if (this.state.dataSplit2) {
                    this.state.dataSplit2.element.setAttribute('data-split2', this.state.dataSplit2.id)
                }

                if (this.state.fromIndex == -1 && this.state.toIndex == -1 ) {
                    let childrenofgui = Array.from(parentgui.children);
                    console.log( 'ORDER', this.state.indexOrder)
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

                this.setState({confirmSwap: 0, dataSplit2: null });

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
                                this.setState({confirmSwap: 1, fromIndex: -1, toIndex: -1 , indexOrder: [ 2, 0, 1] , dataSplit2: {id:1, element: element}  } );
                            }

                            else {
                                paras[0].setAttribute('data-swap', 'no');
                                paras[1].setAttribute('data-swap', 'no');
                                paras[2].setAttribute('data-swap', 'no');
                                this.setState({confirmSwap: 0, dataSplit2: null } );

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
                                paras[2].setAttribute('data-swap', 'no');
                                paras[0].setAttribute('data-swap', 'no');
                                this.setState({confirmSwap: 1, fromIndex: 0, toIndex: 1});
                            }

                            else if ( (event.target.getBoundingClientRect().bottom  > paras[1].getBoundingClientRect().bottom - paras[1].getBoundingClientRect().height/2  )   && (event.target.getBoundingClientRect().left >= paras[1].getBoundingClientRect().left - 10)  && (event.target.getBoundingClientRect().right <= paras[2].getBoundingClientRect().right + 10) ) {
                                let element = document.getElementsByClassName(cl.before_channelFormatSandbox)[0];
                                paras[1].setAttribute('data-swap', 'yes');
                                paras[2].setAttribute('data-swap', 'yes');
                                this.setState({confirmSwap: 1, fromIndex: -1, toIndex: -1 , indexOrder: [ 1, 2, 0] , dataSplit2: {id:0, element: element} } );
                            }
                            
                            else {

                                paras[2].setAttribute('data-swap', 'no');
                                paras[1].setAttribute('data-swap', 'no');
                                paras[0].setAttribute('data-swap', 'no');
                                this.setState({confirmSwap: 0, dataSplit2: null } );

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
                                this.setState({confirmSwap: 0, dataSplit2: null } );

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
                                this.setState({confirmSwap: 0, dataSplit2: null } );

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

