import React, {Component} from 'react';
import common from './common.css'; 
import classes from './Auth.css'; 
import img_eye_open from "../src/icons/eye_icon.png"
import img_eye_closed from "../src/icons/eye_closed.png"
import stop_sign from "../src/icons/stop_icon.png"
import check_sign from "../src/icons/check.png"

class Auth extends Component {
    
    constructor(props){
        super(props);
        this.handleEyeClick = this.handleEyeClick.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);
        this.state = {
            eye: false, // false-eye closed
            authSessionValid: false,
            messages: {username: [], password: []},
            warning_id: -1
        } 
    }

    handleEyeClick(event) {
        this.setState({eye: !this.state.eye})
    }
    
    handleSignIn (event) {
        let tmp = document.getElementsByClassName( classes.auth_input);
        let [usernameWarnings, passwordWarnings] = signInRules(tmp[0].value, tmp[1].dataset.customRaw);
        let mergedUsername =  Array.from(usernameWarnings.values().map((ele, index)=>{return [index, ele] }));
        let mergePassword =  Array.from(passwordWarnings.values().map((ele, index)=>{return [index, ele] }));
        this.setState({warning_id: mergedUsername.length + mergePassword.length, messages: {username: mergedUsername, password: mergePassword} });
    }

    render () {

        return (
        
        <div className={classes.container1} >
            
            { 
                
                this.state.warning_id > 0 ?
                    
                    <div  className={classes.child_container_1}> 
                            <div className={classes.stop_sign_col}>
                                <div>
                                    <img src={stop_sign} alt="stop sign"/>
                                </div>
                            </div>

                            <div className={classes.stop_sign_msg}>
                                <>
                                    {this.state.messages.username.map( (record)=>{ return (<p key={record[0]} className={classes.msg_username}> {record[1]} </p>); } ) }
                                </>

                                <>
                                    {this.state.messages.password.map( (record)=>{ return (<p key={record[0]} className={classes.msg_password}> {record[1]} </p>); } ) }
                                </>
                            </div>
                    </div>
                
                :
                
                this.state.warning_id == 0 ?
                    
                    <div  className={classes.success_container}> 
                        <div> 
                            <img src={check_sign} alt="check icon"/>
                        </div>
                    </div>
                : 
                    
                    ''

            }
            
            <div  className={classes.child_container_2}> 
                <div className={classes.auth_container}>
                    
                    <div className={classes.auth_input_container}>
                        <AuthUsername eye={true} placeholder='Enter Username' />   
                        <div  className={classes.eye_container}> 
                            <button  className={`${classes.button_hide} ${classes.eye_child}`}> 
                                <img src={!this.state.eye ?  img_eye_closed :img_eye_open} alt="Eye Button" className={classes.eye} />
                                
                            </button>
                        </div>
                    </div>

                    <div className={classes.auth_input_container}>
                        <AuthPassword eye={this.state.eye} placeholder='Enter Password'/>   
                        <div className={classes.eye_container} >
                            <button  onClick={this.handleEyeClick}   className={classes.eye_child}  > 
                                <img src={!this.state.eye ?  img_eye_closed :img_eye_open} alt="Eye Button" className={classes.eye} />
                            </button>
                        </div>
                            
                    </div>

                    <div className={classes.auth_input_container}>
                        <div>
                            <button onClick= {this.handleSignIn} className={classes.sign_input}> Sign In</button>
                        </div>

                        <button  className={`${classes.button_hide} ${classes.eye_child}`}> 
                             <img src={!this.state.eye ?  img_eye_closed :img_eye_open} alt="Eye Button" className={classes.eye} />
                        </button>

                    </div>

                </div>
            </div>

        </div>
        )
    }
}

class AuthInput extends Component {

    constructor(props) {
        super(props);
        this.state = {rawText: '', text: '', buffer: ''}
    }

    handleInput(event) {
    /* 
        Grabs last character and appends to state.rawText. 
        Drops last character in state.rawText if user deletes a character 
    */
        let prevString = this.state.rawText;
        let nextString = '' 

        if (event.target.value.length > this.state.rawText.length) {
            nextString = prevString + event.target.value.slice(-1);
        } else {
            let reduce_length =  prevString.length - event.target.value.length;
            nextString = prevString.slice(0, -reduce_length);
        }

        this.setState({rawText: nextString})
    }

    render() {
        return (
            <input type="text" data-custom-cow={1} data-custom-raw = {this.state.rawText} value={this.props.eye? this.state.rawText:  '*'.repeat(this.state.rawText.length)     } onChange={this.handleInput} className={classes.auth_input} placeholder={this.props.placeholder} />
        )
    }
}

class AuthUsername extends AuthInput {
    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
    }
}

class AuthPassword extends AuthInput {
    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
    }
}

const signInRules=  (username, password) => {
    const uList = [];
    const pList = [];
    let uniqueSpecialChars = password.match(/[\s!#%'\(\)\*\+,\-\.\/:;<=>?@\[\]\\\^_`\{\|\}]/g);
    
    if (username.length < 6)
        uList.push('Username must have at least 6 characters');

    if (username.length > 40)
        uList.push('Username must be at least 10 characters long');

    if (/[\s!#%'\(\)\*\+,\-\.\/:;<=>?@\[\]\\\^_`\{\|\}]/.test(username))
        uList.push('Username cannot contain ^! #%()*+,-./:;<=>?@[]\^_`{|}~');

    if (password.length < 10)
        pList.push('Password must be at least 10 characters long');

    if (password.length > 40)
        pList.push('Password length is too large; length <= 40 characters');
    
    if (uniqueSpecialChars == null  || (uniqueSpecialChars.length  < 3))
        pList.push('Password requires 3 special characters');

    
    return [uList, pList];
}

export default Auth; 