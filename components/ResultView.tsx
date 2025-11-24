import React from 'react';
import { ScoreResult } from '@/utils/types';

interface ResultViewProps {
    userResult: { han: number; fu: number; points: number };
    actualResult: ScoreResult;
    onNext: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ userResult, actualResult, onNext }) => {
    const isCorrect =
        userResult.han === actualResult.han &&
        userResult.fu === actualResult.fu &&
        userResult.points === actualResult.points;

    return (
        <div className="p-6 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border-2 border-pink-200 space-y-4 animate-fade-in">
            <div className={`text-2xl font-black text-center ${isCorrect ? 'text-pink-500' : 'text-purple-600'}`}>
                {isCorrect ? 'よき〜！✨ Perfect!' : 'おしい！💦 Try again!'}
            </div>

            <div className="border-t-2 border-pink-100 pt-4">
                <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <span>📝</span> Correct Answer
                </h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-pink-50 p-2 rounded-lg border border-pink-100">
                        <div className="text-xs text-pink-400 font-bold uppercase">Han</div>
                        <div className="font-black text-xl text-gray-800">{actualResult.han}</div>
                    </div>
                    <div className="bg-pink-50 p-2 rounded-lg border border-pink-100">
                        <div className="text-xs text-pink-400 font-bold uppercase">Fu</div>
                        <div className="font-black text-xl text-gray-800">{actualResult.fu}</div>
                    </div>
                    <div className="bg-pink-50 p-2 rounded-lg border border-pink-100">
                        <div className="text-xs text-pink-400 font-bold uppercase">Points</div>
                        <div className="font-black text-xl text-gray-800">
                            {(() => {
                                // Try to extract Tsumo breakdown from text
                                const tsumoMatch = actualResult.text.match(/(\d+)\/(\d+)/);
                                if (tsumoMatch) {
                                    return <span className="text-lg">{tsumoMatch[1]}-{tsumoMatch[2]}</span>;
                                }
                                const oyaTsumoMatch = actualResult.text.match(/(\d+) all/i);
                                if (oyaTsumoMatch) {
                                    return <span className="text-lg">{oyaTsumoMatch[1]} all</span>;
                                }
                                return actualResult.points;
                            })()}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <h4 className="font-bold text-sm text-gray-700 flex items-center gap-2">
                    <span>🀄</span> Yaku (役)
                </h4>
                <ul className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 space-y-1 border border-gray-100">
                    {Object.entries(actualResult.yaku).map(([name, han]) => (
                        <li key={name} className="flex justify-between">
                            <span>{name}</span>
                            <span className="font-bold text-pink-500">{han}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="font-bold text-sm text-gray-700 flex items-center gap-2">
                    <span>wv</span> Fu Details (符計算)
                </h4>
                <ul className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 space-y-1 border border-gray-100">
                    {actualResult.fuDetails.map((detail, index) => (
                        <li key={index} className="text-gray-600">• {detail}</li>
                    ))}
                </ul>
            </div>

            <div className="text-xs text-center text-gray-400 mt-2 font-mono">
                {actualResult.text}
            </div>

            <button
                onClick={onNext}
                className="w-full py-3 px-4 bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-full hover:from-pink-500 hover:to-pink-700 font-bold shadow-md transform transition-all hover:-translate-y-1"
            >
                Next Hand ➡️
            </button>
        </div>
    );
};

export default ResultView;
