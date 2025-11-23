const { PointCalculator, Hand, Tile } = require('mahjong-utils');
// Note: I need to check how to import from mahjong-utils.
// It might be ESM only or have specific exports.
// Based on package info, it has a main entry.

async function test() {
    try {
        // Guessing the API based on common patterns or previous research.
        // If this fails, I'll inspect the package exports.

        // Example hand: 123m 456m 789m 123p 11s
        // This is Pinfu.

        // I might need to construct objects.
        // Let's try to import and log exports first to see what's available.
        const mu = require('mahjong-utils');
        console.log('Exports:', Object.keys(mu));

        // If there is a calculator, try to use it.
    } catch (e) {
        console.error(e);
    }
}

test();
