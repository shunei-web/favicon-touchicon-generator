# favicon-pwa-generator

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
| `apple-touch-icon.png` | 180×180 | ホーム画面に追加 ※1 | iPhone / iPad | - |
| `icon-192.png` | 192×192 | PWA インストールアイコン | Android | `any` |
| `icon-512.png` | 512×512 | PWA スプラッシュ / 拡大表示 | Android | `any` |
| `icon-mask-512.png` | 512×512 | Adaptive Icon（マスク対応）/ WordPress site_icon source ※2 ※3 | Android / 全般 | `maskable` |
| `manifest.webmanifest` | - | Web App Manifest | Android（主）/ iOS（一部） | - |

> ※1 `config.background_color` で 180×180 を塗りつぶし + 140×140 ロゴ中央配置（20px padding）。透明 padding を残すと iOS「ホーム画面に追加」でホーム画面 wallpaper が透けて見える問題を回避するため。
>
> ※2 `config.background_color` で 512×512 を塗りつぶし + 409×409 safe zone 中央配置（51-52px padding）。Android adaptive icon マスク（円 / 角丸 / しずく等）で重要絵柄が欠けないよう、W3C maskable spec の safe zone 80% を確保。
>
> ※3 `icon-mask-512.png` は WordPress テーマの `site_icon`（管理画面 → 外観 → カスタマイズ → サイトアイコン）の **source PNG としても流用可能**。WP コアは site_icon から 32 / 180 / 192 / 270 を自動派生するため、`bg 塗りつぶし` + `safe zone 80%` の 1 枚で「WP 派生 4 サイズ + manifest maskable」の計 5 サイズをカバーできる（safe zone 80% は Apple HIG inner box ~80% / Android adaptive ~80% と一致、ブラウザタブ favicon 32×32 派生でも視覚的に自然な余白）。

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

### 6. HTML の `<head>` に貼り付け

`dist/head-tags.html` の内容をそのまま `<head>` 内にコピーしてください。
favicon / apple-touch-icon / manifest / theme-color に加えて、**iOS PWA splash screen** 8 サイズ分の `<link>` も含まれます。

> `head-tags.html` は `config.json` の `theme_color` と `icon_base_path` を自動展開します。

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
