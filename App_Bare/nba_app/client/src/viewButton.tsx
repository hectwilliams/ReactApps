
export function viewButton(node: HTMLSpanElement) {
    let rows = [2, 5, 9] as Array<number>;
    rows.forEach((r, index)=>{
        let v = rows[3 - 1 - index];
        if (v) {
            console.log(v);
            for (let i = 0; i < v; i++) {
                let pos = 10 * r + i; 
                let ele = node.children[pos] as HTMLSpanElement;
                ele.style.backgroundColor="white";
            }
        }
    })
}

export const moreViewSymbol = document.createElement('span');
for (let i = 0; i < 100; i++) {
    let node = document.createElement('span');
    moreViewSymbol.append(node);
}

export const setEventMoreViewSymbol = (node: HTMLSpanElement)=>{
    // click event 
    node.addEventListener( 'click', (event:MouseEvent) => {
        console.log(event);
    });

}

viewButton(moreViewSymbol);