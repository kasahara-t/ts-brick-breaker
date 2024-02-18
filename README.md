# Brick Breaker Game with Phaser 3 and TypeScript

このプロジェクトは、クラシックなブロック崩しゲームを現代的なウェブ技術で再現したものです。Mozilla Developer Network (MDN) の[2D breakout game using Phaser](https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_breakout_game_Phaser)チュートリアルを基にしていますが、オリジナルのJavaScriptとPhaser2のコードをTypeScriptとPhaser3に書き換え、全体的なコード構造を改善するためのリファクタリングを行いました。

## 特徴

- **TypeScriptの導入**: より安全でメンテナンスしやすいコードベースを実現するため、TypeScriptを採用しています。
- **Phaser 3への移行**: ゲーム開発フレームワークとして最新のPhaser 3を使用し、その強力な機能を活用しています。
- **コードのリファクタリングとクラスの分割**: 元のコードをリファクタリングし、機能ごとにクラスを分割することで、コードの可読性と再利用性を向上させました。
- **定数の使用**: マジックナンバーを避け、コードの理解とメンテナンスを容易にするために、定数を積極的に使用しています。

## 技術スタック

- TypeScript
- Phaser 3
- Vite (プロジェクトのビルドとバンドルのため)

## ローカルでの実行

このプロジェクトをローカル環境で実行するには、以下の手順に従ってください。

1. リポジトリをクローンします。

```bash
git clone https://github.com/kasahara-t/ts-brick-breaker.git
```

2. 依存関係をインストールします（このプロジェクトではpnpmを使用しています）。

```bash
cd ts-brick-breaker
pnpm install
```

3. 開発サーバーを起動します。

```bash
pnpm start
```

http://localhost:8000でゲームをプレイできます。