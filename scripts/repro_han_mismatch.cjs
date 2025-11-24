const Riichi = require('riichi');

console.log('--- Testing Han Mismatch ---');
// Hand: 444m 999m 444s 88s 67m + 5m (Red)
// 444m999m444s88s67m+5m
// Add +riichi +tsumo +d5m (aka)
const hand = '444m999m444s88s67m+5m+riichi+tsumo+d5m';

console.log('Query: ' + hand);
const res = new Riichi(hand).calc();
console.log('Han:', res.han);
console.log('Fu:', res.fu);
console.log('Points:', res.ten);
console.log('Yaku:', res.yaku);
console.log('Text:', res.text);

// Check if Ura Dora is involved
// Riichi lib might generate random Ura Dora?
// Or maybe it defaults to some Ura Dora?
