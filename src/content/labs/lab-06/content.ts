import type { Lab } from '../../types'

const voiceInstructions = `You are a multilingual voice service agent for Contoso.

Conversation rules:
- Detect English, Simplified Chinese, Japanese, or Korean from the caller's speech and continue in that language.
- Use short spoken sentences. Ask one question at a time.
- Confirm names, email addresses, dates, quantities, and reference numbers before using them.
- Read long identifiers in grouped characters and offer to repeat them.
- Support interruptions and corrections without restarting the conversation.
- After two failed recognition attempts, offer keypad input or transfer to a person.
- Summarize the request and ask for explicit confirmation before creating or changing a record.
- Never speak secrets, full payment details, or sensitive personal data back to the caller.

Multi-turn flow:
1. Greet and identify the caller's goal.
2. Collect only the minimum required details.
3. Retrieve knowledge or status with approved tools.
4. Confirm the proposed answer or action.
5. Complete the action only after confirmation.
6. Recap the outcome and next step.

Escalate immediately for threats to safety, suspected identity compromise, or when the caller explicitly asks for a person.`

export const lab06: Lab = {
  id: 'lab-06', number: 6, icon: 'mic', duration: 75,
  title: { en: 'Build a multilingual voice agent', zh: '构建多语言 Voice Agent', ja: '多言語 Voice Agent を作成', ko: '다국어 Voice Agent 구축' },
  summary: { en: 'Use the classic agent experience to create a safe, multilingual, multi-turn voice conversation.', zh: '使用 Classic Agent Experience 创建安全的多语言、多轮语音对话。', ja: 'Classic Agent Experience で安全な多言語・複数ターン音声会話を作成します。', ko: 'Classic Agent Experience를 사용해 안전한 다국어 다중 턴 음성 대화를 만듭니다.' },
  outcome: { en: 'A tested voice agent with language detection, confirmation, recovery, and human handoff.', zh: '一个具备语言检测、确认、恢复与人工转接的已测试 Voice Agent。', ja: '言語検出、確認、復旧、人への転送を備えたテスト済み Voice Agent。', ko: '언어 감지, 확인, 복구 및 상담원 연결을 갖춘 테스트된 Voice Agent.' },
  objectives: [
    { en: 'Configure a voice-capable classic agent.', zh: '配置支持语音的 Classic Agent。', ja: '音声対応 Classic Agent を構成する。', ko: '음성 지원 Classic Agent를 구성합니다.' },
    { en: 'Design concise multilingual, multi-turn instructions.', zh: '设计简洁的多语言、多轮指令。', ja: '簡潔な多言語・複数ターン指示を設計する。', ko: '간결한 다국어 다중 턴 지침을 설계합니다.' },
    { en: 'Test recognition, interruption, confirmation, and handoff.', zh: '测试识别、打断、确认和人工转接。', ja: '認識、割り込み、確認、転送をテストする。', ko: '인식, 중단, 확인 및 상담원 연결을 테스트합니다.' },
  ],
  prerequisites: [{ en: 'Voice features enabled in the training environment, a test phone configuration, and supported speech languages.', zh: '培训环境已启用语音功能，并具备测试电话配置和受支持语音语言。', ja: 'トレーニング環境で音声機能が有効で、テスト電話構成と言語が利用可能であること。', ko: '교육 환경에서 음성 기능이 활성화되고 테스트 전화 구성 및 지원 언어가 준비되어야 합니다.' }],
  steps: [
    { id: 'classic', imageKey: '01-classic-agent', title: { en: 'Create the classic voice agent', zh: '创建 Classic Voice Agent', ja: 'Classic Voice Agent を作成', ko: 'Classic Voice Agent 만들기' }, body: { en: 'Switch to the classic agent experience as directed by the facilitator. Create a new voice-capable agent and set the primary authoring and speech language.', zh: '按照讲师指引切换到 Classic Agent Experience，创建支持语音的新 Agent，并设置主要创作与语音语言。', ja: '講師の指示で Classic Agent Experience に切り替え、音声対応 Agent と主要言語を設定します。', ko: '진행자 안내에 따라 Classic Agent Experience로 전환하고 음성 지원 Agent와 기본 언어를 설정합니다.' }, highlight: { en: 'This lab intentionally uses the classic experience because voice configuration surfaces can differ from the new experience.', zh: '本实验特意使用 Classic Experience，因为语音配置界面可能与 New Experience 不同。', ja: '音声設定画面が新しい Experience と異なるため、このラボでは意図的に Classic を使用します。', ko: '음성 구성 화면이 새 Experience와 다를 수 있어 이 랩에서는 의도적으로 Classic을 사용합니다.' } },
    { id: 'instructions', imageKey: '02-voice-instructions', title: { en: 'Apply voice-first instructions', zh: '应用语音优先指令', ja: '音声優先の指示を適用', ko: '음성 우선 지침 적용' }, body: { en: 'Paste the instructions below. Configure supported languages and verify the speech services available in the environment.', zh: '粘贴下方指令，配置受支持语言，并验证环境中可用的语音服务。', ja: '以下の指示を貼り付け、対応言語と環境で利用できる音声サービスを確認します。', ko: '아래 지침을 붙여넣고 지원 언어와 환경에서 사용 가능한 음성 서비스를 확인합니다.' }, prompt: voiceInstructions },
    { id: 'dialog', imageKey: '03-multiturn-dialog', title: { en: 'Build the multi-turn recovery flow', zh: '构建多轮恢复流程', ja: '複数ターン復旧フローを作成', ko: '다중 턴 복구 흐름 구축' }, body: { en: 'Create a short scenario that collects a reference number, looks up status, confirms the result, handles a correction, and offers human transfer after repeated recognition failure.', zh: '创建简短场景：收集参考编号、查询状态、确认结果、处理纠正，并在多次识别失败后提供人工转接。', ja: '参照番号の収集、状態照会、確認、訂正、認識失敗時の人への転送を含むシナリオを作成します。', ko: '참조 번호 수집, 상태 조회, 결과 확인, 수정 처리, 반복 인식 실패 후 상담원 연결을 포함하는 시나리오를 만듭니다.' } },
    { id: 'test', imageKey: '04-voice-test', title: { en: 'Run the multilingual call test', zh: '运行多语言通话测试', ja: '多言語通話テストを実行', ko: '다국어 통화 테스트 실행' }, body: { en: 'Test all four languages with background noise, interruption, correction, silence, unsupported requests, and transfer. Record recognition accuracy, task completion, latency, and handoff success.', zh: '以四种语言测试背景噪声、打断、纠正、静默、不支持请求和转接，并记录识别准确率、任务完成率、延迟与转接成功率。', ja: '4言語でノイズ、割り込み、訂正、沈黙、未対応要求、転送をテストし、精度、完了率、遅延を記録します。', ko: '4개 언어로 배경 소음, 중단, 수정, 침묵, 미지원 요청 및 연결을 테스트하고 정확도, 완료율, 지연 시간, 연결 성공을 기록합니다.' } },
  ],
}