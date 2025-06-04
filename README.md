# favicon-touchicon-generator

## 概要

favicon-touchicon-generator は、Web サイトに必要なファビコン（favicon）と Apple Touch Icon（apple-touch-icon）を、1 枚の SVG 画像から自動生成するツールです。

「src」フォルダに SVG ファイルを 1 つ置くだけで、コマンド一つで以下の 3 種類のアイコン画像を「dist」フォルダにまとめて出力できます。

- favicon.ico（32×32px ICO ファイル：PC ブラウザやブックマーク用）
- favicon.svg（SVG ファビコン：モダンブラウザ向け）
- apple-touch-icon.png（180×180px PNG：iOS デバイスのホーム画面用）

これらのアイコンは、Web サイトのタブやブックマーク、iPhone/iPad のホーム画面ショートカットなど、各種端末・ブラウザで最適に表示されます。

HTML の head タグに必要な記述例もあわせて提供しており、面倒な手作業を省き、誰でも簡単に最新のファビコン環境を整えることができます。

## 特徴

- SVG ファイル 1 枚から主要なファビコン画像を一括生成
- 画像サイズや形式の変換は自動で最適化
- 生成されたファイルをそのままサイトのルートに配置して利用可能
- HTML への記述例も明記、実装ミスを防止

このツールを使えば、Web サイトの見た目やブランド力を高めるファビコン・アイコンの導入が、誰でも簡単・確実に実現できます。

## 使い方

1. npm のインストール

```
npm install
```

2. SVG ファイルを src フォルダに置く

   ※1 つ以上の SVG ファイルを置いてください。最初に見つかったファイルが使われます。

3. 実行

```
npm run create
```

4. 3 つのファビコン関連画像ファイルが dist フォルダに出力されます

```
favicon.ico（32px）を出力しました
favicon.svg を出力しました
apple-touch-icon.png を出力しました
```

5. 出力された 3 つのファイルをサイトのルートフォルダ（例：public やドキュメントルート）に配置してください

   ※必ずしもルート直下でなくても動作しますが、一般的にはルート直下が推奨です。

6. HTML の head タグに次のコードを追加します

```
<!-- favicon（ブラウザタブやブックマーク用、主にWindows/多くのブラウザで利用） -->
<link rel="icon" href="/favicon.ico" sizes="32x32" />

<!-- SVGファビコン（最新ブラウザでサポート、拡大縮小や高解像度に強い） -->
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />

<!-- apple-touch-icon（iOSデバイスのホーム画面に追加した時のアイコン） -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
```
