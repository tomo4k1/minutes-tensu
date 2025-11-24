const Riichi = require('riichi');

const hand = '123m456p789s111z22z'; // Valid hand (East triplet, South pair)
const resultDefault = new Riichi(hand).calc();
console.log('Default:', resultDefault.text, resultDefault.yaku);

const resultRon = new Riichi(hand + '+ron').calc();
console.log('With +ron:', resultRon.text, resultRon.yaku);

const resultRonCap = new Riichi(hand + '+Ron').calc();
console.log('With +Ron:', resultRonCap.text, resultRonCap.yaku);

const resultNoTsumo = new Riichi(hand + '-tsumo').calc();
console.log('With -tsumo:', resultNoTsumo.text, resultNoTsumo.yaku);
