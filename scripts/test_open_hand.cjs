const Riichi = require('riichi');

// Test Open Hand formats
console.log('--- Testing Open Hand Formats ---');

// 1. Standard Closed: 123m
const closed = new Riichi('123m456m789m11z222z').calc();
console.log('Closed:', closed.yaku);

// 2. Open? Maybe using +?
// In some parsers, 123m is closed, <123m> is open? or 123m+?
// Let's try `123m+456m+789m+11z+222z` (Separated) - we saw this makes it "Open" logic-wise for Sanankou?
// But does it make it "Open" for Yaku restrictions (e.g. No Pinfu)?

const sep = new Riichi('123m+456m+789m+11z+222z').calc();
console.log('Separated (+):', sep.yaku);

// 3. Try `123m` vs `123m` (Open).
// Riichi lib documentation says: 
// "Use + to separate groups. Groups after the first + are considered open."
// e.g. '11z+123m+456m' -> 11z is hand, 123m is open, 456m is open.
// Let's verify.

const openTest = new Riichi('11z+123m+456m+789m+222z').calc();
console.log('Open Test (11z hand, rest open):', openTest.yaku);

// Check if Pinfu is allowed (should be NO if open)
// Hand: 123m 456m 789m 22z 33z (Wait 3z? No, 22z+33z is not valid).
// Let's use 123m 456m 789m 22z + 34m (Wait 2m/5m).
// Closed: Pinfu.
// Open: No Pinfu.

const handPinfu = '123m456m789m22z34m';
const resClosed = new Riichi(handPinfu + '+2m').calc(); // Win on 2m
console.log('Pinfu Closed:', resClosed.yaku);

const resOpen = new Riichi('22z34m+123m+456m+789m+2m').calc(); // 22z34m in hand, others open
console.log('Pinfu Open:', resOpen.yaku);
