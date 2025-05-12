import React, {Component} from 'react';
import classes from './Auth.css'; 
import img_eye_open from "./assets/eye_open.png"
import img_eye_closed from "./assets/eye_closed.png"
import stop_sign from "./assets/stop_sign.png"
import check_sign from "./assets/check.png"
import info_icon from "./assets/info.png"

import axios from 'axios';

const ORIGIN = "http://127.0.0.1:5000"

class Auth extends Component {
    
    constructor(props){
        super(props);
        this.handleEyeClick = this.handleEyeClick.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleApply  = this.handleApply.bind(this);
        this.handleSignUpCancel = this.handleSignUpCancel.bind(this);

        this.state = {
            eye: false, // false-eye closed
            authSessionValid: false,
            messages: {username: [], password: []},
            warning_id: -1,
            signup: false,
            data: {firstname:'', lastname:'', username:'', password:''},
            debug: true
        } 
    }

    handleEyeClick(event) {
        this.setState({eye: !this.state.eye})
    }
    
    handleSignIn (event) {
        let tmp = document.getElementsByClassName( classes.auth_input);
        let u = tmp[0].value
        let p = tmp[1].dataset.customRaw

        let req = {
            method: 'post',
            url: ORIGIN + '/' + 'signin',
            data: {password: p, username: u },
        };

        axios(req)
        .then(response=> {
            window.location.href =   ORIGIN + '/' + 'aihumans'          
        })
        .catch(err => {
            let ele = document.getElementsByName('shake_button')[0];
            ele.classList.add(classes.rotate_button);
            
            setTimeout(()=>{
                ele.classList.remove(classes.rotate_button);
            }, 1000);
        });

    }

    handleSignUp (event){
        this.setState({signup: true});
    }
    
    handleSignUpCancel (event){
        // window.location.href = ORIGIN  
        this.setState({signup: false});

    }

    handleApply (event){
        let tmp = document.getElementsByClassName( classes.auth_input);
        let firstname = tmp[0].value;
        let lastname = tmp[1].value;
        let username = tmp[2].value;
        let password = tmp[3].dataset.customRaw
        let [usernameWarnings, passwordWarnings] = signInRules(username, password);
        let mergedUsername =  Array.from(usernameWarnings.values().map((ele, index)=>{return [index, ele] }));
        let mergePassword =  Array.from(passwordWarnings.values().map((ele, index)=>{return [index, ele] }));
        this.setState({warning_id: mergedUsername.length + mergePassword.length, messages: {username: mergedUsername, password: mergePassword} });

        if ( mergedUsername.length + mergePassword.length == 0) {

            let req = {
                method: 'post',
                url: ORIGIN + '/' + 'signup',
                data: {firstname, lastname, username, password},
            };

            axios(req)
            .then(response => {
                console.log('response from webserver', response.data);
                // window.location.href = ORIGIN + '/' + 'aihumans'  // page redirection 
            })
            .catch(err => {
                console.log(err.response);
            });
        }
    }


    render () {

        return (
        <>
    
        {/* SIGN IN SESSION (DEFAULT) */}
        {


            !this.state.signup ? 

            <div className={classes.container1_} >
                
                <div  className={classes.child_container_2}> 
                    <div className={classes.auth_container}>
                        
                        <div className={classes.auth_input_container}>
                            <AuthUsername eye={true} placeholder='Enter Username' />    
                            <div  className={classes.eye_container}> 
                                <button  className={`${classes.button_hide} ${classes.eye_child}`}> 
                                    <img src={!this.state.eye ?  ORIGIN + '/static/assets/Signin/eye_closed.png' : ORIGIN + '/static/assets/Signin/eye_open.png'} alt="Eye Button" className={classes.eye} />
                                    
                                </button>
                            </div>
                        </div>

                        <div className={classes.auth_input_container}>
                            <AuthPassword eye={this.state.eye} placeholder='Enter Password'/>   
                            <div className={classes.eye_container} >
                                <button  onClick={this.handleEyeClick}   className={`${classes.eye_child}`}  > 
                                    <img src={!this.state.eye ?  ORIGIN + '/static/assets/Signin/eye_closed.png' :ORIGIN + '/static/assets/Signin/eye_open.png'} alt="Eye Button" className={classes.eye} />
                                </button>
                            </div>
                        </div>

                        <div className={classes.auth_input_container}>
                            
                            <div name='shake_button' >
                                <button onClick= {this.handleSignIn} className={`${classes.sign_input}`}> Sign In</button>
                            </div>

                            <button  className={`${classes.button_hide} ${classes.eye_child}`}> 
                                <img src={!this.state.eye ?  ORIGIN + '/static/assets/Signin/eye_closed.png' : ORIGIN + '/static/assets/Signin/eye_open.png'} alt="Eye Button" className={classes.eye} />
                            </button>
                            
                            <div>
                                <button onClick= {this.handleSignUp} className={`${classes.sign_input} ${classes.sign_up}`}> Sign Up</button>
                            </div>

                            <button  className={`${classes.button_hide} ${classes.eye_child}`}> 
                                <img src={!this.state.eye ?  ORIGIN + '/static/assets/Signin/eye_closed.png' : ORIGIN + '/static/assets/Signin/eye_open.png'} alt="Eye Button" className={classes.eye} />
                            </button>
                        </div>

                    </div>
                </div>

            </div>

            
            : 

            
            <div className={classes.container1} >

            {/* COLUMN 1 INPUT WARNINGS */}

                { 
                    
                    this.state.warning_id > 0 ?
                        
                        <div  className={classes.child_container_1}> 
                                <div className={classes.stop_sign_col}>
                                    <div>
                                        <img src={ORIGIN + '/static/assets/Signin/stop_sign.png'} alt="stop sign"/>
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
                                <img src={ORIGIN + '/static/assets/Signin/check.png'} alt="check icon"/>
                            </div>
                        </div>
                    : 
                        
                        ''
                }


            {/* COLUMN 2  SIGN UP SESSION */}


                <div className={classes.inputs_container}>
                    
                    <div className={classes.metadata_container}>

                        <div className={classes.auth_input_container}>
                            <AuthUsername eye={true} placeholder='First Name' />    
                                <div className={classes.eye_container} > <button  onClick={this.handleEyeClick}   className={`${classes.eye_child} ${classes.button_hide}`}> </button></div>
                        </div>

                        <div className={classes.auth_input_container}>
                                <AuthUsername eye={true} placeholder=' Last Name'/>   
                                <div className={classes.eye_container} > <button  onClick={this.handleEyeClick}   className={`${classes.eye_child} ${classes.button_hide}`}> </button></div>
                        </div>

                        <div className={classes.auth_input_container}>
                                <AuthUsername eye={true} placeholder=' Username'/>   
                                <div className={classes.eye_container} > <button  onClick={this.handleEyeClick}   className={`${classes.eye_child} ${classes.button_hide}`}> </button></div>
                        </div>

                        <div className={classes.auth_input_container}>
                            <AuthPassword eye={this.state.eye} placeholder=' Password'/>   
                            <div className={classes.eye_container} >
                                <button  onClick={this.handleEyeClick}   className={`${classes.eye_child} }`}  > 
                                    <img src={!this.state.eye ?  ORIGIN + '/static/assets/Signin/eye_closed.png' :ORIGIN + '/static/assets/Signin/eye_open.png'} alt="Eye Button" className={classes.eye} />
                                </button>
                            </div>
                                
                        </div>

                        <div className={classes.apply_container}>
                            <div>
                            <button onClick={this.handleApply}> Apply</button> 
                            </div>
                            <div>
                            <button onClick={this.handleSignUpCancel}> Cancel</button> 
                            </div>
                                
                        </div>

                        <div className={classes.disclaimer}>

                            <div className={classes.disclaimer_item1}>
                                <img src= {ORIGIN +'/static/assets/Signin/info.png'}></img>
                            </div>

                            <div className={classes.disclaimer_item2}>
                                <p> Back button exits sign-up session. Click Cancel to exit session. </p>
                            </div>


                        </div>
                        

                    </div>

                </div>

            </div>
        }
        </>


        )
    }
}

class AuthInput extends Component {

    constructor(props) {
        super(props);
        this.state = {rawText: '', text: '', buffer: ''}
    }

    handleInput(event) {
        let prevString = this.state.rawText;
        let nextString = '' 
        let change_in_size = Math.abs(prevString.length - event.target.value.length)
        if (event.target.value.length > this.state.rawText.length) {
            nextString = prevString + event.target.value.slice(-change_in_size);
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

    const regexAcceptedCharsUsername = /[^a-z0-9]/ig;
    const regexAcceptedCharsPassword = /[^a-z0-9#\!\-\?\_@\$]/ig;
    const regexAcceptedCharsPassword_ = /[\!\-\?\_@\$]/g;

    let specialChars = password.match(regexAcceptedCharsPassword_);

    if (username.length < 6)
        uList.push('Username must have at least 6 characters');

    if (username.length > 40)
        uList.push('Username must be at least 10 characters long');

    if (username.match(regexAcceptedCharsUsername))
        uList.push('Username accepts only alpha-numeric characters');

    if (password.match(regexAcceptedCharsPassword))
        pList.push('Password accepts alpha-numeric and special characters in square brackets [#-!?_@$]');

    if (password.length < 10)
        pList.push('Password must be at least 10 characters long');

    if (password.length > 40)
        pList.push('Password length is too large; length <= 40 characters');
    
    if (specialChars == null || specialChars.length  < 3)
        pList.push('Password requires 3 or more special characters #-!?_@$');

    return [uList, pList];
};

export default Auth; 