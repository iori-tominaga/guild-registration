# /update-qa

コードのコミット後に呼ぶと、2つの Agent が**並列**で docs を更新します。

## 前提条件

コードの変更がすでにコミット済みであること。

## 実行手順

### 1. コミット内容の確認

```bash
git log --oneline -3
```

### 2. 2つの Agent を同時に起動する

以下の Agent を**1つのメッセージで同時に**呼び出す（並列実行）：

**Agent A — requirements.md 更新**
- `.claude/commands/update-requirements.md` を読み込む
- その指示に従って `docs/requirements.md` を更新する
- 完了したらバージョン番号と変更箇所を報告する

**Agent B — external-spec.md 更新**
- `.claude/commands/update-test-cases.md` を読み込む
- その指示に従って `docs/external-spec.md` を更新する
- 完了したら追加した TC 番号と内容を報告する

### 3. 両 Agent の完了を待つ

### 4. コミット・push

```bash
git add docs/requirements.md docs/external-spec.md
git commit -m "docs: update QA docs to vX.Y.Z"
git push -u origin master
```

## 注意事項

- Agent A・B はコミットしない（コミットはこのスキルが担当）
- 両 Agent が返したバージョン番号が一致しているか確認してからコミットする
