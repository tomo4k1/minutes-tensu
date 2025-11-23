const Riichi = require('riichi');

const handStr = '123m456p789s123s11z';
const riichi = new Riichi(handStr);
const result = riichi.calc();

console.log('Result:', JSON.stringify(result, null, 2));

// Inspect internal state for Fu details
// Based on source code reading, there might be `fu_details` or similar if we are lucky,
// or we might need to look at `riichi.fu` if it's an object (unlikely, it was a number).
// Let's dump the whole riichi object to see what's available.
console.log('Riichi Instance Keys:', Object.keys(riichi));
console.log('Current Pattern:', JSON.stringify(riichi.currentPattern, null, 2));

