const Riichi = require('riichi');

const handStr = '123m456p789s222z11z'; // Valid 14 tiles: 3+3+3+3+2
// Dora indicator: 1z (East) -> Dora is 2z (South)
// Hand has 222z (South triplet). So it should have 3 Dora.

console.log('--- Test 1: No Dora ---');
const r1 = new Riichi(handStr);
console.log(r1.calc().text);

console.log('--- Test 2: +d1z (Dora Indicator 1z) ---');
// Try appending +d1z
const r2 = new Riichi(handStr + '+d1z');
console.log(r2.calc().text);

console.log('--- Test 3: +d1z+d2z (Multiple Dora Indicators) ---');
const r3 = new Riichi(handStr + '+d1z+d2z');
console.log(r3.calc().text);
