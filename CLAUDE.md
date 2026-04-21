# 冒険者ギルド登録アプリ — Claude 編集ガイド

## プロジェクト概要

ドラゴンクエスト風UIの冒険者ギルド登録ウェブアプリ。GitHub Pages で公開されている静的HTMLアプリ。

**公開URL**: https://iori-tominaga.github.io/guild-registration/

## ファイル構成

```
guild-registration/
├── index.html          # アプリ本体（これ1ファイルですべて完結）
├── CLAUDE.md           # このファイル
└── docs/
    ├── requirements.md     # 要件定義書
    └── external-spec.md    # 外部仕様書（テスト仕様）
```

## 技術スタック

| 項目 | 内容 |
|------|------|
| 言語 | HTML / CSS / JavaScript (JSX) |
| フレームワーク | React 18.3.1（CDN経由） |
| JSXトランスパイル | Babel Standalone 7.29.0（CDN） |
| フォント | Press Start 2P（Google Fonts） |
| ホスティング | GitHub Pages（master ブランチ root） |

> **重要**: ビルドツール・node_modules・package.json は一切不要。`index.html` を直接編集するだけで動く。

## 編集方法

**唯一の編集対象: `index.html`**

ファイルは3つのセクションで構成されている：

1. **`<head>` 内 `<style>` タグ** (12〜323行目) — CSSスタイル定義
2. **`<script type="text/babel">` タグ** (329〜806行目) — React コンポーネント（JSX）

### コンポーネント構成

```
App (メイン)
├── StepName       — Step 1: 名前入力
├── StepClass      — Step 2: 職業選択（9種類）
├── StepProfile    — Step 3: 自己紹介入力
├── StepConfirm    — Step 4: 確認画面
└── StepComplete   — Step 5: 登録完了・冒険者カード表示

補助コンポーネント:
├── DQWindow       — ドラクエ風ウィンドウ枠
├── ClassSprite    — ピクセルアートキャラクター（SVG）
└── StatBars       — ステータスバー表示

フック:
└── useTypewriter  — タイプライター演出フック

定数:
└── CLASSES        — 職業データ配列（9種）
```

### 主要な定数・データ

**職業リスト** (`CLASSES` 配列, 383〜393行目):
```js
{ id, label, icon, stats: {力, 素早, 守備, 魔力, 回復} }
```

**ランクマップ** (`StepComplete` 内, 673行目):
```js
const rankMap = {warrior:'C', mage:'C', priest:'C', ...}
```

## デプロイ方法

`master` ブランチに push すると GitHub Actions が自動的に GitHub Pages へデプロイする。

```
変更 → commit → push origin master → 自動デプロイ → 公開URL反映（約1〜2分）
```

## よくある変更例

### 職業を追加する
`CLASSES` 配列（383行目付近）に新しいオブジェクトを追加し、`ClassSprite` の `colors` オブジェクトと `rankMap` にも対応エントリを追加する。

### テキスト・メッセージを変更する
各 `Step*` コンポーネント内の `useTypewriter(...)` の引数文字列を変更する。

### 色・スタイルを変更する
`<style>` タグ内のCSS変数・セレクタを直接編集する。メインカラーは `#ffec40`（黄）、`#000060`（濃紺）、`#c0d8ff`（薄青）。

### ランクロジックを変更する
`StepComplete` コンポーネント内の `rankMap` オブジェクト（673行目付近）を編集する。

## モバイル対応メモ

- `@media (max-width: 520px)` で font-size 16px（iOS自動ズーム防止）
- `min-height: 44px` でタッチターゲット確保
- `env(safe-area-inset-top)` でノッチ対応
- 職業選択のステータスパネルはスマホでは非表示（`.class-step-sidebar`）
