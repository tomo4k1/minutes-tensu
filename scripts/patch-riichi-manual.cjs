const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../node_modules/riichi/index.js');
console.log(`Patching ${filePath}...`);

try {
    let content = fs.readFileSync(filePath, 'utf8');
    const target = "this.tmpResult.ten = this.isOya ? eval(this.tmpResult.oya.join('+')) : eval(this.tmpResult.ko.join('+'))";
    const replacement = "this.tmpResult.ten = this.isOya ? this.tmpResult.oya.reduce((a, b) => a + b, 0) : this.tmpResult.ko.reduce((a, b) => a + b, 0)";

    if (content.includes(target)) {
        content = content.replace(target, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Successfully patched riichi/index.js');
    } else {
        console.log('Target string not found. Already patched?');
    }
} catch (e) {
    console.error('Error patching file:', e);
    process.exit(1);
}
