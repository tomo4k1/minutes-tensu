import React, { useState, useEffect } from 'react';
import './style.css';
import HandDisplay from '@/components/HandDisplay';
import ScoreInput from '@/components/ScoreInput';
import ResultView from '@/components/ResultView';
import { generateRandomHand } from '@/utils/generator';
import type { MahjongHand, ScoreResult } from '@/utils/types';
import { settingsStorage, defaultSettings, GameSettings } from '@/utils/storage';

function App() {
  const [hand, setHand] = useState<MahjongHand | null>(null);
  const [userResult, setUserResult] = useState<{ han: number; fu: number; points: number } | null>(null);
  const [actualResult, setActualResult] = useState<ScoreResult | null>(null);
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);

  const loadNewHand = async () => {
    let attempts = 0;
    while (attempts < 10) {
      attempts++;
      const newHand = generateRandomHand(settings);

      try {
        const { calculateScore } = await import('@/utils/scoring');
        // Force Tsumo if Ron has no Yaku (handled inside loop logic below)

        // Calculate score to check validity
        const result = calculateScore(newHand.tiles, newHand.wind, newHand.roundWind, newHand.dora, settings, newHand.isTsumo, newHand.isRiichi, newHand.calls);

        // If Ron and no Yaku (excluding Dora), try to force Tsumo or regenerate
        const yakuKeys = Object.keys(result.yaku);
        const validYaku = yakuKeys.filter(y => !['ドラ', '赤ドラ', '裏ドラ'].includes(y));

        if (!newHand.isTsumo && validYaku.length === 0) {
          // Try converting to Tsumo
          newHand.isTsumo = true;
          const tsumoResult = calculateScore(newHand.tiles, newHand.wind, newHand.roundWind, newHand.dora, settings, true, newHand.isRiichi, newHand.calls);
          if (tsumoResult.han > 0 && !tsumoResult.error) {
            // Tsumo worked
            setHand(newHand);
            setUserResult(null);
            setActualResult(null);
            return;
          }
        } else if (result.han > 0 && !result.error) {
          // Valid hand
          setHand(newHand);
          setUserResult(null);
          setActualResult(null);
          return;
        }

        // If we get here, hand is invalid (0 Han or Error). Retry.
        console.log('Generated invalid hand (0 Han or Error), retrying...', result);
      } catch (e) {
        console.error('Error checking hand validity:', e);
      }
    }
    console.error('Failed to generate valid hand after 10 attempts');
    // Fallback: show whatever we have to avoid infinite loop, or show error
    // For now, just show the last generated hand (which might be 0 score)
    // But ideally we should alert.
  };

  useEffect(() => {
    const init = async () => {
      try {
        console.log('Starting init...');
        console.log('Loading settings...');
        const s = await settingsStorage.getValue();
        console.log('Settings loaded:', s);
        setSettings(s);
      } catch (e) {
        console.error('Failed to load settings:', e);
        // Fallback to default settings if storage fails
        setSettings(defaultSettings);
      } finally {
        console.log('Loading new hand...');
        loadNewHand();
      }
    };
    init();
  }, []);

  const handleSubmit = async (han: number, fu: number, points: number) => {
    if (!hand) return;
    try {
      // Lazy load scoring logic to improve startup time
      const { calculateScore } = await import('@/utils/scoring');
      const result = calculateScore(hand.tiles, hand.wind, hand.roundWind, hand.dora, settings, hand.isTsumo, hand.isRiichi, hand.calls);
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
      <header className="mb-6 text-center relative">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 drop-shadow-sm">
          🀄 Tensu Gal 🀄
        </h1>
        <p className="text-sm text-gray-500 font-medium mt-1">
          Let's practice scoring! ✨
        </p>
        <a
          href="/options.html"
          target="_blank"
          className="absolute top-1 right-0 text-2xl hover:scale-110 transition-transform cursor-pointer"
          title="Settings"
        >
          ⚙️
        </a>
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
        Powered by WXT & Riichi 💖 v1.2
      </footer>
    </div>
  );
}

export default App;
