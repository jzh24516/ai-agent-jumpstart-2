import type { Lab } from '../../types'

const itInstructions = `You are Ask IT Anything, an internal IT support specialist.
- Search the approved ServiceNow knowledge base before answering procedural questions.
- For ticket status, use the ServiceNow connection and require the incident number or help the user select from tickets they are authorized to view.
- Return incident number, short description, state, priority, assigned group, last update, and next expected action.
- Never expose another user's ticket, private work notes, credentials, or security-sensitive implementation details.
- Do not claim a ticket was updated unless the ServiceNow tool confirms success.
- Escalate urgent safety, identity compromise, and widespread outage signals according to the approved helpdesk process.
- Respond in the user's language while preserving official ServiceNow field values where precision matters.`

export const lab04: Lab = {
  id: 'lab-04', number: 4, icon: 'network', duration: 70,
  title: { en: 'Connect an Ask IT Anything agent', zh: '连接 Ask IT Anything Agent', ja: 'Ask IT Anything Agent を接続', ko: 'Ask IT Anything Agent 연결' },
  summary: { en: 'Build a ServiceNow-backed specialist, connect it as an agent, and publish the multi-agent experience.', zh: '构建由 ServiceNow 支持的专家 Agent，作为 Connected Agent 接入并发布多 Agent 体验。', ja: 'ServiceNow 対応の専門 Agent を作り、Connected Agent として接続・公開します。', ko: 'ServiceNow 기반 전문 Agent를 구축하고 Connected Agent로 연결해 다중 Agent 경험을 게시합니다.' },
  outcome: { en: 'A routed multi-agent solution available for joint testing in Microsoft 365 Copilot and Teams.', zh: '一个可在 Microsoft 365 Copilot 与 Teams 联合测试的路由式多 Agent 方案。', ja: 'Microsoft 365 Copilot と Teams で共同テストできるルーティング型マルチ Agent。', ko: 'Microsoft 365 Copilot 및 Teams에서 공동 테스트 가능한 라우팅형 다중 Agent 솔루션.' },
  objectives: [
    { en: 'Connect ServiceNow knowledge and ticket status actions.', zh: '连接 ServiceNow 知识与工单状态操作。', ja: 'ServiceNow ナレッジとチケット状態アクションを接続する。', ko: 'ServiceNow 지식 및 티켓 상태 작업을 연결합니다.' },
    { en: 'Delegate IT requests to a connected specialist agent.', zh: '将 IT 请求委派给 Connected Specialist Agent。', ja: 'IT リクエストを Connected Specialist Agent に委任する。', ko: 'IT 요청을 연결된 전문 Agent에 위임합니다.' },
    { en: 'Publish and verify behavior across M365 and Teams.', zh: '发布并验证 M365 与 Teams 中的行为。', ja: 'M365 と Teams で公開・検証する。', ko: 'M365 및 Teams에서 게시하고 동작을 검증합니다.' },
  ],
  prerequisites: [{ en: 'Complete Labs 1-3 and obtain an approved ServiceNow connection with sample incidents.', zh: '完成 Labs 1-3，并获得包含示例工单的已批准 ServiceNow 连接。', ja: 'Labs 1-3 を完了し、サンプル インシデントを含む承認済み ServiceNow 接続を用意します。', ko: 'Labs 1-3를 완료하고 샘플 인시던트가 있는 승인된 ServiceNow 연결을 준비합니다.' }],
  steps: [
    { id: 'create-it', imageKey: '01-create-it-agent', title: { en: 'Create the IT specialist', zh: '创建 IT 专家 Agent', ja: 'IT 専門 Agent を作成', ko: 'IT 전문 Agent 만들기' }, body: { en: 'Create a separate agent named Ask IT Anything. Add the instructions below and a clear description that helps orchestration recognize IT support, device, access, software, and incident-status intents.', zh: '创建独立的 Ask IT Anything Agent，添加下方指令和清晰描述，以便编排识别 IT 支持、设备、访问、软件和工单状态意图。', ja: 'Ask IT Anything を別 Agent として作り、以下の指示と IT サポート意図を識別できる説明を追加します。', ko: 'Ask IT Anything을 별도 Agent로 만들고 아래 지침과 IT 지원 의도를 식별할 수 있는 설명을 추가합니다.' }, prompt: itInstructions },
    { id: 'servicenow', imageKey: '02-servicenow', title: { en: 'Add the ServiceNow connection', zh: '添加 ServiceNow 连接', ja: 'ServiceNow 接続を追加', ko: 'ServiceNow 연결 추가' }, body: { en: 'In Tools, add the ServiceNow connection. Enable knowledge search and read-only incident lookup actions first, then test with a known incident owned by the signed-in user.', zh: '在 Tools 中添加 ServiceNow 连接；先启用知识搜索与只读工单查询，并使用当前用户拥有的已知工单进行测试。', ja: 'Tools で ServiceNow 接続を追加し、ナレッジ検索と読み取り専用インシデント検索から有効化してテストします。', ko: 'Tools에서 ServiceNow 연결을 추가하고 지식 검색 및 읽기 전용 인시던트 조회부터 활성화한 뒤 테스트합니다.' }, highlight: { en: 'Keep write actions out of scope until you have explicit confirmation, audit, and rollback requirements.', zh: '在具备明确确认、审计和回滚要求前，不要启用写入操作。', ja: '明示的な確認、監査、ロールバック要件が整うまでは書き込みを対象外にします。', ko: '명시적 확인, 감사 및 롤백 요구 사항이 마련될 때까지 쓰기 작업을 범위에서 제외하세요.' } },
    { id: 'connect', imageKey: '03-connected-agent', title: { en: 'Connect the specialist to Ask Me Anything', zh: '将专家接入 Ask Me Anything', ja: '専門 Agent を Ask Me Anything に接続', ko: '전문 Agent를 Ask Me Anything에 연결' }, body: { en: 'Return to Ask Me Anything, add Ask IT Anything as a connected agent, and describe its delegation boundary. Test a Microsoft product question, an IT knowledge question, and a ticket-status question.', zh: '返回 Ask Me Anything，将 Ask IT Anything 添加为 Connected Agent 并描述委派边界；测试产品问题、IT 知识问题与工单状态问题。', ja: 'Ask Me Anything に戻り、Ask IT Anything を Connected Agent として追加し、製品・IT・チケット質問をテストします。', ko: 'Ask Me Anything으로 돌아가 Ask IT Anything을 Connected Agent로 추가하고 제품, IT 지식, 티켓 상태 질문을 테스트합니다.' } },
    { id: 'publish', imageKey: '04-publish-channels', title: { en: 'Publish to M365 and Teams', zh: '发布到 M365 与 Teams', ja: 'M365 と Teams に公開', ko: 'M365 및 Teams에 게시' }, body: { en: 'Publish the latest version, add Microsoft 365 Copilot and Teams channels, install the agent, then run a joint test matrix for routing, identity, citations, ticket privacy, and file or link rendering.', zh: '发布最新版本，添加 Microsoft 365 Copilot 与 Teams 渠道，安装 Agent，并联合测试路由、身份、引用、工单隐私及文件/链接呈现。', ja: '最新版を公開し、Microsoft 365 Copilot と Teams チャネルを追加して、ルーティング、ID、引用、プライバシーを共同テストします。', ko: '최신 버전을 게시하고 Microsoft 365 Copilot 및 Teams 채널을 추가한 뒤 라우팅, ID, 인용, 티켓 개인정보 보호를 공동 테스트합니다.' } },
  ],
}