import  {
    ul_cls,
    leader_cls, 
} from './static/css/module.css'; 

const rootDiv = document.getElementById('root');
const leader = document.createElement('div');

leader.classList.add(leader_cls, ul_cls); //= `${leader_cls} ${ul_cls}`;
leader.dataset.name = "leader";

// block for rootDiv
while(rootDiv== null){}

rootDiv.append(leader);

// import 
// import {Accumulator} from './player';

// // pass leader object to Accumulator
// Accumulator({dnode: leader});

export default leader;