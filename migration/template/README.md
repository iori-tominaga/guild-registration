# Tommy Games

ブラウザで遊べる自作ゲーム置き場。ビルド不要の静的サイトとして GitHub Pages で公開している。

**▶ あそぶ: https://oshou35.github.io/tommy-games/**

## ゲーム一覧

| ゲーム | 内容 | URL |
|---|---|---|
| 🛡️ 冒険者ギルド | ドラクエ風の冒険者ギルド。登録・装備・呪文・バトル | [/guild-registration/](https://oshou35.github.io/tommy-games/guild-registration/) |
| 🪳 ゴキブリは1匹みたら100匹いると思え | 家の中でゴキブリを増やして100匹を目指す3D育成 | [/goki100/](https://oshou35.github.io/tommy-games/goki100/) |
| 🏃 crowd-run | 戦いながらクイズに答えて軍団を増やす3レーンシューター | [/crowd-run/](https://oshou35.github.io/tommy-games/crowd-run/) |

## 構成

```
games/<name>/src/    ← ここが https://oshou35.github.io/tommy-games/<name>/ で公開される
games/<name>/docs/   仕様書（非公開）
games/<name>/game.json  ランチャーに出す表示情報
index.html           ゲームランチャー（トップページ）
```

## ローカルで動かす

ビルドは不要。`games/<name>/src/index.html` をブラウザで開けば動く。

`fetch()` を使うゲームは `file://` だと CORS で失敗するので、簡易サーバー経由で開く。

```bash
cd games/<name>/src && python3 -m http.server 8000
# → http://localhost:8000/
```

ランチャーごと確認したい場合はリポジトリのルートで同じことをする（`games.json` は
デプロイ時に生成されるため、ローカルでは埋め込みのフォールバック一覧が表示される）。

## デプロイ

`main` に push すると GitHub Actions が自動でデプロイする（約1〜2分）。

## ゲームを追加する

1. `games/<新しい名前>/src/index.html` を作る
2. `games/<新しい名前>/game.json` に `title` / `emoji` / `description` / `tags` を書く
3. push する（ランチャーは自動更新される）
