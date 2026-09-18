import type { Lab } from '../../types'
import { applyLab07Locale, lab07Ja } from './locales.ts'

const mrmAppPrompt = `Build a Marketing Resource Management (MRM) app, inspired by Siebel Marketing Resource Management, that lets a marketing team manage the full lifecycle of their work in one place: budget & planning, expense tracking, marketing tactics, and time & resource management.`

const themePrompt = `Add a new light/dark theme switch feature to this app.`

const openAppsStep = `## Open Copilot Studio Apps (Preview)
1. Open **Copilot Studio** and confirm that you are working in the environment assigned by your facilitator.
2. On the **Home** page, find and select **Apps (Preview)**.
3. If the Apps entry isn't visible, open the preview directly in a new tab: **https://aka.ms/app-studio/preview**.
4. Select the option to create a new app powered by the **GitHub Copilot harness**.
5. Keep this browser tab open for the rest of the lab.

> **Preview note:** The experience, labels, and placement can change. Follow the closest equivalent option if the UI differs from these instructions.`

const openAppsStepZh = `## 打开 Copilot Studio Apps（预览版）
1. 打开 **Copilot Studio**，确认你正在使用讲师分配的环境。
2. 在 **Home** 页面找到并选择 **Apps (Preview)**。
3. 如果看不到 Apps 入口，请在新标签页中直接打开预览地址：**https://aka.ms/app-studio/preview**。
4. 选择使用 **GitHub Copilot harness** 创建新应用的选项。
5. 在本实验的后续过程中保持此浏览器标签页打开。

> **预览功能提示：** 此体验、标签名称和入口位置可能会发生变化。如果界面与本说明不同，请选择含义最接近的选项。`

const describeAppStep = `## Describe the Marketing Resource Management app
1. In the natural-language input, paste the app request provided below.
2. Submit the request.
3. If Copilot Studio asks clarifying questions, keep the first version focused on these four areas:
   - **Budget & planning** — plan campaigns and allocate marketing budget.
   - **Expense tracking** — record planned and actual spend.
   - **Marketing tactics** — organize campaigns, activities, channels, and deliverables.
   - **Time & resource management** — assign owners, effort, dates, and status.
4. Review any proposed plan or assumptions before approving the build.
5. Start the build and keep the conversation available so you can refine the app later.

The more specific the business outcome and users are, the more useful the generated information architecture and experience will be.`

const describeAppStepZh = `## 描述营销资源管理应用
1. 在自然语言输入框中粘贴下方提供的应用需求。
2. 提交该需求。
3. 如果 Copilot Studio 提出澄清问题，请让第一个版本聚焦于以下四个领域：
  - **预算与规划** — 规划营销活动并分配营销预算。
  - **费用跟踪** — 记录计划支出与实际支出。
  - **营销策略** — 组织营销活动、任务、渠道和交付物。
  - **时间与资源管理** — 分配负责人、工作量、日期和状态。
4. 在批准构建前，检查建议的计划和所有假设。
5. 开始构建，并保留当前对话，以便稍后继续完善应用。

你提供的业务目标和用户背景越具体，生成的信息架构和应用体验就越有价值。`

const watchBuildStep = `## Watch the GitHub Copilot harness build the app
1. Follow the progress messages while Copilot Studio interprets the request and creates the application.
2. Observe how it decomposes the MRM scenario into pages, navigation, components, interactions, and data concepts.
3. Allow approximately **10–15 minutes** for the first complete version. Build time can vary.
4. Don't refresh or close the page while generation is active.
5. If the harness requests approval for a connection, table, or other resource, read the request before accepting it.
6. When generation finishes, confirm that a modern application appears in the preview area on the right.

Generation is iterative. A usable first version is the starting point, not the final design.

## Explore the generated app freely
When the first version is ready, feel free to click anywhere in the generated app and explore it like an end user:

- Use the navigation to move between the MRM work areas.
- Filter and sort the available marketing resource records.
- Select a record and drill down into its detail form.
- Create a new marketing plan or budget and review the generated fields and experience.
- Edit different types of marketing resource records and confirm that your changes appear in the app.
- Return to the main views and continue exploring any other available actions.

Use only workshop or sample data. The goal is to understand the generated application's navigation, forms, filtering, and record-management experience before you inspect its code.`

const watchBuildStepZh = `## 观察 GitHub Copilot harness 构建应用
1. 在 Copilot Studio 解读需求并创建应用时，持续查看进度消息。
2. 观察它如何将 MRM 场景拆分为页面、导航、组件、交互和数据概念。
3. 第一个完整版本通常需要大约 **10–15 分钟**，实际构建时间可能有所不同。
4. 生成过程中不要刷新或关闭页面。
5. 如果 harness 要求批准连接、数据表或其他资源，请在接受前仔细阅读请求。
6. 生成完成后，确认右侧预览区域中出现了一个现代化应用。

生成过程是迭代式的。可用的第一个版本只是起点，并非最终设计。

## 自由探索生成的应用
第一个版本准备就绪后，你可以像最终用户一样，自由点击生成应用中的各个位置进行探索：

- 使用导航在不同的 MRM 工作区域之间切换。
- 筛选和排序可用的营销资源记录。
- 选择一条记录，并下钻到其详细信息表单。
- 新建营销计划或预算，检查自动生成的字段和操作体验。
- 编辑不同类型的营销资源记录，并确认更改已显示在应用中。
- 返回主要视图，继续探索其他可用操作。

请仅使用研讨会数据或示例数据。此环节的目标是在检查代码前，了解生成应用的导航、表单、筛选和记录管理体验。`

const inspectAppStep = `## Explore Preview and Code modes
1. In **Preview**, navigate through the generated experience and locate the major MRM areas:
   - Budget and planning
   - Expense tracking
   - Marketing tactics
   - Time and resource management
2. Try the primary interactions and inspect the empty, loading, and populated states that are available.
3. Switch to **Code** mode and inspect how the application is generated at runtime.
4. Move between **Preview** and **Code** while the harness applies a change, and observe how the source and rendered experience stay synchronized.
5. Return to **Preview** and verify that the app remains usable at both desktop and narrow widths.

You don't need to hand-edit the generated source in this lab. The goal is to understand how natural-language changes become working application code.`

const inspectAppStepZh = `## 探索 Preview 和 Code 模式
1. 在 **Preview** 中浏览生成的体验，并找到以下主要 MRM 区域：
  - 预算与规划
  - 费用跟踪
  - 营销策略
  - 时间与资源管理
2. 尝试主要交互，并检查现有的空状态、加载状态和已有数据状态。
3. 切换到 **Code** 模式，查看应用代码如何在运行时生成。
4. 在 harness 应用更改时来回切换 **Preview** 和 **Code**，观察源代码与渲染体验如何保持同步。
5. 返回 **Preview**，确认应用在桌面宽度和窄屏宽度下都能正常使用。

本实验不要求手动编辑生成的源代码。重点是理解自然语言更改如何转化为可运行的应用代码。`

const enhanceAppStep = `## Add a light/dark theme switch
1. Return to the natural-language conversation.
2. Paste the enhancement request provided below.
3. Submit the request and watch the harness identify the affected UI and code.
4. When the update completes, locate the new theme control in **Preview**.
5. Switch between light and dark themes and verify that text, navigation, forms, charts, and status colors remain readable.
6. Switch to **Code** to inspect the generated changes, then return to **Preview** for the final test.

Use the same iterative approach for future enhancements. You can ask for new experiences first, then add approved connections and data tables when the application needs live business data.`

const enhanceAppStepZh = `## 添加明暗主题切换
1. 返回自然语言对话。
2. 粘贴下方提供的增强需求。
3. 提交需求，观察 harness 如何识别受影响的界面和代码。
4. 更新完成后，在 **Preview** 中找到新的主题控件。
5. 在浅色与深色主题之间切换，确认文本、导航、表单、图表和状态颜色都清晰可读。
6. 切换到 **Code** 查看生成的更改，然后返回 **Preview** 完成最终测试。

今后的功能增强也可以采用相同的迭代方式。先提出新的体验需求；当应用需要实时业务数据时，再添加经过批准的连接和数据表。`

const publishStep = `## Rename, save, and publish
1. Open the app details or rename command.
2. Rename the application to **Marketing Resource Hub - <Your Alias>**.
3. Select **Save** and wait for the save operation to finish.
4. Review the final Preview and confirm that the four MRM areas and theme switch still work.
5. Select **Publish** (or **Save and publish**, if that is the label in the preview experience).
6. Wait for the success confirmation before leaving the page.
7. Reopen the published app from Copilot Studio and confirm the published name and experience.

Publishing makes the current saved version available through the channels and permissions supported by your environment. Preview and trial capabilities can vary by tenant.`

const publishStepZh = `## 重命名、保存并发布
1. 打开应用详细信息或重命名命令。
2. 将应用重命名为 **Marketing Resource Hub - <Your Alias>**。
3. 选择 **Save**，并等待保存操作完成。
4. 检查最终 Preview，确认四个 MRM 区域和主题切换仍可正常工作。
5. 选择 **Publish**（如果预览体验中的标签是 **Save and publish**，则选择该选项）。
6. 等待成功确认后再离开页面。
7. 从 Copilot Studio 重新打开已发布的应用，确认发布后的名称和体验。

发布操作会通过当前环境支持的渠道和权限提供已保存的版本。不同租户可用的预览版和试用版功能可能有所不同。`

export const lab07: Lab = {
  id: 'lab-07',
  number: 7,
  icon: 'sparkles',
  duration: 45,
  title: { en: 'Build an MRM app with Copilot Studio Apps (Preview)', zh: '使用 Copilot Studio Apps（预览版）构建 MRM 应用' },
  summary: { en: 'Use the GitHub Copilot harness in Copilot Studio Apps (Preview) to vibe-code a modern Marketing Resource Management application from natural language, inspect its generated code, enhance it, and publish it.', zh: '在 Copilot Studio Apps（预览版）中使用 GitHub Copilot harness，通过自然语言以 Vibe Coding 方式创建现代化的营销资源管理应用，查看生成的代码、增强功能并发布应用。' },
  outcome: { en: 'A published managed application named Marketing Resource Hub - <Your Alias>, with budget planning, expense tracking, marketing tactics, resource management, and a light/dark theme switch.', zh: '一个已发布的托管应用 Marketing Resource Hub - <Your Alias>，包含预算规划、费用跟踪、营销策略、资源管理以及明暗主题切换功能。' },
  objectives: [
    { en: 'Open Copilot Studio Apps (Preview) and create a new app with the GitHub Copilot harness.', zh: '打开 Copilot Studio Apps（预览版），并使用 GitHub Copilot harness 创建新应用。' },
    { en: 'Generate a Marketing Resource Management app from a detailed natural-language request and inspect progress in real time.', zh: '根据详细的自然语言需求生成营销资源管理应用，并实时查看创建进度。' },
    { en: 'Compare Preview and Code modes, add a light/dark theme enhancement, then save and publish the app.', zh: '对比 Preview 与 Code 模式，添加明暗主题增强功能，然后保存并发布应用。' },
  ],
  prerequisites: [
    { en: 'A Copilot Studio environment where Apps (Preview) and the GitHub Copilot harness are enabled for your maker account.', zh: '一个已为你的 Maker 账户启用 Apps（预览版）和 GitHub Copilot harness 的 Copilot Studio 环境。' },
    { en: 'Permission to create and publish apps in the environment. Preview usage can consume Copilot Credits and is subject to preview terms.', zh: '拥有在该环境中创建和发布应用的权限。使用预览功能可能会消耗 Copilot Credits，并受预览条款约束。' },
  ],
  steps: [
    {
      id: 'open-apps-preview',
      title: { en: 'Open Copilot Studio Apps (Preview)', zh: '打开 Copilot Studio Apps（预览版）' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'Start from the Copilot Studio Home page, or use the direct preview URL when the Apps entry is not yet visible in your tenant.', zh: '从 Copilot Studio Home 页面开始；如果你的租户中尚未显示 Apps 入口，请使用预览版直达 URL。' }],
        markdown: { en: openAppsStep, zh: openAppsStepZh },
        highlight: { en: 'If you cannot find Apps on the Home page, open https://aka.ms/app-studio/preview directly. This is a preview experience, so labels and layout can change.', zh: '如果在 Home 页面找不到 Apps，请直接打开 https://aka.ms/app-studio/preview。此功能仍处于预览阶段，标签和布局可能会变化。' },
        prompts: [{ id: 'lab07-preview-url', title: { en: 'Apps (Preview) direct URL', zh: 'Apps（预览版）直达 URL' }, content: 'https://aka.ms/app-studio/preview' }],
        imageKeys: ['image-01'],
      }],
    },
    {
      id: 'describe-mrm-app',
      title: { en: 'Describe the MRM application', zh: '描述 MRM 应用' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'Use a single outcome-focused prompt to give the harness the application scope, users, and four core business capabilities.', zh: '使用一条以结果为中心的提示词，向 harness 说明应用范围、目标用户和四项核心业务能力。' }],
        markdown: { en: describeAppStep, zh: describeAppStepZh },
        highlight: { en: 'Keep the first build focused. Approve only the plan and resources you understand, then refine the experience in small, testable requests.', zh: '让首次构建保持聚焦。仅批准你理解的计划与资源，然后通过小而可测试的需求逐步优化体验。' },
        prompts: [{ id: 'lab07-mrm-app-prompt', title: { en: 'MRM application request', zh: 'MRM 应用需求' }, content: mrmAppPrompt }],
        imageKeys: ['image-02'],
      }],
    },
    {
      id: 'build-and-explore',
      title: { en: 'Watch the build and explore Preview and Code', zh: '观察构建并探索 Preview 与 Code' },
      pages: [
        {
          id: 'watch-generation',
          title: { en: 'Watch the app take shape', zh: '观察应用逐步成形' },
          paragraphs: [{ en: 'Observe how the GitHub Copilot harness interprets your requirements and turns them into a working, modern application.', zh: '观察 GitHub Copilot harness 如何理解你的需求，并将其转化为可运行的现代化应用。' }],
          markdown: { en: watchBuildStep, zh: watchBuildStepZh },
          highlight: { en: 'The first build commonly takes about 10–15 minutes. Keep the session open and use the progress messages to understand what the harness is creating.', zh: '首次构建通常需要大约 10–15 分钟。请保持会话打开，并通过进度消息了解 harness 正在创建哪些内容。' },
          prompts: [],
          imageKeys: ['image-03'],
        },
        {
          id: 'preview-and-code',
          title: { en: 'Explore Preview and Code modes', zh: '探索 Preview 与 Code 模式' },
          paragraphs: [{ en: 'Test the generated application in Preview, then inspect Code mode to see how the working experience is produced and updated.', zh: '先在 Preview 中测试生成的应用，再查看 Code 模式，了解可运行体验如何生成和更新。' }],
          markdown: { en: inspectAppStep, zh: inspectAppStepZh },
          highlight: { en: 'Preview proves the user experience; Code mode makes the generated implementation visible. Switch between both to connect your natural-language intent to the resulting app.', zh: 'Preview 用于验证用户体验，Code 模式用于展示生成的实现。在两者之间切换，将自然语言意图与最终应用联系起来。' },
          prompts: [],
          imageKeys: ['image-04'],
        },
      ],
    },
    {
      id: 'enhance-theme',
      title: { en: 'Enhance the app with a theme switch', zh: '通过主题切换增强应用' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'Continue the same conversation and ask the harness to add a complete light/dark theme experience.', zh: '继续使用同一对话，请 harness 添加完整的明暗主题体验。' }],
        markdown: { en: enhanceAppStep, zh: enhanceAppStepZh },
        highlight: { en: 'Treat every enhancement as a testable change: request one capability, watch what changes, and verify it in Preview before asking for the next feature.', zh: '将每项增强都视为可测试的更改：一次请求一项能力，观察发生的变化，并在 Preview 中验证后再提出下一项功能。' },
        prompts: [{ id: 'lab07-theme-prompt', title: { en: 'Theme enhancement request', zh: '主题增强需求' }, content: themePrompt }],
        imageKeys: ['image-05', 'image-06', 'image-07'],
      }],
    },
    {
      id: 'save-and-publish',
      title: { en: 'Rename, save, and publish', zh: '重命名、保存并发布' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'Give the app a unique workshop name, save the generated work, and publish the validated version.', zh: '为应用指定唯一的研讨会名称，保存生成的工作，并发布已验证的版本。' }],
        markdown: { en: publishStep, zh: publishStepZh },
        highlight: { en: 'Wait for an explicit save and publish confirmation. A preview that looks correct is not the same as a successfully published app.', zh: '请等待明确的保存和发布成功确认。预览显示正常并不代表应用已经成功发布。' },
        prompts: [{ id: 'lab07-app-name', title: { en: 'Final application name', zh: '最终应用名称' }, content: 'Marketing Resource Hub - <Your Alias>' }],
        imageKeys: ['image-08'],
      }],
    },
  ],
}

applyLab07Locale(lab07, 'ja', lab07Ja)
