import React, { useState } from 'react';

interface ScoreInputProps {
    onSubmit: (han: number, fu: number, points: number) => void;
}

const ScoreInput: React.FC<ScoreInputProps> = ({ onSubmit }) => {
    const [han, setHan] = useState('');
    const [fu, setFu] = useState('');
    const [points, setPoints] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(Number(han), Number(fu), Number(points));
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-pink-100">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-pink-600 mb-1">Han (翻)</label>
                    <input
                        type="number"
                        value={han}
                        onChange={(e) => setHan(e.target.value)}
                        className="block w-full rounded-lg border-pink-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-lg p-2 border bg-pink-50"
                        placeholder="3"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-pink-600 mb-1">Fu (符)</label>
                    <input
                        type="number"
                        value={fu}
                        onChange={(e) => setFu(e.target.value)}
                        className="block w-full rounded-lg border-pink-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-lg p-2 border bg-pink-50"
                        placeholder="30"
                        required
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-pink-600 mb-1">Points (点数)</label>
                <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    className="block w-full rounded-lg border-pink-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-lg p-2 border bg-pink-50"
                    placeholder="4000"
                    required
                />
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
