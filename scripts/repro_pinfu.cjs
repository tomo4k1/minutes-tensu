const Riichi = require('riichi');

console.log('--- Pinfu Ron ---');
// 123m 456p 789s 22z + 3m (Wait 14m? No, 23m -> 14m. 12m -> 3m.)
// Let's use 23m + 1m.
const handPinfu = '23m456p789s22z+1m';
const resPinfu = new Riichi(handPinfu + '+ron').calc();
console.log('Yaku:', resPinfu.yaku);

console.log('\n--- Suuuankou Tanki Ron ---');
// 111m 222m 333m 444p 5z + 5z
const handTanki = '111m222m333m444p5z+5z';
const resTanki = new Riichi(handTanki + '+ron').calc();
console.log('Yaku:', resTanki.yaku);
