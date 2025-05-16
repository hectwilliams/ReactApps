import React, {Component} from 'react';
import Banner  from '../Common/Banner';
import Dashboard from './Dashboard';
import dashboardClass from './Dashboard.css'

class App extends Component {
    
    constructor(props) {
        super(props);
    };

    componentDidMount() {
        resizeStartup();
    }

    render() {
        return (
            <>
                <Banner/>
                <Dashboard/>
            </>
        );
    }

}

const resizeStartup = () => {

    const windowChange = (event)=>{
        let ele = document.getElementsByClassName(dashboardClass.main_grid)[0] ;
        var obj = {}
        if (  (event instanceof Event) == false) {
        obj = event;
        } else {
        obj = event.currentTarget;
        }
        if (obj.screen.height > 600 &&  obj.screen.height < 1000) {
        ele.dataset.height = 700;
        } else if(obj.screen.height > 1300 &&  obj.screen.height < 1800) {
            ele.dataset.height = 1260;
        }
    }
  
    window.addEventListener('resize', windowChange);
    windowChange(window);
}

export default App;