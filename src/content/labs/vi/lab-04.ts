const createAgentEnglish = [
  "1. Open a **new browser tab** and navigate to **`copilotstudio.preview.microsoft.com`**. Sign in with your work account and confirm the correct **environment**.",
  "2. Verify you're in the **new experience** (Build / Preview / Evaluate / Monitor tabs).",
  "3. In the left navigation, select **Create**, then **New agent**.",
  "4. Enter the name **`Ask IT Anything Agent v2 - <Your Alias>`** and an instruction as below.",
].join('\n')

const createAgentVietnamese = [
  "1. Mở một **tab trình duyệt mới** và truy cập **`copilotstudio.preview.microsoft.com`**. Đăng nhập bằng tài khoản công việc của bạn và xác nhận đúng **environment**.",
  "2. Xác minh rằng bạn đang ở **trải nghiệm mới** (các tab Build / Preview / Evaluate / Monitor).",
  "3. Trên thanh điều hướng bên trái, chọn **Create**, sau đó chọn **New agent**.",
  "4. Nhập tên **`Ask IT Anything Agent v2 - <Your Alias>`** và hướng dẫn như bên dưới.",
].join('\n')

const beforeCreateEnglish = [
  "## Before you start",
  "- You're using the **new/modern agent experience** (top nav shows **Build / Preview / Evaluate / Monitor**).",
  "- You have a **ServiceNow** instance plus its connection details to serve as IT Helpdesk knowledge and Service Ticket.",
  "- Both agents (**Ask Me Anything Agent** and **Ask IT Anything Agent**) live in the **\"Training\" environment** .",
  "- The specialist agent must be **published** before it can be connected.",
].join('\n')

const beforeCreateVietnamese = [
  "## Trước khi bắt đầu",
  "- Bạn đang sử dụng **trải nghiệm Agent mới/hiện đại** (thanh điều hướng trên cùng hiển thị **Build / Preview / Evaluate / Monitor**).",
  "- Bạn có một instance **ServiceNow** cùng thông tin kết nối để làm nguồn Knowledge cho IT Helpdesk và Service Ticket.",
  "- Cả hai Agent (**Ask Me Anything Agent** và **Ask IT Anything Agent**) đều nằm trong **\"Training\" environment** .",
  "- Agent chuyên trách phải được **phát hành** trước khi có thể kết nối.",
].join('\n')

const serviceNowKnowledgeEnglish = [
  "1. On the **Build** tab, in the components panel, select **Knowledge** → **Add knowledge**.",
  "2. Choose **ServiceNow** (the ServiceNow Knowledge Copilot Connection) as the source.",
  "3. Select **mjCopilotSNOW27** from the connection list, and then clicked **Add**.",
  "4. Go to the **Preview** tab, to test using example prompt to check and result.",
  " > *How to setup the out of office auto reply in outlook?*",
  "5. Click **Save** in the top right toolbar.",
].join('\n')

const serviceNowKnowledgeVietnamese = [
  "1. Trên tab **Build**, trong bảng components, chọn **Knowledge** → **Add knowledge**.",
  "2. Chọn **ServiceNow** (ServiceNow Knowledge Copilot Connection) làm nguồn.",
  "3. Chọn **mjCopilotSNOW27** trong danh sách connection, sau đó bấm **Add**.",
  "4. Chuyển đến tab **Preview** và dùng prompt mẫu để kiểm thử rồi xem kết quả.",
  " > *How to setup the out of office auto reply in outlook?*",
  "5. Bấm **Save** trên thanh công cụ ở góc trên bên phải.",
].join('\n')

const incidentWorkflowEnglish = [
  "## Add the existing workflow as a tool",
  "1. On the **Build** tab, in the components panel, select **Tools**.",
  "2. In the **Add a tool** dialog, open the **Workflows** tab (or use the search box).",
  "3. Search for and select **JumpStart - Get SNOW Incident Status and Description by Number**.",
  "4. Review its details, then select **Add**. The workflow now appears as a **tool** on your agent's Build tab.",
  "",
  "---",
  "",
  "## Edit the tool description and input description",
  "1. On the **Build** tab, select the tool **JumpStart - Get SNOW Incident Status and Description by Number** to open its settings.",
  "2. Set the **Description** to:",
  "   > `Get Service Now Service Request / Ticket / Incident / Case Status and Description by Number`",
  "3. In the **Inputs** section, open the **first input parameter** (Incident Number) and set its **description** to:",
  "   > `The Service Now Incident Number, or mentioned by user as service request / Ticket / Case Number`",
  "4. **Save.** *(These descriptions drive orchestration — the \"service request / ticket / case\" synonyms help the agent map the user's words to this tool and its input.)*",
  "",
  "---",
  "",
  "## Test in the Preview tab",
  "1. Open the **Preview** tab.",
  "2. Enter the test prompt:",
  "   > *\"I want to check the current status of my ticket with number INC0010053\"*",
  "3. **Expected result:** the agent recognizes \"ticket … number,\" calls **JumpStart - Get SNOW Incident Status and Description by Number**, passes **INC0010053** into the Incident Number input, and returns the incident's **status and description** from ServiceNow.",
  "4. Click **Save** and then **Publish** the agent.",
].join('\n')

const incidentWorkflowVietnamese = [
  "## Thêm workflow hiện có dưới dạng một Tool",
  "1. Trên tab **Build**, trong bảng components, chọn **Tools**.",
  "2. Trong hộp thoại **Add a tool**, mở tab **Workflows** (hoặc dùng ô tìm kiếm).",
  "3. Tìm kiếm và chọn **JumpStart - Get SNOW Incident Status and Description by Number**.",
  "4. Xem lại thông tin chi tiết, sau đó chọn **Add**. Workflow giờ xuất hiện dưới dạng một **Tool** trên tab Build của Agent.",
  "",
  "---",
  "",
  "## Chỉnh sửa mô tả Tool và mô tả đầu vào",
  "1. Trên tab **Build**, chọn Tool **JumpStart - Get SNOW Incident Status and Description by Number** để mở phần cài đặt.",
  "2. Đặt **Description** thành:",
  "   > `Get Service Now Service Request / Ticket / Incident / Case Status and Description by Number`",
  "3. Trong phần **Inputs**, mở **tham số đầu vào đầu tiên** (Incident Number) và đặt **description** thành:",
  "   > `The Service Now Incident Number, or mentioned by user as service request / Ticket / Case Number`",
  "4. **Save.** *(Các mô tả này điều khiển orchestration — những từ đồng nghĩa \"service request / ticket / case\" giúp Agent ánh xạ cách diễn đạt của người dùng với Tool này và đầu vào của Tool.)*",
  "",
  "---",
  "",
  "## Kiểm thử trong tab Preview",
  "1. Mở tab **Preview**.",
  "2. Nhập prompt kiểm thử:",
  "   > *\"I want to check the current status of my ticket with number INC0010053\"*",
  "3. **Kết quả mong đợi:** Agent nhận diện \"ticket … number,\" gọi **JumpStart - Get SNOW Incident Status and Description by Number**, truyền **INC0010053** vào đầu vào Incident Number và trả về **status and description** của incident từ ServiceNow.",
  "4. Bấm **Save**, sau đó bấm **Publish** để phát hành Agent.",
].join('\n')

const incidentNotesEnglish = [
  "- **Descriptions matter:** the tool description and the input description (with the ticket/case/service-request synonyms) are what the orchestrator uses to pick this tool and fill the number — keep them exactly as set.",
  "- **If the agent doesn't call the tool:** re-check the tool description wording and confirm the tool shows **Enabled: On**.",
  "- **Empty result:** for an unknown number, the tool should say \"no incident found for that number\" rather than returning blank.",
].join('\n')

const incidentNotesVietnamese = [
  "- **Mô tả rất quan trọng:** orchestrator sử dụng mô tả Tool và mô tả đầu vào (có các từ đồng nghĩa ticket/case/service-request) để chọn Tool này và điền số — hãy giữ nguyên chính xác như đã thiết lập.",
  "- **Nếu Agent không gọi Tool:** hãy kiểm tra lại cách diễn đạt trong mô tả Tool và xác nhận Tool hiển thị **Enabled: On**.",
  "- **Kết quả trống:** với một số không xác định, Tool phải trả lời \"no incident found for that number\" thay vì trả về nội dung trống.",
].join('\n')

const connectAgentEnglish = [
  "1. Open the **Ask Me Anything Agent** (your front-door/primary agent) in the new experience.",
  "2. On the **Build** tab, in the components panel, select **Connected agents** → **Add a connected agent**.",
  "3. Browse or search and select **Ask IT Anything Agent v2 - <Your Alias>**.",
  "4. Add a clear routing **description**, for example:",
  "   **`Use for all IT helpdesk questions and for ServiceNow service ticket/incident status queries and updates. Route any IT support or ticket-status request here.`**",
  "5. Select **Connect** and confirm it appears in the components panel.",
  "6. **Test delegation** in the **Preview** tab:",
  "   - Ask an IT helpdesk question and a ticket-status/update request → confirm the primary agent **routes to Ask IT Anything Agent v2 - <Your Alias>**.",
  "   - Ask an unrelated question → confirm the **primary agent** handles it itself.",
].join('\n')

const connectAgentVietnamese = [
  "1. Mở **Ask Me Anything Agent** (Agent đầu mối/Agent chính của bạn) trong trải nghiệm mới.",
  "2. Trên tab **Build**, trong bảng components, chọn **Connected agents** → **Add a connected agent**.",
  "3. Duyệt hoặc tìm kiếm rồi chọn **Ask IT Anything Agent v2 - <Your Alias>**.",
  "4. Thêm **description** định tuyến rõ ràng, ví dụ:",
  "   **`Use for all IT helpdesk questions and for ServiceNow service ticket/incident status queries and updates. Route any IT support or ticket-status request here.`**",
  "5. Chọn **Connect** và xác nhận Agent xuất hiện trong bảng components.",
  "6. **Kiểm thử việc ủy quyền** trong tab **Preview**:",
  "   - Đặt một câu hỏi cho IT helpdesk và một yêu cầu về trạng thái/cập nhật ticket → xác nhận Agent chính **định tuyến đến Ask IT Anything Agent v2 - <Your Alias>**.",
  "   - Đặt một câu hỏi không liên quan → xác nhận **Agent chính** tự xử lý câu hỏi đó.",
].join('\n')

const connectedAgentNotesEnglish = [
  "## Notes & gotchas",
  "- **Connected agents (new experience)** can only connect other **new-experience Copilot Studio agents in the same environment**, and the target must be **published** and owned by/shared with you.",
  "- **Routing quality** depends on the connected agent's **name + description** — keep it specific and non-overlapping with other connected agents.",
  "- **KB vs. Incident:** ServiceNow **Knowledge** is read-only Q&A; **incident status query** needs the **ServiceNow connector actions (Tool)**.",
].join('\n')

const connectedAgentNotesVietnamese = [
  "## Lưu ý và điểm cần chú ý",
  "- **Connected agents (trải nghiệm mới)** chỉ có thể kết nối với các **Copilot Studio Agent thuộc trải nghiệm mới trong cùng environment**; Agent đích phải được **phát hành** và do bạn sở hữu hoặc được chia sẻ với bạn.",
  "- **Chất lượng định tuyến** phụ thuộc vào **name + description** của Connected Agent — hãy mô tả cụ thể và không trùng lặp với các Connected Agent khác.",
  "- **KB và Incident:** ServiceNow **Knowledge** là Q&A chỉ đọc; **truy vấn trạng thái incident** cần **ServiceNow connector actions (Tool)**.",
].join('\n')

const publishPrerequisitesEnglish = [
  "## Before you start",
  "- **Ask Me Anything Agent** (primary) has **Ask IT Anything Agent v2 -MJ** connected, and both are tested in **Preview**.",
  "- You're in a **paid environment** (trial environments can't publish).",
  "- Keep **Authenticate with Microsoft** turned on so Teams and Microsoft 365 Copilot use Entra ID sign-in and the ServiceNow tools can run with user credentials. *(With \"No authentication,\" tools can't use user credentials.)*",
].join('\n')

const publishPrerequisitesVietnamese = [
  "## Trước khi bắt đầu",
  "- **Ask Me Anything Agent** (Agent chính) đã kết nối với **Ask IT Anything Agent v2 -MJ** và cả hai đã được kiểm thử trong **Preview**.",
  "- Bạn đang ở trong một **environment trả phí** (environment dùng thử không thể phát hành).",
  "- Duy trì **Authenticate with Microsoft** ở trạng thái bật để Teams và Microsoft 365 Copilot sử dụng đăng nhập Entra ID, đồng thời các ServiceNow Tool có thể chạy bằng thông tin xác thực của người dùng. *(Với \"No authentication,\" các Tool không thể sử dụng thông tin xác thực của người dùng.)*",
].join('\n')

const publishWorkflowEnglish = [
  "## Publish the latest version",
  "1. Open **Ask Me Anything Agent** and go to the **Build** tab.",
  "2. Select the **chevron next to Publish** (first publish) or **Publish** in the upper-right (updates).",
  "3. In the **Publish agent** dialog, review the details — make sure name, description, and instructions are complete.",
  "4. Select **Publish** and confirm; wait for it to finish.",
  "5. **Republish Ask IT Anything Agent v2 -MJ too** if you changed it — the connected agent must be on its latest published version.",
  "",
  "> Publishing applies to all channels. The latest content goes live for a user when a **new session** starts (type **start over** to force it; otherwise it can take up to an hour).",
  "",
  "---",
  "",
  "## Add Microsoft 365 Copilot and Teams channels",
  "1. In the **Publish** dialog (or the top-menu **Channels**), select **Teams + Microsoft 365 Copilot**.",
  "2. In the configuration panel, under **Turn on Microsoft 365**, select **Make agent available in Microsoft 365 Copilot chat** — this enables both **Teams** and **Microsoft 365 Copilot**.",
  "3. Set the **Availability options** (start with just yourself for testing).",
  "4. **Publish** again to apply the channel changes.",
  "",
  "---",
  "",
  "## Install the agent",
  "- **For yourself (fastest):** select **Open the agent in Teams** / **See agent in Teams** to install it in Teams; **pin** it for easy access.",
  "- **In Microsoft 365 Copilot:** open Microsoft 365 Copilot chat → **Get Agents** → search **Ask Me Anything Agent** → **Add**.",
  "- **Org-wide (optional):** on the Publish page, select **Make the agent available to others** → **Submit for admin approval**; an admin approves it in **Teams Admin Center → Manage apps**.",
  "",
  "---",
  "",
  "## Run the joint test matrix",
  "Run every row in **both channels** (Microsoft Teams **and** Microsoft 365 Copilot), signed in as a normal end user.",
  "",
  "| # | Area | Sample prompt | Pass criteria |",
  "|---|------|---------------|---------------|",
  "| 1 | Routing (KB) | \"Top 5 reason to select Copilot Studio?\" | handled by the **primary** agent; answer comes from the **Microsoft Website**  |",
  "| 2 | Routing (ticket) | \"What's the status of my ticket INC0010053?\" | Routes to the IT agent; **JumpStart - Get SNOW Incident Status and Description by Number** is called; status + description returned |",
  "| 3 | Routing (negative) | \"Customer insights for My Big Bet Account\" | Handled by the **primary** agent — **not** routed to the IT agent |",
  "",
  "**For each run, log:** the channel, whether routing was correct, the identity the ticket call resolved to, whether a citation appeared, and how links/cards rendered.",
].join('\n')

const publishWorkflowVietnamese = [
  "## Phát hành phiên bản mới nhất",
  "1. Mở **Ask Me Anything Agent** và chuyển đến tab **Build**.",
  "2. Chọn **mũi tên chữ V bên cạnh Publish** (lần phát hành đầu tiên) hoặc **Publish** ở góc trên bên phải (khi cập nhật).",
  "3. Trong hộp thoại **Publish agent**, xem lại thông tin chi tiết — bảo đảm name, description và instructions đã đầy đủ.",
  "4. Chọn **Publish** và xác nhận; chờ quá trình hoàn tất.",
  "5. Nếu bạn đã thay đổi **Ask IT Anything Agent v2 -MJ**, hãy **phát hành lại Agent đó** — Connected Agent phải ở phiên bản được phát hành mới nhất.",
  "",
  "> Việc phát hành áp dụng cho mọi kênh. Nội dung mới nhất có hiệu lực với người dùng khi một **phiên mới** bắt đầu (nhập **start over** để buộc tải phiên bản mới; nếu không, quá trình này có thể mất đến một giờ).",
  "",
  "---",
  "",
  "## Thêm các kênh Microsoft 365 Copilot và Teams",
  "1. Trong hộp thoại **Publish** (hoặc menu **Channels** ở phía trên), chọn **Teams + Microsoft 365 Copilot**.",
  "2. Trong bảng cấu hình, bên dưới **Turn on Microsoft 365**, chọn **Make agent available in Microsoft 365 Copilot chat** — thao tác này bật cả **Teams** và **Microsoft 365 Copilot**.",
  "3. Thiết lập **Availability options** (ban đầu chỉ cung cấp cho chính bạn để kiểm thử).",
  "4. **Publish** lại để áp dụng các thay đổi về kênh.",
  "",
  "---",
  "",
  "## Cài đặt Agent",
  "- **Cho chính bạn (nhanh nhất):** chọn **Open the agent in Teams** / **See agent in Teams** để cài đặt Agent trong Teams; **pin** Agent để truy cập thuận tiện.",
  "- **Trong Microsoft 365 Copilot:** mở Microsoft 365 Copilot chat → **Get Agents** → tìm kiếm **Ask Me Anything Agent** → **Add**.",
  "- **Trong toàn tổ chức (không bắt buộc):** trên trang Publish, chọn **Make the agent available to others** → **Submit for admin approval**; quản trị viên phê duyệt Agent trong **Teams Admin Center → Manage apps**.",
  "",
  "---",
  "",
  "## Chạy ma trận kiểm thử kết hợp",
  "Thực hiện mọi hàng trong **cả hai kênh** (Microsoft Teams **và** Microsoft 365 Copilot) khi đăng nhập bằng tài khoản người dùng cuối thông thường.",
  "",
  "| # | Khu vực | Prompt mẫu | Tiêu chí đạt |",
  "|---|------|---------------|---------------|",
  "| 1 | Định tuyến (KB) | \"Top 5 reason to select Copilot Studio?\" | Do **Agent chính** xử lý; câu trả lời đến từ **Microsoft Website** |",
  "| 2 | Định tuyến (ticket) | \"What's the status of my ticket INC0010053?\" | Định tuyến đến IT Agent; **JumpStart - Get SNOW Incident Status and Description by Number** được gọi; trả về status + description |",
  "| 3 | Định tuyến (trường hợp phủ định) | \"Customer insights for My Big Bet Account\" | Do **Agent chính** xử lý — **không** định tuyến đến IT Agent |",
  "",
  "**Với mỗi lượt chạy, hãy ghi lại:** kênh, định tuyến có chính xác hay không, danh tính người dùng mà lệnh gọi ticket thực tế sử dụng, trích dẫn có xuất hiện hay không và cách liên kết/card được hiển thị.",
].join('\n')

const publishNotesEnglish = [
  "## Notes & gotchas",
  "- **Republish after every change** — and republish the connected IT agent too; unpublished changes don't reach users.",
  "- **Latest content timing:** start a new session or type **start over**; otherwise propagation can take ~1 hour.",
  "- **Rendering differs by channel:** adaptive cards and markdown are only partially supported in Teams/M365 Copilot vs. the web demo — always test both surfaces (rows #5, #7).",
  "- **Don't go org-wide early:** keep availability limited to yourself until the full matrix passes in both channels.",
].join('\n')

const publishNotesVietnamese = [
  "## Lưu ý và điểm cần chú ý",
  "- **Phát hành lại sau mỗi thay đổi** — đồng thời phát hành lại IT Agent đã kết nối; các thay đổi chưa được phát hành sẽ không đến được người dùng.",
  "- **Thời điểm nội dung mới nhất có hiệu lực:** bắt đầu một phiên mới hoặc nhập **start over**; nếu không, quá trình truyền cập nhật có thể mất khoảng 1 giờ.",
  "- **Cách hiển thị khác nhau theo kênh:** adaptive cards và markdown chỉ được hỗ trợ một phần trong Teams/M365 Copilot so với bản web demo — luôn kiểm thử cả hai bề mặt (hàng #5, #7).",
  "- **Không triển khai toàn tổ chức quá sớm:** chỉ cung cấp Agent cho chính bạn cho đến khi toàn bộ ma trận đạt yêu cầu trên cả hai kênh.",
].join('\n')

export const lab04Vietnamese: Readonly<Record<string, string>> = {
  "Connect an Ask IT Anything agent": "Kết nối Ask IT Anything Agent",
  "Build a ServiceNow-backed specialist, connect it as an agent, and publish the multi-agent experience.": "Xây dựng một Agent chuyên trách dựa trên ServiceNow, kết nối Agent này vào hệ thống và phát hành trải nghiệm đa Agent.",
  "A routed multi-agent solution available for joint testing in Microsoft 365 Copilot and Teams.": "Một giải pháp đa Agent có định tuyến, sẵn sàng cho việc kiểm thử kết hợp trong Microsoft 365 Copilot và Teams.",
  "Connect ServiceNow knowledge and ticket status actions.": "Kết nối ServiceNow Knowledge và các action tra cứu trạng thái ticket.",
  "Delegate IT requests to a connected specialist agent.": "Ủy quyền các yêu cầu IT cho một Agent chuyên trách đã kết nối.",
  "Publish and verify behavior across M365 and Teams.": "Phát hành và xác minh hành vi trên M365 và Teams.",
  "Complete Labs 1-3 and obtain an approved ServiceNow connection with sample incidents.": "Hoàn thành các bài thực hành 1-3 và có một kết nối ServiceNow đã được phê duyệt kèm các incident mẫu.",
  "Create the IT Specialist Agent": "Tạo IT Specialist Agent",
  "Create a separate agent named **Ask IT Anything**. Add the instructions below and a clear description that helps orchestration recognize IT support, device, access, software, and incident-status intents.": "Tạo một Agent riêng có tên **Ask IT Anything**. Thêm các hướng dẫn bên dưới và một mô tả rõ ràng để giúp orchestration nhận diện các ý định liên quan đến hỗ trợ IT, thiết bị, quyền truy cập, phần mềm và trạng thái incident.",
  [createAgentEnglish]: createAgentVietnamese,
  [beforeCreateEnglish]: beforeCreateVietnamese,
  "URL to open in the new tab": "URL cần mở trong tab mới",
  "Agent name": "Tên Agent",
  "Agent instruction": "Hướng dẫn cho Agent",
  "Connect to ServiceNow": "Kết nối với ServiceNow",
  "Add ServiceNow Knowledge": "Thêm ServiceNow Knowledge",
  "ServiceNow Knowledge (IT Helpdesk Q&A) as Knowledge using **Copilot Connection** as **Tool**": "Thêm ServiceNow Knowledge (Q&A của IT Helpdesk) dưới dạng Knowledge bằng **Copilot Connection** dưới dạng **Tool**",
  [serviceNowKnowledgeEnglish]: serviceNowKnowledgeVietnamese,
  "ServiceNow Knowledge Connection Name": "Tên kết nối ServiceNow Knowledge",
  "Test Prompt": "Prompt kiểm thử",
  "Query ServiceNow Incident": "Truy vấn ServiceNow Incident",
  "ServiceNow Incident (Ticket Status Query) as a **Tool**": "ServiceNow Incident (truy vấn trạng thái ticket) dưới dạng một **Tool**",
  [incidentWorkflowEnglish]: incidentWorkflowVietnamese,
  "Workflow Name": "Tên Workflow",
  "Tool Description": "Mô tả Tool",
  "Tool's Input Description": "Mô tả đầu vào của Tool",
  "Notes & gotchas": "Lưu ý và điểm cần chú ý",
  [incidentNotesEnglish]: incidentNotesVietnamese,
  "Connect to Ask Me Anything Agent": "Kết nối với Ask Me Anything Agent",
  "Return to Ask Me Anything, add Ask IT Anything as a connected agent, and describe its delegation boundary. Test a Microsoft product question, an IT knowledge question, and a ticket-status question.": "Quay lại Ask Me Anything, thêm Ask IT Anything dưới dạng Connected Agent và mô tả ranh giới ủy quyền của Agent này. Kiểm thử một câu hỏi về sản phẩm Microsoft, một câu hỏi về Knowledge IT và một câu hỏi về trạng thái ticket.",
  [connectAgentEnglish]: connectAgentVietnamese,
  [connectedAgentNotesEnglish]: connectedAgentNotesVietnamese,
  "Connected Agent Description": "Mô tả Connected Agent",
  "Publish to M365 and Teams": "Phát hành lên M365 và Teams",
  [publishPrerequisitesEnglish]: publishPrerequisitesVietnamese,
  [publishWorkflowEnglish]: publishWorkflowVietnamese,
  [publishNotesEnglish]: publishNotesVietnamese,
  "Test Prompt 1": "Prompt kiểm thử 1",
  "Test Prompt 2": "Prompt kiểm thử 2",
  "Test Prompt 3": "Prompt kiểm thử 3",
  "Create the IT specialist": "Tạo Agent chuyên trách IT",
  "Create a separate agent named Ask IT Anything. Add the instructions below and a clear description that helps orchestration recognize IT support, device, access, software, and incident-status intents.": "Tạo một Agent riêng có tên Ask IT Anything. Thêm các hướng dẫn bên dưới và một mô tả rõ ràng để giúp orchestration nhận diện các ý định liên quan đến hỗ trợ IT, thiết bị, quyền truy cập, phần mềm và trạng thái incident.",
  "Add the ServiceNow connection": "Thêm kết nối ServiceNow",
  "In Tools, add the ServiceNow connection. Enable knowledge search and read-only incident lookup actions first, then test with a known incident owned by the signed-in user.": "Trong Tools, thêm kết nối ServiceNow. Trước tiên, bật các action tìm kiếm Knowledge và tra cứu incident chỉ đọc, sau đó kiểm thử bằng một incident đã biết thuộc về người dùng đang đăng nhập.",
  "Keep write actions out of scope until you have explicit confirmation, audit, and rollback requirements.": "Không đưa các action ghi dữ liệu vào phạm vi cho đến khi bạn có yêu cầu rõ ràng về xác nhận, kiểm toán và rollback.",
  "Connect the specialist to Ask Me Anything": "Kết nối Agent chuyên trách với Ask Me Anything",
  "Publish the latest version, add Microsoft 365 Copilot and Teams channels, install the agent, then run a joint test matrix for routing, identity, citations, ticket privacy, and file or link rendering.": "Phát hành phiên bản mới nhất, thêm các kênh Microsoft 365 Copilot và Teams, cài đặt Agent, sau đó chạy ma trận kiểm thử kết hợp cho định tuyến, danh tính, trích dẫn, quyền riêng tư của ticket và cách hiển thị tệp hoặc liên kết.",
}