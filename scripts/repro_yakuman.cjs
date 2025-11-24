const Riichi = require('riichi');

// Suuuankou (Four Concealed Triplets)
// 111m 222m 333m 444m 55z
const hand = '111m222m333m444m55z';
const resultDefault = new Riichi(hand).calc();
console.log('Default:', resultDefault.text, resultDefault.han, resultDefault.yaku);

const resultRon = new Riichi(hand + '+ron').calc();
console.log('With +ron:', resultRon.text, resultRon.han, resultRon.yaku);
