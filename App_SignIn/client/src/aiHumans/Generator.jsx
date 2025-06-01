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

            guiDiv : null

        }
        this.panelClick = this.panelClick.bind(this);
        this.dspClick = this.dspClick.bind(this);
        this.channelButtonHandle = this.channelButtonHandle.bind(this);
        this.wrapperDivMouseDown = this.wrapperDivMouseDown.bind(this);
        this.wrapperDivMouseUp = this.wrapperDivMouseUp.bind(this);
        this.channelFormat = this.channelFormat.bind(this);
        this.channelFormatOff = this.channelFormatOff.bind(this);
        this.swapped = this.swapped.bind(this);

        
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
        let parentSwapContainer = Array.from(document.getElementsByClassName(cl.para));
        let arr;
        let indexNextTo = null;

        // decrease in number of channels disabled
        if (count < this.state.numChannels) {

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
            
            // remove style from 'Swap Mode' cells
            if (parentSwapContainer.length) { 
                parentSwapContainer = parentSwapContainer[0].parentNode;
                c = Array.from(parentSwapContainer.children)
                c.forEach(element => { 
                    element.removeAttribute('style')
                });
                
            }

        }   
        
        // increase in number of channels enabled
        
        else {
            

            // pluck svg block stored in memory 
            if (this.state.channels_svg[index].svghtml) {
                 
                c = Array.from(container.children);

                new_node = this.state.channels_svg[index].svghtml;

                for (let i = 0; i < c.length; i++ ) {
                    if (parseInt(c[i].getAttribute('data-name')) > index) {
                        indexNextTo = i;
                        break;
                    }
                }

                if (arr = indexNextTo != null ) {
                    arr = c.slice(0, indexNextTo).concat([new_node]).concat(c.slice(indexNextTo)) 
                    console.log(arr)
                }
                else  {
                    arr = c.slice(0, c.length).concat([new_node]);
                } 

                container.innerHTML =  "";
                arr.forEach((e) => {container.appendChild(e);});

            }

            // new svg block
            else {
                
                this.state.channels_svg[index].svg = getSvg(this, index, count);
                
                let sgv_ele = container.children[container.children.length-1];

                new_node = getWrapperDiv();
                new_node.appendChild(sgv_ele);
                this.state.channels_svg[index].svghtml = new_node;
                document.getElementById('my_dataviz').appendChild(new_node);

            }

        }

        
        this.setState({numChannels: count, channels_svg: this.state.channels_svg, guiDiv: container});


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
            
            // load svg
            this.state.channels_svg[0].svg = getSvg(this, 0,1 );
            
            let movevableSVGElement = container.children[0];
            let div = getWrapperDiv();
            div.appendChild(movevableSVGElement); // moves svg into div
            container.appendChild(div); // append div to container 
            
            
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

    swapped() {
    
        /*
            After swapping cells during swap mode, update attributes 
        */

        let ele = document.getElementById('my_dataviz');
        let c = Array.from(ele.children);
        this.setState({cc2: c.map( (x) => x.getAttribute('data-channel') )   })
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
                this.setState({ channelModalSetup: true , cc2:  c.map( (x) => x.getAttribute('data-channel') ) }   ); 
            }

            else if (c.length == 3) {


                // 
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
                element.setAttribute('data-split', "25_25_25_25");
                this.setState({ channelModalSetup: true , cc2:  c.map( (x) => x.getAttribute('data-channel') )  ,  dataSplit: this.state.dataSplit}   ); 

                // this.setState({channelModalSetup: true, channelNames: [ c[0].getAttribute('data-channel'),c[1].getAttribute('data-channel'), c[2].getAttribute('data-channel'), c[3].getAttribute('data-channel')] });

            }


         
            
        }
    }

    channelFormatOff(event) { 

        let ele = document.getElementById('my_dataviz');
        let c = Array.from(ele.children);
        this.setState({channelModalSetup: null});
        
        // if (this.state.swapblockLevel1) 
        {
            // console.log(this.state.swapblock);
            // this.state.swapblock.data.func(this.state.swapblock.data.event);
            if (this.state.swapblockLevel1.interface) {
                if (this.state.swapblockLevel1.interface.funckill) {
                    this.state.swapblockLevel1.interface.funckill(null);
                }

            }
        }

        console.log('closing system');

    }
    // event.target.classList.remove(cl.channel_reorg); 

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
                        <div id={"my_dataviz"} data-power={this.state.dsp + ''} data-count={this.state.numChannels + this.state.numChannelsAlpha + ''} className={` ${cl.vizContainer}  ${cl.powerOff}   `}></div>
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
            indexOrder : []
            // indices: []
        }
        this.clicked = this.clicked.bind(this);
        this.moved = this.moved.bind(this);
        this.resetCell = this.resetCell.bind(this);
        this.fkill = this.fkill.bind(this);
        this.resizeCells = this.resizeCells.bind(this);
    }

    componentDidMount() {
        
    }

    resizeCells () {    
        console.log('hello world')
    }

    resetCell (event) {
        const box = event.target.getBoundingClientRect();
        event.target.classList.remove(cl.moveme);
        Array.from(event.target.parentNode.children).forEach( (p) => {
            p.classList.remove(cl.err);
        });
        this.setState({draggable: false, session: false});
        event.target.parentNode.style.width = this.state.parentWidth;
        event.target.parentNode.style.height = this.state.parentHeight;
        event.target.style.width =   this.state.box.width + 'px';
        event.target.style.height =  this.state.box.height+ 'px'  ;
        event.target.style.border =  this.state.border ;
        event.target.style.margin =  this.state.margin + 'px' ;  
        event.target.style.top =     this.state.top + 'px';        //  this.state.width ;
        event.target.style.left =    this.state.left + 'px';       // this.state.left ;
        event.target.style.right =   this.state.right + 'px';      //  this.state.right;
        event.target.style.bottom =  this.state.bottom + 'px';     // this.state.bottom;
        event.target.style.padding = 0;
        event.target.style.margin = 0;
    }

    fkill (event) {
        let paras = document.getElementsByClassName(cl.para);
        let parentNode; 
        this.setState({draggable: false, session: false});
        if (paras.length) {
            // paras = Array.from(paras);
            // parentNode = paras[0].parentNode;
            // Array.from(paras) .forEach( (p, index)=> {
            //     p.style.width = `${this.state.width}px`;
            //     p.style.height = `${this.state.height}px`;
            //     console.log('para, p', p)
            // });
        }
    }

    
    clicked (event) {
        
        let parent = document.getElementsByClassName(cl.para)[0] .parentNode
        
        if (!this.state.draggable) {
            //  Detach  cell 
            
            // console.log('clicked');
            const box = event.target.getBoundingClientRect();
            const parentbox = event.target.parentNode.getBoundingClientRect();
            const children = Array.from(event.target.parentNode.children);

            console.log(children);

            if ( !this.state.session ) {
                
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
                    
                if (children.length == 2) {
                
                }

                // console.log(this.props.dataSplit)
                    
                //     event.target.style.top = `${box.top}px` ;
                //     event.target.style.left = `${box.left}px` ;
                //     event.target.style.right = `${box.right}px`;
                //     event.target.style.bottom = `${box.bottom}px`;
                //     event.target.style.width =  `${box.width}px`;
                //     event.target.style.height =`${box.height}px`;
                //     event.target.style.y =`${box.y}px`;
                //     event.target.style.offsetLeft =`${0}px`;
                //     event.target.style.padding = 0;
                //     event.target.style.margin = 0;
                    
                    // else if (children.length == 3) {
                    // }

                // console.log(box)
                // console.log('offsetleft', event.target.offsetLeft)
                // console.log('offsettop', event.target.offsetTop)
                // console.log(event.clientX, event.clientY)
            
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

            } else {

                // event.target.style.width =   this.state.width + 'px';
                // event.target.style.height =  this.state.height + 'px' ;
                // event.target.style.border =  this.state.border ;
                // event.target.style.margin =  this.state.margin + 'px' ;  
                // event.target.style.top =     this.state.top + 'px';        //  this.state.width ;
                // event.target.style.left =    this.state.left + 'px';       // this.state.left ;
                // event.target.style.right =   this.state.right + 'px';      //  this.state.right;
                // event.target.style.bottom =  this.state.bottom + 'px';     // this.state.bottom;
                // event.target.style.padding = 0;
                // event.target.style.margin = 0;
                // event.target.parentNode.style.width = this.state.parentWidth;
                // event.target.parentNode.style.height = this.state.parentHeight;
            }
                
            if (event.target == event.target.parentNode.children[0] ) {
                this.props.swapblockLevel2.activeIndex = 0;
            } else {
                this.props.swapblockLevel2.activeIndex = 1;
            }

            // note: this.props.swapblockLevel2 equals this.props.swapblockLevel1.interface 
            this.props.swapblockLevel2.activeElement = event.target;
            this.props.swapblockLevel2.event = event;
            this.props.swapblockLevel2.func = this.resetCell;
            this.props.swapblockLevel2.funckill = this.fkill;
            this.props.swapblockLevel2.resizeCells = this.resizeCells;


        }

        else {
            //  Sntaches  cell  back to container 

            if (this.state.confirmSwap) {

                let temp = document.createComment('');
                let parent = document.getElementsByClassName(cl.before_channelFormatSandbox)[0];
                let children = Array.from(parent.children);
                let parentgui = document.getElementById('my_dataviz');


                if (this.state.fromIndex == -1 && this.state.toIndex == -1 ) {
                    let childrenofgui = Array.from(parentgui.children);
                    let divsReordered = this.state.indexOrder.map( idx => childrenofgui[idx])  ;
                    
                    // reorder  gui modify
                    parentgui.innerHTML = "";
                    divsReordered.forEach( (div) => {
                        parentgui.appendChild(div);
                    });   
                    this.props.channelFormat(); 
                    
                    // gui modify
                    console.log(parentgui)
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
                this.setState({confirmSwap: 0 });

            } else {
                console.log('nothing ')
            }
            // this.resetCell(event); 
        }

        let box = event.target.getBoundingClientRect();
        const parentbox = event.target.parentNode.getBoundingClientRect();

        if (box.right > parentbox.right + 100    ||  box.left  < parentbox.left - 100 ||  box.top  < parentbox.top - 100  ||  box.bottom  > parentbox.bottom + 100  ) {
            event.target.classList.add(cl.err);
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
                    // console.log('basic');
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
                            // console.log('swap to bottom')
                            // event.target.classList.add(cl.swappable)
                            paras[1].setAttribute('data-swap', 'yes')
                            this.setState({confirmSwap: 1, fromIndex: 0, toIndex: 1})
                        } 
                        
                        else {

                            paras[1].setAttribute('data-swap', 'no');

                        }

                    }

                    else if (event.target == paras[1]) {
                        if ( event.target.getBoundingClientRect().top < (paras[0].getBoundingClientRect().bottom -  paras[0].getBoundingClientRect().height/2) ) {
                            // console.log('swap to top')
                            paras[0].setAttribute('data-swap', 'yes')
                            // console.log(event.target.parentNode)
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

                            if ( (event.target.getBoundingClientRect().top < paras[0].getBoundingClientRect().bottom - paras[0].getBoundingClientRect().height/2  ) && ( event.target.getBoundingClientRect().right < paras[0].getBoundingClientRect().right -paras[0].getBoundingClientRect().width/2  )) {
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
                                element.setAttribute('data-split2', '1')
                                this.setState({confirmSwap: 1, fromIndex: -1, toIndex: -1 , indexOrder: [ 2, 0, 1]   } );
                            }

                            else {
                                paras[0].setAttribute('data-swap', 'no');
                                paras[1].setAttribute('data-swap', 'no');
                                paras[2].setAttribute('data-swap', 'no');


                            }
                            
                        }

                    }

                    else if (this.props.dataSplit == "50_25_25" ) { 


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

const getSvg = (this_, index, count)=> {

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
                    .attr("data-count", count )
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
    return div;
};

const updateGrid = (count) => {

    /* resize swap mode cells if nedded  */
    // let divs = document.getElementsByClassName(cl.svg_wrapper);
    
  
    // Array.from(divs).forEach( (currentDiv) => {
    //     console.log(currentDiv);
    // });
}



// var intervalID;
// var div;
// var offsetX, offsetY;
// var status = {bool: false};
// var box; 
// var prev;
// const MouseMove = (event) => {
//   event.preventDefault()

//     // if ( (event.clientX < box.left+5 || event.clientX > box.right -8 )  ||  (  event.clientY > (box.bottom - 5)  ||  event.clientY < (box.top +  8)   )  ) {
//     //     event.target.classList.remove(cl.moveme);
//     //     let c = document.getElementsByTagName("canvas");
//     //     if (Array.from(c).length) {
//     //         let canvas = c[0];
//     //         let parent = canvas.parentNode;

//     //         // remove event listener 
            
//     //     }
//     //     clearInterval(intervalID);

//     // }


//         if (status.bool) {
// // 
//             // console.log(event.target.parentNode);

//             // console.log(event.target.parentNode.getBoundingClientRect())
//             // console.log('parent',parentBox,'parent')
//             // console.log(e[0].getBoundingClientRect())
//             // console.log(e[1].getBoundingClientRect())
//             // console.log('end')
            
//             let childBox = event.target.getBoundingClientRect();
//             console.log(childBox.top, childBox1.bottom)
//             // console.log('pare', parentBox)
//             // console.log('child', childBox)

//             event.target.style.top = `${event.clientY - offsetY }px`;
//             event.target.style.left =  `${event.clientX - offsetX }px` ;

//             // if (event.target.style.left == prev[0] && event.target.style.left == prev[1]  ) {
//             //     prev = [event.target.style.top, event.target.style.left  ]
//             // }

//             if (childNodes.length == 2) {
                
//                 if (active == 0) {
//                     console.log('1')
//                     if (childBox.top  <  parentBox.left) {
                        
//                         // console.log('error')
//                     }
//                 }

                   
//                 else if (active == 1) {
//                     if (childBox.top  <  childBox1.bottom  - 10) {
                            
//                         console.log('swap me')

//                         console.log(parent)
//                         parent.insertBefore( childNodes[0], childNodes[1] );
//                         console.log(parent)
                        
                        
//                         // console.log('error')
//                     }
//                 }

//             }
//         // }
            
//         //     event.target.classList.add(cl.errorBarrier);


//         //     // console.log(event.target.parentNode, event.clientX, event.clientY );
//         //     // console.log(event.target.parentNode.getBoundingClientRect());
//         //     // console.log(event.target.getBoundingClientRect());
            
//         // } else {
//         //     event.target.classList.remove(cl.errorBarrier);
//         // }




//         }




//         // if (childNodes.length == 2) {
            

//         //     if (childNodes[0] == event.target) {
                
//         //     } else if (childNodes[1] == event.target) {
//         //         console.log('hello')
//         //     }


//         //     if (event.target) {

                


//         //     }
            
//         // }

//         // setTimeout( ()=> {
//         // }, 100)
//     //     // console.log('Moving x,y', event.clientX ,event.clientY, offsetX, offsetY);        
   
        
//     //     // console.log(event.target);
//     //     // console.log(event.target.getBoundingClientRect(), stateY)
//     //     // console.log(event.clientY, event.target.getBoundingClientRect());

//     //     // if ( event.clientY > stateY ) {
//     //     //     // swap
//     //     //     console.log('swap')
//     //     // }
//     //     console.log(typeof  box.right)
//     //     console.log(typeof  event.clientX )

//     //         // console.log(box.left , box.right, event.clientX);
            
//     //         // if (event.clientX <= box.left || event.clientX >= box.right) {
//     //         //         console.log('rigged')
//     //         //         console.log('released', intervalID);
                
//     //         //         offsetX = 0;
//     //         //         offsetY = 0;
//     //         //         status.bool = false;
                    
//     //         //         let c = document.getElementsByTagName("canvas");
//     //         //         if (Array.from(c).length) {
//     //         //             let canvas = c[0];
                        
//     //         //             let parent = canvas.parentNode;
//     //         //             parent.removeChild(canvas);
//     //         //         }
//     //         //         clearInterval(intervalID);
//     //         //             // event.target.classList.remove(cl.svg_wrapper_shake);
//     //         //         event.target.classList.remove(cl.moveme);

//     //         // }


//     //     // offsetY = event.clientY + offsetY;

//     //     // console.log('x', hor_factor * event.clientX);
//     //     // event.target.style.left = `${hor_factor * event.clientX}px`;
        
//     //     // event.target.style.top = `${vert_factor* event.clientY}px`;
//     //     // console.log( 'y', vert_factor* event.clientY);
        
//     //     // div.style.left  = `${event.clientX - offsetX}px` ;
//     //     // div.style.top  = `${event.clientY - offsetY}px` ;
//     //     // div.clientX = event.clientX;

//     //     // hor_factor 
        
//     //     // vert_factor
//     // }

// };

// var hor_factor;
// var vert_factor;
// var state = null; 
// var stateX, stateY;
// var count; 
// var box; 

// const MouseDown =  (event) => {
//   event.preventDefault()


//   if (status.bool) {
//     // clearInterval(intervalID);
//     console.log('released', intervalID);
//     // event.target.classList.remove(cl.svg_wrapper_shake);
//         // event.target.classList.remove(cl.moveme);
//     offsetX = 0;
//     offsetY = 0;
//     status.bool = false;

//     let c = document.getElementsByTagName("canvas");
    
//     if (Array.from(c).length) {
//         let canvas = c[0];

//         let parent = canvas.parentNode;
//         parent.removeChild(canvas);
//     }
     
//     c = document.getElementsByClassName(cl.moveme);
//     if (c.length) {
//         c[0].classList.remove(cl.moveme);
//     }


//     for (let i =0 ; i < childNodes.length; i++) {
//         if (active == i)
//             childNodes[i].setAttribute('data-prompt', 'yes')

//     }

//     return 

//   }

//     // intervalID = setTimeout( (event)=>{
        
//         // shake div 
//         // event.target.classList.add(cl.svg_wrapper_shake);
//         // console.log('Clicked x,y', event.clientX ,event.clientY);
//         // console.log ("offset left", event.target.offsetLeft);
//         // console.log ("offset top", event.target.offsetTop);

//         const canvas =  document.createElement("canvas") ;
//         const ctx = canvas.getContext("2d");
//         ctx.moveTo(90, 130);
//         ctx.lineTo(95, 25);
//         ctx.lineTo(150, 80);
//         ctx.lineTo(205, 25);
//         ctx.lineTo(210, 130);
//         ctx.lineWidth = 15;
//         ctx.strokeStyle = "red";
//         ctx.stroke();

//         event.target.append(canvas);

//         // console.log(canvas)
//         // console.log('parent',canvas.parentNode.parentNode)
//         // console.log(canvas.parentNode.parentNode.children)
//         // hor_factor = (event.clientX / event.target.offsetLeft)**-1;
//         // vert_factor = (event.clientY / event.target.offsetTop)**-1;

//         box = event.target.getBoundingClientRect();
        
//         parent = event.target.parentNode;

//         let rect =event.target.parentNode.getBoundingClientRect();
        
//         childNodes = parent.children;
        
//         // count = parent.children.length
        
//         parentBox.x = rect.x;
//         parentBox.y = rect.y;
//         parentBox.left = rect.left;
//         parentBox.right = rect.right;
//         parentBox.height = rect.height ;
//         parentBox.width = rect.width;
//         parentBox.bottom = rect.bottom;
        
//         if (childNodes[0] ){

//             rect = childNodes[0].getBoundingClientRect();
            
//             childBox1.x = rect.x;
//             childBox1.y = rect.y;
//             childBox1.left = rect.left;
//             childBox1.right = rect.right;
//             childBox1.height = rect.height ;
//             childBox1.width = rect.width;
//             childBox1.bottom = rect.bottom;
//         }
        
//         if (childNodes[1]) {

//             rect = childNodes[1].getBoundingClientRect();
            
//             childBox2.x = rect.x;
//             childBox2.y = rect.y;
//             childBox2.left = rect.left;
//             childBox2.right = rect.right;
//             childBox2.height = rect.height ;
//             childBox2.width = rect.width;
//             childBox2.bottom = rect.bottom;


//         }
        
//         offsetX = event.clientX - event.target.offsetLeft;
//         offsetY = event.clientY - event.target.offsetTop;

//         event.target.classList.add(cl.moveme);

//         event.target.style.top = `${box.top}px`;
//         event.target.style.left = `${box.left}px`;
//         event.target.style.right = `${box.right}px`;
//         event.target.style.bottom= `${box.bottom}px`;
//         event.target.style.width= `${box.width}px`;
//         event.target.style.height= `${box.height}px`;
//         // event.target.style.x= `${0}px`;
//         // event.target.style.y= `${0}px`;
        
//         status.bool = true;

//         if (event.target == childNodes[0]) {
//             active = 0
//     childNodes[0].setAttribute('data-prompt', 'no')
//         }
//         if (event.target == childNodes[1]) {
//     childNodes[1].setAttribute('data-prompt', 'no')

//             active =1
//         }
        
//     // }, 0,event, status);

//         document.getElementsByClassName(cl.channel_reorg)[0].addEventListener("mousedown", MouseClose);  

  

// };

// const MouseClose = ()=> {
//     console.log('hell world')
// }

// var isOn= false;
// var parentBox =  Object({});
// var childBox1 =  Object({});
// var childBox2 =  Object({});
// var childBox3 =  Object({});
// var childBox4 =  Object({});
// var parent;
// var childNodes;
// var offsetX;
// var offsetY;
// var active;



// const MouseUp =  (event) => {
//       event.preventDefault()

//     // clearInterval(intervalID);
//     // console.log('released', intervalID);
//     // // event.target.classList.remove(cl.svg_wrapper_shake);
//     //     // event.target.classList.remove(cl.moveme);
//     // offsetX = 0;
//     // offsetY = 0;
//     // status.bool = false;

//     // let c = document.getElementsByTagName("canvas");
//     // if (Array.from(c).length) {
//     //     let canvas = c[0];

//     //     let parent = canvas.parentNode;
//     //     parent.removeChild(canvas);
//     // }
     
//     // c = document.getElementsByClassName(cl.moveme);
//     // if (c.length) {
//     //     c[0].classList.remove(cl.moveme);
//     // }

// };
