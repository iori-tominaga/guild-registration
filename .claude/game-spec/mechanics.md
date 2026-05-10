# ゲームメカニクス設計

## 呪文システム

### 呪文データ構造

```json
{
  "id": "string",
  "name": "string（ひらがな・カタカナ）",
  "category": "attack | heal | buff",
  "element": "炎 | 氷 | 雷 | 光 | 闇 | 補助",
  "mpCost": "number",
  "power": "number（攻撃・回復量の基準値）",
  "targetScope": "self | enemy | all_enemies | all_allies",
  "requiredLevel": "number（1〜15）",
  "description": "string（1文で効果を説明）"
}
```

### 習得ロジック

- キャラクターの `Lv`（= 登録時に決定、初期値 1）と呪文の `requiredLevel` を比較する
- `character.lv >= spell.requiredLevel` なら習得済み
- 習得済み呪文IDは `codequest:save.character.spells` に配列で保存する
- spells.html を開くたびに現在のレベルと照合して自動更新する

### カテゴリ定義

| category | 表示名 | 説明 |
|---|---|---|
| attack | 攻撃魔法 | 敵にダメージを与える |
| heal | 回復魔法 | 味方のHPを回復する |
| buff | 補助魔法 | ステータスを変化させる |

### 表示ルール（spells.html）

- 属性ごとにグループ化して表示する
- 習得済み：通常表示（黄色ハイライト）
- 未習得：グレーアウト + 「Lv X で習得」表示
- カテゴリバッジ（attack=赤、heal=緑、buff=青）で種別を示す

### board.html との連携

- キャラクターパネルに「習得呪文: X 個」を追加表示する
- 「魔法の巻物」リンクカードを「冒険の場所」に追加する
- Quest 05 完了後に解放される
