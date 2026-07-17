import '../src/Init';
// import { logbookInst } from './logbook';

import * as styles_main_css from './static/css/Main.module.css'; // importing css modules boiler

const styles_main_css_eff :  Record<string, any> = styles_main_css;

function setRoot(root: HTMLDivElement) {
    root.className = styles_main_css_eff.root_container_cls as string;
}

function setBody(body: HTMLBodyElement)  {
    body.className = styles_main_css_eff.body_cls as string;
    body.style.backgroundColor = 'gray';
}

 export async function createRoot() {
    const domRoot = document.getElementById('root') as HTMLDivElement;
    const domBody = document.body as HTMLBodyElement;
    setRoot(domRoot);
    setBody(domBody);
}

// get BINSIZE from css global (variables.css)
const rootstyles = window.getComputedStyle(document.documentElement);
export const binsize = parseInt(rootstyles.getPropertyValue('--BINSIZE').trim()); 


(async () => {
    await createRoot();
})()


// logbookInst.add("Application started");

