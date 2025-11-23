const Riichi = require('riichi');

const handStr = '123m456p789s123s11z';
console.log(`Testing hand: ${handStr}`);

try {
    const riichi = new Riichi(handStr);
    const result = riichi.calc();

    console.log('Result:', JSON.stringify(result, null, 2));

    if (result.error) {
        console.error('Riichi returned error:', result);
    } else {
        console.log('Calculation successful');
    }
} catch (e) {
    console.error('Exception thrown:', e);
}
