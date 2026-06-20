import {
    option_container_cls,
    option_button_cls
} from './static/option.css';

const iconPath = "./static/images/icons";
const rootDiv = document.getElementById('root');

// create options element
const optionNode = document.createElement('div');
optionNode.className = option_container_cls;

const DateAddedButton = document.createElement('button');
const OrderFirstName = document.createElement('button');
const OrderLastName = document.createElement('button');
const OrderFullName = document.createElement('button');

// create type [html, string]
type pairHTMLString_t = [HTMLButtonElement, string];

// set items of type
const items : pairHTMLString_t[] = [
    [DateAddedButton, "date_added.png"], [OrderFirstName, "first_name.png"], [OrderLastName,  "last_name.png"  ], [OrderFullName, "full_name.png"]
]

// set each option button 
items.forEach((record, index) => {
    let element : HTMLButtonElement = record[0] ;
    let basename : string = record[1] ;
    
    // set css class of button
    element.className = option_button_cls;

    element.dataset.status = index.toString();

    optionNode.append(element);

});

if (rootDiv) {
    rootDiv.prepend(optionNode)
}

export default optionNode;
