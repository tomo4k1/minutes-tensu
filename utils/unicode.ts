export const handToUnicode = (handStr: string): string => {
    const map: Record<string, number> = {
        m: 0x1F007, // 1m start (offset -1 because 1m is 0x1F007) -> Wait, 1m is 0x1F007. 
        // U+1F007 is MAHJONG TILE ONE BAMBOO? No.
        // U+1F007 is MAHJONG TILE ONE CHARACTER (Wan)
        p: 0x1F019, // 1p start (MAHJONG TILE ONE DOT)
        s: 0x1F010, // 1s start (MAHJONG TILE ONE BAMBOO)
        z: 0x1F000, // 1z (East) start (MAHJONG TILE EAST WIND)
    };

    // Simple parser: numbers followed by type
    // e.g. 123m -> 1m 2m 3m
    let result = '';
    let buffer: number[] = [];

    for (const char of handStr) {
        if (/[0-9]/.test(char)) {
            buffer.push(parseInt(char));
        } else if (['m', 'p', 's', 'z'].includes(char)) {
            const base = map[char];
            for (const num of buffer) {
                let codePoint = 0;
                if (char === 'z') {
                    // z1=East(1F000), z2=South(1F001), z3=West(1F002), z4=North(1F003)
                    // z5=Red(1F004), z6=Green(1F005), z7=White(1F006)
                    codePoint = base + (num - 1);
                } else {
                    // m1=1F007, m2=1F008...
                    codePoint = base + (num - 1);
                }
                result += String.fromCodePoint(codePoint);
            }
            buffer = [];
        }
    }
    return result;
};

export interface TileObject {
    char: string;
    isRed: boolean;
}

export const handToTileObjects = (handStr: string): TileObject[] => {
    const map: Record<string, number> = {
        m: 0x1F007,
        p: 0x1F019,
        s: 0x1F010,
        z: 0x1F000,
    };

    const result: TileObject[] = [];
    let buffer: number[] = [];

    for (const char of handStr) {
        if (/[0-9]/.test(char)) {
            buffer.push(parseInt(char));
        } else if (['m', 'p', 's', 'z'].includes(char)) {
            const base = map[char];
            for (const num of buffer) {
                let codePoint = 0;
                let isRed = false;
                let effectiveNum = num;

                if (num === 0) {
                    isRed = true;
                    effectiveNum = 5;
                }

                if (char === 'z') {
                    if (effectiveNum === 5) codePoint = 0x1F006; // White
                    else if (effectiveNum === 6) codePoint = 0x1F005; // Green
                    else if (effectiveNum === 7) codePoint = 0x1F004; // Red
                    else codePoint = base + (effectiveNum - 1);
                } else {
                    codePoint = base + (effectiveNum - 1);
                }
                result.push({
                    char: String.fromCodePoint(codePoint) + '\uFE0E',
                    isRed
                });
            }
            buffer = [];
        }
    }
    return result;
};
