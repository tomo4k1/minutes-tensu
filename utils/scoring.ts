import Riichi from 'riichi';
import { ScoreResult } from './types';

const isYaochu = (tile: string): boolean => {
    return /[19]|[z]/.test(tile);
};

const getTileNumber = (tile: string): number => {
    return parseInt(tile.replace(/[a-z]/, ''));
};

const getTileType = (tile: string): string => {
    return tile.replace(/[0-9]/, '');
};

export const calculateScore = (handStr: string, wind: string = 'East', roundWind: string = 'East', dora: string[] = []): ScoreResult => {
    const windMap: Record<string, number> = { 'East': 1, 'South': 2, 'West': 3, 'North': 4 };
    const round = windMap[roundWind] || 1;
    const seat = windMap[wind] || 1;

    let query = `${handStr}+${round}${seat}`;
    if (dora && dora.length > 0) {
        dora.forEach(d => {
            query += `+d${d}`;
        });
    }

    const riichi = new Riichi(query) as any;
    const result = riichi.calc();

    if (result.error) {
        throw new Error('Calculation error');
    }

    // Calculate Fu Details
    const fuDetails: string[] = ['副底 20符']; // Base is always 20
    const pattern = riichi.currentPattern;

    // Determine winning tile (last tile in string)
    const tilesMatch = handStr.match(/[0-9]+[mpsz]/g);
    let winTile = '';
    if (tilesMatch) {
        const lastGroup = tilesMatch[tilesMatch.length - 1];
        const type = lastGroup.slice(-1);
        const nums = lastGroup.slice(0, -1);
        winTile = nums.slice(-1) + type;
    }

    // 1. Mentsu & Head Fu
    if (pattern) {
        pattern.forEach((group: any) => {
            if (Array.isArray(group)) {
                // Mentsu
                if (group.length === 3) {
                    // Check if Shuntsu or Koutsu
                    const t1 = group[0];
                    const t2 = group[1];
                    const t3 = group[2];

                    if (t1 === t2 && t2 === t3) {
                        // Koutsu (Triplet)
                        // Assume Closed for now (Ankou)
                        const isYao = isYaochu(t1);
                        const fu = isYao ? 8 : 4;
                        fuDetails.push(`暗刻 (${t1}) ${fu}符`);
                    }
                } else if (group.length === 1) {
                    // Koutsu (Triplet) - Compressed by riichi (e.g. ['6m'])
                    const t1 = group[0];
                    const isYao = isYaochu(t1);
                    const fu = isYao ? 8 : 4;
                    fuDetails.push(`暗刻 (${t1}) ${fu}符`);
                } else if (group.length === 4) {
                    // Kantsu (Quad) - Assume Closed (Ankan)
                    const t1 = group[0];
                    const isYao = isYaochu(t1);
                    const fu = isYao ? 32 : 16;
                    fuDetails.push(`暗槓 (${t1}) ${fu}符`);
                }
            } else {
                // Head (String)
                const head = group;
                if (['5z', '6z', '7z'].includes(head)) {
                    fuDetails.push(`役牌雀頭 (${head}) 2符`);
                } else if (head === '1z') {
                    fuDetails.push(`連風牌雀頭 (${head}) 2符`); // Simplified
                }
            }
        });
    }

    // 2. Wait Fu
    if (pattern) {
        let waitFuFound = false;
        for (const group of pattern) {
            if (waitFuFound) break;

            if (Array.isArray(group)) {
                // Shuntsu
                if (group.length === 3 && group[0] !== group[1]) {
                    const n1 = getTileNumber(group[0]);
                    const n2 = getTileNumber(group[1]);
                    const n3 = getTileNumber(group[2]);
                    const type = getTileType(group[0]);
                    const winNum = getTileNumber(winTile);
                    const winType = getTileType(winTile);

                    if (type === winType) {
                        if (winNum === n2) {
                            // Kanchan
                            fuDetails.push(`嵌張待ち 2符`);
                            waitFuFound = true;
                        } else if ((n1 === 1 && n2 === 2 && n3 === 3 && winNum === 3) ||
                            (n1 === 7 && n2 === 8 && n3 === 9 && winNum === 7)) {
                            // Penchan
                            fuDetails.push(`辺張待ち 2符`);
                            waitFuFound = true;
                        }
                    }
                }
            } else {
                // Head
                if (group === winTile) {
                    fuDetails.push(`単騎待ち 2符`);
                    waitFuFound = true;
                }
            }
        }
    }

    // 3. Win Type Fu
    const isPinfu = result.yaku && Object.keys(result.yaku).some(y => y.includes('平和'));
    const isTsumo = result.text.includes('自摸') || result.text.includes('Tsumo');

    if (isTsumo) {
        if (!isPinfu) {
            fuDetails.push(`ツモ 2符`);
        }
    } else {
        // Ron
        // Menzen Ron is +10. Assuming Menzen for now.
        fuDetails.push(`門前ロン 10符`);
    }

    return {
        han: result.han,
        fu: result.fu,
        points: result.ten,
        yaku: result.yaku,
        fuDetails: fuDetails,
        text: result.text
    };
};
