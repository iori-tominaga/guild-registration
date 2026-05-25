# アーキテクチャ・技術仕様

## ファイル構成

```
guild-registration/
├── .claude/                   # Claude が参照するファイル
│   ├── CLAUDE.md
│   ├── game-spec/
│   │   ├── world.md           # 世界設定・属性定義
│   │   └── mechanics.md       # ゲームメカニクス設計
│   ├── rules/
│   │   ├── world.md           # UIルール・カラーテーマ
│   │   ├── architecture.md    # アーキテクチャ仕様
│   │   └── monsters.md        # モンスター設計ルール
│   ├── commands/
│   │   ├── update-qa.md
│   │   ├── update-requirements.md
│   │   └── update-test-cases.md
│   └── settings.json
├── .github/
│   └── workflows/
│       └── deploy.yml
├── .gitignore
├── src/                       # プロダクトのソースファイル
│   ├── index.html             # 登録ページ（Quest 01）
│   ├── board.html             # ギルド本部ハブ（Quest 02）
│   ├── equipment.html         # 装備の間（Quest 03）
│   ├── monsters.html          # モンスター図鑑（Quest 04）
│   ├── spells.html            # 呪文システム（Quest 05）
│   ├── battle.html            # バトル画面（Quest 06）
│   ├── classes.html           # 職業進化（Quest 7.1）
│   ├── lore.html              # 伝承の間（Quest 08）
│   ├── portals.html           # 古代の門（Quest 09）
│   ├── monsters.json          # モンスターデータ
│   └── spells.json            # 呪文データ
└── docs/
    └── specs/                 # 仕様書
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
| ホスティング | GitHub Pages（src/ ディレクトリを配信） |
| デプロイ | `.github/workflows/deploy.yml`（master push で自動） |

## localStorage 保存形式

キー命名規則: `codequest:save.<category>` 形式で統一。

### キャラクター情報（最新の登録）
```
キー: 'codequest:save.character'
型:   { name, cls: { id, label, icon, stats }, profile, rank, date, id }
```

`cls.stats` は `{ 力, 素早, 守備, 魔力, 回復 }` の数値オブジェクト（0〜100）。

board.html では `HP = stats.守備 * 2`、`MP = stats.魔力 * 2`、`ATK = stats.力`、`DEF = stats.守備`、`SPD = stats.素早` のように派生させて表示する。

### 習得呪文（spells.html）
```
キー: 'codequest:save.character.spells'
型:   Array<string>  ※習得済み呪文IDの配列
```

### 登録履歴
```
キー: 'codequest:save.history'
型:   Array<{ name, cls, profile, rank, date, id }>  ※最大50件、新しい順
```

### 個人クエストログ（board.html）
```
キー: 'codequest:save.questLog'
型:   Array<{ id, text, done, createdAt }>
```

### 装備（equipment.html）
```
キー: 'codequest:save.equipment'
型:   { weapon, shield, armor, accessory }  ※各値は装備ID or null
```

### モンスター討伐記録（monsters.html）
```
キー: 'codequest:save.bestiary'
型:   { defeatedMonsterIds: [] }  ※Quest 06 バトルで埋まる
```

## ページ間の遷移フロー

```
index.html（登録）
  └── 登録完了後 → board.html（ギルド本部）
        ├── equipment.html（装備の間）
        ├── monsters.html（モンスター図鑑）
        └── spells.html（呪文システム）
```

## コンポーネント・関数の共有パターン

各HTMLファイルは独立した `<script type="text/babel">` を持つ。共通のUI部品（`DQWindow`、`ClassSprite`、`StatBars`、`beep`系、`useTypewriter`）は**各ファイルにコピーして使う**（ビルドなしの制約）。

共通部品を変更したら、すべてのHTMLに反映すること。

## よくある変更パターン

### 職業を追加する
`index.html` の `CLASSES` 配列に `{ id, label, icon, stats }` を追加し、`ClassSprite` の `colors` と `rankMap` にも同じ `id` でエントリを追加する。

### 新しいページ（クエスト）を追加する
1. `src/board.html` の「冒険の場所」セクションにリンクカードを追加する
2. 新しい HTML ファイルを `src/` に作成する

### テキストを変更する
`useTypewriter('...', speed)` の第1引数を変更する。

### 色・スタイルを変更する
`<style>` タグ内を直接編集する。CSSクラスを追加する場合は既存のDQスタイルに合わせること。

## モバイル対応

- `@media (max-width: 520px)` で input/textarea の font-size を 16px にする（iOS自動ズーム防止）
- ボタンは `min-height: 44px`（タッチターゲット確保）
- `env(safe-area-inset-top)` でノッチ対応
