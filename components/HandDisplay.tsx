import React from 'react';
import { MahjongHand } from '@/utils/types';
import { handToTileObjects } from '@/utils/unicode';
import { getTileName } from '@/utils/formatters';

interface HandDisplayProps {
    hand: MahjongHand;
}

const HandDisplay: React.FC<HandDisplayProps> = ({ hand }) => {
    console.log('HandDisplay render:', hand);
    const tileObjects = handToTileObjects(hand.tiles);

    const windMap: Record<string, string> = { 'East': '東', 'South': '南', 'West': '西', 'North': '北' };
    const round = windMap[hand.roundWind || 'East'];
    const seat = windMap[hand.wind || 'East'];

    return (
        <div className="relative p-6 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl shadow-lg text-center transform transition-all hover:scale-105 min-h-[160px] flex flex-col justify-center items-center">

            {/* Riichi Stick */}
            {hand.isRiichi && (
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-white border border-red-500 rounded-full px-4 py-1 shadow-md flex items-center gap-2 z-50">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-gray-700 tracking-wider">RIICHI</span>
                </div>
            )}

            {/* Status Badge */}
            <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-bl-xl shadow-sm z-10 ${hand.isTsumo ? 'bg-blue-500' : 'bg-orange-500'}`}>
                {hand.isTsumo ? 'TSUMO' : 'RON'}
            </div>

            {/* Tiles */}
            {/* Tiles */}
            <div className="text-white text-6xl font-serif tracking-widest drop-shadow-md flex justify-center flex-wrap mt-4 mb-2 relative z-0 items-end gap-4">
                {/* Closed Hand */}
                <div className="flex flex-wrap justify-center">
                    {tileObjects.map((t, i) => (
                        <span key={i} className={`transform transition-transform hover:-translate-y-1 ${t.isRed ? 'text-red-500 filter drop-shadow-sm' : ''}`}>
                            {t.char}
                        </span>
                    ))}
                </div>

                {/* Calls (Open Sets) */}
                {hand.calls && hand.calls.length > 0 && (
                    <div className="flex gap-2 opacity-90">
                        {hand.calls.map((call, i) => (
                            <div key={i} className="flex bg-black/10 rounded px-1">
                                {handToTileObjects(call).map((t, j) => (
                                    <span key={j} className={`transform ${t.isRed ? 'text-red-500 filter drop-shadow-sm' : ''}`}>
                                        {t.char}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Footer */}
            <div className="mt-2 flex justify-center gap-3 relative z-0">
                <div className="text-pink-100 text-sm font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    {round}場 {seat}家
                </div>
                <div className="text-pink-100 text-sm font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    Dora: {hand.dora?.map(d => getTileName(d)).join('・') || 'None'}
                </div>
            </div>
        </div>
    );
};

export default HandDisplay;
