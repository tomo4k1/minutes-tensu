const Riichi = require('riichi');

console.log('--- Testing Ghost Riichi ---');
// Hand from screenshot: 345m 666m 456p 66p 666z (Hatsu)
// 345m666m456p66p666z
// Assume Ron on 6p (or any tile).
// Let's try constructing it.
const hand = '345m666m456p66p666z';

console.log('Query: ' + hand + '+ron');
const res = new Riichi(hand + '+ron').calc();
console.log('Yaku (No Riichi flag):', res.yaku);

console.log('\nQuery: ' + hand + '+ron+riichi');
const resRiichi = new Riichi(hand + '+ron+riichi').calc();
console.log('Yaku (With Riichi flag):', resRiichi.yaku);

// Check Separated Format
// 345m 666m 456p 66p 666z
// Remove one 6p: 345m 666m 456p 6p 666z + 6p
const handSep = '345m666m456p6p666z+6p';
console.log('\nQuery Separated: ' + handSep + '+ron');
const resSep = new Riichi(handSep + '+ron').calc();
console.log('Yaku Separated (No Riichi flag):', resSep.yaku);
