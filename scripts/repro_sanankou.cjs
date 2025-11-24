const Riichi = require('riichi');

// Hand: 111m 222m 333m 444p 55z (14 tiles)
// Shanpon wait on 4p/5z? No, 444p is triplet.
// Let's say hand was 111m 222m 333m 44p 55z + 4p (Ron)
// String: 111m222m333m444p55z
const hand = '111m222m333m444p55z';

console.log('--- Compressed String ---');
const resRon = new Riichi(hand + '+ron').calc();
console.log('Ron:', resRon.yaku);

const resTsumo = new Riichi(hand + '+tsumo').calc();
console.log('Tsumo:', resTsumo.yaku);

// Try separated winning tile (111m222m333m44p55z + 4p)
console.log('\n--- Separated String (111m222m333m44p55z4p) ---');
const handSep = '111m222m333m44p55z4p';
const resRonSep = new Riichi(handSep + '+ron').calc();
console.log('Ron:', resRonSep.yaku);

// Try separated with plus
console.log('\n--- Separated with Plus (111m222m333m44p55z+4p) ---');
const handPlus = '111m222m333m44p55z+4p';
const resRonPlus = new Riichi(handPlus + '+ron').calc();
console.log('Ron:', resRonPlus.yaku);

const resTsumoPlus = new Riichi(handPlus + '+tsumo').calc();
console.log('Tsumo:', resTsumoPlus.yaku);
