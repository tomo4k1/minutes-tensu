export interface MahjongHand {
    tiles: string; // Riichi format: '123m456p...'
    dora?: string[];
    wind?: 'East' | 'South' | 'West' | 'North';
    roundWind?: 'East' | 'South';
}

export interface ScoreResult {
    han: number;
    fu: number;
    points: number;
    yaku: Record<string, string>;
    fuDetails: string[];
    text: string;
}
