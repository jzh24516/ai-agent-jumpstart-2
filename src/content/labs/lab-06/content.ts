import type { Lab } from '../../types'

const createStep = `## Create a classic agent from the modern home page
1. Open **Copilot Studio** and go to the **Home** page (the modern agent experience).
2. Select **+ Create** (or the **New agent** button).
3. On the describe screen, select **Skip to configure** to open the configuration form.
4. Switch to the **classic agent** experience — use the **…** (more) menu and choose **Switch to classic**, or select the classic-experience link on the configure page.
5. Enter a **Name** (for example *Microsoft Product & Service Voice Agent*) and pick the primary **Language**.
6. Select **Create**.`

const createStepTh = `## สร้าง classic agent จากหน้า home สมัยใหม่
1. เปิด **Copilot Studio** และไปที่หน้า **Home** (โหมด agent experience สมัยใหม่)
2. เลือก **+ Create** (หรือปุ่ม **New agent**)
3. ที่หน้าจอ describe ให้เลือก **Skip to configure** เพื่อเปิดฟอร์มการตั้งค่า
4. สลับไปยัง **classic agent** experience — ใช้เมนู **…** (more) แล้วเลือก **Switch to classic** หรือเลือกลิงก์ classic-experience บนหน้า configure
5. กรอก **Name** (เช่น *Microsoft Product & Service Voice Agent*) และเลือก **Language** หลัก
6. เลือก **Create**`

const createStepHi = `## आधुनिक home page से classic agent बनाएं
1. **Copilot Studio** खोलें और **Home** page (आधुनिक agent experience) पर जाएं।
2. **+ Create** (या **New agent** बटन) चुनें।
3. describe स्क्रीन पर, configuration form खोलने के लिए **Skip to configure** चुनें।
4. **classic agent** experience पर स्विच करें — **…** (more) मेनू का उपयोग करें और **Switch to classic** चुनें, या configure page पर classic-experience लिंक चुनें।
5. एक **Name** दर्ज करें (उदाहरण के लिए *Microsoft Product & Service Voice Agent*) और मुख्य **Language** चुनें।
6. **Create** चुनें।`

const authStep = `## Set security to No authentication
1. Open the agent's **Settings** → **Security** → **Authentication**.
2. Select **No authentication**.
3. **Save**, then refresh the agent if prompted.

No authentication lets the voice channel and the Test window run without a sign-in prompt, which keeps the lab flow simple.`

const authStepTh = `## ตั้งค่า security เป็น No authentication
1. เปิด **Settings** → **Security** → **Authentication** ของ agent
2. เลือก **No authentication**
3. **Save** แล้วรีเฟรช agent หากมีการแจ้ง

No authentication ทำให้ voice channel และ Test window ทำงานได้โดยไม่ต้องมี sign-in prompt ซึ่งช่วยให้ขั้นตอนของ lab เรียบง่าย`

const authStepHi = `## security को No authentication पर सेट करें
1. agent की **Settings** → **Security** → **Authentication** खोलें।
2. **No authentication** चुनें।
3. **Save** करें, फिर संकेत मिलने पर agent को रिफ्रेश करें।

No authentication voice channel और Test window को sign-in prompt के बिना चलने देता है, जिससे lab का प्रवाह सरल रहता है।`

const voiceChannelStep = `## Enable the voice channel and choose real-time voice
1. Go to **Channels** (or **Settings → Channels**).
2. Select **Telephony** / **Voice**.
3. Turn **on** the voice capability for this agent.
4. For the voice engine, choose **Real-time voice** (powered by the GPT-Realtime model via Microsoft Foundry) instead of **Classic voice**.
5. **Save**.

Real-time voice streams audio both ways for low latency and natural turn-taking. Classic voice uses the traditional speech-to-text → model → text-to-speech pipeline, which feels more like an IVR.`

const voiceChannelStepTh = `## เปิดใช้ voice channel และเลือก real-time voice
1. ไปที่ **Channels** (หรือ **Settings → Channels**)
2. เลือก **Telephony** / **Voice**
3. **เปิด** ความสามารถ voice สำหรับ agent นี้
4. สำหรับ voice engine ให้เลือก **Real-time voice** (ขับเคลื่อนด้วยโมเดล GPT-Realtime ผ่าน Microsoft Foundry) แทน **Classic voice**
5. **Save**

Real-time voice สตรีมเสียงทั้งสองทางเพื่อ latency ต่ำและการสลับสนทนาที่เป็นธรรมชาติ ส่วน Classic voice ใช้ pipeline แบบดั้งเดิม speech-to-text → model → text-to-speech ซึ่งให้ความรู้สึกเหมือน IVR มากกว่า`

const voiceChannelStepHi = `## voice channel सक्षम करें और real-time voice चुनें
1. **Channels** (या **Settings → Channels**) पर जाएं।
2. **Telephony** / **Voice** चुनें।
3. इस agent के लिए voice क्षमता **on** करें।
4. voice engine के लिए, **Classic voice** के बजाय **Real-time voice** (Microsoft Foundry के माध्यम से GPT-Realtime मॉडल द्वारा संचालित) चुनें।
5. **Save** करें।

Real-time voice कम latency और स्वाभाविक turn-taking के लिए दोनों दिशाओं में audio स्ट्रीम करता है। Classic voice पारंपरिक speech-to-text → model → text-to-speech pipeline उपयोग करता है, जो अधिक IVR जैसा लगता है।`

const settingsStep = `## Review the voice settings one by one
Open the voice channel settings and walk through each option:

- **Voice selection** — pick the neural voice and locale (name, gender, style) the agent speaks with.
- **Silence timeout / end-of-speech** — how long the agent waits after the caller stops talking before it responds. Shorter feels snappy; too short cuts people off.
- **Speech sensitivity** — how eagerly the agent detects that the caller has started speaking, especially in noisy audio.
- **DTMF** — accept **keypad tones** so callers can enter menus, numbers, or confirmations by pressing keys.
- **Barge-in** — let the caller **interrupt** the agent while it is speaking, so they don't have to wait for a long prompt to finish.
- **Greeting & retries** — the opening message and how many times to re-prompt on silence or no recognition.

Tune **silence timeout** and **sensitivity** together to balance responsiveness against accidentally cutting the caller off.`

const settingsStepTh = `## ตรวจสอบ voice settings ทีละรายการ
เปิดการตั้งค่า voice channel และดูแต่ละตัวเลือก:

- **Voice selection** — เลือก neural voice และ locale (ชื่อ, เพศ, สไตล์) ที่ agent ใช้พูด
- **Silence timeout / end-of-speech** — agent รอนานเท่าใดหลังจากผู้โทรหยุดพูดก่อนจะตอบ สั้นกว่าจะรู้สึกกระฉับกระเฉง แต่ถ้าสั้นเกินไปจะพูดแทรกคนอื่น
- **Speech sensitivity** — agent ตรวจจับว่าผู้โทรเริ่มพูดได้ไวเพียงใด โดยเฉพาะในเสียงที่มี noise
- **DTMF** — รับ **keypad tones** เพื่อให้ผู้โทรป้อนเมนู ตัวเลข หรือการยืนยันด้วยการกดปุ่ม
- **Barge-in** — ให้ผู้โทร **interrupt** agent ขณะที่กำลังพูดได้ เพื่อไม่ต้องรอ prompt ยาว ๆ จบ
- **Greeting & retries** — ข้อความเปิด และจำนวนครั้งที่จะ re-prompt เมื่อเงียบหรือไม่รู้จำ

ปรับ **silence timeout** และ **sensitivity** ไปด้วยกันเพื่อสร้างสมดุลระหว่างการตอบสนองกับการพูดแทรกผู้โทรโดยไม่ตั้งใจ`

const settingsStepHi = `## voice settings एक-एक करके देखें
voice channel settings खोलें और हर विकल्प देखें:

- **Voice selection** — agent जिस neural voice और locale (नाम, लिंग, शैली) से बोलता है, उसे चुनें।
- **Silence timeout / end-of-speech** — caller के बोलना बंद करने के बाद agent जवाब देने से पहले कितनी देर प्रतीक्षा करता है। छोटा तेज़ लगता है; बहुत छोटा लोगों को बीच में काट देता है।
- **Speech sensitivity** — agent कितनी तत्परता से पहचानता है कि caller ने बोलना शुरू किया, खासकर शोरगुल वाले audio में।
- **DTMF** — **keypad tones** स्वीकार करें ताकि callers कुंजियाँ दबाकर menus, संख्याएँ, या पुष्टियाँ दर्ज कर सकें।
- **Barge-in** — caller को agent के बोलते समय उसे **interrupt** करने दें, ताकि उन्हें लंबे prompt के खत्म होने का इंतज़ार न करना पड़े।
- **Greeting & retries** — शुरुआती संदेश और silence या पहचान न होने पर कितनी बार re-prompt करना है।

**silence timeout** और **sensitivity** को एक साथ ट्यून करें ताकि प्रतिक्रियाशीलता और caller को गलती से बीच में काटने के बीच संतुलन बने।`

const capabilitiesStep = `## One agent, all of Copilot Studio's capabilities
A real-time voice agent is not a separate, limited product — it reuses everything you already build in Copilot Studio, now spoken:

- **Knowledge** — ground spoken answers in Microsoft.com, SharePoint, files, or your own indexes.
- **Tools** — call MCP servers, connectors, Power Automate flows, and APIs (for example Dataverse or ServiceNow) during the call.
- **Topics** — run deterministic, compliance-critical flows when you need exact wording and steps.
- **Child / connected agents** — hand off to specialists (for example an *Ask IT Anything* agent) mid-conversation and come back.

Combined, these turn a phone call into a compelling, interactive, intelligent conversational experience.`

const capabilitiesStepTh = `## agent เดียว ครบทุกความสามารถของ Copilot Studio
real-time voice agent ไม่ใช่ผลิตภัณฑ์แยกที่จำกัด — มันนำทุกอย่างที่คุณสร้างไว้ใน Copilot Studio มาใช้ซ้ำในรูปแบบเสียง:

- **Knowledge** — อ้างอิงคำตอบด้วยเสียงจาก Microsoft.com, SharePoint, ไฟล์ หรือ index ของคุณเอง
- **Tools** — เรียกใช้ MCP servers, connectors, Power Automate flows และ API (เช่น Dataverse หรือ ServiceNow) ระหว่างการโทร
- **Topics** — รัน flow ที่กำหนดผลลัพธ์ชัดเจนและสำคัญต่อ compliance เมื่อคุณต้องการถ้อยคำและขั้นตอนที่แม่นยำ
- **Child / connected agents** — ส่งต่อไปยังผู้เชี่ยวชาญ (เช่น agent *Ask IT Anything*) กลางบทสนทนา แล้วกลับมา

เมื่อรวมกัน สิ่งเหล่านี้เปลี่ยนการโทรศัพท์ให้เป็นประสบการณ์การสนทนาที่น่าสนใจ โต้ตอบได้ และชาญฉลาด`

const capabilitiesStepHi = `## एक agent, Copilot Studio की सभी क्षमताएं
एक real-time voice agent एक अलग, सीमित उत्पाद नहीं है — यह उन सब चीज़ों को फिर से उपयोग करता है जो आप पहले से Copilot Studio में बनाते हैं, अब बोली गई रूप में:

- **Knowledge** — बोले गए उत्तरों को Microsoft.com, SharePoint, files, या आपके अपने indexes पर आधारित करें।
- **Tools** — कॉल के दौरान MCP servers, connectors, Power Automate flows, और APIs (उदाहरण के लिए Dataverse या ServiceNow) को कॉल करें।
- **Topics** — जब आपको सटीक शब्दांकन और चरण चाहिए तब deterministic, compliance-critical flows चलाएं।
- **Child / connected agents** — बातचीत के बीच में विशेषज्ञों (उदाहरण के लिए एक *Ask IT Anything* agent) को सौंपें और वापस आएं।

मिलकर, ये एक फोन कॉल को एक आकर्षक, इंटरैक्टिव, बुद्धिमान संवादात्मक अनुभव में बदल देते हैं।`

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

const testStepTh = `## ทดสอบสดใน Test command window (multilingual)
1. เปิดแผง **Test** และสลับเป็นโหมด **voice** (ไมโครโฟนใน Test command window)
2. ถามคำถามเกี่ยวกับ Microsoft เป็น **English**: *"What is Microsoft Copilot Studio?"*
3. ถามอีกครั้งเป็น **中文**: *"Copilot 和 Copilot Studio 有什么区别？"*
4. ถามเป็น **日本語**: *"Microsoft 365 Copilot でできることを教えて。"*
5. ถามเป็น **한국어**: *"Azure AI Foundry는 무엇인가요?"*
6. ยืนยันว่า agent: ตรวจจับแต่ละภาษาและตอบเป็นภาษานั้น รักษา context ข้ามเทิร์น และให้คุณ **barge-in** เพื่อขัดจังหวะได้`

const testStepHi = `## Test command window में लाइव परीक्षण (multilingual)
1. **Test** पैन खोलें और इसे **voice** मोड में बदलें (Test command window में माइक्रोफ़ोन)।
2. **English** में एक Microsoft प्रश्न पूछें: *"What is Microsoft Copilot Studio?"*
3. फिर **中文** में पूछें: *"Copilot 和 Copilot Studio 有什么区别？"*
4. **日本語** में पूछें: *"Microsoft 365 Copilot でできることを教えて。"*
5. **한국어** में पूछें: *"Azure AI Foundry는 무엇인가요?"*
6. पुष्टि करें कि agent: हर भाषा का पता लगाता है और उसी में जवाब देता है, turns के बीच context बनाए रखता है, और आपको बीच में रोकने के लिए **barge-in** करने देता है।`

export const lab06: Lab = {
  id: 'lab-06', number: 6, icon: 'mic', duration: 45,
  title: { en: 'Build a real-time voice agent', zh: '构建实时语音 Agent', ja: 'リアルタイム音声 Agent を作成', ko: '실시간 음성 Agent 구축', th: 'สร้าง real-time voice agent', hi: 'रीयल-टाइम voice agent बनाएं' },
  summary: { en: 'Create a classic agent from the modern home page, enable the real-time voice channel, tune the voice settings, and test a multilingual Microsoft product & service voice assistant.', zh: '从现代主页创建 Classic Agent，启用实时语音通道，调整语音设置，并测试多语言的 Microsoft 产品与服务语音助手。', ja: 'モダン ホームから Classic Agent を作成し、リアルタイム音声チャネルを有効化して音声設定を調整し、多言語の Microsoft 製品・サービス音声アシスタントをテストします。', ko: '모던 홈에서 Classic Agent를 만들고 실시간 음성 채널을 활성화하며 음성 설정을 조정하고 다국어 Microsoft 제품 및 서비스 음성 도우미를 테스트합니다.', th: 'สร้าง classic agent จากหน้า home สมัยใหม่ เปิดใช้ real-time voice channel ปรับตั้งค่า voice และทดสอบ voice assistant สำหรับ Microsoft product & service แบบ multilingual', hi: 'आधुनिक home page से classic agent बनाएं, real-time voice channel सक्षम करें, voice settings ट्यून करें, और multilingual Microsoft product & service voice assistant का परीक्षण करें।' },
  outcome: { en: 'A no-auth classic agent with the real-time voice channel enabled, tuned voice settings, and a tested multilingual Microsoft product & service voice experience.', zh: '一个无需身份验证、已启用实时语音通道、语音设置已调优并经过多语言测试的 Microsoft 产品与服务语音体验。', ja: '認証なしの Classic Agent にリアルタイム音声チャネルを有効化し、音声設定を調整して多言語でテストした Microsoft 製品・サービス音声体験。', ko: '인증 없는 Classic Agent에 실시간 음성 채널을 활성화하고 음성 설정을 조정하여 다국어로 테스트한 Microsoft 제품 및 서비스 음성 경험.', th: 'classic agent แบบ no-auth ที่เปิดใช้ real-time voice channel ปรับตั้งค่า voice แล้ว และทดสอบ voice experience สำหรับ Microsoft product & service แบบ multilingual แล้ว', hi: 'real-time voice channel सक्षम, ट्यून की गई voice settings, और परीक्षित multilingual Microsoft product & service voice experience वाला no-auth classic agent।' },
  objectives: [
    { en: 'Create a classic agent from the modern home page and set No authentication.', zh: '从现代主页创建 Classic Agent 并设置为无身份验证。', ja: 'モダン ホームから Classic Agent を作成し、認証なしに設定する。', ko: '모던 홈에서 Classic Agent를 만들고 인증 없음으로 설정합니다.', th: 'สร้าง classic agent จากหน้า home สมัยใหม่ และตั้งค่าเป็น No authentication', hi: 'आधुनिक home page से classic agent बनाएं और No authentication सेट करें।' },
    { en: 'Enable the voice channel, choose real-time voice, and review the voice settings.', zh: '启用语音通道，选择实时语音，并检查语音设置。', ja: '音声チャネルを有効化し、リアルタイム音声を選択して音声設定を確認する。', ko: '음성 채널을 활성화하고 실시간 음성을 선택한 뒤 음성 설정을 검토합니다.', th: 'เปิดใช้ voice channel เลือก real-time voice และตรวจสอบ voice settings', hi: 'voice channel सक्षम करें, real-time voice चुनें, और voice settings की समीक्षा करें।' },
    { en: 'Add multilingual voice instructions and test live in the Test command window.', zh: '添加多语言语音指令，并在测试命令窗口中进行实时测试。', ja: '多言語の音声指示を追加し、テスト コマンド ウィンドウでライブ テストする。', ko: '다국어 음성 지침을 추가하고 테스트 명령 창에서 실시간으로 테스트합니다.', th: 'เพิ่ม voice instructions แบบ multilingual และทดสอบสดใน Test command window', hi: 'multilingual voice instructions जोड़ें और Test command window में लाइव परीक्षण करें।' },
  ],
  prerequisites: [{ en: 'A Copilot Studio environment with maker access and real-time voice enabled by the facilitator.', zh: '具备 Maker 访问权限、并已由讲师启用实时语音的 Copilot Studio 环境。', ja: 'Maker アクセス権があり、講師によりリアルタイム音声が有効化された Copilot Studio 環境。', ko: 'Maker 액세스 권한이 있고 진행자가 실시간 음성을 활성화한 Copilot Studio 환경.', th: 'สภาพแวดล้อม Copilot Studio ที่มีสิทธิ์ maker และเปิดใช้ real-time voice โดยผู้ดำเนินการ', hi: 'maker एक्सेस और facilitator द्वारा सक्षम real-time voice वाला Copilot Studio environment।' }],
  steps: [
    {
      id: 'create', title: { en: 'Create a classic agent from the modern home page', zh: '从现代主页创建 Classic Agent', ja: 'モダン ホームから Classic Agent を作成', ko: '모던 홈에서 Classic Agent 만들기', th: 'สร้าง classic agent จากหน้า home สมัยใหม่', hi: 'आधुनिक home page से classic agent बनाएं' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'Start on the modern Copilot Studio home page and create a classic agent for voice.', zh: '从现代 Copilot Studio 主页开始，为语音创建一个 Classic Agent。', ja: 'モダンな Copilot Studio ホームから、音声用の Classic Agent を作成します。', ko: '모던 Copilot Studio 홈에서 음성용 Classic Agent를 만듭니다.', th: 'เริ่มที่หน้า home ของ Copilot Studio สมัยใหม่ และสร้าง classic agent สำหรับ voice', hi: 'आधुनिक Copilot Studio home page पर शुरू करें और voice के लिए classic agent बनाएं।' }],
        markdown: { en: createStep, zh: '', ja: '', ko: '', th: createStepTh, hi: createStepHi },
        highlight: { en: 'The real-time voice configuration surfaces live in the classic agent experience, so create the agent there.', zh: '实时语音配置界面位于 Classic Agent 体验中，因此在此创建 Agent。', ja: 'リアルタイム音声の設定画面は Classic Agent 体験にあるため、そこで作成します。', ko: '실시간 음성 구성 화면은 Classic Agent 경험에 있으므로 거기서 에이전트를 만듭니다.', th: 'การตั้งค่า real-time voice จะปรากฏใน classic agent experience จึงควรสร้าง agent ที่นั่น', hi: 'real-time voice configuration classic agent experience में दिखती है, इसलिए agent वहीं बनाएं।' },
        prompts: [{ id: 'lab06-agent-name', title: { en: 'Suggested agent name', zh: '建议的 Agent 名称', ja: '推奨エージェント名', ko: '권장 에이전트 이름', th: 'ชื่อ agent ที่แนะนำ', hi: 'सुझाया गया agent नाम' }, content: 'Microsoft Product & Service Voice Agent' }],
        imageKeys: ['01-create-classic-agent-1', '01-create-classic-agent-2'],
      }],
    },
    {
      id: 'auth', title: { en: 'Set security to No authentication', zh: '将安全设置为无身份验证', ja: 'セキュリティを認証なしに設定', ko: '보안을 인증 없음으로 설정', th: 'ตั้งค่า security เป็น No authentication', hi: 'security को No authentication पर सेट करें' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'Turn off sign-in so the voice channel and Test window run without authentication.', zh: '关闭登录，使语音通道和测试窗口无需身份验证即可运行。', ja: 'サインインをオフにして、音声チャネルとテスト ウィンドウが認証なしで動作するようにします。', ko: '로그인을 끄면 음성 채널과 테스트 창이 인증 없이 실행됩니다.', th: 'ปิด sign-in เพื่อให้ voice channel และ Test window ทำงานโดยไม่ต้อง authentication', hi: 'sign-in बंद करें ताकि voice channel और Test window authentication के बिना चलें।' }],
        markdown: { en: authStep, zh: '', ja: '', ko: '', th: authStepTh, hi: authStepHi },
        highlight: { en: 'No authentication is for lab and demo only. Production voice agents should use proper authentication and DLP policies.', zh: '无身份验证仅用于实验和演示。生产语音 Agent 应使用适当的身份验证与 DLP 策略。', ja: '認証なしはラボ・デモ用のみです。本番の音声 Agent は適切な認証と DLP を使用してください。', ko: '인증 없음은 랩 및 데모 전용입니다. 프로덕션 음성 Agent는 적절한 인증과 DLP 정책을 사용해야 합니다.', th: 'No authentication ใช้สำหรับ lab และ demo เท่านั้น voice agent ในการใช้งานจริงควรใช้ authentication และ DLP policies ที่เหมาะสม', hi: 'No authentication केवल lab और demo के लिए है। production voice agents को उचित authentication और DLP policies उपयोग करनी चाहिए।' },
        prompts: [],
        imageKeys: ['02-no-authentication-1'],
      }],
    },
    {
      id: 'voice-channel', title: { en: 'Enable the voice channel (real-time voice)', zh: '启用语音通道（实时语音）', ja: '音声チャネルを有効化（リアルタイム音声）', ko: '음성 채널 활성화 (실시간 음성)', th: 'เปิดใช้ voice channel (real-time voice)', hi: 'voice channel सक्षम करें (real-time voice)' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'Enable the voice channel and select real-time voice instead of classic voice.', zh: '启用语音通道，并选择实时语音而非经典语音。', ja: '音声チャネルを有効化し、クラシック音声ではなくリアルタイム音声を選択します。', ko: '음성 채널을 활성화하고 클래식 음성 대신 실시간 음성을 선택합니다.', th: 'เปิดใช้ voice channel และเลือก real-time voice แทน classic voice', hi: 'voice channel सक्षम करें और classic voice के बजाय real-time voice चुनें।' }],
        markdown: { en: voiceChannelStep, zh: '', ja: '', ko: '', th: voiceChannelStepTh, hi: voiceChannelStepHi },
        highlight: { en: 'Real-time voice gives low latency and natural turn-taking. Classic voice uses the traditional STT → model → TTS pipeline.', zh: '实时语音提供低延迟和自然轮流对话。经典语音使用传统的 STT → 模型 → TTS 流程。', ja: 'リアルタイム音声は低遅延で自然なターン交代。クラシック音声は従来の STT → モデル → TTS です。', ko: '실시간 음성은 낮은 지연과 자연스러운 턴 전환을 제공합니다. 클래식 음성은 전통적인 STT → 모델 → TTS 방식입니다.', th: 'real-time voice ให้ latency ต่ำและการสลับสนทนาที่เป็นธรรมชาติ classic voice ใช้ pipeline แบบดั้งเดิม STT → model → TTS', hi: 'real-time voice कम latency और स्वाभाविक turn-taking देता है। classic voice पारंपरिक STT → model → TTS pipeline उपयोग करता है।' },
        prompts: [],
        imageKeys: ['03-enable-voice-realtime-1', '03-enable-voice-realtime-2'],
      }],
    },
    {
      id: 'settings', title: { en: 'Review the voice settings', zh: '检查语音设置', ja: '音声設定を確認', ko: '음성 설정 검토', th: 'ตรวจสอบ voice settings', hi: 'voice settings की समीक्षा करें' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'Walk through each voice setting so you understand what to tune before testing.', zh: '逐项了解每个语音设置，以便在测试前进行调整。', ja: 'テスト前に調整すべき各音声設定を順に確認します。', ko: '테스트 전에 조정할 각 음성 설정을 하나씩 살펴봅니다.', th: 'ดูแต่ละ voice setting เพื่อเข้าใจว่าจะปรับอะไรก่อนการทดสอบ', hi: 'परीक्षण से पहले क्या ट्यून करना है समझने के लिए हर voice setting देखें।' }],
        markdown: { en: settingsStep, zh: '', ja: '', ko: '', th: settingsStepTh, hi: settingsStepHi },
        highlight: { en: 'Barge-in plus a well-tuned silence timeout is what makes a real-time voice call feel human.', zh: '打断功能加上调优良好的静默超时，才能让实时语音通话更自然。', ja: 'バージインと適切な無音タイムアウトが、リアルタイム音声を人間らしくします。', ko: '바지인과 잘 조정된 침묵 시간 초과가 실시간 음성 통화를 사람처럼 느껴게 합니다.', th: 'Barge-in ร่วมกับ silence timeout ที่ปรับตั้งไว้ดี ทำให้การโทรด้วย real-time voice รู้สึกเหมือนมนุษย์', hi: 'Barge-in और अच्छी तरह ट्यून किया गया silence timeout ही real-time voice call को मानवीय बनाता है।' },
        prompts: [],
        imageKeys: ['04-voice-settings-1', '04-voice-settings-2'],
      }],
    },
    {
      id: 'capabilities', title: { en: 'Leverage knowledge, tools, topics, and child agents', zh: '利用知识、工具、主题与子 Agent', ja: 'ナレッジ・ツール・トピック・子 Agent を活用', ko: '지식, 도구, 토픽, 자식 Agent 활용', th: 'ใช้ประโยชน์จาก knowledge, tools, topics และ child agents', hi: 'knowledge, tools, topics और child agents का लाभ उठाएं' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'A real-time voice agent can use everything else you build in Copilot Studio.', zh: '实时语音 Agent 可以使用你在 Copilot Studio 中构建的一切。', ja: 'リアルタイム音声 Agent は、Copilot Studio で作った他のすべてを利用できます。', ko: '실시간 음성 Agent는 Copilot Studio에서 만든 다른 모든 것을 사용할 수 있습니다.', th: 'real-time voice agent สามารถใช้ทุกอย่างที่คุณสร้างใน Copilot Studio ได้', hi: 'एक real-time voice agent Copilot Studio में आपके बनाए हर चीज का उपयोग कर सकता है।' }],
        markdown: { en: capabilitiesStep, zh: '', ja: '', ko: '', th: capabilitiesStepTh, hi: capabilitiesStepHi },
        highlight: { en: 'Design once, speak everywhere: the same knowledge, tools, topics, and child agents power chat and voice.', zh: '一次设计，处处可用：相同的知识、工具、主题和子 Agent 同时驱动聊天与语音。', ja: '一度作れば、どこでも話せる：同じナレッジ・ツール・トピック・子 Agent がチャットと音声を支えます。', ko: '한 번 설계로 어디서나 말하기: 동일한 지식, 도구, 토픽, 자식 Agent가 채팅과 음성을 구동합니다.', th: 'ออกแบบครั้งเดียว พูดได้ทุกที่: knowledge, tools, topics และ child agents เดียวกันขับเคลื่อนทั้ง chat และ voice', hi: 'एक बार डिज़ाइन करें, हर जगह बोलें: वही knowledge, tools, topics और child agents chat और voice को शक्ति देते हैं।' },
        prompts: [],
        imageKeys: ['05-capabilities-1'],
      }],
    },
    {
      id: 'instructions', title: { en: 'Add the multilingual voice instruction', zh: '添加多语言语音指令', ja: '多言語音声指示を追加', ko: '다국어 음성 지침 추가', th: 'เพิ่ม voice instruction แบบ multilingual', hi: 'multilingual voice instruction जोड़ें' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'Paste this sample instruction to make a multi-turn, multilingual Microsoft product & service voice agent.', zh: '粘贴此示例指令，打造多轮、多语言的 Microsoft 产品与服务语音 Agent。', ja: 'このサンプル指示を貼り付けて、複数ターン・多言語の Microsoft 製品・サービス音声 Agent を作ります。', ko: '이 샘플 지침을 붙여넣어 다중 턴, 다국어 Microsoft 제품 및 서비스 음성 Agent를 만듭니다.', th: 'วาง sample instruction นี้เพื่อสร้าง voice agent สำหรับ Microsoft product & service แบบ multi-turn และ multilingual', hi: 'multi-turn, multilingual Microsoft product & service voice agent बनाने के लिए यह sample instruction पेस्ट करें।' }],
        markdown: { en: '## Apply the agent instruction\n1. Open the agent\'s **Instructions** (Overview or Settings).\n2. Paste the instruction below.\n3. **Save**.', zh: '', ja: '', ko: '', th: '## \u0e19\u0e33 agent instruction \u0e44\u0e1b\u0e43\u0e0a\u0e49\n1. \u0e40\u0e1b\u0e34\u0e14 **Instructions** \u0e02\u0e2d\u0e07 agent (Overview \u0e2b\u0e23\u0e37\u0e2d Settings)\n2. \u0e27\u0e32\u0e07 instruction \u0e14\u0e49\u0e32\u0e19\u0e25\u0e48\u0e32\u0e07\n3. **Save**', hi: '## agent instruction \u0932\u093e\u0917\u0942 \u0915\u0930\u0947\u0902\n1. agent \u0915\u0940 **Instructions** \u0916\u094b\u0932\u0947\u0902 (Overview \u092f\u093e Settings)\u0964\n2. \u0928\u0940\u091a\u0947 \u0926\u0940 \u0917\u0908 instruction \u092a\u0947\u0938\u094d\u091f \u0915\u0930\u0947\u0902\u0964\n3. **Save** \u0915\u0930\u0947\u0902\u0964' },
        highlight: { en: 'Voice instructions should ask for short spoken sentences and one question at a time — long paragraphs sound robotic.', zh: '语音指令应要求简短口语句子、每次只问一个问题——长段落听起来很生硬。', ja: '音声指示は短い口語文と一度に一つの質問を求めます。長い段落は機械的に聞こえます。', ko: '음성 지침은 짧은 구어 문장과 한 번에 하나의 질문을 요청해야 합니다. 긴 문단은 로봇처럼 들립니다.', th: 'voice instructions ควรขอให้พูดประโยคสั้น ๆ และถามทีละคำถาม — ย่อหน้ายาว ๆ ฟังดูเหมือนหุ่นยนต์', hi: 'voice instructions को छोटे बोले गए वाक्य और एक बार में एक प्रश्न माँगना चाहिए — लंबे पैराग्राफ रोबोट जैसे लगते हैं।' },
        prompts: [{ id: 'lab06-voice-instruction', title: { en: 'Microsoft Product & Service Voice AI Agent instruction', zh: 'Microsoft 产品与服务语音 AI Agent 指令', ja: 'Microsoft 製品・サービス音声 AI Agent 指示', ko: 'Microsoft 제품 및 서비스 음성 AI Agent 지침', th: 'คำสั่ง Microsoft Product & Service Voice AI Agent', hi: 'Microsoft Product & Service Voice AI Agent instruction' }, content: sampleInstruction }],
        imageKeys: ['06-sample-instruction-1'],
      }],
    },
    {
      id: 'test', title: { en: 'Live test in the Test command window', zh: '在测试命令窗口中实时测试', ja: 'テスト コマンド ウィンドウでライブ テスト', ko: '테스트 명령 창에서 실시간 테스트', th: 'ทดสอบสดใน Test command window', hi: 'Test command window में लाइव परीक्षण' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'Speak to the agent in several languages and confirm multilingual, multi-turn behavior.', zh: '用多种语言与 Agent 对话，确认其多语言、多轮的表现。', ja: '複数の言語で Agent に話しかけ、多言語・複数ターンの動作を確認します。', ko: '여러 언어로 Agent에게 말하고 다국어, 다중 턴 동작을 확인합니다.', th: 'พูดกับ agent หลายภาษาและยืนยันพฤติกรรมแบบ multilingual, multi-turn', hi: 'agent से कई भाषाओं में बात करें और multilingual, multi-turn व्यवहार की पुष्टि करें।' }],
        markdown: { en: testStep, zh: '', ja: '', ko: '', th: testStepTh, hi: testStepHi },
        highlight: { en: 'Use the Test command window\'s voice mode to hear real-time turn-taking and interruptions before publishing to a phone number.', zh: '在发布到电话号码之前，使用测试命令窗口的语音模式来体验实时轮流对话和打断。', ja: '電話番号に公開する前に、テスト コマンド ウィンドウの音声モードでリアルタイムのターン交代と割り込みを確認します。', ko: '전화번호로 게시하기 전에 테스트 명령 창의 음성 모드로 실시간 턴 전환과 중단을 들어 보세요.', th: 'ใช้ voice mode ของ Test command window เพื่อฟังการสลับสนทนาและการขัดจังหวะแบบ real-time ก่อน Publish ไปยังหมายเลขโทรศัพท์', hi: 'phone number पर Publish करने से पहले real-time turn-taking और interruptions सुनने के लिए Test command window का voice mode उपयोग करें।' },
        prompts: [],
        imageKeys: ['07-voice-test-1', '07-voice-test-2'],
      }],
    },
  ],
}