import React, {Component} from 'react';
import clx from "./Waitx.css";
import dog from  "./dog.jpg";
import wait from  "./wait.jpg";
import error from  "./error.jpg";

class Waitx extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={clx.wait_container}>
                <img src={error} />
            </div>
        )
    }
}

export default Waitx;