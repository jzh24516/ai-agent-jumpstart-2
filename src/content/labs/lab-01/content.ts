import type { Lab } from '../../types'

const agentInstructions = `# Role
You are Ask Me Anything, a trusted Microsoft product and learning guide.

# Grounding and tools
- Use microsoft.com for current product information.
- Use the Microsoft Learn MCP server for technical documentation, prerequisites, limits, and code samples.
- Prefer grounded facts. Include source links and say when information cannot be verified.
- Never invent licensing, availability, roadmap, or tenant-specific configuration.

# Language behavior
- Detect the language of the latest user message.
- Respond in that language unless the user asks for another language.
- Preserve product names, commands, code, URLs, and UI labels in their official form; add a short localized explanation when useful.
- For mixed-language questions, use the dominant language and keep quoted text unchanged.

# Response style
1. Start with a direct answer.
2. Give numbered, actionable steps when the user asks how to do something.
3. Separate confirmed facts from recommendations.
4. End with 2-4 relevant source links when tools return sources.
5. Ask one concise clarifying question only when the request cannot be completed safely without it.`

const browserProfileSetup = `Your organization may block sign-in to tenants other than your work tenant. To access the training environment, you **must** use a browser profile that is **not signed into your work account**. Follow the steps below.

---

## Option 1: Create a New Edge Profile *(Recommended)*

A separate profile keeps your training session alive across browser restarts and won't interfere with your work profile.

### Step 1: Create the profile

1. Open **Microsoft Edge**.
2. Click your **profile icon** in the top-right corner of the browser.
3. Click **Set up a new profile** (at the bottom of the profile flyout).
4. When prompted to choose a profile type, click **Work or school**. (Do **not** choose Personal — the training tenant is an organizational account.)
5. Click **Start without your data**.
6. Click **Confirm and start browsing**.
7. **Do NOT sign in** with any account. Skip or dismiss any sign-in prompts.

> 📖 **Official docs:** [Sign in and create multiple profiles in Microsoft Edge](https://support.microsoft.com/en-us/topic/sign-in-and-create-multiple-profiles-in-microsoft-edge-df94e622-2061-49ae-ad1d-6f0e43ce6435)

### Step 2: Confirm you are NOT signed in

Before navigating to the training tenant, verify the profile is clean:

1. In your **new profile window**, click the **profile icon** in the top-right corner.
2. It should show **"Sign in to sync data"** or a generic person silhouette — **not** your name or work email.
3. Navigate to \`edge://settings/profiles\` and confirm no account is listed under **"Microsoft account"** or **"Work or school account"**.
4. As a final check, go to [**portal.microsoft.com**](https://portal.microsoft.com/). You should see a generic sign-in page — **not** be auto-signed-in to your work tenant.

If you see your work identity anywhere, you are in the wrong profile. Switch to the new profile you just created.

### Step 3: Get your training account and access the labs

1. In your **new, unsigned-in profile**, go to [**Microsoft Copilot Studio Training**](https://aka.ms/MCSWorkshopAgent/) and chat with the training agent to get an account.
2. Use the **code provided by your instructor** when prompted.
3. The agent will provide you with training credentials (username and password).
4. Go to [**portal.microsoft.com**](https://portal.microsoft.com/) and log in using the credentials provided by the agent.
5. Go to the [**Architecture Bootcamp — Microsoft Copilot Agents Labs**](https://aka.ms/MCSWorkshopAgent/) to access the labs. **Make sure you are in the labs specific to your bootcamp.**

---

## Option 2: InPrivate Browsing in Edge *(Fallback)*

> ⚠️ **Warning:** InPrivate sessions do not persist. If you **close the InPrivate window**, you will be **immediately signed out** of the training tenant and will need to sign in again. All tabs, session state, and unsaved work in the browser will be lost. Use this only if you cannot create a new profile.

1. Open **Microsoft Edge**.
2. Press **Ctrl + Shift + N**, or click **Settings and more (⋯)** → **New InPrivate window**.
3. A dark-themed window opens with the **"InPrivate"** label visible in the top-left corner.
4. Navigate to the training tenant URL and sign in with your **training credentials**.
5. **Do not close this window** for the duration of the training session.

> 📖 **Official docs:** [Browse InPrivate in Microsoft Edge](https://support.microsoft.com/en-us/microsoft-edge/browse-inprivate-in-microsoft-edge-e6f47704-340c-7d4f-b00d-d0cf35aa1fcc)

---

## Other Browsers — Profile Setup Guides

If you are not using Microsoft Edge, use these official guides to create a separate browser profile:

| Browser | Guide |
| --- | --- |
| **Google Chrome** | [Create Chrome browser profiles](https://support.google.com/chrome/answer/2364824) |
| **Mozilla Firefox** | [Profile Manager — Create, remove, or switch Firefox profiles](https://support.mozilla.org/en-US/kb/profile-manager-create-remove-switch-firefox-profiles) |

The same principle applies: create a new profile, **do not sign in** with your work account, then navigate to the training tenant URL.`

const browserProfileSetupText = { en: browserProfileSetup, zh: browserProfileSetup, ja: browserProfileSetup, ko: browserProfileSetup, th: browserProfileSetup, hi: browserProfileSetup }

export const lab01: Lab = {
  id: 'lab-01', number: 1, icon: 'sparkles', duration: 45,
  title: { en: 'Meet the new agent experience', zh: '认识全新的 Agent Experience', ja: '新しい Agent Experience', ko: '새로운 Agent Experience', th: 'พบกับ Agent Experience ใหม่', hi: 'नया Agent Experience देखें' },
  summary: { en: 'Create a multilingual Ask Me Anything agent grounded in Microsoft.com and Microsoft Learn MCP.', zh: '创建由 Microsoft.com 与 Microsoft Learn MCP 提供依据的多语言 Ask Me Anything Agent。', ja: 'Microsoft.com と Microsoft Learn MCP に基づく多言語 Ask Me Anything Agent を作成します。', ko: 'Microsoft.com 및 Microsoft Learn MCP에 기반한 다국어 Ask Me Anything Agent를 만듭니다.', th: 'สร้าง Ask Me Anything agent หลายภาษาที่อ้างอิงจาก Microsoft.com และ Microsoft Learn MCP', hi: 'Microsoft.com और Microsoft Learn MCP पर आधारित बहुभाषी Ask Me Anything agent बनाएं।' },
  outcome: { en: 'A grounded, multilingual agent ready for extension in the next labs.', zh: '一个可在后续实验中继续扩展的可信多语言 Agent。', ja: '次のラボで拡張できる、根拠付き多言語 Agent。', ko: '다음 랩에서 확장할 수 있는 근거 기반 다국어 Agent.', th: 'Agent หลายภาษาที่มีการอ้างอิง พร้อมขยายในแล็บถัดไป', hi: 'आधारभूत, बहुभाषी agent जो अगली labs में विस्तार के लिए तैयार है।' },
  objectives: [
    { en: 'Navigate the modern Create, Knowledge, Tools, Skills, and Memory surfaces.', zh: '熟悉现代化 Create、Knowledge、Tools、Skills 与 Memory 界面。', ja: 'Create、Knowledge、Tools、Skills、Memory の画面を理解する。', ko: 'Create, Knowledge, Tools, Skills, Memory 화면을 익힙니다.', th: 'ทำความเข้าใจหน้าจอ Create, Knowledge, Tools, Skills และ Memory สมัยใหม่', hi: 'आधुनिक Create, Knowledge, Tools, Skills, और Memory सतहों को समझें।' },
    { en: 'Ground answers with Microsoft.com and Microsoft Learn MCP.', zh: '使用 Microsoft.com 和 Microsoft Learn MCP 约束回答依据。', ja: 'Microsoft.com と Microsoft Learn MCP で回答をグラウンディングする。', ko: 'Microsoft.com과 Microsoft Learn MCP로 답변을 그라운딩합니다.', th: 'อ้างอิงคำตอบด้วย Microsoft.com และ Microsoft Learn MCP', hi: 'Microsoft.com और Microsoft Learn MCP के साथ उत्तरों को आधार दें।' },
    { en: 'Apply language-aware agent instructions and test citations.', zh: '应用多语言 Agent 指令并测试引用。', ja: '言語対応の指示を適用し、引用をテストする。', ko: '언어 인식 지침을 적용하고 인용을 테스트합니다.', th: 'ใช้คำสั่ง agent ที่รองรับหลายภาษาและทดสอบการอ้างอิง', hi: 'भाषा-जागरूक agent निर्देश लागू करें और उद्धरण परखें।' },
  ],
  prerequisites: [
    { en: 'A Copilot Studio environment with maker access and generative AI enabled.', zh: '具备 Maker 权限且已启用生成式 AI 的 Copilot Studio 环境。', ja: 'Maker 権限と生成 AI が有効な Copilot Studio 環境。', ko: 'Maker 권한과 생성형 AI가 활성화된 Copilot Studio 환경.', th: 'สภาพแวดล้อม Copilot Studio ที่มีสิทธิ์ maker และเปิดใช้งาน generative AI', hi: 'maker एक्सेस और generative AI सक्षम वाला Copilot Studio एनवायरनमेंट।' },
  ],
  steps: [
    {
      id: 'browser-profile-setup',
      title: { en: 'Browser Profile Setup', zh: 'Browser Profile Setup', ja: 'Browser Profile Setup', ko: 'Browser Profile Setup', th: 'Browser Profile Setup', hi: 'Browser Profile Setup' },
      pages: [{
        id: 'browser-profile-setup',
        paragraphs: [],
        markdown: browserProfileSetupText,
      }],
    },
    {
      id: 'create',
      title: { en: 'Create the agent', zh: '创建 Agent', ja: 'Agent を作成', ko: 'Agent 만들기', th: 'สร้าง Agent', hi: 'Agent बनाएं' },
      pages: [
        {
          id: 'start',
          title: { en: 'Start from the Create experience', zh: '从 Create 体验开始', ja: 'Create 画面から開始', ko: 'Create 환경에서 시작', th: 'เริ่มจาก Create experience', hi: 'Create experience से शुरू करें' },
          paragraphs: [
            { en: 'Open Copilot Studio and confirm that you are working in the environment assigned by your facilitator. Select Create, then New agent.', zh: '打开 Copilot Studio，并确认当前使用的是讲师分配的环境。选择 Create，然后选择 New agent。', ja: 'Copilot Studio を開き、講師から割り当てられた環境で作業していることを確認します。Create、New agent の順に選択します。', ko: 'Copilot Studio를 열고 진행자가 지정한 환경에서 작업 중인지 확인합니다. Create, New agent를 차례로 선택합니다.', th: 'เปิด Copilot Studio และยืนยันว่าคุณทำงานในสภาพแวดล้อมที่ผู้สอนกำหนด เลือก Create แล้วเลือก New agent', hi: 'Copilot Studio खोलें और पुष्टि करें कि आप फैसिलिटेटर द्वारा असाइन किए गए एनवायरनमेंट में काम कर रहे हैं। Create चुनें, फिर New agent चुनें।' },
            { en: 'The new creation experience begins with a natural-language description. Use it to establish the agent purpose before editing detailed settings.', zh: '新的创建体验从自然语言描述开始。先用它确定 Agent 的用途，再编辑详细设置。', ja: '新しい作成画面では自然言語の説明から始めます。詳細設定を編集する前に、Agent の目的を定義します。', ko: '새 만들기 환경은 자연어 설명으로 시작합니다. 세부 설정을 편집하기 전에 Agent의 목적을 정합니다.', th: 'ประสบการณ์การสร้างใหม่เริ่มต้นด้วยคำอธิบายภาษาธรรมชาติ ใช้เพื่อกำหนดวัตถุประสงค์ของ agent ก่อนแก้ไขการตั้งค่าโดยละเอียด', hi: 'नया creation experience प्राकृतिक-भाषा विवरण से शुरू होता है। विस्तृत सेटिंग्स संपादित करने से पहले agent का उद्देश्य तय करने के लिए इसका उपयोग करें।' },
          ],
          highlight: { en: 'Use the new agent experience. Do not switch to the classic authoring canvas in this lab.', zh: '本实验使用 New Agent Experience，请勿切换到经典创作画布。', ja: 'このラボでは新しい Agent Experience を使用し、クラシック画面には切り替えません。', ko: '이 랩에서는 새 Agent Experience를 사용하고 클래식 작성 화면으로 전환하지 않습니다.', th: 'ใช้ New Agent Experience อย่าสลับไปยัง classic authoring canvas ในแล็บนี้', hi: 'New Agent Experience का उपयोग करें। इस lab में classic authoring canvas पर स्विच न करें।' },
          imageKeys: ['01-create-agent'],
        },
        {
          id: 'configure',
          title: { en: 'Name and review the agent', zh: '命名并检查 Agent', ja: 'Agent の名前と設定を確認', ko: 'Agent 이름 지정 및 검토', th: 'ตั้งชื่อและตรวจสอบ Agent', hi: 'Agent का नाम रखें और समीक्षा करें' },
          paragraphs: [
            { en: 'Name the agent “Ask Me Anything” and choose the primary authoring language. Review the generated description and instructions before continuing.', zh: '将 Agent 命名为“Ask Me Anything”并选择主要创作语言。继续之前，请检查自动生成的描述和指令。', ja: 'Agent を「Ask Me Anything」と命名し、主な作成言語を選択します。続行する前に、生成された説明と指示を確認します。', ko: 'Agent 이름을 “Ask Me Anything”으로 지정하고 기본 작성 언어를 선택합니다. 계속하기 전에 생성된 설명과 지침을 검토합니다.', th: 'ตั้งชื่อ agent ว่า “Ask Me Anything” และเลือกภาษาการสร้างหลัก ตรวจสอบคำอธิบายและคำสั่งที่สร้างขึ้นก่อนดำเนินการต่อ', hi: 'agent का नाम “Ask Me Anything” रखें और प्राथमिक authoring भाषा चुनें। जारी रखने से पहले जनरेट किए गए विवरण और निर्देशों की समीक्षा करें।' },
            { en: 'Create the agent and wait for the overview page to load. You should see the Knowledge, Tools, Skills, and Memory surfaces used throughout the remaining labs.', zh: '创建 Agent 并等待概览页加载。此时应能看到后续实验将使用的 Knowledge、Tools、Skills 与 Memory 区域。', ja: 'Agent を作成して概要ページが読み込まれるまで待ちます。以降のラボで使用する Knowledge、Tools、Skills、Memory が表示されます。', ko: 'Agent를 만들고 개요 페이지가 로드될 때까지 기다립니다. 이후 랩에서 사용할 Knowledge, Tools, Skills, Memory 영역이 표시되어야 합니다.', th: 'สร้าง agent และรอให้หน้าภาพรวมโหลด คุณควรเห็นหน้าจอ Knowledge, Tools, Skills และ Memory ที่ใช้ในแล็บที่เหลือ', hi: 'agent बनाएं और overview पेज लोड होने की प्रतीक्षा करें। आपको शेष labs में उपयोग होने वाली Knowledge, Tools, Skills, और Memory सतहें दिखनी चाहिए।' },
          ],
          imageKeys: ['01-agent-overview'],
        },
      ],
    },
    { id: 'knowledge', imageKey: '02-add-knowledge', title: { en: 'Add trusted public knowledge', zh: '添加可信公共知识', ja: '信頼できる公開ナレッジを追加', ko: '신뢰할 수 있는 공개 지식 추가', th: 'เพิ่มความรู้สาธารณะที่เชื่อถือได้', hi: 'विश्वसनीय सार्वजनिक ज्ञान जोड़ें' }, body: { en: 'On Knowledge, add https://www.microsoft.com as a public website. Scope the source description to official product and company information.', zh: '在 Knowledge 中将 https://www.microsoft.com 添加为公共网站，并说明仅用于官方产品与公司信息。', ja: 'Knowledge で https://www.microsoft.com を公開 Web サイトとして追加し、公式製品・企業情報に限定します。', ko: 'Knowledge에서 https://www.microsoft.com을 공개 웹 사이트로 추가하고 공식 제품 및 회사 정보로 범위를 지정합니다.', th: 'ใน Knowledge ให้เพิ่ม https://www.microsoft.com เป็นเว็บไซต์สาธารณะ กำหนดคำอธิบายแหล่งข้อมูลให้จำกัดเฉพาะข้อมูลผลิตภัณฑ์และบริษัทอย่างเป็นทางการ', hi: 'Knowledge पर, https://www.microsoft.com को सार्वजनिक वेबसाइट के रूप में जोड़ें। स्रोत विवरण को आधिकारिक उत्पाद और कंपनी जानकारी तक सीमित करें।' } },
    { id: 'mcp', imageKey: '03-learn-mcp', title: { en: 'Connect Microsoft Learn MCP', zh: '连接 Microsoft Learn MCP', ja: 'Microsoft Learn MCP に接続', ko: 'Microsoft Learn MCP 연결', th: 'เชื่อมต่อ Microsoft Learn MCP', hi: 'Microsoft Learn MCP कनेक्ट करें' }, body: { en: 'Open Tools, add an MCP server, and register the Microsoft Learn MCP endpoint supplied by your facilitator. Review the discovered documentation tools before enabling them.', zh: '打开 Tools，添加 MCP 服务器，并注册讲师提供的 Microsoft Learn MCP 终结点；启用前先检查发现的文档工具。', ja: 'Tools で MCP サーバーを追加し、講師から提供された Microsoft Learn MCP エンドポイントを登録して、検出ツールを確認します。', ko: 'Tools에서 MCP 서버를 추가하고 진행자가 제공한 Microsoft Learn MCP 엔드포인트를 등록한 뒤 발견된 도구를 검토합니다.', th: 'เปิด Tools เพิ่ม MCP server และลงทะเบียน Microsoft Learn MCP endpoint ที่ผู้สอนให้มา ตรวจสอบเครื่องมือเอกสารที่ค้นพบก่อนเปิดใช้งาน', hi: 'Tools खोलें, एक MCP server जोड़ें, और अपने फैसिलिटेटर द्वारा दिए गए Microsoft Learn MCP endpoint को रजिस्टर करें। सक्षम करने से पहले खोजे गए documentation tools की समीक्षा करें।' }, highlight: { en: 'Tenant policy can restrict remote MCP servers. Use the facilitator-approved endpoint and authentication method.', zh: '租户策略可能限制远程 MCP；请使用讲师批准的终结点和身份验证方式。', ja: 'テナント ポリシーでリモート MCP が制限される場合があります。承認済みの設定を使用してください。', ko: '테넌트 정책이 원격 MCP 서버를 제한할 수 있으므로 승인된 설정을 사용하세요.', th: 'นโยบายของ tenant อาจจำกัด remote MCP server ให้ใช้ endpoint และวิธีการยืนยันตัวตนที่ผู้สอนอนุมัติ', hi: 'Tenant नीति remote MCP servers को प्रतिबंधित कर सकती है। फैसिलिटेटर-अनुमोदित endpoint और प्रमाणीकरण विधि का उपयोग करें।' } },
    { id: 'instructions', imageKey: '04-instructions-test', title: { en: 'Add instructions and test', zh: '添加指令并测试', ja: '指示を追加してテスト', ko: '지침 추가 및 테스트', th: 'เพิ่มคำสั่งและทดสอบ', hi: 'निर्देश जोड़ें और परखें' }, body: { en: 'Paste the instructions below, save, and test the same product question in English, Chinese, Japanese, and Korean. Confirm that answers stay grounded and contain useful source links.', zh: '粘贴下方指令并保存，分别使用英语、中文、日语和韩语测试同一产品问题，确认回答有依据并附有来源链接。', ja: '以下の指示を貼り付けて保存し、同じ質問を英中日韓でテストして、根拠とリンクを確認します。', ko: '아래 지침을 붙여넣고 저장한 뒤 동일한 제품 질문을 영·중·일·한 언어로 테스트하여 근거와 링크를 확인합니다.', th: 'วางคำสั่งด้านล่าง บันทึก และทดสอบคำถามผลิตภัณฑ์เดียวกันในภาษาอังกฤษ จีน ญี่ปุ่น และเกาหลี ยืนยันว่าคำตอบมีการอ้างอิงและมีลิงก์แหล่งข้อมูลที่มีประโยชน์', hi: 'नीचे दिए गए निर्देश पेस्ट करें, सहेजें, और वही उत्पाद प्रश्न अंग्रेज़ी, चीनी, जापानी और कोरियाई में परखें। पुष्टि करें कि उत्तर आधारित रहें और उपयोगी स्रोत लिंक शामिल हों।' }, prompt: agentInstructions },
  ],
}