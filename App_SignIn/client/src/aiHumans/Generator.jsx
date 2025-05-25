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
                {enabled: false, svg: null, svgbuffer: null, svghtml: null}, 
                {enabled: false, svg: null,  svgbuffer: null, svghtml: null}, 
                {enabled: false, svg: null,  svgbuffer: null, svghtml: null}, 
                {enabled: false, svg: null,  svgbuffer: null, svghtml: null} 
            ],
            
            numChannels: 0,
            timeoutID: false
        }
        this.panelClick = this.panelClick.bind(this);
        this.dspClick = this.dspClick.bind(this);
        this.channelButtonHandle = this.channelButtonHandle.bind(this);
        this.wrapperDivMouseDown = this.wrapperDivMouseDown.bind(this);
        this.wrapperDivMouseUp = this.wrapperDivMouseUp.bind(this);
    }
    
    componentDidMount() {
        addScript('https://d3js.org/d3.v4.js');
    }

    panelClick(event) {
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
    }

    channelButtonHandle(event){

        let name = event.currentTarget.getAttribute('name');
        
        let index = Number(name);

        this.state.channels_svg[index].enabled = !this.state.channels_svg[index].enabled;

        // number of buttons enabled after change
        let count = +this.state.channels_svg[0].enabled + +this.state.channels_svg[1].enabled + +this.state.channels_svg[2].enabled + +this.state.channels_svg[3].enabled ;

        let container = document.getElementById('my_dataviz');
        let new_node  = null; 
        let c;

        // decrease in number of channels disabled
        if (count < this.state.numChannels) {

            console.log(container.children);

            // save previous svg
            this.state.channels_svg[index].svghtml = container.children[index];

            // htmlcollection to array (remove child on interest)
            c = Array.from(container.children);
            
            // search for index (using array to shrink html collection)
            for(let i =0; i < c.length; i++) {

                if ( parseInt(c[i].getAttribute('data-name') )  == index) {
                    c = c.slice(0, i).concat(c.slice(i + 1));
                    container.innerHTML = "";
                    c.forEach((e)=>{
                        container.appendChild(e);
                    });
                    console.log('container - lowered', container)
                    break;
                }
            }
        }   
        
        // increase in number of channels enabled
        
        else {
            
            // pluck svg block stored in memory 
            if (this.state.channels_svg[index].svghtml) {
                 
                let arr;
                let indexNextTo = null;
                c = Array.from(container.children);

                new_node = this.state.channels_svg[index].svghtml;

                for (let i = 0; i < c.length; i++ ) {
                    if (parseInt(c[i].getAttribute('data-name')) > index) {
                        indexNextTo = i;
                        break;
                    }
                }

                arr = indexNextTo != null ?  arr = c.slice(0, indexNextTo).concat(new_node).concat(c.slice(indexNextTo)) : arr = c.slice(0, c.length).concat([new_node]);
                container.innerHTML =  "";
                arr.forEach((e) => {container.appendChild(e);});

            }

            // new svg block
            else {
                
                this.state.channels_svg[index].svg = getSvg(this, index, count);
                
                let sgv_ele = container.children[container.children.length-1];

                let div;grid

                container = document.getElementById('my_dataviz');

                div = getWrapperDiv();
                div.appendChild(sgv_ele);
                new_node = div;
                this.state.channels_svg[index].svghtml = new_node;

                container.appendChild(new_node);

            }

        }

        updateGrid(count);

        this.setState({numChannels: count, channels_svg: this.state.channels_svg});

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
            
            // load svg
            this.state.channels_svg[0].svg = getSvg(this, 0,1 );
            
            let movevableSVGElement = container.children[0];
            let div = getWrapperDiv();
            div.appendChild(movevableSVGElement); // moves svg into div
            container.appendChild(div); // append div to container 
            
            updateGrid(1);
            
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
                    svgRecord.svghtml = null;
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

            // clearInterval(this.state.intervalID);

            // if  (this.state.svg)
                // this.state.svg.remove() 
                // d3.selectAll('svg').remove()

            // this.setState({dsp: null, intervalID: null, svg: null});
            
        }

    }


    wrapperDivMouseDown () {
        // timeout
        var intervalID=setInterval( ()=>{
            console.log('hello world');
        }, 5000)
        this.setState({timeoutID: intervalID});
        console.log('hello');
    }

    wrapperDivMouseUp () {
        console.log(this.timeoutID)
        clearInterval(this.timeoutID);
        console.log('released');
        // this.setState({timeoutID: intervalID});

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
                        <div id={"my_dataviz"} data-power={this.state.dsp + ''} data-count={this.state.numChannels + ''} className={` ${cl.vizContainer}  ${cl.powerOff}   `}></div>
                    </div>

                      {/* screen  */}

                    <div  className={cl.screenBase}>
                        a
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
                        <div className={cl.screen_options_ele}> <img src={grid}/> </div>
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

const addScript = (src) => {
    let some_script_ele = document.createElement('script');
    some_script_ele.setAttribute('src', src );
    document.head.appendChild(some_script_ele);
};

const getSvg = (this_, index, count)=> {
// console.log('new svg')

    const margin = {
        left: 15,
        right: 15, 
        top: 10, 
        bottom:30
    }

    let ele = document.getElementsByClassName(cl.screenGraphContainer)[0];

    let rect = ele.getBoundingClientRect(); 

    var svg =  d3.select("#my_dataviz")
                    .append("svg")
                    .attr("width", '100%')
                    .attr("height", '100%' )
                    .attr("style", "outline: thin solid red;")   
                    .attr("data-name", index)
                    .attr("data-channel", 'CH' + index)
                    .attr("data-count", count)
                    // .attr("class", cl.channelName)
                    .append("g")
                    .attr("transform", "translate(" + (margin.left + margin.right) * 2 + ',' + (margin.top + 40 ) + ")")  // margin left abd nargin bottom

    d3.csv(this_.state.csvs[this_.state.index],

        function(d){
            return { data : d.data, value : d.value }
        },

        function(data) {
            
            var x = d3.scaleLinear()
            .domain(d3.extent(data, function(d) { return d.data; }))
            .range([ 0, rect.width - 30 ]);
            svg.append("g")
            .attr("transform", "translate(0," + (rect.height-210)  + ")")
            .call(d3.axisBottom(x));

            // Add Y axis
            var y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return d.value; })])
            .range([ rect.height - 220, 0 ]);
            svg.append("g")
            .attr("transform", "translate(0," + 0 + ")")
            .text('Y Axis Label')
            .call(d3.axisLeft(y));

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

            // let someElement = d3.select('path');
            // let pathElement = someElement._groups[0][0];
            // this_.setState({x: x, y: y})
        }
    )

    return svg;
};


const getWrapperDiv = () => {
    let container = document.getElementById('my_dataviz');
    let div = document.createElement('div');
    div.classList.add(cl.svg_wrapper);
    div.setAttribute('data-name', container.children[container.children.length-1].getAttribute('data-name'));
    div.setAttribute('data-count', container.children[container.children.length-1].getAttribute('data-count'));
    div.setAttribute('data-channel', container.children[container.children.length-1].getAttribute('data-channel'));
    div.addEventListener("mouseup",  wrapperDivMouseUp);
    div.addEventListener("mousedown", wrapperDivMouseDown);
    div.addEventListener('mousemove', wrapperDivMove);
    return div;
    // div.appendChild(movevableSVGElement); // moves svg into div
};

const updateGrid = (count) => {
    let divs = document.getElementsByClassName(cl.svg_wrapper);
    Array.from(divs).forEach( (currentDiv) => {
        // console.log(currentDiv);
    });
}



var intervalID;
var div;
var offsetX, offsetY;
const wrapperDivMove = (event) => {
    // div.style.left  = `${event.clientX - offsetX}px` ;
    // div.style.top  = `${event.clientY - offsetY}px` ;
        console.log(offsetX,)
        div.style.left =  `${event.clientX - offsetX}px` ;
        div.style.top = `${0}px`;

    // div.clientX = event.clientX;
};

const wrapperDivMouseDown =  (event) => {
    intervalID = setTimeout( (event)=>{
        // shake div 
        console.log(event.target.parentNode);
        event.target.parentNode.classList.add(cl.svg_wrapper_shake);

        let x = event.target.clientX ;
        let y = event.target.clientY;

        div = event.target.parentNode;
         offsetX = event.clientX - div.offsetLeft;
         offsetY = event.clientY - div.offsetTop;
        

    }, 2000,event);
};

const wrapperDivMouseUp =  (event) => {
    clearInterval(intervalID);
    console.log('released');
    event.target.parentNode.classList.remove(cl.svg_wrapper_shake);
};
