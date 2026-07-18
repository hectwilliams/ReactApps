/**
 * @jest-environment jsdom
 */

import './init.test'; // loads body to DOM  
import { describe, expect, test } from '@jest/globals';
import { createRoot, setRoot, setBody, getClass} from './Mainn';

import main_css  from './static/css/Main.module.css';

describe ('gui start up', () => {
    
    // created object styles_main_css
    
    test('Test main element', async () => {
         
        // create div (root)
        const domRoot = document.getElementById('root') as HTMLDivElement;
        
        // ref body 
        const domBody = document.body as HTMLBodyElement;

        // set root div class
        setRoot(domRoot, main_css.root_container_cls);
        
        // set body class
        setBody(domBody, main_css.body_cls);

        // expectations 
        expect(domBody.className).toEqual('body_cls');
        expect(domRoot.className).toEqual('root_container_cls');

    });

});