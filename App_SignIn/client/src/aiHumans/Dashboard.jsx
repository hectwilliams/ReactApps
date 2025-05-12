import React, {Component} from 'react';
import dashboardClass from './Dashboard.css'
import Fortune from './Fortune'
import axios from 'axios';
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageRef: null
        }
    }

    componentDidMount() {
        axios({method:'get', url: window.origin + '/' + 'aihumans' + '?req=objects' })
        .then((response)=>{
            this.setState({pageRef: response.data.menuItems})
        })
    }
    
    render() {
        return  (
                
                <div className={dashboardClass.main_grid}>
                
                    <div className={dashboardClass.bucket}>   

                        {
                            this.state.pageRef == null?
                            '':
                            this.state.pageRef.map( (obj) => { return<MenuItem name={obj.name} pages={ obj.pages }/> })
                        } 
                        
                    </div>
                    
                    <div className={dashboardClass.page}> 

                        <Fortune/> 

                    </div>

                </div>
        )
    }
}

class MenuItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonState : true, // true closed , false open 
        }
        this.ringClick = this.ringClick.bind(this);
    }

    ringClick(event) {
        this.setState({buttonState: !this.state.buttonState})
    }

    render() {
        return (

            <div className={dashboardClass.menu_item_container}>
                
                <div className={dashboardClass.menu_items}>

                    {/* main option */}
                    <div className={dashboardClass.menu_cicle} > 
                        <div onClick={this.ringClick}  className={dashboardClass.open_outer}>
                            <>
                            {
                                this.state.buttonState ?
                                <div className={`${dashboardClass.open_inner} ${dashboardClass.open_inner_hide}`} ></div>:
                                <div className={`${dashboardClass.open_inner} ${dashboardClass.open_inner_show}`} ></div>
                            }
                            </>
                        </div>
                    </div>

                    <div className={dashboardClass.menu_name} > <p > {this.props.name}  </p></div>

                </div>
                
                <>
                    {
                        this.state.buttonState? '' : <Suboptions depth={0} pages={this.props.pages} /> 
                    }
                </>

            </div>
        )

    }
}

class Suboptions extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        
        return (

            <div className={dashboardClass.suboptions}>
                {

                    this.props.name? 
                        <div className={dashboardClass.suboptions_div}>
                            <div depth={this.props.depth}  className={dashboardClass.suboptions_div_ident}> • </div>
                            <p className={dashboardClass.suboptions_div_value}>  {this.props.name} </p>
                        </div>

                    : ''
                }

                {/* render subpages (traverse of json table is analagous to PreOrder Travesal) */}

                {
                    this.props.pages? 
                        this.props.pages.map((obj)=> <Suboptions depth={this.props.depth + 1 } name={obj.name} pages={obj.pages}/>)
                    :
                        ''
                }

            </div>

        )
    }
}


export default Dashboard;
