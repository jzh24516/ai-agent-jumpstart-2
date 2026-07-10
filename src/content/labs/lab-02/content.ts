import type { Lab } from '../../types'

const accountSkill = `# Skill: Build an account plan
When the user asks to plan for an account:
1. Resolve the account unambiguously with the Dataverse MCP server.
2. Retrieve the account profile, open opportunities, recent activities, stakeholders, and risks available to the current user.
3. Ask for the planning horizon and desired business outcome only if missing.
4. Produce: executive snapshot, customer priorities, relationship map, opportunity plays, risks, and a 30/60/90-day action plan.
5. Clearly label CRM facts, external research, and recommendations.
6. Do not expose records the signed-in user is not authorized to access.`

const coworkInput = `Research this account using public web sources and return an enhanced customer 360:

Account: {{Account.Name}}
Known domain: {{Account.Website}}
CRM context: {{AccountSummary}}

Find and summarize only verifiable information from the last 12 months:
- company strategy and executive priorities
- major announcements, acquisitions, and partnerships
- technology signals relevant to Microsoft
- material risks or market changes
- suggested conversation starters

Return source URL, publication date, and confidence for every external claim.`

export const lab02: Lab = {
  id: 'lab-02', number: 2, icon: 'database', duration: 60,
  title: { en: 'Bring in business context', zh: '接入业务上下文', ja: 'ビジネス コンテキストを追加', ko: '비즈니스 컨텍스트 연결' },
  summary: { en: 'Use Dataverse MCP, Skills, Memory, and a CoWork workflow to build an account-aware assistant.', zh: '使用 Dataverse MCP、Skills、Memory 与 CoWork 工作流构建客户感知助手。', ja: 'Dataverse MCP、Skills、Memory、CoWork ワークフローでアカウント対応アシスタントを作ります。', ko: 'Dataverse MCP, Skills, Memory, CoWork 워크플로로 계정 인식 도우미를 만듭니다.' },
  outcome: { en: 'An agent that retrieves your active accounts, remembers Big Bets, and creates a sourced customer 360.', zh: '一个可查询活跃客户、记忆 Big Bet 并生成有来源客户 360 的 Agent。', ja: 'アクティブ アカウントの取得、Big Bet の記憶、出典付き Customer 360 ができる Agent。', ko: '활성 계정 조회, Big Bet 기억, 출처 기반 고객 360을 제공하는 Agent.' },
  objectives: [
    { en: 'Connect Dataverse MCP with user-scoped access.', zh: '以用户范围权限连接 Dataverse MCP。', ja: 'ユーザー スコープのアクセスで Dataverse MCP に接続する。', ko: '사용자 범위 액세스로 Dataverse MCP를 연결합니다.' },
    { en: 'Create a reusable Account Planning skill.', zh: '创建可复用的 Account Planning Skill。', ja: '再利用可能な Account Planning Skill を作成する。', ko: '재사용 가능한 Account Planning Skill을 만듭니다.' },
    { en: 'Combine durable Memory with fresh external CoWork research.', zh: '将持久 Memory 与最新 CoWork 外部调研结合。', ja: '永続 Memory と最新の CoWork 外部調査を組み合わせる。', ko: '지속형 Memory와 최신 CoWork 외부 조사를 결합합니다.' },
  ],
  prerequisites: [{ en: 'Complete Lab 1 and have read access to the facilitator Dataverse sample data.', zh: '完成 Lab 1，并拥有讲师 Dataverse 示例数据的读取权限。', ja: 'Lab 1 を完了し、Dataverse サンプル データの読み取り権限があること。', ko: 'Lab 1을 완료하고 Dataverse 샘플 데이터 읽기 권한이 있어야 합니다.' }],
  steps: [
    { id: 'dataverse', imageKey: '01-dataverse-mcp', title: { en: 'Add Dataverse MCP', zh: '添加 Dataverse MCP', ja: 'Dataverse MCP を追加', ko: 'Dataverse MCP 추가' }, body: { en: 'In Tools, connect the facilitator-provided Dataverse MCP server with user authentication. Test: “Show my top 20 active accounts, ordered by the agreed account score.”', zh: '在 Tools 中以用户身份验证连接讲师提供的 Dataverse MCP。测试：“按约定客户评分列出我的前 20 个活跃客户。”', ja: 'Tools で Dataverse MCP にユーザー認証で接続し、「合意したスコア順に上位20のアクティブ アカウントを表示」とテストします。', ko: 'Tools에서 사용자 인증으로 Dataverse MCP를 연결하고 “합의된 계정 점수순으로 내 상위 20개 활성 계정 표시”를 테스트합니다.' }, highlight: { en: 'Define “my,” “active,” and the ranking field with your facilitator; do not let the model guess the business definition.', zh: '请与讲师明确“我的”“活跃”及排序字段，不要让模型猜测业务定义。', ja: '「自分の」「アクティブ」「順位フィールド」の定義を講師と確認し、モデルに推測させないでください。', ko: '“내”, “활성”, 순위 필드를 진행자와 정의하고 모델이 추측하지 않게 하세요.' } },
    { id: 'skill', imageKey: '02-account-skill', title: { en: 'Create the Account Planning skill', zh: '创建 Account Planning Skill', ja: 'Account Planning Skill を作成', ko: 'Account Planning Skill 만들기' }, body: { en: 'Open Skills, create a skill named Account Planning, define when it should be selected, and use the instructions below. Bind the Dataverse MCP tools it needs.', zh: '打开 Skills，新建名为 Account Planning 的 Skill，定义触发条件，使用下方指令，并绑定所需 Dataverse MCP 工具。', ja: 'Skills で Account Planning を作成し、選択条件と以下の指示を設定して Dataverse MCP ツールを関連付けます。', ko: 'Skills에서 Account Planning을 만들고 선택 조건과 아래 지침을 설정한 뒤 Dataverse MCP 도구를 연결합니다.' }, prompt: accountSkill },
    { id: 'memory', imageKey: '03-big-bet-memory', title: { en: 'Remember Big Bet accounts', zh: '记忆 Big Bet 客户', ja: 'Big Bet アカウントを記憶', ko: 'Big Bet 계정 기억' }, body: { en: 'Enable Memory and tell the agent which accounts you frequently treat as Big Bets. Start a new session and ask for “my Big Bets” to verify durable recall.', zh: '启用 Memory，并告诉 Agent 哪些客户是你常用的 Big Bet。开始新会话并询问“我的 Big Bet”来验证持久记忆。', ja: 'Memory を有効にし、よく使う Big Bet アカウントを伝えます。新しいセッションで「my Big Bets」と質問して確認します。', ko: 'Memory를 활성화하고 자주 사용하는 Big Bet 계정을 알려 줍니다. 새 세션에서 “my Big Bets”를 물어 지속 기억을 확인합니다.' }, highlight: { en: 'Store preferences and stable identifiers, not confidential notes, credentials, or rapidly changing CRM facts.', zh: '只存储偏好和稳定标识，不要存储机密备注、凭据或快速变化的 CRM 事实。', ja: '設定や安定した識別子のみを保存し、機密情報や変化する CRM 事実は保存しません。', ko: '환경 설정과 안정적인 식별자만 저장하고 기밀 메모, 자격 증명, 자주 변하는 CRM 사실은 저장하지 마세요.' } },
    { id: 'cowork', imageKey: '04-cowork-workflow', title: { en: 'Build the CoWork customer 360 workflow', zh: '构建 CoWork 客户 360 工作流', ja: 'CoWork Customer 360 ワークフローを作成', ko: 'CoWork 고객 360 워크플로 만들기' }, body: { en: 'Create a workflow tool that passes the selected CRM account to CoWork for public research. Return structured findings and sources to the agent, then compare them with CRM facts.', zh: '创建工作流工具，将所选 CRM 客户传给 CoWork 进行公开信息调研，以结构化结果和来源返回 Agent，并与 CRM 事实比较。', ja: '選択した CRM アカウントを CoWork に渡して公開情報を調査し、構造化した結果と出典を Agent に返すワークフローを作成します。', ko: '선택한 CRM 계정을 CoWork에 전달해 공개 정보를 조사하고 구조화된 결과와 출처를 Agent에 반환하는 워크플로를 만듭니다.' }, prompt: coworkInput },
  ],
}