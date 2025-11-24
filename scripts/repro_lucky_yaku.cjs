const Riichi = require('riichi');

console.log('--- Testing Riichi Defaults ---');
// Hand: 23m 456m 789m 23s 44p + 1m (Wait 14m).
// 23m456m789m23s44p+1m
const hand = '23m456m789m23s44p+1m';

console.log('Query: ' + hand + '+riichi+tsumo');
const res = new Riichi(hand + '+riichi+tsumo').calc();
console.log('Yaku:', res.yaku);

console.log('\nQuery: ' + hand + '+riichi+ron');
const resRon = new Riichi(hand + '+riichi+ron').calc();
console.log('Yaku:', resRon.yaku);

console.log('\nQuery: ' + hand + '+tsumo');
const resTsumo = new Riichi(hand + '+tsumo').calc();
console.log('Yaku:', resTsumo.yaku);
