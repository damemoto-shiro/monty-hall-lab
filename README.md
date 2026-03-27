# Monty Hall Lab (モンティ・ホール問題 シミュレーター)

> **「直感」という名の霧を、「論理」という光で切り裂く。**

このシミュレーターは、確率論における最も有名なパラドックスの一つである「モンティ・ホール問題」を、物理的・視覚的に、かつ大規模な試行回数（1万回以上）を用いて検証するためのラボです。

## 💡 背景：なぜ今、モンティ・ホールなのか？

人生における「選択」もまた、時に私たちの不完全な直感に左右されます。
かつて直感に裏切られた私（溜元士郎）は、自分自身を再構築するための「自分OS」プロジェクトの一環として、この数学的真理を視覚化することに挑戦しました。

「選択を変えるべきか否か」――その答えは、感情ではなく、統計が知っています。

## 🚀 特徴

- **2つの戦略を同時シミュレーション**: 「変える (SWITCH)」と「変えない (STAY)」をリアルタイムで戦わせます。
- **ターボモード実装**: 描写をスキップして、瞬時に数千回の試行を行い、大数の法則（勝率66.7%への収束）を体験できます。
- **グラフ可視化**: Chart.js を使用し、原点(0,0)からの収束曲線を描画します。
- **ステップHUD表示**: プレイヤーの選択、司会者の介入、最終決定のプロセスを明確化。

## 🛠️ 技術スタック

- **Frontend**: Vanilla JavaScript / CSS (Glassmorphism design)
- **Engine**: Custom async-loop engine with Turbo mode
- **Libraries**: Chart.js (Visualization), GSAP (Animation Control)

## 🌐 ライブデモ

[https://damemoto-shiro.github.io/monty-hall-lab/](https://damemoto-shiro.github.io/monty-hall-lab/)

## 📜 ライセンス

MIT (c) 2026 Shiro Damemoto
