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

    const sets: string[][] = [];

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
                    sets.push([tile, tile, tile]);
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
                    sets.push([t1, t2, t3]);
                    added = true;
                }
            }
        }
    }

    // 2. Generate Pair (Jantou)
    let pair: string[] = [];
    let pairAdded = false;
    while (!pairAdded) {
        const available = deck.getAvailableTiles();
        const tile = available[randomInt(available.length)];
        if (deck.tryTake([tile, tile])) {
            pair = [tile, tile];
            pairAdded = true;
        }
    }

    // 3. Naki (Open Hand) Logic
    const isOpenHand = Math.random() < 0.3; // 30% chance to be open
    const calls: string[] = [];
    let isRiichi = false;

    if (isOpenHand) {
        // Decide how many sets to open (1 to 4, usually 1 or 2)
        const numOpen = randomInt(2) + 1; // 1 or 2 sets open

        // Shuffle indices 0-3
        const indices = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
        const openIndices = indices.slice(0, numOpen);

        openIndices.forEach(idx => {
            const set = sets[idx];
            // Format call string: e.g. "1m1m1m" -> "111m", "2p3p4p" -> "234p"
            // Sort set for consistency
            set.sort();

            // Compress to short format for riichi library
            const suit = set[0].slice(-1);
            const nums = set.map(t => t.slice(0, -1)).join('');
            calls.push(nums + suit);

            // Mark as null or remove? We need to exclude from handTiles.
            sets[idx] = []; // Empty it
        });
    } else {
        // Closed Hand
        isRiichi = Math.random() < 0.5;
    }

    // 4. Assemble Hand Tiles (Closed Part)
    sets.forEach(s => handTiles.push(...s));
    handTiles.push(...pair);

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
    if (settings?.akaDora) {
        const suits = ['m', 'p', 's'];
        suits.forEach(suit => {
            // Find all 5s of this suit in CLOSED tiles
            const indices = finalTiles.map((t, i) => t === `5${suit}` ? i : -1).filter(i => i !== -1);
            if (indices.length > 0) {
                const targetIndex = indices[randomInt(indices.length)];
                finalTiles[targetIndex] = `0${suit}`;
            }

            // Also check CALLS for Red Dora
            // This is trickier because calls are strings.
            // Let's simplify: Only apply Red Dora to closed tiles for now.
            // Applying to calls requires parsing and rebuilding the call string.
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

    // 6. Randomize Conditions
    const winds = ['East', 'South', 'West', 'North'] as const;
    const roundWinds = ['East', 'South'] as const;
    const isTsumo = Math.random() > 0.5;

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
