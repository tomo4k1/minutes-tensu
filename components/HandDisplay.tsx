import React from 'react';
import { MahjongHand } from '@/utils/types';
import { handToUnicode } from '@/utils/unicode';

interface HandDisplayProps {
    hand: MahjongHand;
}

const HandDisplay: React.FC<HandDisplayProps> = ({ hand }) => {
    const unicodeTiles = handToUnicode(hand.tiles);

    const windMap: Record<string, string> = { 'East': '東', 'South': '南', 'West': '西', 'North': '北' };
    const round = windMap[hand.roundWind || 'East'];
    const seat = windMap[hand.wind || 'East'];

    return (
        <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg text-center transform transition-all hover:scale-105">
            <div className="text-white text-6xl font-serif tracking-widest drop-shadow-md">
                {unicodeTiles}
            </div>
            <div className="mt-4 flex justify-center gap-3">
                <div className="text-pink-100 text-sm font-bold bg-white/20 px-3 py-1 rounded-full">
                    {round}場 {seat}家
                </div>
                <div className="text-pink-100 text-sm font-bold bg-white/20 px-3 py-1 rounded-full">
                    Dora: {hand.dora?.join(', ') || 'None'}
                </div>
            </div>
        </div>
    );
};

export default HandDisplay;
