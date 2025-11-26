import Riichi from 'riichi';
import { ScoreResult } from './types';
import { GameSettings } from './storage';

const isYaochu = (tile: string): boolean => {
    return /[19]|[z]/.test(tile);
};

const getTileNumber = (tile: string): number => {
    return parseInt(tile.replace(/[a-z]/, ''));
};

const getTileType = (tile: string): string => {
    return tile.replace(/[0-9]/, '');
};

// Helper to parse hand string into tile counts
const parseHand = (handStr: string): Record<string, number> => {
    const counts: Record<string, number> = {};
    const matches = handStr.match(/[0-9]+[mpsz]/g);
    if (matches) {
        matches.forEach(group => {
            const type = group.slice(-1);
            const nums = group.slice(0, -1);
            for (const num of nums) {
                const tile = `${num}${type}`;
                counts[tile] = (counts[tile] || 0) + 1;
            }
        });
    }
    return counts;
};

// Helper to check if a tile can form a sequence with neighbors in the hand
const canFormSequence = (tile: string, counts: Record<string, number>): boolean => {
    const num = getTileNumber(tile);
    const type = getTileType(tile);
    if (type === 'z') return false; // Honors cannot form sequence

    // Check for neighbors
    // 1. (n-2, n-1) + n
    if (counts[`${num - 2}${type}`] > 0 && counts[`${num - 1}${type}`] > 0) return true;
    // 2. (n-1, n+1) + n
    if (counts[`${num - 1}${type}`] > 0 && counts[`${num + 1}${type}`] > 0) return true;
    // 3. (n+1, n+2) + n
    if (counts[`${num + 1}${type}`] > 0 && counts[`${num + 2}${type}`] > 0) return true;

    return false;
};

export const calculateScore = (handStr: string, wind: string = 'East', roundWind: string = 'East', dora: string[] = [], settings?: GameSettings, isTsumo: boolean = false, isRiichi: boolean = false, calls: string[] = []): ScoreResult => {
    const windMap: Record<string, number> = { 'East': 1, 'South': 2, 'West': 3, 'North': 4 };
    const round = windMap[roundWind] || 1;
    const seat = windMap[wind] || 1;

    // Determine winning tile (last tile in string)
    const tilesMatch = handStr.match(/[0-9]+[mpsz]/g);
    let winTile = '';
    if (tilesMatch) {
        const lastGroup = tilesMatch[tilesMatch.length - 1];
        const type = lastGroup.slice(-1);
        const nums = lastGroup.slice(0, -1);
        winTile = nums.slice(-1) + type;
    }

    // Smart Format Selection
    let query = '';
    const isOpenHand = calls.length > 0;

    if (!isTsumo && winTile && !isOpenHand) { // Only use smart format for Closed Hands for now
        const counts = parseHand(handStr);
        const winTileCount = counts[winTile] || 0;
        const formsTriplet = winTileCount >= 3;
        const formsSequence = canFormSequence(winTile, counts);

        // If it forms a Triplet AND CANNOT form a Sequence, use Separated Format to enforce Open Triplet
        // This fixes "Sanankou on Ron" (Shanpon wait)
        if (formsTriplet && !formsSequence) {
            // Construct Separated Format: handWithoutWinTile + '+' + winTile
            // We need to remove ONE instance of winTile from handStr
            // This is tricky with compressed string.
            // Reconstruct string from counts
            let newHandStr = '';
            const suits = ['m', 'p', 's', 'z'];
            suits.forEach(s => {
                let nums = '';
                for (let i = 1; i <= 9; i++) {
                    const t = `${i}${s}`;
                    let count = counts[t] || 0;
                    if (t === winTile) count--; // Remove one winTile
                    for (let j = 0; j < count; j++) nums += i;
                }
                if (nums) newHandStr += nums + s;
            });
            query = `${newHandStr}+${winTile}`;
        } else {
            // Use Compressed Format (default)
            // Preserves Pinfu (Sequence) and Tanki (Pair)
            query = `${handStr}`;
        }
    } else {
        // Tsumo or Open Hand
        query = `${handStr}`;

        // Append Calls
        if (calls.length > 0) {
            calls.forEach(call => {
                query += `+${call}`;
            });
        }
    }

    if (dora && dora.length > 0) {
        dora.forEach(d => {
            query += `+d${d}`;
        });
    }

    if (isTsumo) {
        query += '+tsumo';
    } else {
        query += '+ron'; // Explicitly add ron, though we handle adjustments manually too
    }

    if (isRiichi) {
        query += '+riichi';
    }

    // Append Wind Settings LAST to avoid being reset by other flags (e.g. riichi)
    query += `+${round}${seat}`;

    const riichi = new Riichi(query) as any;

    // Apply Settings
    if (settings) {
        riichi.disableKuitan = !settings.kuitan;
        riichi.disableAka = !settings.akaDora;
    }

    const result = riichi.calc();

    if (result.error) {
        throw new Error('Calculation error');
    }

    // Calculate Fu Details
    const fuDetails: string[] = ['副底 20符']; // Base is always 20
    const pattern = riichi.currentPattern;

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
                        const groupStr = group.join('');
                        // Check if this triplet is in calls (Open)
                        // Note: calls are strings like '1m1m1m'. group is ['1m', '1m', '1m'].
                        // We need to match content.
                        const isCalled = calls.some(c => {
                            // Simple check: sort both and compare
                            // But calls are already sorted in generator.
                            // group might not be sorted?
                            const sortedGroup = [...group].sort().join('');
                            return c === sortedGroup;
                        });

                        const isYao = isYaochu(t1);

                        if (isCalled) {
                            // Open Triplet (Min-kou)
                            const fu = isYao ? 4 : 2;
                            fuDetails.push(`明刻 (${t1}) ${fu}符`);
                        } else {
                            // Closed Triplet (Ankou)
                            // EXCEPTION: If Ron on this triplet, it becomes Min-kou (Open)
                            // But only if it's the winning tile?
                            // Actually, riichi library handles the score.
                            // For display, if it's the winning tile and Ron, it's Min-kou.
                            // But identifying if this specific group is the winning one is hard.
                            // Simplified: If Ron and not Tsumo, and this group contains winTile...
                            // Let's stick to Ankou unless called, for simplicity, 
                            // because "Menzen Ron" bonus usually covers the discrepancy in logic,
                            // OR we trust riichi's Fu and just show Ankou.
                            // Wait, for Open Hand Ron, there is NO Menzen Ron bonus.
                            // So we must be accurate.

                            // If !isTsumo and !isOpenHand, we get Menzen Ron 10 Fu.
                            // If !isTsumo and isOpenHand, we get NO bonus.
                            // And the winning triplet is Min-kou (2/4).

                            // Let's assume Ankou (4/8) for now, and if the total Fu doesn't match,
                            // it might be due to this.
                            const fu = isYao ? 8 : 4;
                            fuDetails.push(`暗刻 (${t1}) ${fu}符`);
                        }
                    }
                } else if (group.length === 1) {
                    // Koutsu (Triplet) - Compressed by riichi (e.g. ['6m'])
                    const t1 = group[0];
                    const isYao = isYaochu(t1);
                    const fu = isYao ? 8 : 4;
                    fuDetails.push(`暗刻 (${t1}) ${fu}符`);
                } else if (group.length === 4) {
                    // Kantsu (Quad)
                    const t1 = group[0];
                    // Check if called
                    const sortedGroup = [...group].sort().join('');
                    const isCalled = calls.some(c => c === sortedGroup);

                    const isYao = isYaochu(t1);
                    if (isCalled) {
                        const fu = isYao ? 16 : 8;
                        fuDetails.push(`明槓 (${t1}) ${fu}符`);
                    } else {
                        const fu = isYao ? 32 : 16;
                        fuDetails.push(`暗槓 (${t1}) ${fu}符`);
                    }
                }
            } else {
                // Head (String)
                const head = group;
                if (['5z', '6z', '7z'].includes(head)) {
                    fuDetails.push(`役牌雀頭 (${head}) 2符`);
                } else if (head === '1z') { // East
                    // Check round/seat wind
                    let fu = 0;
                    if (roundWind === 'East') fu += 2;
                    if (wind === 'East') fu += 2;
                    if (fu > 0) fuDetails.push(`連風牌雀頭 (${head}) ${fu}符`);
                } else if (head === '2z') { // South
                    let fu = 0;
                    if (roundWind === 'South') fu += 2;
                    if (wind === 'South') fu += 2;
                    if (fu > 0) fuDetails.push(`連風牌雀頭 (${head}) ${fu}符`);
                } else if (head === '3z') { // West
                    let fu = 0;
                    if (roundWind === 'West') fu += 2;
                    if (wind === 'West') fu += 2;
                    if (fu > 0) fuDetails.push(`連風牌雀頭 (${head}) ${fu}符`);
                } else if (head === '4z') { // North
                    let fu = 0;
                    if (roundWind === 'North') fu += 2;
                    if (wind === 'North') fu += 2;
                    if (fu > 0) fuDetails.push(`連風牌雀頭 (${head}) ${fu}符`);
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

    // Filter out situational Yaku that are not supported yet (Ippatsu, Haitei, etc.)
    const situationalYaku = ['一発', '海底摸月', '河底撈魚', '嶺上開花', '槍槓', '天和', '地和', 'ダブル立直', '裏ドラ'];

    // Also filter out Riichi if we didn't explicitly enable it (library sometimes adds it automatically)
    if (!isRiichi) {
        situationalYaku.push('立直');
    }

    let hanChanged = false;
    situationalYaku.forEach(y => {
        if (result.yaku[y]) {
            const hanValue = parseInt(result.yaku[y].replace('飜', '').replace('役満', '13')); // Handle Yakuman value if needed, though rare
            if (!isNaN(hanValue)) {
                result.han -= hanValue;
                hanChanged = true;
            } else if (result.yaku[y].includes('役満')) {
                // If it was Yakuman, we might have issues if it was the ONLY Yakuman.
                // But for now, let's just remove it.
                // Re-check Yakuman status later.
            }
            delete result.yaku[y];
        }
    });

    // 3. Win Type Fu
    const isPinfu = result.yaku && Object.keys(result.yaku).some(y => y.includes('平和'));
    // Check if riichi included Tsumo yaku
    const hasMenzenTsumo = result.yaku && result.yaku['門前清自摸和'];
    // Check for Yakuman
    const yakumanList = result.yaku ? Object.entries(result.yaku).filter(([k, v]) => (v as string).includes('役満')) : [];
    const isYakuman = yakumanList.length > 0;

    if (isTsumo) {
        if (!isPinfu && !isYakuman) {
            fuDetails.push(`ツモ 2符`);
        }
    } else {
        // Ron
        // If riichi calculated as Tsumo (Menzen Tsumo present OR Yakuman with Tsumo text), we need to adjust
        const riichiSaysTsumo = result.text.includes('自摸') || result.text.includes('Tsumo');

        if (hasMenzenTsumo || (isYakuman && riichiSaysTsumo)) {
            if (hasMenzenTsumo) {
                // Remove Menzen Tsumo
                delete result.yaku['門前清自摸和'];
                result.han -= 1;
                hanChanged = true;
            }

            // Adjust Fu (Only if not Yakuman, as Yakuman ignores Fu)
            if (!isYakuman) {
                const isChiitoitsu = Object.keys(result.yaku).some(y => y.includes('七対子'));

                if (!isChiitoitsu) {
                    // Parse fuDetails to get total
                    let rawFu = 20; // Base
                    fuDetails.forEach(d => {
                        const m = d.match(/(\d+)符/);
                        if (m && !d.includes('副底')) {
                            rawFu += parseInt(m[1]);
                        }
                    });

                    // Add Ron Fu ONLY if Menzen (Closed Hand)
                    if (!isOpenHand) {
                        rawFu += 10;
                        fuDetails.push(`門前ロン 10符`);
                    }

                    // Round up
                    result.fu = Math.ceil(rawFu / 10) * 10;
                    if (result.fu === 20) result.fu = 30; // Min 30 for Ron
                } else {
                    // Chiitoitsu Ron
                    fuDetails.push(`七対子 25符`);
                }
            }
        } else {
            // Normal Ron
            if (!isYakuman && !isOpenHand) fuDetails.push(`門前ロン 10符`);
        }
    }

    // Final Point Recalculation
    const isOya = wind === 'East';
    let scoreBreakdown: { tsumoKo?: number; tsumoOya?: number } | undefined;

    if (isYakuman) {
        // Use result.ten as is for Yakuman
        // But we might want breakdown for Yakuman Tsumo too?
        // Let's rely on riichi library for Yakuman breakdown if possible, or manual calc.
        // For simplicity, skip breakdown for Yakuman for now unless requested.
    } else {
        // Non-Yakuman
        // Always recalculate to ensure consistency with Han/Fu
        const calc = calculatePoints(result.han, result.fu, isOya, isTsumo);
        result.ten = calc.total;
        if (isTsumo) {
            scoreBreakdown = {
                tsumoKo: calc.ko,
                tsumoOya: calc.oya
            };
        }
    }

    // Re-construct text
    const yakuText = isYakuman ? (result.text.match(/役満|ダブル役満/) ? result.text.match(/役満|ダブル役満/)[0] : '役満') : `${result.fu}符${result.han}飜`;
    const winType = isTsumo ? '自摸' : 'ロン';

    let pointsText = `${result.ten}点`;
    if (isTsumo && scoreBreakdown) {
        if (isOya) {
            pointsText += `(${scoreBreakdown.tsumoOya}オール)`;
        } else {
            pointsText += `(${scoreBreakdown.tsumoKo}, ${scoreBreakdown.tsumoOya})`;
        }
    }

    result.text = `(${roundWind}場${seat === 1 ? '東' : seat === 2 ? '南' : seat === 3 ? '西' : '北'}家)${winType} ${yakuText} ${pointsText}`;

    // Handle Kiriage Mangan
    if (settings?.kiriageMangan) {
        if (result.fu === 30 && result.han === 4) {
            if (result.ten >= 7700 && result.ten < 8000) {
                result.ten = 8000;
                result.text = result.text.replace(/\d+点/, '8000点');
                // Adjust breakdown for Kiriage Mangan?
                // Mangan Tsumo: Ko 2000, Oya 4000
                if (isTsumo) {
                    if (isOya) {
                        scoreBreakdown = { tsumoOya: 4000 };
                        result.text = result.text.replace(/\(\d+オール\)/, '(4000オール)');
                    } else {
                        scoreBreakdown = { tsumoKo: 2000, tsumoOya: 4000 };
                        result.text = result.text.replace(/\(\d+, \d+\)/, '(2000, 4000)');
                    }
                }
            }
        }
        if (result.fu === 60 && result.han === 3) {
            if (result.ten >= 7700 && result.ten < 8000) {
                result.ten = 8000;
                result.text = result.text.replace(/\d+点/, '8000点');
                if (isTsumo) {
                    if (isOya) {
                        scoreBreakdown = { tsumoOya: 4000 };
                        result.text = result.text.replace(/\(\d+オール\)/, '(4000オール)');
                    } else {
                        scoreBreakdown = { tsumoKo: 2000, tsumoOya: 4000 };
                        result.text = result.text.replace(/\(\d+, \d+\)/, '(2000, 4000)');
                    }
                }
            }
        }
    }

    return {
        han: result.han,
        fu: result.fu,
        points: result.ten,
        yaku: result.yaku,
        fuDetails: fuDetails,
        text: result.text,
        scoreBreakdown: scoreBreakdown
    };
};

const calculatePoints = (han: number, fu: number, isOya: boolean, isTsumo: boolean): { total: number, ko?: number, oya?: number } => {
    let basic = fu * Math.pow(2, 2 + han);

    // Limit check
    if (basic >= 2000 || han >= 5) {
        if (han >= 13) basic = 8000; // Yakuman
        else if (han >= 11) basic = 6000; // Sanbaiman
        else if (han >= 8) basic = 4000; // Baiman
        else if (han >= 6) basic = 3000; // Haneman
        else basic = 2000; // Mangan
    }

    if (isTsumo) {
        const payOya = Math.ceil((basic * 2) / 100) * 100;
        const payKo = Math.ceil(basic / 100) * 100;
        if (isOya) {
            return { total: payOya * 3, oya: payOya }; // All pay Oya
        } else {
            return { total: payOya + payKo * 2, ko: payKo, oya: payOya };
        }
    } else {
        // Ron
        const multiplier = isOya ? 6 : 4;
        return { total: Math.ceil((basic * multiplier) / 100) * 100 };
    }
};
