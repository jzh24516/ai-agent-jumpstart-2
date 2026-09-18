import type { Lab, Locale } from '../../types'

type Lab07PageKey =
  | 'open-apps-preview/main'
  | 'describe-mrm-app/main'
  | 'build-and-explore/watch-generation'
  | 'build-and-explore/preview-and-code'
  | 'enhance-theme/main'
  | 'save-and-publish/main'

type Lab07StepId = 'open-apps-preview' | 'describe-mrm-app' | 'build-and-explore' | 'enhance-theme' | 'save-and-publish'
type Lab07PromptId = 'lab07-preview-url' | 'lab07-mrm-app-prompt' | 'lab07-theme-prompt' | 'lab07-app-name'

export interface Lab07LocalePack {
  title: string
  summary: string
  outcome: string
  objectives: [string, string, string]
  prerequisites: [string, string]
  stepTitles: Record<Lab07StepId, string>
  pageTitles: Record<'build-and-explore/watch-generation' | 'build-and-explore/preview-and-code', string>
  paragraphs: Record<Lab07PageKey, [string]>
  markdown: Record<Lab07PageKey, string>
  highlights: Record<Lab07PageKey, string>
  promptTitles: Record<Lab07PromptId, string>
}

export const applyLab07Locale = (lab: Lab, locale: Exclude<Locale, 'en'>, pack: Lab07LocalePack): void => {
  lab.title[locale] = pack.title
  lab.summary[locale] = pack.summary
  lab.outcome[locale] = pack.outcome
  pack.objectives.forEach((value, index) => { lab.objectives[index][locale] = value })
  pack.prerequisites.forEach((value, index) => { lab.prerequisites[index][locale] = value })

  for (const step of lab.steps) {
    step.title[locale] = pack.stepTitles[step.id as Lab07StepId]
    for (const page of step.pages ?? []) {
      const key = `${step.id}/${page.id}` as Lab07PageKey
      if (page.title) page.title[locale] = pack.pageTitles[key as keyof typeof pack.pageTitles]
      page.paragraphs[0][locale] = pack.paragraphs[key][0]
      if (page.markdown) page.markdown[locale] = pack.markdown[key]
      if (page.highlight) page.highlight[locale] = pack.highlights[key]
      for (const prompt of page.prompts ?? []) {
        if (prompt.title) prompt.title[locale] = pack.promptTitles[prompt.id as Lab07PromptId]
      }
    }
  }
}

export const lab07Ja: Lab07LocalePack = {
  title: 'Copilot Studio Apps (Preview) で MRM アプリを構築する',
  summary: 'Copilot Studio Apps (Preview) で GitHub Copilot harness を使い、自然言語からモダンなマーケティング リソース管理 (MRM) アプリを構築し、生成されたコードを確認して拡張し、公開します。',
  outcome: '予算計画、費用追跡、マーケティング施策、リソース管理、ライト/ダーク テーマ切り替えを備えた、Marketing Resource Hub - <Your Alias> という名前の公開済み管理対象アプリ。',
  objectives: [
    'Copilot Studio Apps (Preview) を開き、GitHub Copilot harness を使って新しいアプリを作成する。',
    '詳細な自然言語の要求からマーケティング リソース管理 (MRM) アプリを生成し、生成の進捗をリアルタイムで確認する。',
    'Preview と Code モードを比較し、ライト/ダーク テーマ切り替え機能を追加して、アプリを保存・公開する。',
  ],
  prerequisites: [
    'Apps (Preview) と GitHub Copilot harness が Maker アカウントで有効になっている Copilot Studio 環境。',
    'その環境でアプリを作成および公開する権限。Preview の利用では Copilot Credits を消費する場合があり、Preview の利用条件が適用されます。',
  ],
  stepTitles: {
    'open-apps-preview': 'Copilot Studio Apps (Preview) を開く',
    'describe-mrm-app': 'MRM アプリについて説明する',
    'build-and-explore': '構築を見守り、Preview と Code を探索する',
    'enhance-theme': 'テーマ切り替えでアプリを拡張する',
    'save-and-publish': '名前を変更して保存し、公開する',
  },
  pageTitles: {
    'build-and-explore/watch-generation': 'アプリが形になる様子を見る',
    'build-and-explore/preview-and-code': 'Preview と Code モードを確認する',
  },
  paragraphs: {
    'open-apps-preview/main': ['Copilot Studio の Home ページから始めるか、テナントに Apps の項目がまだ表示されない場合は Preview の直接 URL を使用します。'],
    'describe-mrm-app/main': ['1 つの成果重視プロンプトを使って、アプリの範囲、ユーザー、4 つの中核業務機能を harness に伝えます。'],
    'build-and-explore/watch-generation': ['GitHub Copilot harness が要件を解釈し、動作するモダンなアプリケーションへ変換する様子を確認します。'],
    'build-and-explore/preview-and-code': ['Preview で生成されたアプリケーションをテストし、Code モードで、動作する体験がどのように生成・更新されるかを確認します。'],
    'enhance-theme/main': ['同じ会話を続け、harness に完全なライト/ダーク テーマ体験を追加するよう依頼します。'],
    'save-and-publish/main': ['アプリにワークショップ用の一意の名前を付け、生成された作業内容を保存し、検証済みのバージョンを公開します。'],
  },
  markdown: {
    'open-apps-preview/main': `## Copilot Studio Apps (Preview) を開く
1. **Copilot Studio** を開き、講師が割り当てた環境を使用していることを確認します。
2. **Home** ページで **Apps (Preview)** を見つけて選択します。
3. Apps の項目が見当たらない場合は、新しいタブで Preview を直接開きます: **https://aka.ms/app-studio/preview**
4. **GitHub Copilot harness** を使って新しいアプリを作成するオプションを選択します。
5. このブラウザー タブは、ラボの終了まで開いたままにします。

> **Preview に関する注意:** 体験、ラベル、配置は変更される場合があります。UI がこの手順と異なる場合は、最も近い同等の項目を選択してください。`,
    'describe-mrm-app/main': `## マーケティング リソース管理アプリについて説明する
1. 自然言語入力欄に、下に示すアプリ要求を貼り付けます。
2. 要求を送信します。
3. Copilot Studio から確認のための質問が出た場合は、最初のバージョンを次の 4 つの領域に絞ります:
   - **予算と計画** — キャンペーンを計画し、マーケティング予算を配分します。
   - **費用追跡** — 予定支出と実績支出を記録します。
   - **マーケティング施策** — キャンペーン、アクティビティ、チャネル、成果物を整理します。
   - **時間とリソース管理** — 担当者、工数、日付、ステータスを割り当てます。
4. 構築を承認する前に、提案された計画や前提条件を確認します。
5. 構築を開始し、後でアプリを調整できるよう会話を開いたままにします。

ビジネス成果とユーザー像が具体的であるほど、生成される情報アーキテクチャと体験は有用になります。`,
    'build-and-explore/watch-generation': `## GitHub Copilot harness によるアプリの構築を見守る
1. Copilot Studio が要求を解釈してアプリを作成している間、進捗メッセージを確認します。
2. MRM シナリオがページ、ナビゲーション、コンポーネント、インタラクション、データ概念に分解される様子を確認します。
3. 最初の完成版には通常約 **10～15 分**かかります。構築時間は変動します。
4. 生成中はページを更新したり閉じたりしないでください。
5. harness が接続、テーブル、その他のリソースの承認を求めた場合は、承認前に要求内容を確認します。
6. 生成が完了したら、右側の Preview 領域にモダンなアプリケーションが表示されることを確認します。

生成は反復的に行われます。使える最初のバージョンは出発点であり、最終デザインではありません。

## 生成されたアプリを自由に探索する
最初のバージョンが準備できたら、エンド ユーザーのように生成されたアプリ内の好きな場所をクリックして探索してください。

- ナビゲーションを使って MRM の各作業領域を移動します。
- 利用可能なマーケティング リソース レコードをフィルターし、並べ替えます。
- レコードを選択して詳細フォームまで掘り下げます。
- 新しいマーケティング計画または予算を作成し、生成されたフィールドと体験を確認します。
- さまざまな種類のマーケティング リソース レコードを編集し、変更がアプリに反映されることを確認します。
- メイン ビューに戻り、利用可能な他の操作も引き続き探索します。

ワークショップまたはサンプル データのみを使用してください。目的は、コードを確認する前に、生成されたアプリのナビゲーション、フォーム、フィルター、レコード管理の体験を理解することです。`,
    'build-and-explore/preview-and-code': `## Preview と Code モードを探索する
1. **Preview** で生成された体験をたどり、主要な MRM 領域を確認します。
   - 予算と計画
   - 費用追跡
   - マーケティング施策
   - 時間とリソース管理
2. 主要なインタラクションを試し、利用できる空状態、読み込み状態、データあり状態を確認します。
3. **Code** モードに切り替え、アプリケーションが実行時にどのように生成されるかを確認します。
4. harness が変更を適用している間に **Preview** と **Code** を行き来し、ソースとレンダリング結果が同期されたままであることを確認します。
5. **Preview** に戻り、アプリがデスクトップ幅でも狭い幅でも使用できることを確認します。

このラボでは、生成されたソースを手動で編集する必要はありません。目的は、自然言語の変更がどのように動作するアプリケーション コードになるかを理解することです。`,
    'enhance-theme/main': `## ライト/ダーク テーマ切り替えを追加する
1. 自然言語の会話に戻ります。
2. 下に示す機能拡張要求を貼り付けます。
3. 要求を送信し、harness が影響を受ける UI とコードを特定する様子を確認します。
4. 更新が完了したら、**Preview** で新しいテーマ切り替えコントロールを見つけます。
5. ライト テーマとダーク テーマを切り替え、テキスト、ナビゲーション、フォーム、グラフ、状態の色が読みやすいことを確認します。
6. **Code** に切り替えて生成された変更を確認し、最後に **Preview** に戻ってテストします。

今後の機能拡張でも、同じ反復的な進め方を使用できます。まず新しい体験を依頼し、アプリが実際の業務データを必要とするときに、承認済みの接続とデータ テーブルを追加してください。`,
    'save-and-publish/main': `## 名前を変更して保存し、公開する
1. アプリの詳細または名前変更コマンドを開きます。
2. アプリの名前を **Marketing Resource Hub - <Your Alias>** に変更します。
3. **Save** を選択し、保存処理が完了するまで待ちます。
4. 最終的な Preview を確認し、4 つの MRM 領域とテーマ切り替えが引き続き動作することを確認します。
5. **Publish** を選択します（Preview 体験でラベルが **Save and publish** の場合は、そちらを選択します）。
6. 成功の確認が表示されるまで待ってからページを離れます。
7. Copilot Studio から公開済みのアプリを再度開き、公開後の名前と体験を確認します。

公開すると、現在保存されているバージョンが、環境でサポートされているチャネルと権限を通じて利用できるようになります。Preview および試用機能はテナントによって異なる場合があります。`,
  },
  highlights: {
    'open-apps-preview/main': 'Home ページで Apps が見つからない場合は、https://aka.ms/app-studio/preview を直接開いてください。これは Preview 体験なので、ラベルやレイアウトは変更される場合があります。',
    'describe-mrm-app/main': '最初の構築は焦点を絞って進めます。理解している計画とリソースだけを承認し、その後は小さく検証しやすい要求を重ねて体験を磨きます。',
    'build-and-explore/watch-generation': '最初の完成版には通常 10～15 分ほどかかります。セッションを開いたままにして、進捗メッセージで harness が何を作成しているかを把握してください。',
    'build-and-explore/preview-and-code': 'Preview はユーザー体験を確認し、Code モードでは生成された実装を可視化します。両方を切り替えて、自然言語での意図を最終的なアプリにつなげてください。',
    'enhance-theme/main': 'すべての拡張を検証可能な変更として扱います。1 つの機能を依頼し、何が変わるかを確認してから、次の機能を求める前に Preview で検証します。',
    'save-and-publish/main': '明示的な保存と公開の完了確認を待ってください。見た目が正しい Preview と、正常に公開されたアプリは同じではありません。',
  },
  promptTitles: {
    'lab07-preview-url': 'Apps (Preview) の直接 URL',
    'lab07-mrm-app-prompt': 'MRM アプリの依頼文',
    'lab07-theme-prompt': 'テーマ切り替えの依頼文',
    'lab07-app-name': '最終アプリ名',
  },
}
