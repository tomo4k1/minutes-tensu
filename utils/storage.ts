// Auto-imported storage

export interface GameSettings {
    kuitan: boolean;
    akaDora: boolean;
    kiriageMangan: boolean;
}

export const defaultSettings: GameSettings = {
    kuitan: true,
    akaDora: true,
    kiriageMangan: false,
};

export const settingsStorage = storage.defineItem<GameSettings>(
    'local:settings',
    {
        defaultValue: defaultSettings,
    }
);
