const connectDocumentToolsEnglish = [
  "1. On the **Build** tab, in the components panel, select **Tools**.",
  "2. In the **Add a tool** dialog, select **Model Context Protocol**.",
  "3. Search for **Copilot**, **Word**, **User** and **OneDrive**, and add these MCP servers respectively:",
  "   - **Copilot MCP** — this connects the agent to your organization's emails, chats, files, and activity.",
  "   - **User MCP** — this connects the agent to Microsoft 365 User operations.",
  "   - **Word MCP** — creates/reads Word documents (for the draft proposal / Word output).",
  "   - **OneDrive MCP** — retrieve source files and store outputs.",
  "4. For each tool, when prompted for a connection, select **Create new connection** and **authenticate with the same account** the end user will run as. *(If you authenticate as an admin but demo as another user, the tools silently resolve to the wrong mailbox/files.)*",
  "5. Select **Add and configure**. Confirm each tool shows **Enabled: On**.",
].join('\n')

const connectDocumentToolsVietnamese = [
  "1. Trên tab **Build**, trong bảng thành phần, chọn **Tools**.",
  "2. Trong hộp thoại **Add a tool**, chọn **Model Context Protocol**.",
  "3. Tìm kiếm **Copilot**, **Word**, **User** và **OneDrive**, rồi lần lượt thêm các MCP server sau:",
  "   - **Copilot MCP** — kết nối Agent với email, cuộc trò chuyện, tệp và hoạt động trong tổ chức của bạn.",
  "   - **User MCP** — kết nối Agent với các thao tác Microsoft 365 User.",
  "   - **Word MCP** — tạo/đọc tài liệu Word (cho bản đề xuất nháp / đầu ra Word).",
  "   - **OneDrive MCP** — truy xuất tệp nguồn và lưu trữ đầu ra.",
  "4. Với từng công cụ, khi được nhắc tạo kết nối, chọn **Create new connection** và **xác thực bằng cùng tài khoản** mà người dùng cuối sẽ sử dụng để chạy. *(Nếu bạn xác thực bằng tài khoản quản trị viên nhưng trình diễn bằng một người dùng khác, các công cụ sẽ âm thầm truy cập nhầm hộp thư/tệp.)*",
  "5. Chọn **Add and configure**. Xác nhận mỗi công cụ hiển thị **Enabled: On**.",
].join('\n')

const createSkillEnglish = [
  "1. On the **Build** tab, in the components panel, select **Skills**.",
  "2. In **Add skill**, select **Create from blank**.",
  "3. **Name:** `rfq-response-generator` (lowercase letters, numbers, hyphens only).",
  "4. **Description** (this drives when the orchestrator activates the skill):",
  "   > `Generates comprehensive RFP/RFI responses by processing uploaded Excel questionnaire files and producing technically accurate answers grounded in official Microsoft Copilot Studio and Power Platform documentation. Produces updated Excel files, draft proposals, Word documents, and PowerPoint presentation recommendations.`",
  "5. **Instructions** (paste the Markdown below, then adjust to your house style)。",
  "6. Click \"**Save**\" button to save the agent with this new skill created.",
].join('\n')

const createSkillVietnamese = [
  "1. Trên tab **Build**, trong bảng thành phần, chọn **Skills**.",
  "2. Trong **Add skill**, chọn **Create from blank**.",
  "3. **Name:** `rfq-response-generator` (chỉ dùng chữ thường, chữ số và dấu gạch nối).",
  "4. **Description** (phần này quyết định thời điểm orchestrator kích hoạt Skill):",
  "   > `Generates comprehensive RFP/RFI responses by processing uploaded Excel questionnaire files and producing technically accurate answers grounded in official Microsoft Copilot Studio and Power Platform documentation. Produces updated Excel files, draft proposals, Word documents, and PowerPoint presentation recommendations.`",
  "5. **Instructions** (dán Markdown bên dưới, sau đó điều chỉnh cho phù hợp với phong cách của tổ chức bạn).",
  "6. Bấm nút \"**Save**\" để lưu Agent cùng Skill mới vừa tạo.",
].join('\n')

const uploadQuestionnaireEnglish = [
  "1. Open the **Preview** tab.",
  "2. **Upload** the customer's Excel RFQ/RFI questionnaire into the test chat.",
  "3. Enter a prompt such as:",
  "   **`Answer this RFP questionnaire for my customer Microsoft and produce the updated Excel, a draft proposal, a Word response, and a PowerPoint recommendation.`**",
  "4. Watch the agent:",
  "   - Activate **`rfq-response-generator`**,",
  "   - Read the Excel and research each question via the **Microsoft Learn Docs MCP**,",
  "   - Use **Work IQ** for approved internal content,",
  "   - Return the **updated Excel**, **draft proposal**, **Word document**, and **PowerPoint recommendation** as generated files in the chat.",
  "5. Review a few answers for accuracy and confirm cited sources; refine the skill **Instructions** if the format or depth needs adjusting.",
].join('\n')

const uploadQuestionnaireVietnamese = [
  "1. Mở tab **Preview**.",
  "2. **Upload** bảng câu hỏi RFQ/RFI dạng Excel của khách hàng vào cuộc trò chuyện kiểm thử.",
  "3. Nhập một prompt như sau:",
  "   **`Answer this RFP questionnaire for my customer Microsoft and produce the updated Excel, a draft proposal, a Word response, and a PowerPoint recommendation.`**",
  "4. Quan sát Agent:",
  "   - Kích hoạt **`rfq-response-generator`**;",
  "   - Đọc tệp Excel và nghiên cứu từng câu hỏi thông qua **Microsoft Learn Docs MCP**;",
  "   - Dùng **Work IQ** để lấy nội dung nội bộ đã được phê duyệt;",
  "   - Trả về **updated Excel**, **draft proposal**, **Word document** và **PowerPoint recommendation** dưới dạng các tệp được tạo trong cuộc trò chuyện.",
  "5. Rà soát một số câu trả lời để kiểm tra độ chính xác và xác nhận các nguồn được trích dẫn; tinh chỉnh **Instructions** của Skill nếu cần điều chỉnh định dạng hoặc mức độ chi tiết.",
].join('\n')

const reviewAndExportEnglish = [
  "## Notes & gotchas",
  "",
  "- **License gate:** Work IQ MCP servers require a **Microsoft 365 Copilot license**; without it, the tools won't be addable.",
  "- **Preview behavior:** Work IQ MCP and Microsoft IQ are **preview** — occasional test-panel rendering glitches are expected; not for production-critical use yet.",
  "- **Work IQ toggle ≠ inbox/Teams access by itself:** the **Work IQ flag** primarily strengthens search/grounding over your connected knowledge. Deep, action-level access to mail/files/Word comes from the **Work IQ MCP tools** you added in Part 2.",
  "- **Grounding quality:** keep the **Microsoft Learn Docs MCP** tool enabled and referenced in the skill so answers stay tied to official Copilot Studio / Power Platform docs rather than model memory.",
  "- **Connection identity:** authenticate every Work IQ tool as the **end-user demo account**, not an admin, so results resolve to the right person's data.",
].join('\n')

const reviewAndExportVietnamese = [
  "## Lưu ý và điểm cần chú ý",
  "",
  "- **Yêu cầu giấy phép:** các Work IQ MCP server yêu cầu **Microsoft 365 Copilot license**; nếu không có giấy phép này, bạn sẽ không thể thêm các công cụ.",
  "- **Hành vi Preview:** Work IQ MCP và Microsoft IQ đang ở trạng thái **preview** — đôi khi bảng kiểm thử có thể gặp lỗi hiển thị; hiện chưa phù hợp cho các mục đích sử dụng trọng yếu trong môi trường production.",
  "- **Work IQ toggle ≠ tự cung cấp quyền truy cập hộp thư đến/Teams:** **Work IQ flag** chủ yếu tăng cường khả năng tìm kiếm/grounding trên nguồn kiến thức đã kết nối. Quyền truy cập sâu ở cấp thao tác vào mail/files/Word đến từ các **Work IQ MCP tools** bạn đã thêm trong Phần 2.",
  "- **Chất lượng grounding:** duy trì **Microsoft Learn Docs MCP** ở trạng thái bật và được tham chiếu trong Skill để câu trả lời luôn gắn với tài liệu chính thức của Copilot Studio / Power Platform thay vì bộ nhớ của mô hình.",
  "- **Danh tính kết nối:** xác thực mọi công cụ Work IQ bằng **end-user demo account**, không phải tài khoản quản trị viên, để kết quả được truy xuất từ dữ liệu của đúng người.",
].join('\n')

export const lab03Vietnamese: Readonly<Record<string, string>> = {
  "Generate an evidence-based RFP response": "Tạo phản hồi RFP dựa trên bằng chứng",
  "Turn an uploaded RFP workbook into reviewed Excel and Word deliverables using Skills and MCP tools.": "Chuyển workbook RFP đã tải lên thành các sản phẩm bàn giao Excel và Word đã được rà soát bằng Skills và công cụ MCP.",
  "A reusable RFP Generator skill with traceable sources, confidence, and human review gates.": "Một Skill RFP Generator có thể tái sử dụng, với nguồn có thể truy vết, mức độ tin cậy và các điểm kiểm soát rà soát của con người.",
  "Read and preserve an uploaded Excel questionnaire.": "Đọc và giữ nguyên bảng câu hỏi Excel đã tải lên.",
  "Ground answers in product knowledge and Microsoft 365 content.": "Xây dựng câu trả lời dựa trên kiến thức sản phẩm và nội dung Microsoft 365.",
  "Create Excel and Word outputs with review controls.": "Tạo đầu ra Excel và Word với các biện pháp kiểm soát rà soát.",
  "Complete Labs 1-2. Have a facilitator sample RFP workbook and access to Work IQ, Word, and Excel tools.": "Hoàn thành các bài thực hành 1-2. Chuẩn bị workbook RFP mẫu do người hướng dẫn cung cấp và quyền truy cập vào các công cụ Work IQ, Word và Excel.",
  "Confirm you have a Microsoft 365 Copilot license — it's required to add Work IQ MCP servers.": "Xác nhận bạn có giấy phép Microsoft 365 Copilot — giấy phép này là bắt buộc để thêm các Work IQ MCP server.",
  "Confirm Microsoft IQ is available in your environment (ask your admin if you don't see it).": "Xác nhận Microsoft IQ khả dụng trong môi trường của bạn (hãy hỏi quản trị viên nếu bạn không thấy tính năng này).",
  "Connect document tools": "Kết nối các công cụ tài liệu",
  "Add Microsoft 365 MCP (Preview) tools": "Thêm các công cụ Microsoft 365 MCP (Preview)",
  "In Tools, add the approved OneDrive, Copilot, User, Word MCP or connector tools. Review each tool’s permissions and keep user authentication enabled.": "Trong Tools, hãy thêm các công cụ OneDrive, Copilot, User và Word MCP hoặc connector đã được phê duyệt. Xem lại quyền của từng công cụ và duy trì xác thực người dùng ở trạng thái bật.",
  [connectDocumentToolsEnglish]: connectDocumentToolsVietnamese,
  "Query text in the tools search box": "Văn bản truy vấn trong ô tìm kiếm công cụ",
  "Do the same for adding **Copilot Chat** MCP.": "Thực hiện tương tự để thêm **Copilot Chat** MCP.",
  "Do the same for adding **User** MCP.": "Thực hiện tương tự để thêm **User** MCP.",
  "Do the same for adding **Word** MCP.": "Thực hiện tương tự để thêm **Word** MCP.",
  "Create the RFP Generator skill": "Tạo Skill RFP Generator",
  "Create a skill named RFP Response Generator. Add the instructions below and limit the skill to the document tools and trusted knowledge sources required for this job.": "Tạo một Skill có tên RFP Response Generator. Thêm các hướng dẫn bên dưới và chỉ cho phép Skill sử dụng các công cụ tài liệu cùng những nguồn kiến thức đáng tin cậy cần thiết cho công việc này.",
  [createSkillEnglish]: createSkillVietnamese,
  "Skill's name": "Tên Skill",
  "Skill's description": "Mô tả Skill",
  "Skill‘s instruction": "Hướng dẫn của Skill",
  "Upload and map the questionnaire": "Tải lên và ánh xạ bảng câu hỏi",
  "Upload the sample workbook in the test pane. Ask the agent to identify sheets, question IDs, required columns, and unanswered rows before drafting anything.": "Tải workbook mẫu lên trong bảng kiểm thử. Yêu cầu Agent xác định các sheet, ID câu hỏi, cột bắt buộc và hàng chưa được trả lời trước khi soạn thảo bất kỳ nội dung nào.",
  [uploadQuestionnaireEnglish]: uploadQuestionnaireVietnamese,
  "File upload availability varies by channel. Complete authoring tests in Copilot Studio before testing Teams or M365 Copilot.": "Khả năng tải tệp lên khác nhau tùy theo kênh. Hoàn tất kiểm thử biên soạn trong Copilot Studio trước khi kiểm thử trên Teams hoặc M365 Copilot.",
  "Test Prompt": "Prompt kiểm thử",
  "Sample RFP/RFI File Location": "Vị trí tệp RFP/RFI mẫu",
  "Review and export both deliverables": "Rà soát và xuất cả hai sản phẩm bàn giao",
  "Generate a draft copy of the workbook and a Word executive response. Inspect low-confidence rows, source links, formulas, formatting, and unresolved legal or security items before approval.": "Tạo một bản sao nháp của workbook và một phản hồi dành cho lãnh đạo dưới dạng Word. Trước khi phê duyệt, hãy kiểm tra các hàng có mức độ tin cậy thấp, liên kết nguồn, công thức, định dạng và những mục pháp lý hoặc bảo mật chưa được giải quyết.",
  [reviewAndExportEnglish]: reviewAndExportVietnamese,
  "Don't forget to **Save** and **Publish** the Agent at the end of this lab.\u0020\u0020\u0020": "Đừng quên **Save** và **Publish** Agent khi kết thúc bài thực hành này.",
  "In Tools, add the approved Work IQ, Word, and Excel MCP or connector tools. Review each tool’s permissions and keep user authentication enabled.": "Trong Tools, hãy thêm các công cụ Work IQ, Word và Excel MCP hoặc connector đã được phê duyệt. Xem lại quyền của từng công cụ và duy trì xác thực người dùng ở trạng thái bật.",
}