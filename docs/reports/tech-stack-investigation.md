# 技術選定レポート: 麻雀点数計算勉強用拡張機能

## 1. はじめに
隙間時間に麻雀の点数計算を勉強できるChrome/Firefox両対応の拡張機能を開発するための、技術スタック調査結果と提案です。

## 2. 拡張機能開発フレームワーク
2024-2025年のトレンドと、クロスブラウザ対応（Chrome/Firefox）の容易さを重視して調査しました。

| フレームワーク | 特徴 | メリット | デメリット | 推奨度 |
| :--- | :--- | :--- | :--- | :--- |
| **WXT** | Viteベースの次世代フレームワーク | ・**クロスブラウザ対応が容易**<br>・Viteベースでビルドが高速<br>・React/Vue/Svelteなど好きなUIフレームワークが使える<br>・Manifest V2/V3両対応 | 比較的新しいフレームワークだが、ドキュメントは充実してきている | ★★★ |
| **Plasmo** | React開発者向け、Next.jsライク | ・Reactとの親和性が高い<br>・機能が豊富（認証、ストレージ等） | ・ParcelベースでビルドがWXTより遅い場合がある<br>・メンテナンス状況に一部懸念あり | ★★☆ |
| **CRXJS** | Viteプラグイン | ・シンプル<br>・既存のViteプロジェクトに導入しやすい | ・フレームワークではないため、自前で実装する部分が多い | ★☆☆ |

**結論:**
**WXT** を推奨します。Viteベースで開発体験が良く、クロスブラウザ対応も強力にサポートされているため、今回の要件に最適です。UIフレームワークには、ユーザー体験（リッチなUI）を作りやすい **React** を提案します。

## 3. 麻雀点数計算ライブラリ
JavaScript/TypeScriptで利用可能なライブラリを調査しました。

| ライブラリ | 特徴 | 推奨度 |
| :--- | :--- | :--- |
| **MahjongRepository/mahjong** | ・点数計算、シャンテン数計算など機能が網羅的<br>・天鳳の牌譜で検証されており信頼性が高い<br>・TypeScript対応 | ★★★ |
| **ssttkkl/mahjong-utils** | ・Kotlin Multiplatform製だがJSバインディングあり<br>・機能豊富 | ★★☆ |
| **riichi-core** | ・ゲームエンジン寄り<br>・LiveScript混在で少し扱いづらい可能性 | ★☆☆ |

**結論:**
**MahjongRepository/mahjong** を第一候補として推奨します。機能の網羅性と信頼性が高く、TypeScriptでの開発に適しています。

## 4. 推奨技術スタック構成案
*   **Framework**: WXT (Web Extension Framework)
*   **Language**: TypeScript
*   **UI Library**: React
*   **Styling**: Tailwind CSS (WXTとの相性が良く、モダンなUI構築に適している)
*   **Core Logic**: MahjongRepository/mahjong (または必要に応じて自作/フォーク)
*   **Package Manager**: npm / pnpm

## 5. 次のステップ
1.  **プロトタイプ作成**: WXT + React + TypeScript でプロジェクトをセットアップし、簡単なHello Worldを表示する。
2.  **ライブラリ検証**: `MahjongRepository/mahjong` を導入し、簡単な点数計算が動作することを確認する。
3.  **UI設計**: ポップアップ画面のラフデザインを作成する。

この構成で進めてよろしいでしょうか？
