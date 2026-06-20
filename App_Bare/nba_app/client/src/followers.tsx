// import css modules 
import  {
    ul_cls,
    follower1_cls,
    follower2_cls,
    follower3_cls,
} from './static/module.css'; 

const rootDiv = document.getElementById('root');
const numFollowers = 3;

// block for rootDiv
while(rootDiv== null){}

var follower1 = document.createElement('div');
var follower2 = document.createElement('div');
var follower3 = document.createElement('div');

follower1.classList.add(follower1_cls, ul_cls); 
follower2.classList.add(follower2_cls, ul_cls); 
follower3.classList.add(follower3_cls, ul_cls); 

follower1.dataset.name = "follower1";
follower2.dataset.name = "follower2";
follower3.dataset.name = "follower3";

// check if there are three 
rootDiv.append(follower1);
rootDiv.append(follower2);
rootDiv.append(follower3);
