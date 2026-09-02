const triggerStepLiveEnglish = [
  "## Open the Workflow designer",
  "1. In the **Copilot Studio Agent Maker experience**, go to the left sidebar panel.",
  "2. Select **Workflows** → **+ New workflow** (or **Add workflow**).",
  "3. Name it **Automate Everything Email Workflow v2 - <Your Alias>** and keep it in **Draft** while you build.",
  "",
  "## Add the email trigger",
  "1. On the canvas, select **Add a trigger**.",
  "2. Choose **When a new email arrives** (Microsoft 365 Outlook).",
  "3. Sign in and pick the **connection** for the dedicated training mailbox.",
  "4. In advanced options set **Folder** to *Inbox*, **Include attachments** as needed, and add a filter so automated loops and already-processed mail are ignored.",
].join('\n')

const triggerStepLiveVietnamese = [
  "## Mở trình thiết kế Workflow",
  "1. Trong **Copilot Studio Agent Maker experience**, chuyển đến bảng điều khiển ở thanh bên trái.",
  "2. Chọn **Workflows** → **+ New workflow** (hoặc **Add workflow**).",
  "3. Đặt tên là **Automate Everything Email Workflow v2 - <Your Alias>** và giữ Workflow ở trạng thái **Draft** trong khi xây dựng.",
  "",
  "## Thêm trigger email",
  "1. Trên canvas, chọn **Add a trigger**.",
  "2. Chọn **When a new email arrives** (Microsoft 365 Outlook).",
  "3. Đăng nhập và chọn **connection** cho hộp thư đào tạo chuyên dụng.",
  "4. Trong các tùy chọn nâng cao, đặt **Folder** thành *Inbox*, thiết lập **Include attachments** theo nhu cầu và thêm bộ lọc để bỏ qua các vòng lặp tự động cùng email đã được xử lý.",
].join('\n')

const triggerStepBundledEnglish = [
  "## Open the Workflow designer",
  "1. In the **Copilot Studio Agent Maker experience**, open your agent and go to the **Build** area.",
  "2. Select **Workflows** → **+ New workflow** (or **Add workflow**).",
  "3. Name it **Automate Everything Email Workflow** and keep it in **Draft** while you build.",
  "",
  "## Add the email trigger",
  "1. On the canvas, select **Add a trigger**.",
  "2. Choose **When a new email arrives** (Microsoft 365 Outlook).",
  "3. Sign in and pick the **connection** for the dedicated training mailbox.",
  "4. In advanced options set **Folder** to *Inbox*, **Include attachments** as needed, and add a filter so automated loops and already-processed mail are ignored.",
].join('\n')

const triggerStepBundledVietnamese = [
  "## Mở trình thiết kế Workflow",
  "1. Trong **Copilot Studio Agent Maker experience**, mở Agent của bạn và chuyển đến khu vực **Build**.",
  "2. Chọn **Workflows** → **+ New workflow** (hoặc **Add workflow**).",
  "3. Đặt tên là **Automate Everything Email Workflow** và giữ Workflow ở trạng thái **Draft** trong khi xây dựng.",
  "",
  "## Thêm trigger email",
  "1. Trên canvas, chọn **Add a trigger**.",
  "2. Chọn **When a new email arrives** (Microsoft 365 Outlook).",
  "3. Đăng nhập và chọn **connection** cho hộp thư đào tạo chuyên dụng.",
  "4. Trong các tùy chọn nâng cao, đặt **Folder** thành *Inbox*, thiết lập **Include attachments** theo nhu cầu và thêm bộ lọc để bỏ qua các vòng lặp tự động cùng email đã được xử lý.",
].join('\n')

const classifyStepLiveEnglish = [
  "## Add the Classify action",
  "1. Below the trigger, select **+** → **Classify**.",
  "2. For the **Input**, pass the email **Subject** and **Body** (plain text) from the trigger.",
  "3. Define the routing **categories** (these become the branches you see on the canvas):",
  "   - **IT Service** — IT help, access, device, ticket, or ServiceNow-style requests.",
  "   - **MSFT Copilot Studio Product** — questions about Microsoft Power Platform or Copilot Studio product features and capabilities.",
  "   - **Other** — anything that does not match the two above.",
  "4. Give each category a one-line description so the model routes reliably.",
  "5. **Save**. The Classify node now shows one branch per category.",
].join('\n')

const classifyStepLiveVietnamese = [
  "## Thêm action Classify",
  "1. Bên dưới trigger, chọn **+** → **Classify**.",
  "2. Đối với **Input**, truyền **Subject** và **Body** (plain text) của email từ trigger.",
  "3. Xác định các **categories** định tuyến (chúng sẽ trở thành các nhánh bạn thấy trên canvas):",
  "   - **IT Service** — các yêu cầu về hỗ trợ IT, quyền truy cập, thiết bị, ticket hoặc theo kiểu ServiceNow.",
  "   - **MSFT Copilot Studio Product** — các câu hỏi về tính năng và khả năng của sản phẩm Microsoft Power Platform hoặc Copilot Studio.",
  "   - **Other** — mọi nội dung không khớp với hai category trên.",
  "4. Cung cấp mô tả một dòng cho từng category để mô hình định tuyến chính xác và ổn định.",
  "5. Chọn **Save**. Node Classify giờ đây hiển thị một nhánh cho mỗi category.",
].join('\n')

const classifyStepBundledEnglish = [
  "## Add the Classify action",
  "1. Below the trigger, select **+** → **Classify**.",
  "2. For the **Input**, pass the email **Subject** and **Body** (plain text) from the trigger.",
  "3. Define the routing **categories** (these become the branches you see on the canvas):",
  "   - **IT Service** — IT help, access, device, ticket, or ServiceNow-style requests.",
  "   - **MSFT Copilot** — questions about Microsoft Copilot / Copilot Studio product features.",
  "   - **Other** — anything that does not match the two above.",
  "4. Give each category a one-line description so the model routes reliably.",
  "5. **Save**. The Classify node now shows one branch per category.",
].join('\n')

const classifyStepBundledVietnamese = [
  "## Thêm action Classify",
  "1. Bên dưới trigger, chọn **+** → **Classify**.",
  "2. Đối với **Input**, truyền **Subject** và **Body** (plain text) của email từ trigger.",
  "3. Xác định các **categories** định tuyến (chúng sẽ trở thành các nhánh bạn thấy trên canvas):",
  "   - **IT Service** — các yêu cầu về hỗ trợ IT, quyền truy cập, thiết bị, ticket hoặc theo kiểu ServiceNow.",
  "   - **MSFT Copilot** — các câu hỏi về tính năng của sản phẩm Microsoft Copilot / Copilot Studio.",
  "   - **Other** — mọi nội dung không khớp với hai category trên.",
  "4. Cung cấp mô tả một dòng cho từng category để mô hình định tuyến chính xác và ổn định.",
  "5. Chọn **Save**. Node Classify giờ đây hiển thị một nhánh cho mỗi category.",
].join('\n')

const routeStepLiveEnglish = [
  "## Add an Agent node on each branch",
  "1. On the **IT Service** branch, select **+** → **Agent**, then choose **Ask IT Anything Agent v2**.",
  "   - Pass the email **body** (and subject) as the agent question / input.",
  "   - Capture the agent's response as `text response`.",
  "2. On the **MSFT Copilot Studio Product** branch, select **+** → **Agent**, then choose **Ask Me Anything Agent v2**.",
  "   - Pass the email body as the question and capture the response as `text response`.",
  "3. Leave the **Other** branch to **Human review** (or a no-op) so unmatched mail is never auto-answered.",
].join('\n')

const routeStepLiveVietnamese = [
  "## Thêm node Agent trên mỗi nhánh",
  "1. Trên nhánh **IT Service**, chọn **+** → **Agent**, sau đó chọn **Ask IT Anything Agent v2**.",
  "   - Truyền **body** của email (và subject) làm câu hỏi / input cho Agent.",
  "   - Ghi phản hồi của Agent dưới dạng `text response`.",
  "2. Trên nhánh **MSFT Copilot Studio Product**, chọn **+** → **Agent**, sau đó chọn **Ask Me Anything Agent v2**.",
  "   - Truyền body của email làm câu hỏi và ghi phản hồi dưới dạng `text response`.",
  "3. Để nhánh **Other** chuyển đến **Human review** (hoặc no-op) nhằm bảo đảm email không khớp sẽ không bao giờ được tự động trả lời.",
].join('\n')

const routeStepBundledEnglish = [
  "## Add an Agent node on each branch",
  "1. On the **IT Service** branch, select **+** → **Agent**, then choose **Ask IT Anything Agent v2**.",
  "   - Pass the email **body** (and subject) as the agent question / input.",
  "   - Capture the agent's response into a variable, for example `itReply`.",
  "2. On the **MSFT Copilot** branch, select **+** → **Agent**, then choose **Ask Anything Agent v2**.",
  "   - Pass the email body as the question and capture the response as `copilotReply`.",
  "3. Leave the **Other** branch to **Human review** (or a no-op) so unmatched mail is never auto-answered.",
].join('\n')

const routeStepBundledVietnamese = [
  "## Thêm node Agent trên mỗi nhánh",
  "1. Trên nhánh **IT Service**, chọn **+** → **Agent**, sau đó chọn **Ask IT Anything Agent v2**.",
  "   - Truyền **body** của email (và subject) làm câu hỏi / input cho Agent.",
  "   - Ghi phản hồi của Agent vào một variable, ví dụ `itReply`.",
  "2. Trên nhánh **MSFT Copilot**, chọn **+** → **Agent**, sau đó chọn **Ask Anything Agent v2**.",
  "   - Truyền body của email làm câu hỏi và ghi phản hồi dưới dạng `copilotReply`.",
  "3. Để nhánh **Other** chuyển đến **Human review** (hoặc no-op) nhằm bảo đảm email không khớp sẽ không bao giờ được tự động trả lời.",
].join('\n')

const replyStepEnglish = [
  "## Reply personally from each branch",
  "1. Under the **Ask IT Anything Agent v2** node, add **Connector** → **Send an email (V2)** (Outlook).",
  "   - **To**: the original sender (`From` from the trigger).",
  "   - **Subject**: `Reply by Ask IT Anything Agent — {original subject}`.",
  "   - **Body**: the `itReply` variable, sent as **HTML** so headings and tables render.",
  "2. Under the **Ask Anything Agent v2** node, add a second **Send an email** action (**Send an email 2**).",
  "   - **Subject**: `Reply by Ask Me Anything Agent — {original subject}`.",
  "   - **Body**: the `copilotReply` variable as HTML.",
  "3. Personalize the greeting with the sender's name and keep the agent's grounded, markdown-rich answer intact.",
].join('\n')

const replyStepVietnamese = [
  "## Gửi phản hồi được cá nhân hóa từ từng nhánh",
  "1. Bên dưới node **Ask IT Anything Agent v2**, thêm **Connector** → **Send an email (V2)** (Outlook).",
  "   - **To**: người gửi ban đầu (`From` từ trigger).",
  "   - **Subject**: `Reply by Ask IT Anything Agent — {original subject}`.",
  "   - **Body**: variable `itReply`, được gửi dưới dạng **HTML** để hiển thị đúng các tiêu đề và bảng.",
  "2. Bên dưới node **Ask Anything Agent v2**, thêm action **Send an email** thứ hai (**Send an email 2**).",
  "   - **Subject**: `Reply by Ask Me Anything Agent — {original subject}`.",
  "   - **Body**: variable `copilotReply` dưới dạng HTML.",
  "3. Cá nhân hóa lời chào bằng tên người gửi và giữ nguyên câu trả lời giàu nội dung markdown, có grounding của Agent.",
].join('\n')

const testStepLiveEnglish = [
  "## Test the end-to-end flow",
  "1. **Save** the workflow.",
  "2. Send a test email to the training mailbox for each category:",
  "   - **IT Service** — *\"What's the status of my ticket INC0010053?\"* → handled by **Ask IT Anything Agent v2**.",
  "   - **MSFT Copilot** — *\"What's new with real-time voice agents in Copilot Studio?\"* → handled by **Ask Anything Agent v2**.",
  "3. Open **Activity / Monitor** to confirm the run classified correctly and routed to the right agent.",
  "4. Confirm each sender received a **personalized reply**.",
  "5. **Publish** the workflow when the test matrix passes.",
].join('\n')

const testStepLiveVietnamese = [
  "## Kiểm thử flow end-to-end",
  "1. Chọn **Save** cho Workflow.",
  "2. Gửi một email kiểm thử đến hộp thư đào tạo cho từng category:",
  "   - **IT Service** — *\"Trạng thái ticket INC0010053 của tôi hiện thế nào?\"* → do **Ask IT Anything Agent v2** xử lý.",
  "   - **MSFT Copilot** — *\"Có gì mới về real-time voice Agent trong Copilot Studio?\"* → do **Ask Anything Agent v2** xử lý.",
  "3. Mở **Activity / Monitor** để xác nhận run đã phân loại chính xác và định tuyến đến đúng Agent.",
  "4. Xác nhận mỗi người gửi đã nhận được một **phản hồi được cá nhân hóa**.",
  "5. Chọn **Publish** cho Workflow khi test matrix đạt yêu cầu.",
].join('\n')

const testStepBundledEnglish = [
  "## Test the end-to-end flow",
  "1. **Save** the workflow.",
  "2. Send a test email to the training mailbox for each category:",
  "   - **IT Service** — *\"What's the status of my ticket INC0010053?\"* → handled by **Ask IT Anything Agent v2**.",
  "   - **MSFT Copilot** — *\"What's new with real-time voice agents in Copilot Studio?\"* → handled by **Ask Anything Agent v2**.",
  "   - **Other** — a generic message → goes to **Human review**.",
  "3. Open **Activity / Monitor** to confirm the run classified correctly and routed to the right agent.",
  "4. Confirm each sender received a **personalized reply**.",
  "5. **Publish** the workflow when the test matrix passes.",
].join('\n')

const testStepBundledVietnamese = [
  "## Kiểm thử flow end-to-end",
  "1. Chọn **Save** cho Workflow.",
  "2. Gửi một email kiểm thử đến hộp thư đào tạo cho từng category:",
  "   - **IT Service** — *\"Trạng thái ticket INC0010053 của tôi hiện thế nào?\"* → do **Ask IT Anything Agent v2** xử lý.",
  "   - **MSFT Copilot** — *\"Có gì mới về real-time voice Agent trong Copilot Studio?\"* → do **Ask Anything Agent v2** xử lý.",
  "   - **Other** — một thông điệp chung → chuyển đến **Human review**.",
  "3. Mở **Activity / Monitor** để xác nhận run đã phân loại chính xác và định tuyến đến đúng Agent.",
  "4. Xác nhận mỗi người gửi đã nhận được một **phản hồi được cá nhân hóa**.",
  "5. Chọn **Publish** cho Workflow khi test matrix đạt yêu cầu.",
].join('\n')

export const lab05Vietnamese: Readonly<Record<string, string>> = {
  "Automate email with agent Workflow": "Tự động hóa email bằng Agent Workflow",
  "Automate email with a multi-agent Workflow": "Tự động hóa email bằng Workflow đa Agent",
  "Use the new Workflow in the Copilot Studio Agent Maker experience to classify inbound email and route it to specialist agents that draft personalized replies.": "Sử dụng Workflow mới trong Copilot Studio Agent Maker experience để phân loại email đến và định tuyến đến các Agent chuyên trách nhằm soạn phản hồi được cá nhân hóa.",
  "An email-triggered workflow that classifies intent, routes to Ask IT Anything Agent v2 or Ask Anything Agent v2, and sends a personalized reply.": "Một Workflow được kích hoạt bằng email, phân loại ý định, định tuyến đến Ask IT Anything Agent v2 hoặc Ask Anything Agent v2 và gửi phản hồi được cá nhân hóa.",
  "Create an email-triggered workflow in the new Agent Maker experience.": "Tạo một Workflow được kích hoạt bằng email trong Agent Maker experience mới.",
  "Classify email intent into IT Service, MSFT Copilot, and Other.": "Phân loại ý định của email thành IT Service, MSFT Copilot và Other.",
  "Route to specialist agents and send a personalized reply.": "Định tuyến đến các Agent chuyên trách và gửi phản hồi được cá nhân hóa.",
  "A dedicated training user mailbox, the Ask IT Anything Agent v2 and Ask Anything Agent v2 agents available, and permission to create workflows and Outlook connections.": "Một hộp thư người dùng đào tạo chuyên dụng, các Agent Ask IT Anything Agent v2 và Ask Anything Agent v2 đang khả dụng, cùng quyền tạo Workflow và connection Outlook.",
  "A dedicated training mailbox, the Ask IT Anything Agent v2 and Ask Anything Agent v2 agents available, and permission to create workflows and Outlook connections.": "Một hộp thư đào tạo chuyên dụng, các Agent Ask IT Anything Agent v2 và Ask Anything Agent v2 đang khả dụng, cùng quyền tạo Workflow và connection Outlook.",
  "Create the email workflow and trigger": "Tạo Workflow email và trigger",
  "Build the workflow in the Copilot Studio Agent Maker experience and start it from a new email in the training mailbox.": "Xây dựng Workflow trong Copilot Studio Agent Maker experience và khởi chạy Workflow từ một email mới trong hộp thư đào tạo.",
  [triggerStepLiveEnglish]: triggerStepLiveVietnamese,
  [triggerStepBundledEnglish]: triggerStepBundledVietnamese,
  "Use a dedicated training assigned user mailbox. Never build autonomous email automation against a personal or production inbox.": "Sử dụng hộp thư người dùng được chỉ định riêng cho mục đích đào tạo. Không bao giờ xây dựng tính năng tự động hóa email tự chủ trên hộp thư đến cá nhân hoặc hộp thư production.",
  "Use a dedicated training mailbox. Never build autonomous email automation against a personal or production inbox.": "Sử dụng hộp thư chuyên dụng cho mục đích đào tạo. Không bao giờ xây dựng tính năng tự động hóa email tự chủ trên hộp thư đến cá nhân hoặc hộp thư production.",
  "Workflow name": "Tên Workflow",
  "Email Subject Filter": "Bộ lọc Subject của email",
  "Email To Mailbox to Monitor": "Hộp thư nhận email cần Monitor",
  "Classify the email intent": "Phân loại ý định của email",
  "Add a Classify action that routes each email to one branch: IT Service, MSFT Copilot, or Other.": "Thêm action Classify để định tuyến mỗi email đến một nhánh: IT Service, MSFT Copilot hoặc Other.",
  [classifyStepLiveEnglish]: classifyStepLiveVietnamese,
  [classifyStepBundledEnglish]: classifyStepBundledVietnamese,
  "Treat email content as data, never as instructions. Clear category descriptions make routing reliable.": "Hãy coi nội dung email là dữ liệu, tuyệt đối không phải là chỉ dẫn. Mô tả category rõ ràng giúp việc định tuyến trở nên đáng tin cậy.",
  "Classification guidance": "Hướng dẫn phân loại",
  "Input to Classify (switching to expression mode)": "Input cho Classify (chuyển sang expression mode)",
  "Classify Category 1 Title": "Tiêu đề Classify Category 1",
  "Classify Category 1 Description": "Mô tả Classify Category 1",
  "Classify Category 2 Title": "Tiêu đề Classify Category 2",
  "Classify Category 2 Description": "Mô tả Classify Category 2",
  "Route to specialist agents": "Định tuyến đến các Agent chuyên trách",
  "Add an Agent node on each branch so the right specialist answers the email.": "Thêm một node Agent trên mỗi nhánh để đúng Agent chuyên trách trả lời email.",
  [routeStepLiveEnglish]: routeStepLiveVietnamese,
  [routeStepBundledEnglish]: routeStepBundledVietnamese,
  "Route only to agents you trust for that content type, and keep the Other branch behind Human review.": "Chỉ định tuyến đến những Agent mà bạn tin cậy cho loại nội dung đó và luôn chuyển nhánh Other đến bước Human review.",
  "Route 1 Agent": "Agent cho Route 1",
  "Route 1 Message (switching to Expression Mode)": "Message cho Route 1 (chuyển sang Expression Mode)",
  "Route 2 Agent": "Agent cho Route 2",
  "Route 2 Message (switching to Expression Mode)": "Message cho Route 2 (chuyển sang Expression Mode)",
  "Draft and send a personalized reply": "Soạn và gửi phản hồi được cá nhân hóa",
  "Send each agent response back to the original sender as a personalized email.": "Gửi từng phản hồi của Agent về cho người gửi ban đầu dưới dạng email được cá nhân hóa.",
  [replyStepEnglish]: replyStepVietnamese,
  "Send the agent response as HTML so headings, tables, and lists render in Outlook.": "Gửi phản hồi của Agent dưới dạng HTML để các tiêu đề, bảng và danh sách hiển thị đúng trong Outlook.",
  "Sample personalized reply (Ask Me Anything Agent)": "Phản hồi được cá nhân hóa mẫu (Ask Me Anything Agent)",
  "Send Email's To (switching to expression mode)": "Trường To của Send Email (chuyển sang expression mode)",
  "Send Email's Subject": "Subject của Send Email",
  "Send Email 2's To (switching to expression mode)": "Trường To của Send Email 2 (chuyển sang expression mode)",
  "Send Email 2's Subject": "Subject của Send Email 2",
  "Test, monitor, and publish": "Kiểm thử, Monitor và Publish",
  "Validate routing for every category, review the runs, and publish when the matrix passes.": "Xác thực việc định tuyến cho mọi category, rà soát các run và Publish khi test matrix đạt yêu cầu.",
  [testStepLiveEnglish]: testStepLiveVietnamese,
  [testStepBundledEnglish]: testStepBundledVietnamese,
  "Review every run in Monitor before enabling unattended sending. Add Human review for low-confidence or sensitive email.": "Rà soát mọi run trong Monitor trước khi bật tính năng gửi không giám sát. Thêm Human review cho email có độ tin cậy thấp hoặc chứa nội dung nhạy cảm.",
  "Sample Test Email Subject": "Subject của email kiểm thử mẫu",
  "Sample Test Email Content": "Nội dung email kiểm thử mẫu",
  "Sample Test Email 2 Subject": "Subject của email kiểm thử mẫu 2",
  "Sample Test Email 2 Content": "Nội dung email kiểm thử mẫu 2",
}