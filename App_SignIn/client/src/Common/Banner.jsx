import React, {Component} from 'react';
import classes from "./Banner.css"
import common from "./common.css"
import img from  "./search_icon.jpg"

const ORIGIN = "http://127.0.0.1:5000"

class Banner extends Component {
    render() {
        return (
        <>
        <div className={classes.bannerRow} > 
            <a href="https://www.example.com" className={ `${classes.bannerLink} ${classes.bannerLinkFirst}`} > Link1 </a>
            <a href="https://www.example.com" className={classes.bannerCell}  > Link2 </a>
            <div> </div>
            <Search/>
        </div>
        <hr className={`${common.hline} `}></hr>
        </>
        )
    }
}

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {text: ''}
        this.handleInput = this.handleInput.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleInput(event) {
        this.setState({text: event.target.value});
        console.log(this.state.text)
    }

    handleClick(event) {
        console.log('clicked event')
    }

    render() {
        return (
            <>
                <div className={classes.search}>
                    <div className={classes.img_magnify} >
                        <button  onClick={this.handleClick} className={classes.btn} > 
                            <img src={   ORIGIN + '/static/assets/Signin/search_icon.jpg'} alt="Button Image" className={classes.btn_img} />
                        </button>
                    </div>
                    <input type="text" value={this.state.text} onChange={this.handleInput} className={classes.search_inside} placeholder="Enter text here" />
                </div>
            </>
        )
    }
}

export default Banner