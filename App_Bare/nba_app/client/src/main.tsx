// import css modules 
import  {
    body_cls, 
    root_container_cls,
    leader_cls, 
    follower1_cls,
    follower2_cls,
    follower3_cls,
} from'./static/module.css'; 

// const mainCss = require('./main.css');
const rootDiv = document.getElementById('root');
const body = document.body;
var leader = document.createElement('div');
var follower1 = document.createElement('div');
var follower2 = document.createElement('div');
var follower3 = document.createElement('div');

body.style.backgroundColor = 'gray';

leader.className = leader_cls;
follower1.className = follower1_cls;
follower2.className =follower2_cls ;
follower3.className =follower3_cls ;

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

