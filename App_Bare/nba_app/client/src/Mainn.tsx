import '../src/Init';

import  * as loopbook_css  from './logbook';
const view_button_css_eff :  Record<string, any> = loopbook_css;

import * as styles_main_css from './static/css/Main.module.css'; // importing css modules boiler

// console.log(styles_main_css);

const styles_main_css_eff :  Record<string, any> = styles_main_css;

export function setRoot(root: HTMLDivElement, c : string | undefined = undefined) {
    if (c == undefined) {

        root.className = styles_main_css_eff.root_container_cls as string;

    } else {
        
        root.className = c;
        
    }
}

export function setBody(body: HTMLBodyElement, c: string | undefined = undefined)  {
    if (c == undefined) {

        body.className = styles_main_css_eff.body_cls as string;

    } else {

        body.className = c;

    }

    body.style.backgroundColor = 'gray';
}


export async function createRoot() {
    const domRoot = document.getElementById('root') as HTMLDivElement;
    const domBody = document.body as HTMLBodyElement;
    setRoot(domRoot);
    setBody(domBody);
    return domRoot;
}

export async function getClass() {
    return styles_main_css;
}

// get BINSIZE from css global (variables.css)
const rootstyles = window.getComputedStyle(document.documentElement);
export const binsize = parseInt(rootstyles.getPropertyValue('--BINSIZE').trim()); 

(async () => {
    await createRoot();
})()


// view_button_css_eff.logbookInst.add("Application started");

