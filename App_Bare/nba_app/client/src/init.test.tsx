    /**
 * @jest-environment jsdom
 */

    import { test } from '@jest/globals';

    const html= ` <body>
    <div id = "root"> </div>
    <script type="module" src = "bundle.js"></script>
    </body>`;
    
    document.body.innerHTML = html;
    test('placeholder',  () => {});