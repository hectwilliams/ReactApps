// import css modules 
import  {
    ul_cls,
    body_cls, 
    root_container_cls,
    leader_cls, 
    follower1_cls,
    follower2_cls,
    follower3_cls,
} from './static/module.css'; 

// options css module 
import optionNode  from './options';


// const mainCss = require('./main.css');
const rootDiv = document.getElementById('root');
const body = document.body;
var leader = document.createElement('ul');
var follower1 = document.createElement('ul');
var follower2 = document.createElement('ul');
var follower3 = document.createElement('ul');

body.style.backgroundColor = 'gray';

leader.classList.add(leader_cls, ul_cls); //= `${leader_cls} ${ul_cls}`;
follower1.classList.add(follower1_cls, ul_cls); // = ;
follower2.classList.add(follower2_cls, ul_cls); // =follower2_cls ;
follower3.classList.add(follower3_cls, ul_cls); //

// set
body.className  = body_cls;

if (rootDiv) {
    // / griddy div
    rootDiv.className  = root_container_cls;
    // append node
    rootDiv.append(leader);
    rootDiv.append(follower1);
    rootDiv.append(follower2);
    rootDiv.append(follower3);
}

// import 
import {Accumulator} from './player';

// pass leader object to Accumulator
Accumulator({dnode: leader});

    