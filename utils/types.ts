export interface MahjongHand {
    tiles: string; // Riichi format: '123m456p...'
    dora?: string[];
    wind?: 'East' | 'South' | 'West' | 'North';
    roundWind?: 'East' | 'South';
    isTsumo?: boolean;
    isRiichi?: boolean;
    calls?: string[]; // Array of called sets, e.g. ['123m', '444p']
}

export interface ScoreResult {
    han: number;
    fu: number;
    points: number;
    yaku: Record<string, string>;
    fuDetails: string[];
    text: string;
    error?: boolean;
    scoreBreakdown?: {
        tsumoKo?: number;
        tsumoOya?: number;
    };
}
