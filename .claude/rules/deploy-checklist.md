# デプロイ前チェックルール

## 鉄則：コードを変更したら必ずローカルテストしてからデプロイする

`master` に push する前に、以下のフローを**必ず**実行すること。

```
コード変更 → Puppeteer でローカル確認 → 問題なし → コミット → デプロイ
```

---

## テスト手順（Puppeteer MCP）

### Step 1: Babel 構文チェック

```javascript
// file:// でローカルHTMLを開く
mcp__puppeteer__puppeteer_navigate({ url: "file:///C:/Users/rezer/Documents/work/guild-registration/src/<ファイル名>.html" })

// Babel でトランスパイルし、エラーがないか確認
mcp__puppeteer__puppeteer_evaluate({
  script: `(function() {
    const script = document.querySelector('script[type="text/babel"]');
    try {
      Babel.transform(script.textContent, { presets: ['react'] });
      return JSON.stringify({ ok: true });
    } catch(e) {
      return JSON.stringify({ babelError: e.message });
    }
  })()`
})
```

`{ ok: true }` が返れば構文エラーなし。エラーが出たら**デプロイ禁止**。

### Step 2: スクリーンショット確認

```javascript
mcp__puppeteer__puppeteer_screenshot({ name: "pre-deploy-check", width: 390, height: 844 })
```

画面が正常に表示されていること（真っ暗・真っ白・エラー表示でないこと）を目視確認する。

### Step 3: コンソールエラー確認（必要に応じて）

```javascript
mcp__puppeteer__puppeteer_evaluate({
  script: `(function() {
    const root = document.getElementById('root');
    return JSON.stringify({ rootHTML: root ? root.innerHTML.slice(0, 500) : 'EMPTY' });
  })()`
})
```

`root` が空の場合は React レンダリングが失敗している。

---

## チェック対象ファイル

変更したファイルが含まれるページを必ずチェックすること。

| 変更ファイル | テスト対象ページ |
|---|---|
| `board.html` | board.html |
| `battle.html` | battle.html |
| `index.html` | index.html |
| `equipment.html` | equipment.html |
| `monsters.html` | monsters.html |
| `spells.html` | spells.html |
| `icons.js` / `parts.js` | battle.html |

---

## よくある JSX エラーパターン

| エラー | 原因 | 修正 |
|---|---|---|
| `Unexpected token` at `{...}` | return 文で Fragment なしに複数要素を並べた | `<>...</>` で囲む |
| `Adjacent JSX elements` | 同上 | `<>...</>` で囲む |
| SVG が表示されない | `<div dangerouslySetInnerHTML>` にSVGを注入 | `<svg>` + `<g dangerouslySetInnerHTML>` に変更 |

---

## 違反したとき

🔴(●｀益´●)!!  テストせずにデプロイしてはいけません。
過去に Fragment 抜けで画面が真っ暗になった事故が発生しています（ver. 6.0.2 で修正）。
