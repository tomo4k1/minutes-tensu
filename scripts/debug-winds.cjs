const Riichi = require('riichi');

const handStr = '123m456p789s123s11z';

// Test 1: Default
console.log('--- Default ---');
const r1 = new Riichi(handStr);
console.log('Text:', r1.calc().text);

// Test 2: Append +south (Round) ?
console.log('--- Append +2 (South Round?) ---');
// riichi documentation is sparse.
// Usually: 1=East, 2=South, 3=West, 4=North for winds?
// Or maybe specific char?
// Let's try setting properties directly.
const r2 = new Riichi(handStr);
r2.bakaze = 1; // 0: East, 1: South?
r2.jikaze = 1; // 0: East, 1: South?
console.log('Property Set (1,1):', r2.calc().text);

// Test 3: String format +12 (South Round, West Seat?)
// 0=East, 1=South, 2=West, 3=North
console.log('--- String Format +12 ---');
const r3 = new Riichi(handStr + '+12');
console.log('Result:', r3.calc().text);

// Test 4: +23 (South Round, West Seat)
console.log('--- String Format +23 ---');
const r4 = new Riichi(handStr + '+23');
console.log('Result:', r4.calc().text);

// Test 5: +44 (North Round, North Seat)
console.log('--- String Format +44 ---');
const r5 = new Riichi(handStr + '+44');
console.log('Result:', r5.calc().text);
