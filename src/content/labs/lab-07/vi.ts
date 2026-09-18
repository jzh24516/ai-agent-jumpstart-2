import type { Lab07LocalePack } from './locales.ts'

export const lab07Vi: Lab07LocalePack = {
  title: 'Xây dựng ứng dụng MRM bằng Copilot Studio Apps (Preview)',
  summary: 'Dùng GitHub Copilot harness trong Copilot Studio Apps (Preview) để tạo ứng dụng Marketing Resource Management hiện đại từ mô tả ngôn ngữ tự nhiên, xem code được tạo, mở rộng và publish ứng dụng.',
  outcome: 'Một ứng dụng được quản lý đã publish có tên Marketing Resource Hub - <Your Alias>, với lập kế hoạch ngân sách, theo dõi chi phí, chiến thuật marketing, quản lý nguồn lực và chuyển đổi theme sáng/tối.',
  objectives: [
    'Mở Copilot Studio Apps (Preview) và tạo ứng dụng mới bằng GitHub Copilot harness.',
    'Tạo ứng dụng Marketing Resource Management từ yêu cầu ngôn ngữ tự nhiên chi tiết và theo dõi tiến độ theo thời gian thực.',
    'So sánh Preview và Code mode, thêm theme sáng/tối, rồi Save và Publish ứng dụng.',
  ],
  prerequisites: [
    'Môi trường Copilot Studio đã bật Apps (Preview) và GitHub Copilot harness cho tài khoản Maker của bạn.',
    'Quyền tạo và publish ứng dụng trong môi trường đó. Việc dùng Preview có thể tiêu tốn Copilot Credits và chịu điều khoản Preview.',
  ],
  stepTitles: {
    'open-apps-preview': 'Mở Copilot Studio Apps (Preview)',
    'describe-mrm-app': 'Mô tả ứng dụng MRM',
    'build-and-explore': 'Theo dõi quá trình build và khám phá Preview và Code',
    'enhance-theme': 'Thêm chuyển đổi theme sáng/tối',
    'save-and-publish': 'Đổi tên, Save và Publish',
  },
  pageTitles: {
    'build-and-explore/watch-generation': 'Xem ứng dụng dần thành hình',
    'build-and-explore/preview-and-code': 'Khám phá Preview và Code',
  },
  paragraphs: {
    'open-apps-preview/main': ['Bắt đầu từ trang Home của Copilot Studio, hoặc dùng URL trực tiếp của Preview khi mục Apps chưa hiển thị trong tenant của bạn.'],
    'describe-mrm-app/main': ['Dùng một prompt tập trung vào kết quả để harness hiểu phạm vi ứng dụng, người dùng mục tiêu và bốn năng lực nghiệp vụ cốt lõi.'],
    'build-and-explore/watch-generation': ['Quan sát GitHub Copilot harness diễn giải yêu cầu và chuyển chúng thành một ứng dụng hiện đại, chạy được.'],
    'build-and-explore/preview-and-code': ['Kiểm tra ứng dụng đã tạo trong Preview, rồi xem Code mode để hiểu cách trải nghiệm đang chạy được sinh ra và cập nhật.'],
    'enhance-theme/main': ['Tiếp tục cùng một cuộc trò chuyện và yêu cầu harness thêm trải nghiệm theme sáng/tối hoàn chỉnh.'],
    'save-and-publish/main': ['Đặt cho ứng dụng một tên workshop duy nhất, Save phần đã tạo và publish phiên bản đã được xác nhận.'],
  },
  markdown: {
    'open-apps-preview/main': `## Mở Copilot Studio Apps (Preview)
1. Mở **Copilot Studio** và xác nhận bạn đang làm việc trong môi trường do người hướng dẫn chỉ định.
2. Trên trang **Home**, tìm và chọn **Apps (Preview)**.
3. Nếu mục Apps không hiển thị, mở Preview trực tiếp trong tab mới: **https://aka.ms/app-studio/preview**
4. Chọn tùy chọn tạo ứng dụng mới được hỗ trợ bởi **GitHub Copilot harness**.
5. Giữ tab trình duyệt này mở cho đến hết lab.

> **Lưu ý Preview:** Trải nghiệm, nhãn và vị trí có thể thay đổi. Nếu giao diện khác hướng dẫn này, hãy chọn tùy chọn tương đương gần nhất.`,
    'describe-mrm-app/main': `## Mô tả ứng dụng Marketing Resource Management
1. Trong ô nhập ngôn ngữ tự nhiên, dán yêu cầu ứng dụng được cung cấp bên dưới.
2. Gửi yêu cầu.
3. Nếu Copilot Studio đặt câu hỏi làm rõ, hãy giữ phiên bản đầu tiên tập trung vào bốn khu vực sau:
   - **Ngân sách và lập kế hoạch** — lập kế hoạch chiến dịch và phân bổ ngân sách marketing.
   - **Theo dõi chi phí** — ghi nhận chi phí dự kiến và chi phí thực tế.
   - **Chiến thuật marketing** — tổ chức chiến dịch, hoạt động, kênh và đầu ra.
   - **Quản lý thời gian và nguồn lực** — phân công người phụ trách, effort, ngày tháng và trạng thái.
4. Xem lại mọi kế hoạch hoặc giả định được đề xuất trước khi chấp thuận build.
5. Bắt đầu build và giữ cuộc trò chuyện mở để có thể tinh chỉnh ứng dụng sau.

Mục tiêu kinh doanh và người dùng mục tiêu càng cụ thể thì kiến trúc thông tin và trải nghiệm được tạo ra càng hữu ích.`,
    'build-and-explore/watch-generation': `## Theo dõi GitHub Copilot harness build ứng dụng
1. Theo dõi thông báo tiến độ khi Copilot Studio diễn giải yêu cầu và tạo ứng dụng.
2. Quan sát cách hệ thống tách kịch bản MRM thành các trang, navigation, components, interactions và data concepts.
3. Dành khoảng **10–15 phút** cho phiên bản hoàn chỉnh đầu tiên. Thời gian build có thể thay đổi.
4. Đừng refresh hoặc đóng trang trong khi quá trình tạo đang chạy.
5. Nếu harness yêu cầu phê duyệt connection, table hoặc resource khác, hãy đọc kỹ yêu cầu trước khi chấp nhận.
6. Khi quá trình tạo hoàn tất, xác nhận rằng một ứng dụng hiện đại đã xuất hiện ở vùng Preview bên phải.

Quá trình tạo mang tính lặp lại. Phiên bản đầu tiên dùng được chỉ là điểm khởi đầu, không phải thiết kế cuối cùng.

## Tự do khám phá ứng dụng được tạo
Khi phiên bản đầu tiên đã sẵn sàng, bạn có thể nhấp vào bất kỳ đâu trong ứng dụng và khám phá như một người dùng cuối:

- Dùng navigation để di chuyển giữa các khu vực làm việc MRM.
- Filter và sort các marketing resource records có sẵn.
- Chọn một record và drill down vào form chi tiết.
- Tạo marketing plan hoặc budget mới và xem lại các field cùng trải nghiệm được tạo.
- Edit các loại marketing resource records khác nhau và xác nhận thay đổi xuất hiện trong app.
- Quay lại các view chính và tiếp tục khám phá các action khác.

Chỉ sử dụng workshop data hoặc sample data. Mục tiêu là hiểu navigation, forms, filtering và trải nghiệm quản lý record của ứng dụng trước khi xem code.`,
    'build-and-explore/preview-and-code': `## Khám phá Preview và Code
1. Trong **Preview**, điều hướng qua trải nghiệm được tạo và xác định các khu vực MRM chính:
   - Ngân sách và lập kế hoạch
   - Theo dõi chi phí
   - Chiến thuật marketing
   - Quản lý thời gian và nguồn lực
2. Thử các tương tác chính và kiểm tra trạng thái trống, đang tải và đã có dữ liệu.
3. Chuyển sang **Code** mode để xem ứng dụng được sinh ra như thế nào ở runtime.
4. Chuyển qua lại giữa **Preview** và **Code** trong khi harness áp dụng thay đổi, và quan sát source cùng trải nghiệm render luôn đồng bộ.
5. Quay lại **Preview** và xác minh app vẫn dùng tốt ở cả kích thước desktop lẫn kích thước hẹp.

Trong lab này, bạn không cần tự tay chỉnh sửa source được tạo. Mục tiêu là hiểu cách thay đổi bằng ngôn ngữ tự nhiên trở thành code ứng dụng đang chạy.`,
    'enhance-theme/main': `## Thêm chuyển đổi theme sáng/tối
1. Quay lại cuộc trò chuyện bằng ngôn ngữ tự nhiên.
2. Dán yêu cầu cải tiến được cung cấp bên dưới.
3. Gửi yêu cầu và quan sát cách harness xác định UI và code bị ảnh hưởng.
4. Khi cập nhật hoàn tất, tìm điều khiển theme mới trong **Preview**.
5. Chuyển giữa theme sáng và tối, rồi xác minh văn bản, navigation, forms, charts và màu trạng thái vẫn dễ đọc.
6. Chuyển sang **Code** để xem thay đổi được tạo, rồi quay lại **Preview** để kiểm tra cuối cùng.

Bạn có thể dùng cùng cách tiếp cận lặp lại cho các cải tiến sau này. Hãy yêu cầu trải nghiệm mới trước, rồi thêm các connection và data table đã được phê duyệt khi ứng dụng cần dữ liệu kinh doanh trực tiếp.`,
    'save-and-publish/main': `## Đổi tên, Save và Publish
1. Mở app details hoặc dùng lệnh đổi tên.
2. Đổi tên ứng dụng thành **Marketing Resource Hub - <Your Alias>**.
3. Chọn **Save** và chờ thao tác lưu hoàn tất.
4. Xem lại Preview cuối cùng và xác nhận rằng bốn khu vực MRM cùng chuyển đổi theme vẫn hoạt động.
5. Chọn **Publish** (hoặc **Save and publish** nếu đó là nhãn trong trải nghiệm Preview).
6. Chờ xác nhận thành công trước khi rời khỏi trang.
7. Mở lại ứng dụng đã publish từ Copilot Studio và xác nhận tên cùng trải nghiệm sau khi publish.

Publishing làm cho phiên bản đã lưu hiện tại khả dụng qua các kênh và quyền mà environment của bạn hỗ trợ. Khả năng Preview và trial có thể khác nhau theo tenant.`,
  },
  highlights: {
    'open-apps-preview/main': 'Nếu trên trang Home không tìm thấy Apps, hãy mở trực tiếp https://aka.ms/app-studio/preview. Đây là trải nghiệm Preview nên nhãn và bố cục có thể thay đổi.',
    'describe-mrm-app/main': 'Giữ bản build đầu tiên thật tập trung. Chỉ chấp thuận những kế hoạch và tài nguyên bạn hiểu rõ, rồi tinh chỉnh bằng các yêu cầu nhỏ, dễ kiểm chứng.',
    'build-and-explore/watch-generation': 'Bản build đầu tiên thường mất khoảng 10–15 phút. Hãy giữ phiên làm việc mở và dùng thông báo tiến độ để hiểu harness đang tạo gì.',
    'build-and-explore/preview-and-code': 'Preview xác nhận trải nghiệm người dùng; Code mode làm rõ phần triển khai được tạo. Chuyển qua lại giữa hai chế độ để nối ý định ngôn ngữ tự nhiên với ứng dụng kết quả.',
    'enhance-theme/main': 'Xem mỗi cải tiến như một thay đổi có thể kiểm chứng: yêu cầu một tính năng, xem điều gì thay đổi, rồi xác minh trong Preview trước khi yêu cầu tính năng tiếp theo.',
    'save-and-publish/main': 'Hãy chờ xác nhận Save và Publish rõ ràng. Một Preview trông đúng chưa đồng nghĩa với ứng dụng đã publish thành công.',
  },
  promptTitles: {
    'lab07-preview-url': 'URL trực tiếp của Apps (Preview)',
    'lab07-mrm-app-prompt': 'Yêu cầu ứng dụng MRM',
    'lab07-theme-prompt': 'Yêu cầu cải tiến theme',
    'lab07-app-name': 'Tên ứng dụng cuối cùng',
  },
}
