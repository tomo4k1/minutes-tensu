
export const getTileName = (tile: string): string => {
    if (!tile) return '';

    const type = tile.slice(-1);
    const numStr = tile.slice(0, -1);
    const num = parseInt(numStr);

    if (isNaN(num)) return tile;

    // Handle Red 5 (0)
    const effectiveNum = num === 0 ? 5 : num;
    const isRed = num === 0;

    const numMap = ['unused', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

    if (type === 'm') return `${numMap[effectiveNum]}萬${isRed ? '(赤)' : ''}`;
    if (type === 'p') return `${numMap[effectiveNum]}筒${isRed ? '(赤)' : ''}`;
    if (type === 's') return `${numMap[effectiveNum]}索${isRed ? '(赤)' : ''}`;
    if (type === 'z') {
        const honorMap: Record<number, string> = {
            1: '東', 2: '南', 3: '西', 4: '北',
            5: '白', 6: '發', 7: '中'
        };
        return honorMap[effectiveNum] || tile;
    }

    return tile;
};
