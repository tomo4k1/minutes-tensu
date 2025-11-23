import { generateRandomHand, calculateScore } from '../utils/mahjong';

console.log('--- Generating Random Hand ---');
try {
    const hand = generateRandomHand();
    console.log('Hand:', hand);

    console.log('--- Calculating Score ---');
    const result = calculateScore(hand.tiles, hand.wind, hand.roundWind);
    console.log('Result:', result.text);
    console.log('Fu Details:', result.fuDetails);
} catch (e) {
    console.error('Error:', e);
}
