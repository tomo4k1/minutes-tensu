import { MahjongHand } from './types';
import { GameSettings } from './storage';

// Tile types
const SUITS = ['m', 'p', 's'];
const HONORS = 'z';

// Helper to get random integer
const randomInt = (max: number) => Math.floor(Math.random() * max);

class Deck {
    tiles: Record<string, number>;

    constructor() {
        this.tiles = {};
        // Initialize 1-9 m, p, s and 1-7 z with 4 copies each
        for (const suit of SUITS) {
            for (let i = 1; i <= 9; i++) {
                this.tiles[`${i}${suit}`] = 4;
            }
        }
        for (let i = 1; i <= 7; i++) {
            this.tiles[`${i}${HONORS}`] = 4;
        }
    }

    tryTake(tiles: string[]): boolean {
        // Check if enough tiles exist
        const tempCounts = { ...this.tiles };
        for (const t of tiles) {
            if (!tempCounts[t] || tempCounts[t] <= 0) return false;
            tempCounts[t]--;
        }
        // Commit
        for (const t of tiles) {
            this.tiles[t]--;
        }
        return true;
    }

    getAvailableTiles(): string[] {
        return Object.keys(this.tiles).filter(t => this.tiles[t] > 0);
    }
}

export const generateRandomHand = (settings?: GameSettings): MahjongHand => {
    const deck = new Deck();
    const handTiles: string[] = [];

    // 1. Generate 4 Sets (Mentsu)
    for (let i = 0; i < 4; i++) {
        let added = false;
        while (!added) {
            // Randomly choose Shuntsu (0) or Koutsu (1)
            // Bias towards Shuntsu for more realistic hands (e.g. 70% Shuntsu)
            const isKoutsu = Math.random() > 0.7;

            if (isKoutsu) {
                // Try Koutsu
                const available = deck.getAvailableTiles();
                if (available.length === 0) break; // Should not happen early
                const tile = available[randomInt(available.length)];

                // Need 3 of this tile
                if (deck.tryTake([tile, tile, tile])) {
                    handTiles.push(tile, tile, tile);
                    added = true;
                }
            } else {
                // Try Shuntsu
                const suit = SUITS[randomInt(SUITS.length)];
                const startNum = randomInt(7) + 1; // 1 to 7
                const t1 = `${startNum}${suit}`;
                const t2 = `${startNum + 1}${suit}`;
                const t3 = `${startNum + 2}${suit}`;

                if (deck.tryTake([t1, t2, t3])) {
                    handTiles.push(t1, t2, t3);
                    added = true;
                }
            }
        }
    }

    // 2. Generate Pair (Jantou)
    let pairAdded = false;
    while (!pairAdded) {
        const available = deck.getAvailableTiles();
        const tile = available[randomInt(available.length)];
        if (deck.tryTake([tile, tile])) {
            handTiles.push(tile, tile);
            pairAdded = true;
        }
    }

    // 3. Convert to Riichi String Format
    // Pick a winning tile (agari-hai) randomly from the hand
    const winTileIndex = randomInt(handTiles.length);
    const winTile = handTiles[winTileIndex];

    // Remove winTile from list to sort the rest
    const remainingTiles = [...handTiles];
    remainingTiles.splice(winTileIndex, 1);

    // Sort remaining tiles
    remainingTiles.sort((a, b) => {
        const suitA = a.slice(-1);
        const suitB = b.slice(-1);
        const numA = parseInt(a);
        const numB = parseInt(b);

        const suitOrder = { m: 0, p: 1, s: 2, z: 3 };
        if (suitOrder[suitA as keyof typeof suitOrder] !== suitOrder[suitB as keyof typeof suitOrder]) {
            return suitOrder[suitA as keyof typeof suitOrder] - suitOrder[suitB as keyof typeof suitOrder];
        }
        return numA - numB;
    });

    // Append winTile to the end
    const finalTiles = [...remainingTiles, winTile];

    // Handle Red Dora (Aka Dora)
    // If enabled, replace '5' with '0' with some probability (e.g. 25% per 5)
    // Actually, usually there is only 1 red 5 per suit (2 for 5p sometimes).
    // Let's simplify: if akaDora is on, try to make one 5 red per suit if present.
    if (settings?.akaDora) {
        const suits = ['m', 'p', 's'];
        suits.forEach(suit => {
            // Find all 5s of this suit
            const indices = finalTiles.map((t, i) => t === `5${suit}` ? i : -1).filter(i => i !== -1);
            if (indices.length > 0) {
                // Pick one to be red
                const targetIndex = indices[randomInt(indices.length)];
                finalTiles[targetIndex] = `0${suit}`;
            }
        });
    }

    // Compress to string (e.g. 1m2m3m -> 123m)
    let resultStr = '';
    let currentSuit = '';
    let currentNums = '';

    for (const t of finalTiles) {
        const suit = t.slice(-1);
        const num = t.slice(0, -1);

        if (suit !== currentSuit) {
            if (currentSuit) {
                resultStr += currentNums + currentSuit;
            }
            currentSuit = suit;
            currentNums = num;
        } else {
            currentNums += num;
        }
    }
    resultStr += currentNums + currentSuit;

    // 4. Randomize Conditions
    const winds = ['East', 'South', 'West', 'North'] as const;
    const roundWinds = ['East', 'South'] as const;
    const isTsumo = Math.random() > 0.5;

    // Riichi Logic
    // 50% chance to be Riichi (for testing visibility)
    // We will implement Open Hands (Naki) properly later.
    // For now, all hands are Closed.
    const isRiichi = Math.random() < 0.5;
    const calls: string[] = [];

    // Random Dora (1 indicator)
    const allTiles = [];
    for (const s of SUITS) for (let i = 1; i <= 9; i++) allTiles.push(`${i}${s}`);
    for (let i = 1; i <= 7; i++) allTiles.push(`${i}z`);
    const doraIndicator = allTiles[randomInt(allTiles.length)];

    return {
        tiles: resultStr,
        dora: [doraIndicator],
        wind: winds[randomInt(4)],
        roundWind: roundWinds[randomInt(2)],
        isTsumo: isTsumo,
        isRiichi: isRiichi,
        calls: calls
    };
};
