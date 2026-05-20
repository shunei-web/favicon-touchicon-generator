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
| `apple-touch-icon.png` | 180×180 | ホーム画面に追加 | iPhone / iPad | - |
| `icon-192.png` | 192×192 | PWA インストールアイコン | Android | `any` |
| `icon-512.png` | 512×512 | PWA スプラッシュ / 拡大表示 | Android | `any` |
| `icon-mask-512.png` | 512×512 | Adaptive Icon（マスク対応） | Android | `maskable` |
| `manifest.webmanifest` | - | Web App Manifest | Android（主）/ iOS（一部） | - |

## 使い方

### 1. インストール

```
pnpm install
```

### 2. config.json を作成

`config.example.json` をコピーして `config.json` を作成し、サイト情報を編集してください。

```
cp config.example.json config.json
```

**config.json の設定項目**

| キー | 説明 |
|---|---|
| `name` | サイト名（PWA インストール時に表示） |
| `short_name` | 短縮名（ホーム画面アイコンラベル） |
| `description` | サイトの説明文 |
| `start_url` | PWA 起動時の URL（通常 `"/"` ） |
| `display` | 表示モード（`"standalone"` 推奨） |
| `orientation` | 画面向き（`"portrait"` / `"landscape"` / `"any"`） |
| `background_color` | 背景色（PWA スプラッシュ + maskable アイコン背景に使用） |
| `theme_color` | ブラウザ UI の着色（アドレスバー等） |
| `lang` | 言語コード（`"ja"` / `"en"` 等） |
| `scope` | PWA のスコープ（通常 `"/"` ） |
| `icon_base_path` | manifest 内アイコン src のプレフィックス（通常 `"/"` ） |

> **注意**: `config.json` はプロジェクト固有の設定ファイルです。`.gitignore` に追加済みのため、Git にはコミットされません。

### 3. SVG ファイルを src フォルダに置く

`src/` フォルダに SVG ファイルを 1 つ配置してください。複数ある場合は最初に見つかったファイルが使用されます。

### 4. 実行

```
pnpm run create
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

## 参考リンク

- [2026 年版 favicon の設定方法 | Coliss](https://coliss.com/articles/build-websites/operation/work/how-to-favicon.html)
- [Web App Manifest | W3C](https://www.w3.org/TR/appmanifest/)
- [Maskable.app — maskable アイコンのプレビューツール](https://maskable.app/)
