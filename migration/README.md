# ゲームを oshou35/tommy-games に集約する移行キット

`C:\Users\rezer\Documents\work` に並んでいるゲームリポジトリを、
**`oshou35/tommy-games` 1本のモノレポ**にまとめるための道具一式。

## 中身

| ファイル | 役割 |
|---|---|
| `migrate-to-tommy-games.sh` | 移行スクリプト本体。履歴を保ったまま `games/<name>/` に集約する |
| `template/index.html` | ゲームランチャー（tommy-games のトップページ） |
| `template/.github/workflows/deploy.yml` | 全ゲームをまとめて GitHub Pages に配信するワークフロー |
| `template/CLAUDE.md` | tommy-games 用の CLAUDE.md（`.claude/CLAUDE.md` に置かれる） |
| `template/README.md` | tommy-games の README |
| `template/gitignore` | tommy-games の `.gitignore` |

## 集約後のかたち

```
tommy-games/
├── .github/workflows/deploy.yml
├── .claude/CLAUDE.md            ← リポジトリ共通ルール
├── index.html                   ← ゲームランチャー
└── games/
    ├── guild-registration/
    │   ├── game.json            ← ランチャー表示用メタ情報
    │   ├── src/                 ← ここが公開される
    │   ├── docs/
    │   └── .claude/CLAUDE.md    ← このゲーム固有のルール
    ├── goki100/
    └── crowd-run/
```

| 場所 | 公開URL |
|---|---|
| ランチャー | `https://oshou35.github.io/tommy-games/` |
| 各ゲーム | `https://oshou35.github.io/tommy-games/<name>/` |

3本とも `src/` にルート絶対パス（`/foo.js` のような書き方）が無いことを確認済みなので、
サブディレクトリ配信に変わってもリンクは壊れません。

---

## 事前にやっておくこと

1. **`oshou35/tommy-games` への書き込み権限をもらう**
   別アカウントのリポジトリなので、`iori-tominaga` を Collaborator に招待してもらう
   （Settings → Collaborators → Add people）

2. **GitHub Pages を Actions 配信に切り替える**
   `oshou35/tommy-games` の Settings → Pages → Source を **「GitHub Actions」** にする

3. **（任意）Slack 通知**
   Settings → Secrets and variables → Actions に `SLACKWEBHOOKURL` を登録する。
   未登録でも通知ステップが自動でスキップされるだけで、デプロイは成功します

---

## 実行手順（Windows は Git Bash で）

### 1. 下見（何も書き換えない）

```bash
cd /c/Users/rezer/Documents/work/guild-registration
bash migration/migrate-to-tommy-games.sh
```

`work` 直下の「`.git` があって `src/index.html` を持つディレクトリ」を
ゲームとみなして一覧表示します。**ここに出てこないゲームがあれば教えてください。**

### 2. 実行（まだ push しない）

```bash
APPLY=1 bash migration/migrate-to-tommy-games.sh
```

`C:\Users\rezer\Documents\work\tommy-games` に集約済みリポジトリができます。

### 3. 中身を確認する

```bash
cd /c/Users/rezer/Documents/work/tommy-games
git log --oneline | head -20
git log --oneline -- games/guild-registration/src/board.html   # 履歴が残っているか
ls games/*/src/index.html
```

ローカル表示を見たいときは：

```bash
python -m http.server 8000
# → http://localhost:8000/ （ランチャー）
```

> ローカルでは `games.json` が未生成のため、ランチャーは `index.html` に埋め込んだ
> フォールバック一覧を表示します。本番では `game.json` から自動生成されます。

### 4. push する

```bash
git push -u origin main
```

`APPLY=1 PUSH=1` を付ければ 2〜4 をまとめて実行できます。

---

## スクリプトの設定（環境変数で上書き可）

| 変数 | 既定値 | 意味 |
|---|---|---|
| `WORK_DIR` | `$HOME/Documents/work` | ゲームリポジトリが並ぶ親ディレクトリ |
| `TARGET_URL` | `https://github.com/oshou35/tommy-games.git` | 集約先 |
| `TARGET_BRANCH` | `main` | 集約先のブランチ |
| `STAGE` | `$WORK_DIR/tommy-games` | 集約先の作業クローン先 |
| `ONLY` | （空） | 対象を絞る。例: `ONLY="goki100 crowd-run"` |
| `APPLY` | `0` | `1` で実行 |
| `PUSH` | `0` | `1` で push まで |

## 安全のためにしていること

- **元のリポジトリには一切書き込まない。** 履歴の書き換えは一時クローン上だけで行う
- 未コミットの変更があるゲームがあると、取りこぼしを防ぐため中断する
- 集約先クローンの `origin` が `TARGET_URL` と一致しなければ中断する
- `games/<name>/` が既にあればスキップする（重複取り込みを防ぐ）
- `PUSH=1` を明示しない限り push しない

## 履歴の扱い

`git filter-branch` で各ゲームの全コミットのパスを `games/<name>/` 配下に書き換えてから
マージします。そのため集約後も次が普通に動きます。

```bash
git log   games/guild-registration/src/board.html   # 全 11 コミット遡れる
git blame games/guild-registration/src/board.html   # 移動前の行まで追える
```

浅いクローン（`--depth` 付き）は履歴を取り込めないため、
スクリプトが検出したら自動で `git fetch --unshallow` します。

---

## 移行後にやること

1. **公開URLの差し替え** — 各ゲームの README / CLAUDE.md に旧URLが残っていれば直す
2. **旧リポジトリの後始末** — おすすめは「アーカイブ + README に移転先リンク」。
   消してしまうと既存URLが 404 になるだけなので、アーカイブのほうが安全
3. **`.claude/settings.json` の見直し** — フック等のパスが `games/<name>/` 前提に変わる

## 今後の開発フロー

```
tommy-games/games/<ゲーム名>/ で作業 → commit → push origin main → 自動デプロイ
```

新しいゲームを足すときは `games/<新しい名前>/src/` と `game.json` を作るだけ。
ランチャーは `game.json` から自動生成されるので `index.html` を触る必要はありません。

---

## 検証済みであること

このキットは移行を模した環境で実際に流して確認してあります。

- 3本（guild-registration / goki100 / crowd-run）の取り込みが通ること
- 集約後に `git log` / `git blame` がファイル単位で移行前まで遡れること
- `deploy.yml` の組み立てが `_site/<name>/` と `games.json` を正しく作ること
- ランチャー・3ゲームすべてが Chromium で描画され、JS エラーが出ないこと
  （外部CDN読込は検証環境のネットワーク制限で失敗したが、本番では問題なし）
