# favicon-touchicon-generator

## 概要

1 枚の SVG ファイルから、2026 年版 Coliss 推奨仕様に準拠した **7 種類のアイコン + Web App Manifest** を一括生成するツールです。

- ブラウザタブ向けの favicon（ICO / SVG）
- iOS ホーム画面向けの Apple Touch Icon
- Android PWA 向けの any・maskable アイコン（Adaptive Icon 対応）
- Web App Manifest（`manifest.webmanifest`）

参考: [2026 年版 favicon の設定方法 | Coliss](https://coliss.com/articles/build-websites/operation/work/how-to-favicon.html)

## 出力ファイル一覧

| ファイル | サイズ | 用途 | 対象 | purpose |
|---|---|---|---|---|
| `favicon.ico` | 32×32 | ブラウザタブ（レガシー） | デスクトップ | - |
| `favicon.svg` | - | モダンブラウザ（ダーク対応） | デスクトップ / モバイル | - |
| `apple-touch-icon.png` | 180×180 | ホーム画面に追加（`background_color` 塗りつぶし + 140px ロゴ中央配置） | iPhone / iPad | - |
| `icon-192.png` | 192×192 | PWA インストールアイコン | Android | `any` |
| `icon-512.png` | 512×512 | PWA スプラッシュ / 拡大表示 | Android | `any` |
| `icon-mask-512.png` | 512×512 | Adaptive Icon（マスク対応） | Android | `maskable` |
| `manifest.webmanifest` | - | Web App Manifest | Android（主）/ iOS（一部） | - |

## 使い方

### 1. インストール

```
npm install
```

### 2. config.json を作成

`config.example.json` をコピーして `config.json` を作成し、サイト情報を編集してください。

```
cp config.example.json config.json
```

**config.json の設定項目**

| キー | 必要度 | 説明 |
|---|---|---|
| `name` | **必須** | サイト名（PWA インストール時に表示） |
| `icon_base_path` | **必須** | manifest 内アイコン src のプレフィックス（通常 `"/"`、サブパス配信時は `"/sub/"` 等） |
| `short_name` | 強推奨 | 短縮名（12 文字以内、ホーム画面アイコンラベル） |
| `start_url` | 強推奨 | PWA 起動時の URL（通常 `"/"`、未指定だと現在 URL が使われる） |
| `display` | 強推奨 | 表示モード（`"standalone"` で PWA アプリ風起動、他に `"fullscreen"` / `"minimal-ui"` / `"browser"`） |
| `background_color` | 強推奨 | PWA スプラッシュ画面 + **maskable アイコンの塗りつぶし色**に共用 |
| `theme_color` | 強推奨 | ブラウザ UI の着色（アドレスバー / status bar） |
| `description` | 推奨 | PWA インストール prompt に表示される説明文 |
| `orientation` | 任意 | 画面向き固定（`"portrait"` / `"landscape"` / `"any"`、不要なら省略可） |
| `lang` | 任意 | コンテンツ言語（`"ja"` / `"en"` 等、SEO / a11y 補助） |
| `scope` | 任意 | PWA のスコープ制限（通常 `"/"` でサイト全体、サブパス制限時に指定） |

> **Coliss 記事と本ツールの差分について**: Coliss 記事の `manifest.webmanifest` 例は最小構成（`name` + `icons` のみ）ですが、本ツールは W3C Web App Manifest 仕様の標準フィールドを 11 件出力します。PWA アプリ風起動 / splash 画面 / ブラウザ UI 着色を実用するには「強推奨」までの 7 フィールドの設定が事実上必要なため、`config.example.json` で全件をテンプレ提供しています。「任意」のフィールドが不要な場合は `config.json` 内で空文字 (`""`) にしても manifest.webmanifest 出力には影響しません（manifest 内に空フィールドとして残ります。完全に省きたい場合は `manifest.js` の icons 配列構築を参考に各フィールドを optional 出力に拡張してください）。

> **注意**: `config.json` はプロジェクト固有の設定ファイルです。`.gitignore` に追加済みのため、Git にはコミットされません。

### 3. SVG ファイルを src フォルダに置く

`src/` フォルダに SVG ファイルを 1 つ配置してください。複数ある場合は最初に見つかったファイルが使用されます。

### 4. 実行

```
npm run create
```

以下の 7 ファイルが `dist/` フォルダに出力されます。

```
favicon.ico（32px）を出力しました
favicon.svg を出力しました
apple-touch-icon.png を出力しました
icon-192.png を出力しました
icon-512.png を出力しました
icon-mask-512.png を出力しました
manifest.webmanifest を出力しました
```

### 5. dist/ のファイルをデプロイ

`dist/` 内の 7 ファイルをサイトのルートに配置します（`/favicon.ico` でアクセスできる場所）。

### 6. HTML の `<head>` に記述を追加

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#000000">
```

> `theme-color` の値は `config.json` の `theme_color` と合わせてください。

## maskable アイコンについて

`icon-mask-512.png` は W3C の [Web App Manifest 仕様](https://www.w3.org/TR/appmanifest/#purpose-member)で定義された **maskable** アイコンです。

Android の Adaptive Icon 機能により、端末メーカーや OS 設定に応じてアイコンが円・角丸・しずく型などにマスクされます。このとき、アイコンの端ギリギリまで描画されていると重要な絵柄が切り取られてしまいます。

maskable アイコンでは **中央 80%（Safe Zone）** にロゴを配置し、外側 20% を背景色のみにすることで、どの形状のマスクでも絵柄が欠けない設計になっています。

本ツールでは `background_color`（config.json）をアイコン背景色として使用します。[Maskable.app](https://maskable.app/) でプレビューして確認することをおすすめします。

## アーキテクチャ

`helpers.js` が共通ユーティリティ（`findFirstSvgFile` / `ensureDistDir` / `srcDir` / `distDir` / `hexToRgb`）を提供し、`config.js` が `loadConfig`（config.json 読み込み）を担当します。各生成スクリプト（`favicon-ico.js` / `favicon-svg.js` / `apple-touch-icon.js` / `icon-any.js` / `icon-maskable.js` / `manifest.js`）はこれらを import して使用するため、共通処理が一箇所に集約されています。

## 参考リンク

- [2026 年版 favicon の設定方法 | Coliss](https://coliss.com/articles/build-websites/operation/work/how-to-favicon.html)
- [Web App Manifest | W3C](https://www.w3.org/TR/appmanifest/)
- [Maskable.app — maskable アイコンのプレビューツール](https://maskable.app/)
