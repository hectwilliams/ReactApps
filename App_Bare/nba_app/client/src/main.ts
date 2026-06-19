
const rootDiv = document.getElementById('root');

var node = document.createElement('p');
node.textContent = "just getting started";
node.className = "test-para";

if (rootDiv) {
    rootDiv.append(node);
}