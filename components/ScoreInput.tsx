import React, { useState } from 'react';

interface ScoreInputProps {
    onSubmit: (han: number, fu: number, points: number) => void;
}

const ScoreInput: React.FC<ScoreInputProps> = ({ onSubmit }) => {
    const [han, setHan] = useState('1');
    const [fu, setFu] = useState('30');
    const [points, setPoints] = useState('1000');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(Number(han), Number(fu), Number(points));
    };

    const fuOptions = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];
    const hanOptions = Array.from({ length: 13 }, (_, i) => i + 1); // 1-13
    const pointOptions = [
        800, 1000, 1100, 1300, 1500, 1600, 2000, 2400, 2600, 2900, 3000, 3200, 3900,
        4000, 4800, 5200, 5800, 6000, 6400, 7700, 8000, 9000, 9600, 11600, 12000,
        16000, 18000, 24000, 32000, 36000, 48000
    ].sort((a, b) => a - b);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-pink-100">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-pink-600 mb-1">Fu (符)</label>
                    <select
                        value={fu}
                        onChange={(e) => setFu(e.target.value)}
                        className="block w-full rounded-lg border-pink-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-lg p-2 border bg-pink-50"
                    >
                        {fuOptions.map(f => <option key={f} value={f}>{f}符</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-pink-600 mb-1">Han (翻)</label>
                    <select
                        value={han}
                        onChange={(e) => setHan(e.target.value)}
                        className="block w-full rounded-lg border-pink-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-lg p-2 border bg-pink-50"
                    >
                        {hanOptions.map(h => <option key={h} value={h}>{h}翻</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-pink-600 mb-1">Points (点数)</label>
                <select
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    className="block w-full rounded-lg border-pink-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-lg p-2 border bg-pink-50"
                >
                    {pointOptions.map(p => <option key={p} value={p}>{p}点</option>)}
                </select>
            </div>
            <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transform transition-all hover:-translate-y-1"
            >
                Check Answer! ✨
            </button>
        </form>
    );
};

export default ScoreInput;
