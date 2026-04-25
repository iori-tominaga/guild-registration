# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

ドラゴンクエスト風UIの冒険者ギルドウェブアプリ。GitHub Pages で公開される静的HTMLアプリ。ビルドツール不要。

**公開URL**: https://iori-tominaga.github.io/guild-registration/

## ファイル構成

```
guild-registration/
├── index.html   # 登録ページ（Quest 01）
├── board.html   # ギルド本部ハブ（Quest 02）
├── CLAUDE.md
└── docs/
    ├── requirements.md
    └── external-spec.md
```

## 技術スタック

| 項目 | 内容 |
|------|------|
| 言語 | HTML / CSS / JavaScript (JSX) |
| フレームワーク | React 18.3.1（CDN経由、UMD） |
| JSXトランスパイル | Babel Standalone 7.29.0（CDN） |
| フォント | Press Start 2P（Google Fonts） |
| ホスティング | GitHub Pages（master ブランチ root） |
| デプロイ | `.github/workflows/deploy.yml`（master push で自動） |

## 世界観・UI ルール

このアプリは**ドラゴンクエスト（DQ）風RPG**の世界観で統一する。

- すべてのUIテキストは**ひらがな・カタカナ優先**（DQの雰囲気）
- ウィンドウ枠は `.dq-window` クラスで統一（二重ボーダー＋影）
- ボタンは `.dq-btn` クラスで統一
- メッセージは `useTypewriter` フックで1文字ずつ表示する演出を使う
- サウンドは Web Audio API の8bitビープ音（`beep()` 関数）
- ピクセルアートキャラクターは `<ClassSprite cls={id}/>` で表示（48×64px SVG）

## カラーテーマ

| 役割 | 値 |
|------|----|
| 背景（最暗） | `#000810` |
| ウィンドウ背景 | `#000060` |
| ウィンドウ内背景 | `#000030` |
| メインイエロー（タイトル・選択中） | `#ffec40` |
| ゴールド（カード枠・ランク） | `#ffd700` |
| テキスト薄青 | `#c0d8ff` |
| テキスト青紫 | `#a0c0ff` |
| ボーダーグレー | `#c8c8c8` |
| HPバー緑 | `#40ff40` |
| エラー赤 | `#ff8080` |

## localStorage 保存形式

### キャラクター情報（最新の登録）
```
キー: 'dq-character'
型:   { name, cls: { id, label, icon, stats }, profile, rank, date, id }
```

`cls.stats` は `{ 力, 素早, 守備, 魔力, 回復 }` の数値オブジェクト（0〜100）。

board.html では `HP = stats.守備 * 2`、`MP = stats.魔力 * 2`、`ATK = stats.力`、`DEF = stats.守備`、`SPD = stats.素早` のように派生させて表示する。

### 登録履歴
```
キー: 'dq-guild-history'
型:   Array<{ name, cls, profile, rank, date, id }>  ※最大50件、新しい順
```

### 個人クエストログ（board.html）
```
キー: 'dq-quest-log'
型:   Array<{ id, text, done, createdAt }>
```

## ページ間の遷移フロー

```
index.html（登録）
  └── 登録完了後 → board.html（ギルド本部）
        └── 今後のクエストで追加されるページへのリンクを並べる
```

## コンポーネント・関数の共有パターン

各HTMLファイルは独立した `<script type="text/babel">` を持つ。共通のUI部品（`DQWindow`、`ClassSprite`、`StatBars`、`beep`系、`useTypewriter`）は**各ファイルにコピーして使う**（ビルドなしの制約）。

共通部品を変更したら、すべてのHTMLに反映すること。

## よくある変更パターン

### 職業を追加する
`index.html` の `CLASSES` 配列に `{ id, label, icon, stats }` を追加し、`ClassSprite` の `colors` と `rankMap` にも同じ `id` でエントリを追加する。

### 新しいページ（クエスト）を追加する
1. `board.html` の「冒険の場所」セクションにリンクカードを追加する
2. 新しい HTML ファイルを root に作成する

### テキストを変更する
`useTypewriter('...', speed)` の第1引数を変更する。

### 色・スタイルを変更する
`<style>` タグ内を直接編集する。CSSクラスを追加する場合は既存のDQスタイルに合わせること。

## Claude 学習サポートルール

このプロジェクトはオーナーが **Claude Code の使い方を学ぶ**ために進めている。
そのため、各クエストの作業説明には必ず以下の2項目を含めること。

### 1. 今回使った Claude の機能
クエストで実際に使った機能を列挙し、それぞれ一言で何のために使ったか説明する。

例）
| 使った機能 | 用途 |
|---|---|
| `/init` スキル | CLAUDE.md の初期生成 |
| `Edit` ツール（複数回） | 既存ファイルを部分的に書き換え |
| `Agent` サブエージェント | 大きなファイル生成をタイムアウトなく実行 |
| `TodoWrite` ツール | 作業ステップの進捗管理 |

### 2. より活用できる Claude の機能（提案）
今回やらなかったが、使いこなせばより効率的・高品質になる機能を提案する。
「なぜ良くなるか」をセットで説明すること。

例）
- **`/review` スキル** — 実装後にコードレビューをかけると、バグや改善点を自動で指摘してもらえる
- **`/ultrareview`** — PR 単位で多角的なレビューが受けられる。チームレビューの代替になる
- **並列 Agent 実行** — 複数ファイルの作成を同時に走らせると実装時間を短縮できる

---

## ドキュメント更新ルール

**コードを変更したら、必ず以下のドキュメントも同じコミットで更新すること。**

| ドキュメント | 更新が必要なとき |
|---|---|
| `docs/requirements.md` | 機能追加・変更・削除をしたとき |
| `docs/external-spec.md` | 新しいページ・機能のテスト仕様を追加するとき |

更新の手順：
1. `requirements.md` のバージョンを上げ、変更内容を「7. 変更履歴」に追記する
2. `external-spec.md` のバージョンを合わせ、新機能に対応するテストケース（TC-XX）を追加する
3. コードとドキュメントを同じコミットに含める

## デプロイ

`master` ブランチに push すると GitHub Actions が自動デプロイ（約1〜2分）。

```
変更 → commit → push origin master → 自動デプロイ → 公開URL反映
```

## モバイル対応

- `@media (max-width: 520px)` で input/textarea の font-size を 16px にする（iOS自動ズーム防止）
- ボタンは `min-height: 44px`（タッチターゲット確保）
- `env(safe-area-inset-top)` でノッチ対応
