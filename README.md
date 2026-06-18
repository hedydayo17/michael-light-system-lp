# 株式会社ミカエルライト — システム開発 LP

Claude Design で作成したデザインを、**編集可能なスタンドアロンの静的サイト**として復元したものです。
フレームワーク・ビルド不要。HTML ＋ GSAP（ScrollTrigger）＋ Lenis（スムーススクロール）で動きます。

## 構成

| ファイル | 役割 |
| --- | --- |
| `index.html` | 全マークアップ（インラインCSS）＋ `<head>`（フォント・グローバルCSS）。**文言・見た目の編集はここ** |
| `main.js` | アニメーション初期化。`data-*` 属性をフックに GSAP / Lenis を組み立てる |

外部依存は CDN のみ（Google Fonts: Anton / Noto Sans JP、GSAP 3.12.5、ScrollTrigger、Lenis）。
画像などのローカルアセットはありません。

## ローカルで見る

```bash
npm run dev          # http://localhost:4321 で配信（serve を npx 経由で起動）
```

`index.html` を直接ブラウザで開いても表示はできますが、`main.js` を絶対パス `/main.js` で読むため、
アニメーションも含めて確認するときは上のローカルサーバ経由を推奨します。

## どこを編集する？

- **文言・セクションの中身** … `index.html`
- **色** … `#ml-root` の `style` にある CSS 変数（`--accent` 緑 / `--accent2` 紫 / `--pink` / `--orange`）。
  アクセントは `main.js` 冒頭の `ACCENT`（`green` / `purple` / `pink` / `orange`）でも切替可
- **演出の調整** … `main.js`。`data-*` フック対応表は下記

### data-* フック

| 属性 | 効果 |
| --- | --- |
| `data-preloader` / `data-count` / `data-bar` | 起動時のプリローダー（カウントアップ→せり上げ） |
| `data-hero-line > span` / `data-hero-fade` / `data-hero-sub` | ヒーローの順次出現 |
| `data-float="0.x"` | 背景シェイプのスクロールパララックス（数値=速さ） |
| `data-services` / `data-track` | 「提供内容」の横スクロール（ピン留め） |
| `data-philo` / `data-philo-word` | 理念の単語せり上げ |
| `data-reveal` | 汎用の入場リベール |
| `data-magnetic` | カーソルに吸い付くボタン |
| `data-cursor` | カスタムカーソル |
| `data-nav-link` | アンカーのスムーススクロール |
| `data-contact-form` / `data-form-status` | お問い合わせ → `mailto:` 起動 |

`prefers-reduced-motion` のときは演出を止め、内容を静止表示します。

## デプロイ（Vercel）

ビルド不要の静的サイトです。Vercel のフレームワークプリセットは **Other**、
ビルドコマンドなし／出力ディレクトリはリポジトリ直下のままで公開できます。
（GitHub 連携済みなら push で自動デプロイ）

## 公開前メモ

- 連絡先は `contact@michael-light.co.jp`（フォーム送信は mailto 起動）
- favicon / OGP画像は未配置（必要なら `public` 相当に置いて `index.html` の `<head>` に追記）
