# Agentic IBP（Integrated Business Planning）マニュアル

AIエージェントのスキルを活用した **Agentic IBP** — 需要計画、在庫最適化、生産計画、物流最適化、リスク管理を統合する次世代ビジネスプランニングシステムの使い方ガイドです。

---

## 1. Agentic IBP とは

Agentic IBP は、従来サイロ化していた S&OP / IBP プロセスの各ステップを **AIエージェント** が自律的に実行・連携するアプローチです。

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Agentic IBP ワークフロー                         │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ 需要計画  │→ │ 在庫方針  │→ │ 供給計画  │→ │ 物流計画  │           │
│  │ Forecast │  │ ABC/Inv  │  │ Lotsizing│  │ VRP/LND  │           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
│       ↑                                          ↓                 │
│  ┌──────────┐                              ┌──────────┐           │
│  │ データ前処│                              │ リスク管理 │           │
│  │ 理・分析  │                              │ SCRM     │           │
│  └──────────┘                              └──────────┘           │
│                                                                     │
│  横断機能: シフト最適化 / スケジューリング / 収益管理 / 可視化        │
└─────────────────────────────────────────────────────────────────────┘
```

**従来の IBP との違い:**
- 人間がExcelで繋いでいた各ステップを、エージェントが **自動オーケストレーション**
- 自然言語で指示するだけで、**データ読込→分析→最適化→可視化** を一気通貫実行
- シナリオ比較・What-if分析を **対話的** に実施可能

---

## 2. 利用可能なスキル一覧

### 2.1 IBP コア（SCMOpt シリーズ）

| カテゴリ | スキル名 | 主な機能 | IBP上の位置づけ |
|---------|---------|---------|----------------|
| **需要計画** | `scmopt_forecast` | Holt-Winters、移動平均、指数平滑法、顧客×製品セグメント別予測 | Step 1: 需要予測 |
| **重要度分析** | `scmopt_abc` | ABC分析、XYZ分析、VED分析、FSN分析、ローリングABC、クロス分析 | Step 2: SKU分類・優先度付け |
| **在庫最適化** | `scmopt_inventory` | EOQ、安全在庫、(Q,R)/(s,S)方策、Wagner-Whitin、多段階SSA、ベースストック | Step 3: 在庫方針策定 |
| **生産計画** | `scmopt_lotsizing` | 単純ロットサイズ、BOM対応、マルチモード生産計画 | Step 4: 供給計画 |
| **S&OP統合** | `scmopt_sop` | 需要予測→ABC→在庫→生産を一気通貫実行、シナリオ比較 | Step 1-4 統合オーケストレーション |
| **物流設計** | `scmopt_logistics` | 施設配置（Weiszfeld、K-Median）、3層ネットワーク設計 | ネットワーク設計 |
| **配車計画** | `scmopt_vrp` | CVRP、VRPTW、マルチデポ、異種車両 (PyVRP) | ラストマイル最適化 |
| **リスク管理** | `scmopt_risk` | 生存時間分析、期待値最適化、CVaR最適化、方針比較 | サプライチェーンリスク |
| **スケジューリング** | `scmopt_scheduling` | RCPSP、ジョブショップ、フレキシブルジョブショップ | 生産スケジュール |
| **シフト最適化** | `scmopt_shift` | シフトスケジューリング（CP-SAT） | 人員配置計画 |
| **ネットワーク設計** | `scmopt_snd` | サービスネットワーク設計、K最短経路 | 幹線輸送設計 |
| **収益管理** | `scmopt_revenue` | 容量配分、入札価格制御、予約制限 | 収益最適化 |

### 2.2 データ前処理・分析

| スキル名 | 主な機能 |
|---------|---------|
| `csv_loading` | CSV読込（エンコーディング・区切り文字の自動検出） |
| `data_merging` | 複数CSVの自動マージ |
| `data_preprocessing` | データクリーニング・前処理 |
| `data_visualization` | EDAレポート・可視化 |
| `summarizing_csv_data` | CSV統計サマリー・簡易可視化 |
| `geocoding` | ジオコーディング・距離行列計算 |

### 2.3 予測・ML

| スキル名 | 主な機能 |
|---------|---------|
| `tabular_prediction` | AutoGluonによる表形式データの機械学習（分類・回帰） |
| `timeseries_forecasting` | AutoGluonによる時系列予測 |

### 2.4 アプリ生成

| スキル名 | 主な機能 |
|---------|---------|
| `ampl_code_generation` | 自然言語→AMPLモデル生成 |
| `ampl_streamlit_converter` | AMPL/PythonスクリプトをStreamlitアプリ化 |
| `pydantic_to_streamlit_app_generation` | PydanticモデルからStreamlitアプリ生成 |

---

## 3. フォルダ構成

```
skills/
├── .agent/
│   └── skills/                    # ← スキル定義ファイル群
│       ├── _common/               #    共通ユーティリティ
│       ├── scmopt_forecast/       #    需要予測スキル
│       │   ├── SKILL.md           #    スキル仕様書
│       │   ├── src/               #    Pythonソースコード
│       │   │   └── runner.py      #    実行エントリポイント
│       │   └── samples/           #    サンプルデータ
│       ├── scmopt_abc/            #    ABC分析スキル
│       ├── scmopt_inventory/      #    在庫最適化スキル
│       ├── scmopt_lotsizing/      #    生産計画スキル
│       ├── scmopt_sop/            #    S&OP統合スキル
│       ├── scmopt_logistics/      #    物流ネットワーク設計
│       ├── scmopt_vrp/            #    配車計画スキル
│       ├── scmopt_risk/           #    リスク管理スキル
│       ├── scmopt_scheduling/     #    スケジューリング
│       ├── scmopt_shift/          #    シフト最適化
│       ├── scmopt_snd/            #    サービスネットワーク設計
│       ├── scmopt_revenue/        #    収益管理
│       ├── csv_loading/           #    CSV読込
│       ├── data_visualization/    #    データ可視化
│       ├── geocoding/             #    ジオコーディング
│       ├── tabular_prediction/    #    機械学習予測
│       ├── timeseries_forecasting/#    時系列予測
│       └── ...                    #    その他スキル
│
├── usage/                         # ← サンプルプロンプト・マニュアル
│   ├── manual.md                  #    本マニュアル
│   ├── data/                      #    サンプルデータ
│   └── *_prompts.md               #    各スキルのサンプルプロンプト
│
├── data/                          # ← プロジェクトデータ
├── README.md                      # ← プロジェクト概要
└── pyproject.toml                 # ← 依存パッケージ定義
```

---

## 4. IBP ワークフロー別 使い方

### 4.1 Phase 1: S&OP 一気通貫実行（最速パス）

最小限のデータで S&OP 計画を一気に実行できます。

#### 必要データ
- `monthly_demand.csv`（列: `date`, `demand` または `sku`, `date`, `demand`）

#### サンプルプロンプト

```
以下の月次需要データを読み込んで、S&OP計画を実行してください。

- 需要データ: usage/data/monthly_demand.csv
- テンプレート: manufacturing
- 予測期間: 12ヶ月
- リードタイム: 7日
- サービスレベル: A=99%, B=95%, C=90%

結果のダッシュボードも表示してください。
```

#### 処理フロー
1. **sop_diagnose** — データ診断
2. **sop_plan** — 需要予測→ABC分類→在庫方針→生産計画
3. **sop_summary** — エグゼクティブサマリー生成

---

### 4.2 Phase 2: 各ステップの詳細分析

#### Step 1: 需要予測

```
以下の月次需要データをHolt-Winters法で予測してください。

data = [120, 135, 150, 140, 165, 180, 170, 195, 210, 200, 225, 240,
        130, 145, 160, 150, 175, 190, 180, 205, 220, 210, 235, 250]

- 予測期間: 12ヶ月
- 季節周期: 12
- 信頼区間: 95%
- バックテスト比率: 0.2（精度検証）

予測チャートを表示してください。
```

#### Step 2: ABC分析（重要度分類）

```
以下のSKU別の年間需要データでABC-XYZマトリクス分析を行ってください。

需要データCSV: usage/data/demand_by_sku.csv
（列: date, prod, demand）

結果をヒートマップとバブルチャートで可視化してください。
AXセグメント（高需要・安定）とCZセグメント（低需要・不安定）の管理方針も提案してください。
```

#### Step 3: 在庫最適化

```
以下の製品について最適な在庫方策を計算してください。

- 日次平均需要: 150個
- 需要の標準偏差: 30個
- 平均リードタイム: 10日
- リードタイム標準偏差: 2日
- サービスレベル: 95%
- 発注固定費: 10,000円
- 保管費: 3円/個/日

安全在庫、発注点、EOQを算出し、(Q,R)方策のシミュレーションも実行してください。
```

#### Step 4: 生産計画

```
以下のBOM構成で6期間の生産計画を最適化してください。

製品構成:
- 完成品 FP（在庫費: 2円/期）
- サブアセンブリ Sub1（在庫費: 1円/期）← FPに1個
- 原材料 RM1（在庫費: 0.5円/期）← Sub1に2個

需要:
- FP: [50, 60, 40, 70, 55, 65]

生産能力: 各期480分
段取り費: FP=500円, Sub1=300円, RM1=100円
```

---

### 4.3 Phase 3: 物流最適化

#### 施設配置（ネットワーク設計）

```
以下の顧客データから、最適な物流拠点を2拠点配置してください。

顧客データ: usage/data/customers.csv
（列: name, lat, lon, weight）

K-Median法で最適化し、地図上に可視化してください。
```

#### 配車計画（VRP）

```
東京デポから8件の顧客に配送する配車計画を最適化してください。

デポ: 東京駅（139.7671, 35.6812）
車両: 3台、積載容量50個
制限時間: 60秒

顧客データ:
ID, 経度, 緯度, 配送量
1, 139.77, 35.69, 12
2, 139.75, 35.70, 15
3, 139.80, 35.68, 10
4, 139.73, 35.67, 18
5, 139.78, 35.71, 8
6, 139.76, 35.72, 14
7, 139.79, 35.66, 11
8, 139.74, 35.69, 9

OSRM道路距離を使用し、ルートを地図上に可視化してください。
```

---

### 4.4 Phase 4: リスク分析

```
以下のサプライチェーン構造のリスク分析を行ってください。

BOM: RM1→Sub1→FP1（RM1はSub1に2個必要）
工場: PlantA（RM1, Sub1を生産）、PlantB（FP1を生産）
PlantA → PlantB の物流リンクあり

途絶確率: PlantA=10%, PlantB=5%
回復時間: PlantA=3期, PlantB=2期

生存時間分析を行い、さらにCVaR最適化（信頼水準95%）で最適な安全在庫配置を求めてください。
期待値方策とCVaR方策の比較レポートも出力してください。
```

---

### 4.5 Phase 5: シナリオ比較（What-If分析）

```
以下の2つのシナリオで S&OP 計画を比較してください。

共通データ: usage/data/monthly_demand.csv

シナリオ1「標準」:
- リードタイム: 7日
- サービスレベル: A=99%, B=95%, C=90%

シナリオ2「リスク対応」:
- リードタイム: 14日
- サービスレベル: A=99.5%, B=97%, C=95%

コスト差とサービスレベル差をKPIで比較し、推奨案を提示してください。
```

---

## 5. 高度な使い方

### 5.1 End-to-End IBP パイプライン

複数スキルを連携させるフルパイプラインの例:

```
以下の手順でEnd-to-End IBPを実行してください。

1. データ読込・前処理
   - usage/data/orders.csv を読み込み、サマリーを表示

2. 需要予測
   - 月次集計して Holt-Winters法 で12ヶ月先を予測

3. ABC-XYZ分析
   - SKU別にABC-XYZマトリクス分類

4. 在庫方針
   - Aランク品: サービスレベル99%で安全在庫計算
   - Bランク品: サービスレベル95%
   - Cランク品: サービスレベル90%

5. 生産計画
   - Aランク品について6ヶ月のロットサイズ最適化

6. 配車計画
   - 納入先への配送ルート最適化

各ステップの結果をサマリーにまとめてください。
```

### 5.2 Streamlit アプリ化

分析結果をインタラクティブなWebアプリにする:

```
先ほどの S&OP 分析コードを Streamlit アプリに変換してください。

以下の機能を含めてください:
- パラメータ変更（リードタイム、サービスレベル）
- 需要予測チャートの表示
- ABC分類結果の表示
- 在庫方針テーブルの表示
```

### 5.3 数理最適化モデルの自動生成

AMPL スキルを使って、カスタム最適化モデルを自然言語から生成:

```
以下の輸送問題をAMPLモデルで定式化・求解してください。

工場: 東京（供給300）、大阪（供給250）
顧客: A（需要150）、B（需要200）、C（需要100）

輸送コスト（円/個）:
       A    B    C
東京  10   15   20
大阪  12    8   18

総輸送コストを最小化する輸送計画を求めてください。
LaTeX形式の数式も出力してください。
```

---

## 6. データ準備ガイドライン

### 6.1 需要データ（最も基本）

| パターン | 列 | 用途 |
|---------|----|----- |
| 単一SKU | `date`, `demand` | 需要予測、S&OP（最小構成） |
| 多SKU | `sku`(or `prod`), `date`, `demand` | ABC分析、多品目S&OP |
| 顧客×製品 | `date`, `cust`, `prod`, `demand` | セグメント別予測、リスクプーリング |

### 6.2 製品マスタ

| 列 | 説明 |
|----|------|
| `name` | 製品名 |
| `inv_cost` | 在庫費用/単位/期 |
| `initial_inventory` | 初期在庫 |
| `safety_inventory` | 安全在庫 |

### 6.3 BOM（部品表）

| 列 | 説明 |
|----|------|
| `child` | 子品目 |
| `parent` | 親品目 |
| `units` | 必要数量 |

### 6.4 顧客/拠点データ

| 列 | 説明 |
|----|------|
| `name` | 拠点名 |
| `lat` | 緯度 |
| `lon` | 経度 |
| `weight` or `demand` | 需要量/重み |

---

## 7. Tips & ベストプラクティス

### 一般的なコツ

1. **まず `sop_diagnose` で診断** — データの過不足を事前確認
2. **小さく始める** — 単一SKU→多SKU→多品目BOMの順で拡張
3. **シナリオ比較を活用** — パラメータ変更の影響を定量的に評価
4. **可視化を活用** — 各スキルが出力するHTMLチャートで結果を確認

### プロンプトのコツ

1. **データの場所を明示** — ファイルパスやインラインデータを明記
2. **パラメータを具体的に** — リードタイム、サービスレベル等を数値で指定
3. **出力形式を指定** — 「チャートを表示」「サマリーを日本語で」等

### IBP サイクルの回し方

```
月次サイクル:
  1. 需要予測の更新（新データ追加 → scmopt_forecast）
  2. ABC分類の見直し（scmopt_abc の rolling_abc）
  3. 在庫方針の調整（scmopt_inventory）
  4. 生産計画の更新（scmopt_lotsizing）

四半期サイクル:
  5. ネットワーク設計の見直し（scmopt_logistics）
  6. リスク分析の更新（scmopt_risk）
  7. シナリオ比較でのS&OP審議（scmopt_sop）

年次サイクル:
  8. 収益管理戦略の更新（scmopt_revenue）
  9. 中長期ネットワーク再設計（scmopt_snd）
```

---

## 8. よくある質問（FAQ）

**Q: データがないシナリオでも試せますか？**
A: はい。各スキルにはサンプルデータが含まれています。`scmopt_sop` の `samples/monthly_demand.csv` や `scmopt_abc` の `samples/demand.csv` 等を使ってお試しください。

**Q: S&OP を一気通貫で実行するには？**
A: `scmopt_sop` スキルの `sop_plan` 関数を使えば、需要データだけで Step 1〜4 を自動実行します。BOM データを追加すると Step 4 がフルモードになります。

**Q: 結果をWebアプリにしたいのですが？**
A: `ampl_streamlit_converter` または `pydantic_to_streamlit_app_generation` スキルで、分析結果をインタラクティブな Streamlit アプリに変換できます。

**Q: CSVの文字コードがShift-JISですが？**
A: `csv_loading` スキルがエンコーディングを自動検出して読み込みます。

**Q: 複数の最適化を連携させるにはどうすればよいですか？**
A: 自然言語で手順を記述するだけで、エージェントが各スキルを順に呼び出して連携します。各ステップの出力は次のステップの入力として自動的に引き渡されます。

---

## 9. スキル別 サンプルプロンプト集

各スキルの詳細なサンプルプロンプトは `usage/` ディレクトリ内の以下ファイルを参照してください:

| IBP機能 | サンプルファイル |
|---------|---------------|
| 数理最適化モデル | [ampl_generation_prompts.md](ampl_generation_prompts.md) |
| CSV読込 | [csv_loading_prompts.md](csv_loading_prompts.md) |
| データマージ | [data_merging_prompts.md](data_merging_prompts.md) |
| データ前処理 | [data_preprocessing_prompts.md](data_preprocessing_prompts.md) |
| データ可視化 | [data_visualization_prompts.md](data_visualization_prompts.md) |
| ジオコーディング | [geocoding_prompts.md](geocoding_prompts.md) |
| 在庫管理 | [inventory_management_prompts.md](inventory_management_prompts.md) |
| スケジューリング | [scheduling_prompts.md](scheduling_prompts.md) |
| VRP (pyvroom) | [pyvroom_prompts.md](pyvroom_prompts.md) |
| VRP (PyVRP) | [pyvrp_prompts.md](pyvrp_prompts.md) |
| CSV統計 | [summarizing_csv_prompts.md](summarizing_csv_prompts.md) |
| 機械学習予測 | [tabular_prediction_prompts.md](tabular_prediction_prompts.md) |
| 時系列予測 | [timeseries_prompts.md](timeseries_prompts.md) |
