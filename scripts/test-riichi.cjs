const Riichi = require('riichi');

// Test 1: Simple Pinfu Tsumo
// 123m 456m 789m 123p 11s (pair)
// + indicates options? Let's try without first.
const hand1 = '123456789m123p11s';
console.log('--- Test 1: Simple Hand ---');
const riichi1 = new Riichi(hand1);
const result1 = riichi1.calc();
console.log(JSON.stringify(result1, null, 2));

// Test 2: Winning hand with options (e.g. Tsumo)
// Maybe the library detects winning state?
// Let's try adding a winning tile or specifying it.
// The README example had '112233456789m11s+o'.
// 'o' might be 'oya' (dealer)?
console.log('\n--- Test 2: Winning Hand with Options ---');
const hand2 = '112233m456p789s11z+d'; // +d for dora? or +1?
// Let's try to find what options are available by guessing or minimal output.
const riichi2 = new Riichi(hand2);
const result2 = riichi2.calc();
console.log(JSON.stringify(result2, null, 2));
