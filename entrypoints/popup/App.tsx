import React, { useState, useEffect } from 'react';
import './style.css';
import HandDisplay from '@/components/HandDisplay';
import ScoreInput from '@/components/ScoreInput';
import ResultView from '@/components/ResultView';
import { generateRandomHand } from '@/utils/generator';
import type { MahjongHand, ScoreResult } from '@/utils/types';

function App() {
  const [hand, setHand] = useState<MahjongHand | null>(null);
  const [userResult, setUserResult] = useState<{ han: number; fu: number; points: number } | null>(null);
  const [actualResult, setActualResult] = useState<ScoreResult | null>(null);

  const loadNewHand = () => {
    const newHand = generateRandomHand();
    setHand(newHand);
    setUserResult(null);
    setActualResult(null);
  };

  useEffect(() => {
    loadNewHand();
  }, []);

  const handleSubmit = async (han: number, fu: number, points: number) => {
    if (!hand) return;
    try {
      // Lazy load scoring logic to improve startup time
      const { calculateScore } = await import('@/utils/scoring');
      const result = calculateScore(hand.tiles, hand.wind, hand.roundWind, hand.dora);
      setActualResult(result);
      setUserResult({ han, fu, points });
    } catch (e: any) {
      console.error(e);
      alert(`Error calculating score: ${e.message}\n${JSON.stringify(e)}`);
    }
  };

  if (!hand) return <div className="p-4 text-center text-pink-500">Loading... ⏳</div>;

  return (
    <div className="w-[400px] min-h-[600px] bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6 font-sans text-gray-800">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 drop-shadow-sm">
          🀄 Tensu Gal 🀄
        </h1>
        <p className="text-sm text-gray-500 font-medium mt-1">
          Let's practice scoring! ✨
        </p>
      </header>

      <main className="space-y-8">
        <HandDisplay hand={hand} />

        {!userResult ? (
          <ScoreInput onSubmit={handleSubmit} />
        ) : (
          actualResult && (
            <ResultView
              userResult={userResult}
              actualResult={actualResult}
              onNext={loadNewHand}
            />
          )
        )}
      </main>

      <footer className="mt-8 text-center text-xs text-gray-400">
        Powered by WXT & Riichi 💖
      </footer>
    </div>
  );
}

export default App;
