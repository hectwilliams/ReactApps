import React, {Component} from 'react';
import cl from './Generator.css';

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

        }
        this.panelClick = this.panelClick.bind(this);
        this.dspClick = this.dspClick.bind(this);
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

    dspClick(event) {

        let ele = document.getElementsByClassName(cl.screenGraphContainer)[0];

        var rect = ele.getBoundingClientRect(); 

        const margin = {
            left: 15,
            right: 15, 
            top: 10, 
            bottom:30
        }
        
        if  (this.state.svg)
            // this.state.svg.remove() 
            d3.selectAll('svg').remove()


        var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", rect.width - (margin.left + margin.right))
        .attr("height", rect.height + (margin.top) )
        .append("g")
        .attr("transform", "translate(" + (margin.left + margin.right) * 2 + ',' + margin.top/2 + ")")

        d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",


             // When reading the csv, I must format variables:
                function(d){
                    return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
                },

                // Now I can use this dataset:
                function(data) {

                    // Add X axis --> it is a date format
                    var x = d3.scaleTime()
                    .domain(d3.extent(data, function(d) { return d.date; }))
                    .range([ 0, rect.width - 30 ]);
                    svg.append("g")
                    .attr("transform", "translate(0," + (rect.height-margin.bottom)  + ")")
                    .call(d3.axisBottom(x));

                    // Add Y axis
                    var y = d3.scaleLinear()
                    .domain([0, d3.max(data, function(d) { return +d.value; })])
                    .range([ rect.height - 30, 0 ]);
                    svg.append("g")
                    .call(d3.axisLeft(y));

                    // Add the area
                    svg.append("path")
                    .datum(data)
                    .attr("fill", "#cce5df")
                    .attr("stroke", "#69b3a2")
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.area()
                        .x(function(d) { return x(d.date) })
                        .y0(y(0))
                        .y1(function(d) { return y(d.value) })
                        )
                }
            )
            
            this.setState({captured: true, svg: svg})
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
                        <div id={"my_dataviz"}  className={cl.vizContainer}></div>
                    </div>

                </div>


                {/* front panel buttons */}

                <div className={cl.screen_options}>
                    
                    <div className={cl.screen_options_ele_container}>
                        <div className={cl.screen_options_ele}> <p>CH</p> </div>
                    </div>
                    
                    <div className={cl.screen_options_ele_container}>
                        <div className={cl.screen_options_ele}> <p>INFO</p>  </div>
                    </div>

                </div>



                {/* extra helper panel */}

                <div className={`${cl.dynamic_container}  `}>

                        <div className={cl.dynamic_container_grid_container}>

                            
                                <div   className={`  ${cl.dynamic_container_left} `}>
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