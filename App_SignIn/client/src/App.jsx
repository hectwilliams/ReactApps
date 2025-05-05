import React, {Component} from 'react';
import Banner  from './Banner';
import Auth from './Auth';
class App extends Component {
    
    constructor(props) {
        super(props);
    };

    render() {
        return (
            <>
                <Banner />            
                <Auth/>
            </>
        );
    }

}

export default App;