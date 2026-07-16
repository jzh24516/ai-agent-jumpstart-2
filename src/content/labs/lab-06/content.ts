import type { Lab } from '../../types'

const createStep = `## Create a classic agent from the modern home page
1. Open **Copilot Studio** and go to the **Home** page (the modern agent experience).
2. Select **+ Create** (or the **New agent** button).
3. On the describe screen, select **Skip to configure** to open the configuration form.
4. Switch to the **classic agent** experience — use the **…** (more) menu and choose **Switch to classic**, or select the classic-experience link on the configure page.
5. Enter a **Name** (for example *Microsoft Product & Service Voice Agent*) and pick the primary **Language**.
6. Select **Create**.`

const authStep = `## Set security to No authentication
1. Open the agent's **Settings** → **Security** → **Authentication**.
2. Select **No authentication**.
3. **Save**, then refresh the agent if prompted.

No authentication lets the voice channel and the Test window run without a sign-in prompt, which keeps the lab flow simple.`

const voiceChannelStep = `## Enable the voice channel and choose real-time voice
1. Go to **Channels** (or **Settings → Channels**).
2. Select **Telephony** / **Voice**.
3. Turn **on** the voice capability for this agent.
4. For the voice engine, choose **Real-time voice** (powered by the GPT-Realtime model via Microsoft Foundry) instead of **Classic voice**.
5. **Save**.

Real-time voice streams audio both ways for low latency and natural turn-taking. Classic voice uses the traditional speech-to-text → model → text-to-speech pipeline, which feels more like an IVR.`

const settingsStep = `## Review the voice settings one by one
Open the voice channel settings and walk through each option:

- **Voice selection** — pick the neural voice and locale (name, gender, style) the agent speaks with.
- **Silence timeout / end-of-speech** — how long the agent waits after the caller stops talking before it responds. Shorter feels snappy; too short cuts people off.
- **Speech sensitivity** — how eagerly the agent detects that the caller has started speaking, especially in noisy audio.
- **DTMF** — accept **keypad tones** so callers can enter menus, numbers, or confirmations by pressing keys.
- **Barge-in** — let the caller **interrupt** the agent while it is speaking, so they don't have to wait for a long prompt to finish.
- **Greeting & retries** — the opening message and how many times to re-prompt on silence or no recognition.

Tune **silence timeout** and **sensitivity** together to balance responsiveness against accidentally cutting the caller off.`

const capabilitiesStep = `## One agent, all of Copilot Studio's capabilities
A real-time voice agent is not a separate, limited product — it reuses everything you already build in Copilot Studio, now spoken:

- **Knowledge** — ground spoken answers in Microsoft.com, SharePoint, files, or your own indexes.
- **Tools** — call MCP servers, connectors, Power Automate flows, and APIs (for example Dataverse or ServiceNow) during the call.
- **Topics** — run deterministic, compliance-critical flows when you need exact wording and steps.
- **Child / connected agents** — hand off to specialists (for example an *Ask IT Anything* agent) mid-conversation and come back.

Combined, these turn a phone call into a compelling, interactive, intelligent conversational experience.`

const sampleInstruction = `You are the Microsoft Product & Service Voice Agent — a friendly, multilingual voice assistant that answers questions about Microsoft products and services (Microsoft 365, Microsoft Copilot, Copilot Studio, Azure, Windows, Dynamics 365, and Surface).

Language:
- Detect the caller's language from their speech (English, 中文, 日本語, 한국어, and more) and respond in that same language.
- If the caller switches language mid-call, switch with them.

Speaking style:
- Speak in short, natural sentences. Ask one question at a time.
- Keep answers concise and conversational, then offer to go deeper if the caller wants.

Multi-turn behavior:
1. Greet the caller and ask how you can help with Microsoft products or services.
2. Understand the goal; ask one clarifying question only if needed.
3. Answer using trusted Microsoft knowledge and name the product you are describing.
4. Check that the caller got what they needed and offer a helpful follow-up.

Boundaries:
- Stay on Microsoft products and services; politely redirect off-topic requests.
- Never invent product details, prices, or availability. If you are unsure, say so and offer to follow up.`

const testStep = `## Test live in the Test command window (multilingual)
1. Open the **Test** pane and switch it to **voice** mode (the microphone in the Test command window).
2. Ask a Microsoft question in **English**: *"What is Microsoft Copilot Studio?"*
3. Ask again in **中文**: *"Copilot 和 Copilot Studio 有什么区别？"*
4. Ask in **日本語**: *"Microsoft 365 Copilot でできることを教えて。"*
5. Ask in **한국어**: *"Azure AI Foundry는 무엇인가요?"*
6. Confirm the agent: detects each language and replies in it, keeps context across turns, and lets you **barge-in** to interrupt.`

export const lab06: Lab = {
  id: 'lab-06', number: 6, icon: 'mic', duration: 45,
  title: { en: 'Build a real-time voice agent', zh: '构建实时语音 Agent', ja: 'リアルタイム音声 Agent を作成', ko: '실시간 음성 Agent 구축' },
  summary: { en: 'Create a classic agent from the modern home page, enable the real-time voice channel, tune the voice settings, and test a multilingual Microsoft product & service voice assistant.', zh: '从现代主页创建 Classic Agent，启用实时语音通道，调整语音设置，并测试多语言的 Microsoft 产品与服务语音助手。', ja: 'モダン ホームから Classic Agent を作成し、リアルタイム音声チャネルを有効化して音声設定を調整し、多言語の Microsoft 製品・サービス音声アシスタントをテストします。', ko: '모던 홈에서 Classic Agent를 만들고 실시간 음성 채널을 활성화하며 음성 설정을 조정하고 다국어 Microsoft 제품 및 서비스 음성 도우미를 테스트합니다.' },
  outcome: { en: 'A no-auth classic agent with the real-time voice channel enabled, tuned voice settings, and a tested multilingual Microsoft product & service voice experience.', zh: '一个无需身份验证、已启用实时语音通道、语音设置已调优并经过多语言测试的 Microsoft 产品与服务语音体验。', ja: '認証なしの Classic Agent にリアルタイム音声チャネルを有効化し、音声設定を調整して多言語でテストした Microsoft 製品・サービス音声体験。', ko: '인증 없는 Classic Agent에 실시간 음성 채널을 활성화하고 음성 설정을 조정하여 다국어로 테스트한 Microsoft 제품 및 서비스 음성 경험.' },
  objectives: [
    { en: 'Create a classic agent from the modern home page and set No authentication.', zh: '从现代主页创建 Classic Agent 并设置为无身份验证。', ja: 'モダン ホームから Classic Agent を作成し、認証なしに設定する。', ko: '모던 홈에서 Classic Agent를 만들고 인증 없음으로 설정합니다.' },
    { en: 'Enable the voice channel, choose real-time voice, and review the voice settings.', zh: '启用语音通道，选择实时语音，并检查语音设置。', ja: '音声チャネルを有効化し、リアルタイム音声を選択して音声設定を確認する。', ko: '음성 채널을 활성화하고 실시간 음성을 선택한 뒤 음성 설정을 검토합니다.' },
    { en: 'Add multilingual voice instructions and test live in the Test command window.', zh: '添加多语言语音指令，并在测试命令窗口中进行实时测试。', ja: '多言語の音声指示を追加し、テスト コマンド ウィンドウでライブ テストする。', ko: '다국어 음성 지침을 추가하고 테스트 명령 창에서 실시간으로 테스트합니다.' },
  ],
  prerequisites: [{ en: 'A Copilot Studio environment with maker access and real-time voice enabled by the facilitator.', zh: '具备 Maker 访问权限、并已由讲师启用实时语音的 Copilot Studio 环境。', ja: 'Maker アクセス権があり、講師によりリアルタイム音声が有効化された Copilot Studio 環境。', ko: 'Maker 액세스 권한이 있고 진행자가 실시간 음성을 활성화한 Copilot Studio 환경.' }],
  steps: [
    {
      id: 'create', title: { en: 'Create a classic agent from the modern home page', zh: '从现代主页创建 Classic Agent', ja: 'モダン ホームから Classic Agent を作成', ko: '모던 홈에서 Classic Agent 만들기' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'Start on the modern Copilot Studio home page and create a classic agent for voice.', zh: '从现代 Copilot Studio 主页开始，为语音创建一个 Classic Agent。', ja: 'モダンな Copilot Studio ホームから、音声用の Classic Agent を作成します。', ko: '모던 Copilot Studio 홈에서 음성용 Classic Agent를 만듭니다.' }],
        markdown: { en: createStep, zh: '', ja: '', ko: '' },
        highlight: { en: 'The real-time voice configuration surfaces live in the classic agent experience, so create the agent there.', zh: '实时语音配置界面位于 Classic Agent 体验中，因此在此创建 Agent。', ja: 'リアルタイム音声の設定画面は Classic Agent 体験にあるため、そこで作成します。', ko: '실시간 음성 구성 화면은 Classic Agent 경험에 있으므로 거기서 에이전트를 만듭니다.' },
        prompts: [{ id: 'lab06-agent-name', title: { en: 'Suggested agent name', zh: '建议的 Agent 名称', ja: '推奨エージェント名', ko: '권장 에이전트 이름' }, content: 'Microsoft Product & Service Voice Agent' }],
        imageKeys: ['01-create-classic-agent-1', '01-create-classic-agent-2'],
      }],
    },
    {
      id: 'auth', title: { en: 'Set security to No authentication', zh: '将安全设置为无身份验证', ja: 'セキュリティを認証なしに設定', ko: '보안을 인증 없음으로 설정' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'Turn off sign-in so the voice channel and Test window run without authentication.', zh: '关闭登录，使语音通道和测试窗口无需身份验证即可运行。', ja: 'サインインをオフにして、音声チャネルとテスト ウィンドウが認証なしで動作するようにします。', ko: '로그인을 끄면 음성 채널과 테스트 창이 인증 없이 실행됩니다.' }],
        markdown: { en: authStep, zh: '', ja: '', ko: '' },
        highlight: { en: 'No authentication is for lab and demo only. Production voice agents should use proper authentication and DLP policies.', zh: '无身份验证仅用于实验和演示。生产语音 Agent 应使用适当的身份验证与 DLP 策略。', ja: '認証なしはラボ・デモ用のみです。本番の音声 Agent は適切な認証と DLP を使用してください。', ko: '인증 없음은 랩 및 데모 전용입니다. 프로덕션 음성 Agent는 적절한 인증과 DLP 정책을 사용해야 합니다.' },
        prompts: [],
        imageKeys: ['02-no-authentication-1'],
      }],
    },
    {
      id: 'voice-channel', title: { en: 'Enable the voice channel (real-time voice)', zh: '启用语音通道（实时语音）', ja: '音声チャネルを有効化（リアルタイム音声）', ko: '음성 채널 활성화 (실시간 음성)' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'Enable the voice channel and select real-time voice instead of classic voice.', zh: '启用语音通道，并选择实时语音而非经典语音。', ja: '音声チャネルを有効化し、クラシック音声ではなくリアルタイム音声を選択します。', ko: '음성 채널을 활성화하고 클래식 음성 대신 실시간 음성을 선택합니다.' }],
        markdown: { en: voiceChannelStep, zh: '', ja: '', ko: '' },
        highlight: { en: 'Real-time voice gives low latency and natural turn-taking. Classic voice uses the traditional STT → model → TTS pipeline.', zh: '实时语音提供低延迟和自然轮流对话。经典语音使用传统的 STT → 模型 → TTS 流程。', ja: 'リアルタイム音声は低遅延で自然なターン交代。クラシック音声は従来の STT → モデル → TTS です。', ko: '실시간 음성은 낮은 지연과 자연스러운 턴 전환을 제공합니다. 클래식 음성은 전통적인 STT → 모델 → TTS 방식입니다.' },
        prompts: [],
        imageKeys: ['03-enable-voice-realtime-1', '03-enable-voice-realtime-2'],
      }],
    },
    {
      id: 'settings', title: { en: 'Review the voice settings', zh: '检查语音设置', ja: '音声設定を確認', ko: '음성 설정 검토' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'Walk through each voice setting so you understand what to tune before testing.', zh: '逐项了解每个语音设置，以便在测试前进行调整。', ja: 'テスト前に調整すべき各音声設定を順に確認します。', ko: '테스트 전에 조정할 각 음성 설정을 하나씩 살펴봅니다.' }],
        markdown: { en: settingsStep, zh: '', ja: '', ko: '' },
        highlight: { en: 'Barge-in plus a well-tuned silence timeout is what makes a real-time voice call feel human.', zh: '打断功能加上调优良好的静默超时，才能让实时语音通话更自然。', ja: 'バージインと適切な無音タイムアウトが、リアルタイム音声を人間らしくします。', ko: '바지인과 잘 조정된 침묵 시간 초과가 실시간 음성 통화를 사람처럼 느끼게 합니다.' },
        prompts: [],
        imageKeys: ['04-voice-settings-1', '04-voice-settings-2'],
      }],
    },
    {
      id: 'capabilities', title: { en: 'Leverage knowledge, tools, topics, and child agents', zh: '利用知识、工具、主题与子 Agent', ja: 'ナレッジ・ツール・トピック・子 Agent を活用', ko: '지식, 도구, 토픽, 자식 Agent 활용' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'A real-time voice agent can use everything else you build in Copilot Studio.', zh: '实时语音 Agent 可以使用你在 Copilot Studio 中构建的一切。', ja: 'リアルタイム音声 Agent は、Copilot Studio で作った他のすべてを利用できます。', ko: '실시간 음성 Agent는 Copilot Studio에서 만든 다른 모든 것을 사용할 수 있습니다.' }],
        markdown: { en: capabilitiesStep, zh: '', ja: '', ko: '' },
        highlight: { en: 'Design once, speak everywhere: the same knowledge, tools, topics, and child agents power chat and voice.', zh: '一次设计，处处可用：相同的知识、工具、主题和子 Agent 同时驱动聊天与语音。', ja: '一度作れば、どこでも話せる：同じナレッジ・ツール・トピック・子 Agent がチャットと音声を支えます。', ko: '한 번 설계로 어디서나 말하기: 동일한 지식, 도구, 토픽, 자식 Agent가 채팅과 음성을 구동합니다.' },
        prompts: [],
        imageKeys: ['05-capabilities-1'],
      }],
    },
    {
      id: 'instructions', title: { en: 'Add the multilingual voice instruction', zh: '添加多语言语音指令', ja: '多言語音声指示を追加', ko: '다국어 음성 지침 추가' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'Paste this sample instruction to make a multi-turn, multilingual Microsoft product & service voice agent.', zh: '粘贴此示例指令，打造多轮、多语言的 Microsoft 产品与服务语音 Agent。', ja: 'このサンプル指示を貼り付けて、複数ターン・多言語の Microsoft 製品・サービス音声 Agent を作ります。', ko: '이 샘플 지침을 붙여넣어 다중 턴, 다국어 Microsoft 제품 및 서비스 음성 Agent를 만듭니다.' }],
        markdown: { en: '## Apply the agent instruction\n1. Open the agent\'s **Instructions** (Overview or Settings).\n2. Paste the instruction below.\n3. **Save**.', zh: '', ja: '', ko: '' },
        highlight: { en: 'Voice instructions should ask for short spoken sentences and one question at a time — long paragraphs sound robotic.', zh: '语音指令应要求简短口语句子、每次只问一个问题——长段落听起来很生硬。', ja: '音声指示は短い口語文と一度に一つの質問を求めます。長い段落は機械的に聞こえます。', ko: '음성 지침은 짧은 구어 문장과 한 번에 하나의 질문을 요청해야 합니다. 긴 문단은 로봇처럼 들립니다.' },
        prompts: [{ id: 'lab06-voice-instruction', title: { en: 'Microsoft Product & Service Voice AI Agent instruction', zh: 'Microsoft 产品与服务语音 AI Agent 指令', ja: 'Microsoft 製品・サービス音声 AI Agent 指示', ko: 'Microsoft 제품 및 서비스 음성 AI Agent 지침' }, content: sampleInstruction }],
        imageKeys: ['06-sample-instruction-1'],
      }],
    },
    {
      id: 'test', title: { en: 'Live test in the Test command window', zh: '在测试命令窗口中实时测试', ja: 'テスト コマンド ウィンドウでライブ テスト', ko: '테스트 명령 창에서 실시간 테스트' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'Speak to the agent in several languages and confirm multilingual, multi-turn behavior.', zh: '用多种语言与 Agent 对话，确认其多语言、多轮的表现。', ja: '複数の言語で Agent に話しかけ、多言語・複数ターンの動作を確認します。', ko: '여러 언어로 Agent에게 말하고 다국어, 다중 턴 동작을 확인합니다.' }],
        markdown: { en: testStep, zh: '', ja: '', ko: '' },
        highlight: { en: 'Use the Test command window\'s voice mode to hear real-time turn-taking and interruptions before publishing to a phone number.', zh: '在发布到电话号码之前，使用测试命令窗口的语音模式来体验实时轮流对话和打断。', ja: '電話番号に公開する前に、テスト コマンド ウィンドウの音声モードでリアルタイムのターン交代と割り込みを確認します。', ko: '전화번호로 게시하기 전에 테스트 명령 창의 음성 모드로 실시간 턴 전환과 중단을 들어 보세요.' },
        prompts: [],
        imageKeys: ['07-voice-test-1', '07-voice-test-2'],
      }],
    },
  ],
}