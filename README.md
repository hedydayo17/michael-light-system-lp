# 株式会社ミカエルライト — システム開発 LP

Claude Design で作成した最新版 LP。ビルド不要の静的サイトです。
React（UMD）＋ GSAP（ScrollTrigger）＋ Lenis（スムーススクロール）で動きます。

## 構成

| ファイル | 役割 |
| --- | --- |
| `index.html` | 全マークアップ（インラインCSS）＋ `<head>`（フォント・CDN）。**文言・見た目の編集はここ** |
| `support.js` | デザインコンポーネントのランタイム。`index.html` が `./support.js` で読み込む |
| `logo.png` | ロゴ画像（会社情報・フッターで使用） |
| `vercel.json` | Vercel 設定（cleanUrls） |

外部依存は CDN のみ（React 18 / Google Fonts: Noto Sans JP・Space Grotesk / GSAP 3.12.5 / ScrollTrigger / Lenis）。

> 旧バージョンで使っていた `main.js` / `package.json` はこの構成では不要です。リポジトリに残っている場合は削除してください。

## ローカルで見る

`index.html` を直接ブラウザで開けば表示できます（`support.js`・`logo.png` を相対パスで読むため同じフォルダに置いておくこと）。

## どこを編集する？

- **文言・セクションの中身** … `index.html`
- **色・演出** … `index.html` 内のインラインスタイル／GSAP 初期化スクリプト

`prefers-reduced-motion` のときは演出を止め、内容を静止表示します。

## デプロイ（Vercel）

ビルド不要の静的サイト。フレームワークプリセットは **Other**、ビルドコマンドなし／出力ディレクトリはリポジトリ直下のまま公開できます。GitHub 連携済みなら push で自動デプロイされます。

## 公開前メモ

- 連絡先は `contact@michael-light.co.jp`
- favicon / OGP画像は未配置（必要なら追加して `index.html` の `<head>` に追記）
