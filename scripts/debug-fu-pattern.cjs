const Riichi = require('riichi');

// Hand with triplets: 666m 777m 567p 789p 22s
// 666777m567789p22s
const handStr = '666777m567789p22s';
const riichi = new Riichi(handStr);
const result = riichi.calc();

console.log('Text:', result.text);
console.log('Fu:', result.fu);
console.log('Han:', result.han);
console.log('Current Pattern:', JSON.stringify(riichi.currentPattern, null, 2));

// Check my logic
const pattern = riichi.currentPattern;
if (pattern) {
    pattern.forEach((group, i) => {
        console.log(`Group ${i}:`, group, 'IsArray:', Array.isArray(group));
        if (Array.isArray(group)) {
            console.log('Length:', group.length);
            console.log('0==1:', group[0] === group[1]);
            console.log('1==2:', group[1] === group[2]);
        }
    });
}
