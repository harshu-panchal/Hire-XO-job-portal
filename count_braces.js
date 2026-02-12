const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, 'frontend/src/App.tsx'), 'utf8');
let open = 0, close = 0;
for (let char of content) {
    if (char === '{') open++;
    if (char === '}') close++;
}
console.log(`Open: ${open}, Close: ${close}`);
if (open !== close) {
    console.log('MISMATCH DETECTED!');
} else {
    console.log('Braces are balanced.');
}
