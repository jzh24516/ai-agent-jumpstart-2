const liveCreateStepEnglish = [
  "## Create a classic agent from the modern home page",
  "1. Open **Copilot Studio** and go to the **Home** page (the modern agent experience).",
  "2. Select **+ Create** (or the **New agent** button).",
  "3. On the describe screen, select **Skip to configure** to open the configuration form.",
  "4. Switch to the **classic agent** experience — use the **…** (more) menu and choose **Switch to classic**, or select the classic-experience link on the configure page.",
  "5. Enter a **Name** (for example *Microsoft Product & Service Voice Agent*) and pick the primary **Language**.",
  "6. Select **Create**.",
].join('\n')

const bundledCreateStepEnglish = [
  "## Create a classic agent from the modern home page",
  "1. Open **Copilot Studio** and go to the **Home** page (the modern agent experience).",
  "2. Select **+ Create** (or the **New agent** button).",
  "3. On the describe screen, select **Skip to configure** to open the configuration form.",
  "4. Switch to the **classic agent** experience — use the **…** (more) menu and choose **Switch to classic**, or select the classic-experience link on the configure page.",
  "5. Enter a **Name** (for example *Talk to Me Anything Agent v2 - MJ*) and pick the primary **Language**.",
  "6. Select **Create**.",
].join('\n')

const createStepVietnamese = [
  "## Tạo classic agent từ trang chủ hiện đại",
  "1. Mở **Copilot Studio** và chuyển đến trang **Home** (trải nghiệm Agent hiện đại).",
  "2. Chọn **+ Create** (hoặc nút **New agent**).",
  "3. Trên màn hình mô tả, chọn **Skip to configure** để mở biểu mẫu cấu hình.",
  "4. Chuyển sang trải nghiệm **classic agent** — dùng menu **…** (more) và chọn **Switch to classic**, hoặc chọn liên kết classic-experience trên trang cấu hình.",
  "5. Nhập **Name** (ví dụ: *Microsoft Product & Service Voice Agent*) và chọn **Language** chính.",
  "6. Chọn **Create**.",
].join('\n')

const bundledCreateStepVietnamese = [
  "## Tạo classic agent từ trang chủ hiện đại",
  "1. Mở **Copilot Studio** và chuyển đến trang **Home** (trải nghiệm Agent hiện đại).",
  "2. Chọn **+ Create** (hoặc nút **New agent**).",
  "3. Trên màn hình mô tả, chọn **Skip to configure** để mở biểu mẫu cấu hình.",
  "4. Chuyển sang trải nghiệm **classic agent** — dùng menu **…** (more) và chọn **Switch to classic**, hoặc chọn liên kết classic-experience trên trang cấu hình.",
  "5. Nhập **Name** (ví dụ: *Talk to Me Anything Agent v2 - MJ*) và chọn **Language** chính.",
  "6. Chọn **Create**.",
].join('\n')

const liveAuthStepEnglish = [
  "## Set security to No authentication",
  "1. Open the agent's **Settings** → **Security** → **Authentication**.",
  "2. Select **No authentication**.",
  "3. **Save**, then refresh the agent if prompted.",
  "",
  "No authentication lets the voice channel and the Test window run without a sign-in prompt, which keeps the lab flow simple.",
].join('\n')

const bundledAuthStepEnglish = [
  "## Set security to No authentication",
  "1. Open the agent's **Settings** → **Security** → **Authentication**.",
  "2. Select **No authentication**.",
  "3. **Save**, then refresh the agent if prompted.",
].join('\n')

const liveAuthStepVietnamese = [
  "## Đặt security thành No authentication",
  "1. Mở **Settings** → **Security** → **Authentication** của Agent.",
  "2. Chọn **No authentication**.",
  "3. Chọn **Save**, sau đó refresh Agent nếu được nhắc.",
  "",
  "No authentication cho phép voice channel và Test window hoạt động mà không xuất hiện sign-in prompt, nhờ đó quy trình của bài thực hành trở nên đơn giản hơn.",
].join('\n')

const bundledAuthStepVietnamese = [
  "## Đặt security thành No authentication",
  "1. Mở **Settings** → **Security** → **Authentication** của Agent.",
  "2. Chọn **No authentication**.",
  "3. Chọn **Save**, sau đó refresh Agent nếu được nhắc.",
].join('\n')

const liveVoiceChannelStepEnglish = [
  "## Enable the voice channel and choose real-time voice",
  "1. Go to **Channels** (or **Settings → Channels**).",
  "2. Select **Telephony** / **Voice**.",
  "3. Turn **on** the voice capability for this agent.",
  "4. For the voice engine, choose **Real-time voice** (powered by the GPT-Realtime model via Microsoft Foundry) instead of **Classic voice**.",
  "5. **Save**.",
  "",
  "Real-time voice streams audio both ways for low latency and natural turn-taking. Classic voice uses the traditional speech-to-text → model → text-to-speech pipeline, which feels more like an IVR.",
].join('\n')

const bundledVoiceChannelStepEnglish = [
  "## Enable the voice channel and choose real-time voice",
  "1. Go to **Channels** (or **Settings → Channels**).",
  "2. Select **Telephony** / **Voice**.",
  "3. Turn **on** the voice capability for this agent.",
  "4. For the voice engine, choose **Real-time voice** (powered by the GPT-Realtime model) instead of **Classic voice**.",
  "5. **Save**.",
  "",
  "Real-time voice streams audio both ways for low latency and natural turn-taking. Classic voice uses the traditional speech-to-text → model → text-to-speech pipeline, which feels more like an IVR.",
].join('\n')

const liveVoiceChannelStepVietnamese = [
  "## Bật voice channel và chọn real-time voice",
  "1. Chuyển đến **Channels** (hoặc **Settings → Channels**).",
  "2. Chọn **Telephony** / **Voice**.",
  "3. **Bật** khả năng voice cho Agent này.",
  "4. Đối với voice engine, chọn **Real-time voice** (được hỗ trợ bởi mô hình GPT-Realtime thông qua Microsoft Foundry) thay vì **Classic voice**.",
  "5. Chọn **Save**.",
  "",
  "Real-time voice truyền phát âm thanh theo cả hai chiều để đạt độ trễ thấp và khả năng luân phiên hội thoại tự nhiên. Classic voice sử dụng pipeline speech-to-text → model → text-to-speech truyền thống, nên mang lại cảm giác giống IVR hơn.",
].join('\n')

const bundledVoiceChannelStepVietnamese = [
  "## Bật voice channel và chọn real-time voice",
  "1. Chuyển đến **Channels** (hoặc **Settings → Channels**).",
  "2. Chọn **Telephony** / **Voice**.",
  "3. **Bật** khả năng voice cho Agent này.",
  "4. Đối với voice engine, chọn **Real-time voice** (được hỗ trợ bởi mô hình GPT-Realtime) thay vì **Classic voice**.",
  "5. Chọn **Save**.",
  "",
  "Real-time voice truyền phát âm thanh theo cả hai chiều để đạt độ trễ thấp và khả năng luân phiên hội thoại tự nhiên. Classic voice sử dụng pipeline speech-to-text → model → text-to-speech truyền thống, nên mang lại cảm giác giống IVR hơn.",
].join('\n')

const settingsStepEnglish = [
  "## Review the voice settings one by one",
  "Open the voice channel settings and walk through each option:",
  "",
  "- **Voice selection** — pick the neural voice and locale (name, gender, style) the agent speaks with.",
  "- **Silence timeout / end-of-speech** — how long the agent waits after the caller stops talking before it responds. Shorter feels snappy; too short cuts people off.",
  "- **Speech sensitivity** — how eagerly the agent detects that the caller has started speaking, especially in noisy audio.",
  "- **DTMF** — accept **keypad tones** so callers can enter menus, numbers, or confirmations by pressing keys.",
  "- **Barge-in** — let the caller **interrupt** the agent while it is speaking, so they don't have to wait for a long prompt to finish.",
  "- **Greeting & retries** — the opening message and how many times to re-prompt on silence or no recognition.",
  "",
  "Tune **silence timeout** and **sensitivity** together to balance responsiveness against accidentally cutting the caller off.",
].join('\n')

const settingsStepVietnamese = [
  "## Xem lại từng voice setting",
  "Mở phần cài đặt voice channel và lần lượt xem từng tùy chọn:",
  "",
  "- **Voice selection** — chọn neural voice và locale (tên, giới tính, phong cách) mà Agent sẽ dùng để nói.",
  "- **Silence timeout / end-of-speech** — khoảng thời gian Agent chờ sau khi người gọi ngừng nói trước khi phản hồi. Thời gian ngắn hơn tạo cảm giác phản hồi nhanh; quá ngắn sẽ cắt ngang lời người nói.",
  "- **Speech sensitivity** — mức độ nhạy mà Agent dùng để phát hiện người gọi đã bắt đầu nói, đặc biệt khi âm thanh có nhiều tạp âm.",
  "- **DTMF** — chấp nhận **keypad tones** để người gọi có thể nhập lựa chọn menu, số hoặc xác nhận bằng cách nhấn phím.",
  "- **Barge-in** — cho phép người gọi **ngắt lời** Agent khi Agent đang nói, để họ không phải chờ một prompt dài kết thúc.",
  "- **Greeting & retries** — thông điệp mở đầu và số lần nhắc lại khi im lặng hoặc không nhận dạng được lời nói.",
  "",
  "Điều chỉnh đồng thời **silence timeout** và **sensitivity** để cân bằng giữa tốc độ phản hồi và việc vô tình cắt ngang lời người gọi.",
].join('\n')

const liveCapabilitiesStepEnglish = [
  "## One agent, all of Copilot Studio's capabilities",
  "A real-time voice agent is not a separate, limited product — it reuses everything you already build in Copilot Studio, now spoken:",
  "",
  "- **Knowledge** — ground spoken answers in Microsoft.com, SharePoint, files, or your own indexes.",
  "- **Tools** — call MCP servers, connectors, Power Automate flows, and APIs (for example Dataverse or ServiceNow) during the call.",
  "- **Topics** — run deterministic, compliance-critical flows when you need exact wording and steps.",
  "- **Child / connected agents** — hand off to specialists (for example an *Ask IT Anything* agent) mid-conversation and come back.",
  "",
  "Combined, these turn a phone call into a compelling, interactive, intelligent conversational experience.",
].join('\n')

const bundledCapabilitiesStepEnglish = [
  "## One agent, all of Copilot Studio's capabilities",
  "A real-time voice agent is not a separate, limited product — it reuses everything you already build in Copilot Studio, now spoken:",
  "",
  "- **Knowledge** — ground spoken answers in Policy PDF File Upload, Microsoft.com, or your own indexes.",
  "- **Tools** — call MCP servers, connectors, Power Automate flows, and APIs (for example Dataverse or ServiceNow) during the call.",
  "- **Topics** — run deterministic, compliance-critical flows when you need exact wording and steps.",
  "- **Child / connected agents** — hand off to specialists (for example an *Ask IT Anything* agent) mid-conversation and come back.",
  "",
  "Combined, these turn a phone call into a compelling, interactive, intelligent conversational experience.",
].join('\n')

const liveCapabilitiesStepVietnamese = [
  "## Một Agent, toàn bộ khả năng của Copilot Studio",
  "Real-time voice agent không phải là một sản phẩm riêng biệt với khả năng hạn chế — Agent này tái sử dụng mọi thứ bạn đã xây dựng trong Copilot Studio, giờ đây dưới dạng hội thoại bằng giọng nói:",
  "",
  "- **Knowledge** — xây dựng câu trả lời bằng giọng nói dựa trên Microsoft.com, SharePoint, các tệp hoặc index của riêng bạn.",
  "- **Tools** — gọi MCP server, connector, Power Automate flow và API (ví dụ: Dataverse hoặc ServiceNow) trong cuộc gọi.",
  "- **Topics** — chạy các flow có tính xác định và quan trọng đối với tuân thủ khi bạn cần câu chữ và các bước chính xác.",
  "- **Child / connected agents** — chuyển giao cho các Agent chuyên môn (ví dụ: Agent *Ask IT Anything*) giữa cuộc hội thoại rồi quay lại.",
  "",
  "Khi kết hợp, các khả năng này biến một cuộc gọi điện thoại thành trải nghiệm hội thoại hấp dẫn, có tính tương tác và thông minh.",
].join('\n')

const bundledCapabilitiesStepVietnamese = [
  "## Một Agent, toàn bộ khả năng của Copilot Studio",
  "Real-time voice agent không phải là một sản phẩm riêng biệt với khả năng hạn chế — Agent này tái sử dụng mọi thứ bạn đã xây dựng trong Copilot Studio, giờ đây dưới dạng hội thoại bằng giọng nói:",
  "",
  "- **Knowledge** — xây dựng câu trả lời bằng giọng nói dựa trên Policy PDF File Upload, Microsoft.com hoặc index của riêng bạn.",
  "- **Tools** — gọi MCP server, connector, Power Automate flow và API (ví dụ: Dataverse hoặc ServiceNow) trong cuộc gọi.",
  "- **Topics** — chạy các flow có tính xác định và quan trọng đối với tuân thủ khi bạn cần câu chữ và các bước chính xác.",
  "- **Child / connected agents** — chuyển giao cho các Agent chuyên môn (ví dụ: Agent *Ask IT Anything*) giữa cuộc hội thoại rồi quay lại.",
  "",
  "Khi kết hợp, các khả năng này biến một cuộc gọi điện thoại thành trải nghiệm hội thoại hấp dẫn, có tính tương tác và thông minh.",
].join('\n')

const applyInstructionEnglish = [
  "## Apply the agent instruction",
  "1. Open the agent's **Instructions** (Overview or Settings).",
  "2. Paste the instruction below.",
  "3. **Save**.",
].join('\n')

const applyInstructionVietnamese = [
  "## Áp dụng Agent instruction",
  "1. Mở **Instructions** của Agent (Overview hoặc Settings).",
  "2. Dán instruction bên dưới.",
  "3. Chọn **Save**.",
].join('\n')

const testStepEnglish = [
  "## Test live in the Test command window (multilingual)",
  "1. Open the **Test** pane and switch it to **voice** mode (the microphone in the Test command window).",
  "2. Ask a Microsoft question in **English**: *\"What is Microsoft Copilot Studio?\"*",
  "3. Ask again in **中文**: *\"Copilot 和 Copilot Studio 有什么区别？\"*",
  "4. Ask in **日本語**: *\"Microsoft 365 Copilot でできることを教えて。\"*",
  "5. Ask in **한국어**: *\"Azure AI Foundry는 무엇인가요?\"*",
  "6. Confirm the agent: detects each language and replies in it, keeps context across turns, and lets you **barge-in** to interrupt.",
].join('\n')

const testStepVietnamese = [
  "## Kiểm thử trực tiếp trong Test command window (đa ngôn ngữ)",
  "1. Mở bảng **Test** và chuyển sang chế độ **voice** (biểu tượng micrô trong Test command window).",
  "2. Đặt một câu hỏi về Microsoft bằng **English**: *\"What is Microsoft Copilot Studio?\"*",
  "3. Hỏi lại bằng **中文**: *\"Copilot 和 Copilot Studio 有什么区别？\"*",
  "4. Hỏi bằng **日本語**: *\"Microsoft 365 Copilot でできることを教えて。\"*",
  "5. Hỏi bằng **한국어**: *\"Azure AI Foundry는 무엇인가요?\"*",
  "6. Xác nhận rằng Agent phát hiện từng ngôn ngữ và trả lời bằng chính ngôn ngữ đó, duy trì ngữ cảnh qua nhiều lượt và cho phép bạn dùng **barge-in** để ngắt lời.",
].join('\n')

export const lab06Vietnamese: Readonly<Record<string, string>> = {
  "Build a real-time voice agent": "Xây dựng real-time voice agent",
  "Create a classic agent from the modern home page, enable the real-time voice channel, tune the voice settings, and test a multilingual Microsoft product & service voice assistant.": "Tạo classic agent từ trang chủ hiện đại, bật real-time voice channel, tinh chỉnh voice settings và kiểm thử trợ lý giọng nói đa ngôn ngữ cho các sản phẩm và dịch vụ Microsoft.",
  "A no-auth classic agent with the real-time voice channel enabled, tuned voice settings, and a tested multilingual Microsoft product & service voice experience.": "Một classic agent no-auth đã bật real-time voice channel, có voice settings được tinh chỉnh và trải nghiệm giọng nói đa ngôn ngữ cho các sản phẩm và dịch vụ Microsoft đã được kiểm thử.",
  "Create a classic agent from the modern home page and set No authentication.": "Tạo classic agent từ trang chủ hiện đại và đặt thành No authentication.",
  "Enable the voice channel, choose real-time voice, and review the voice settings.": "Bật voice channel, chọn real-time voice và xem lại voice settings.",
  "Add multilingual voice instructions and test live in the Test command window.": "Thêm voice instruction đa ngôn ngữ và kiểm thử trực tiếp trong Test command window.",
  "A Copilot Studio environment with maker access and real-time voice enabled by the facilitator.": "Một môi trường Copilot Studio có quyền maker và đã được người hướng dẫn bật real-time voice.",
  "Create a classic agent from the modern home page": "Tạo classic agent từ trang chủ hiện đại",
  "Start on the modern Copilot Studio home page and create a classic agent for voice.": "Bắt đầu tại trang chủ Copilot Studio hiện đại và tạo một classic agent cho voice.",
  [liveCreateStepEnglish]: createStepVietnamese,
  [bundledCreateStepEnglish]: bundledCreateStepVietnamese,
  "The real-time voice configuration surfaces live in the classic agent experience, so create the agent there.": "Các giao diện cấu hình real-time voice nằm trong trải nghiệm classic agent, vì vậy hãy tạo Agent tại đó.",
  "Suggested agent name": "Tên Agent được đề xuất",
  "Set security to No authentication": "Đặt security thành No authentication",
  "Turn off sign-in so the voice channel and Test window run without authentication.": "Tắt sign-in để voice channel và Test window hoạt động mà không cần xác thực.",
  [liveAuthStepEnglish]: liveAuthStepVietnamese,
  [bundledAuthStepEnglish]: bundledAuthStepVietnamese,
  "No authentication is for lab and demo only. Production voice agents should use proper authentication and DLP policies.": "No authentication chỉ dành cho bài thực hành và bản demo. Voice agent trong môi trường production phải sử dụng cơ chế xác thực và DLP policies phù hợp.",
  "Enable the voice channel (real-time voice)": "Bật voice channel (real-time voice)",
  "Enable the voice channel and select real-time voice instead of classic voice.": "Bật voice channel và chọn real-time voice thay vì classic voice.",
  [liveVoiceChannelStepEnglish]: liveVoiceChannelStepVietnamese,
  [bundledVoiceChannelStepEnglish]: bundledVoiceChannelStepVietnamese,
  "Real-time voice gives low latency and natural turn-taking. Classic voice uses the traditional STT → model → TTS pipeline.": "Real-time voice mang lại độ trễ thấp và khả năng luân phiên hội thoại tự nhiên. Classic voice sử dụng pipeline STT → model → TTS truyền thống.",
  "Review the voice settings": "Xem lại voice settings",
  "Walk through each voice setting so you understand what to tune before testing.": "Xem lần lượt từng voice setting để hiểu những gì cần tinh chỉnh trước khi kiểm thử.",
  [settingsStepEnglish]: settingsStepVietnamese,
  "Barge-in plus a well-tuned silence timeout is what makes a real-time voice call feel human.": "Barge-in kết hợp với silence timeout được tinh chỉnh tốt sẽ giúp cuộc gọi real-time voice mang lại cảm giác tự nhiên như trò chuyện với con người.",
  "Leverage knowledge, tools, topics, and child agents": "Tận dụng Knowledge, Tools, Topics và child agents",
  "A real-time voice agent can use everything else you build in Copilot Studio.": "Real-time voice agent có thể sử dụng mọi thành phần khác mà bạn xây dựng trong Copilot Studio.",
  [liveCapabilitiesStepEnglish]: liveCapabilitiesStepVietnamese,
  [bundledCapabilitiesStepEnglish]: bundledCapabilitiesStepVietnamese,
  "Design once, speak everywhere: the same knowledge, tools, topics, and child agents power chat and voice.": "Thiết kế một lần, hội thoại ở mọi nơi: cùng một Knowledge, Tools, Topics và child agents hỗ trợ cả chat lẫn voice.",
  "Add the multilingual voice instruction": "Thêm voice instruction đa ngôn ngữ",
  "Paste this sample instruction to make a multi-turn, multilingual Microsoft product & service voice agent.": "Dán sample instruction này để tạo voice agent đa lượt, đa ngôn ngữ cho các sản phẩm và dịch vụ Microsoft.",
  [applyInstructionEnglish]: applyInstructionVietnamese,
  "Voice instructions should ask for short spoken sentences and one question at a time — long paragraphs sound robotic.": "Voice instruction nên yêu cầu các câu nói ngắn và mỗi lần chỉ đặt một câu hỏi — các đoạn văn dài sẽ tạo cảm giác máy móc.",
  "Microsoft Product & Service Voice AI Agent instruction": "Instruction cho Microsoft Product & Service Voice AI Agent",
  "Talk to Me with Anything Voice AI Agent instruction": "Instruction cho Talk to Me with Anything Voice AI Agent",
  "Live test in the Test command window": "Kiểm thử trực tiếp trong Test command window",
  "Speak to the agent in several languages and confirm multilingual, multi-turn behavior.": "Trò chuyện với Agent bằng nhiều ngôn ngữ và xác nhận hành vi đa ngôn ngữ, đa lượt.",
  [testStepEnglish]: testStepVietnamese,
  "Use the Test command window's voice mode to hear real-time turn-taking and interruptions before publishing to a phone number.": "Dùng chế độ voice của Test command window để nghe khả năng luân phiên hội thoại và ngắt lời theo thời gian thực trước khi publish tới một số điện thoại.",
}