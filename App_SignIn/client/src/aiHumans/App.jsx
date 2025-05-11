import React, {Component} from 'react';
import Banner  from '../Common/Banner';
import Dashboard from './Dashboard';

class App extends Component {
    
    constructor(props) {
        super(props);
    };

    render() {
        return (
            <>
                <Banner/>
                <Dashboard/>
            </>
        );
    }

}

export default App;