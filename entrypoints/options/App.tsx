import React, { useEffect, useState } from 'react';
import { settingsStorage, defaultSettings, GameSettings } from '@/utils/storage';

const SettingsApp: React.FC = () => {
    const [settings, setSettings] = useState<GameSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            const stored = await settingsStorage.getValue();
            setSettings(stored);
            setLoading(false);
        };
        loadSettings();
    }, []);

    const handleChange = async (key: keyof GameSettings) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        setSettings(newSettings);
        await settingsStorage.setValue(newSettings);
    };

    if (loading) return <div className="p-8 text-center text-pink-500">Loading... ⏳</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-8 font-sans text-gray-800 flex justify-center items-center">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 drop-shadow-sm">
                        ⚙️ Settings ⚙️
                    </h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                        自分好みにカスタマイズしてね！💖
                    </p>
                </header>

                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div>
                            <h3 className="font-bold text-lg text-gray-700">喰いタン</h3>
                            <p className="text-xs text-gray-400">鳴いてもタンヤオつくやつ！</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.kuitan}
                                onChange={() => handleChange('kuitan')}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div>
                            <h3 className="font-bold text-lg text-gray-700">赤ドラ</h3>
                            <p className="text-xs text-gray-400">赤い5萬・5筒・5索を入れる？</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.akaDora}
                                onChange={() => handleChange('akaDora')}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div>
                            <h3 className="font-bold text-lg text-gray-700">切り上げ満貫</h3>
                            <p className="text-xs text-gray-400">30符4飜を満貫にする？</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.kiriageMangan}
                                onChange={() => handleChange('kiriageMangan')}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                        </label>
                    </div>
                </div>

                <footer className="mt-8 text-center text-xs text-gray-400">
                    Saved automatically ✨
                </footer>
            </div>
        </div>
    );
};

export default SettingsApp;
