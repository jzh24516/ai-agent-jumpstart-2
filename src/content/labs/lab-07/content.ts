import type { Lab } from '../../types'

const mrmAppPrompt = `Build a Marketing Resource Management (MRM) app, inspired by Siebel Marketing Resource Management, that lets a marketing team manage the full lifecycle of their work in one place: budget & planning, expense tracking, marketing tactics, and time & resource management.`

const themePrompt = `Add a new light/dark theme switch feature to this app.`

const openAppsStep = `## Open Copilot Studio Apps (Preview)
1. Open **Copilot Studio** and confirm that you are working in the environment assigned by your facilitator.
2. On the **Home** page, find and select **Apps (Preview)**.
3. If the Apps entry isn't visible, open the preview directly in a new tab: **https://aka.ms/app-studio/preview**.
4. Select the option to create a new app powered by the **GitHub Copilot harness**.
5. Keep this browser tab open for the rest of the lab.

> **Preview note:** The experience, labels, and placement can change. Follow the closest equivalent option if the UI differs from these instructions.`

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

const enhanceAppStep = `## Add a light/dark theme switch
1. Return to the natural-language conversation.
2. Paste the enhancement request provided below.
3. Submit the request and watch the harness identify the affected UI and code.
4. When the update completes, locate the new theme control in **Preview**.
5. Switch between light and dark themes and verify that text, navigation, forms, charts, and status colors remain readable.
6. Switch to **Code** to inspect the generated changes, then return to **Preview** for the final test.

Use the same iterative approach for future enhancements. You can ask for new experiences first, then add approved connections and data tables when the application needs live business data.`

const publishStep = `## Rename, save, and publish
1. Open the app details or rename command.
2. Rename the application to **Marketing Resource Hub - <Your Alias>**.
3. Select **Save** and wait for the save operation to finish.
4. Review the final Preview and confirm that the four MRM areas and theme switch still work.
5. Select **Publish** (or **Save and publish**, if that is the label in the preview experience).
6. Wait for the success confirmation before leaving the page.
7. Reopen the published app from Copilot Studio and confirm the published name and experience.

Publishing makes the current saved version available through the channels and permissions supported by your environment. Preview and trial capabilities can vary by tenant.`

export const lab07: Lab = {
  id: 'lab-07',
  number: 7,
  icon: 'sparkles',
  duration: 45,
  title: { en: 'Build an MRM app with Copilot Studio Apps (Preview)' },
  summary: { en: 'Use the GitHub Copilot harness in Copilot Studio Apps (Preview) to vibe-code a modern Marketing Resource Management application from natural language, inspect its generated code, enhance it, and publish it.' },
  outcome: { en: 'A published managed application named Marketing Resource Hub - <Your Alias>, with budget planning, expense tracking, marketing tactics, resource management, and a light/dark theme switch.' },
  objectives: [
    { en: 'Open Copilot Studio Apps (Preview) and create a new app with the GitHub Copilot harness.' },
    { en: 'Generate a Marketing Resource Management app from a detailed natural-language request and inspect progress in real time.' },
    { en: 'Compare Preview and Code modes, add a light/dark theme enhancement, then save and publish the app.' },
  ],
  prerequisites: [
    { en: 'A Copilot Studio environment where Apps (Preview) and the GitHub Copilot harness are enabled for your maker account.' },
    { en: 'Permission to create and publish apps in the environment. Preview usage can consume Copilot Credits and is subject to preview terms.' },
  ],
  steps: [
    {
      id: 'open-apps-preview',
      title: { en: 'Open Copilot Studio Apps (Preview)' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'Start from the Copilot Studio Home page, or use the direct preview URL when the Apps entry is not yet visible in your tenant.' }],
        markdown: { en: openAppsStep },
        highlight: { en: 'If you cannot find Apps on the Home page, open https://aka.ms/app-studio/preview directly. This is a preview experience, so labels and layout can change.' },
        prompts: [{ id: 'lab07-preview-url', title: { en: 'Apps (Preview) direct URL' }, content: 'https://aka.ms/app-studio/preview' }],
        imageKeys: ['image-01'],
      }],
    },
    {
      id: 'describe-mrm-app',
      title: { en: 'Describe the MRM application' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'Use a single outcome-focused prompt to give the harness the application scope, users, and four core business capabilities.' }],
        markdown: { en: describeAppStep },
        highlight: { en: 'Keep the first build focused. Approve only the plan and resources you understand, then refine the experience in small, testable requests.' },
        prompts: [{ id: 'lab07-mrm-app-prompt', title: { en: 'MRM application request' }, content: mrmAppPrompt }],
        imageKeys: ['image-02'],
      }],
    },
    {
      id: 'build-and-explore',
      title: { en: 'Watch the build and explore Preview and Code' },
      pages: [
        {
          id: 'watch-generation',
          title: { en: 'Watch the app take shape' },
          paragraphs: [{ en: 'Observe how the GitHub Copilot harness interprets your requirements and turns them into a working, modern application.' }],
          markdown: { en: watchBuildStep },
          highlight: { en: 'The first build commonly takes about 10–15 minutes. Keep the session open and use the progress messages to understand what the harness is creating.' },
          prompts: [],
          imageKeys: ['image-03'],
        },
        {
          id: 'preview-and-code',
          title: { en: 'Explore Preview and Code modes' },
          paragraphs: [{ en: 'Test the generated application in Preview, then inspect Code mode to see how the working experience is produced and updated.' }],
          markdown: { en: inspectAppStep },
          highlight: { en: 'Preview proves the user experience; Code mode makes the generated implementation visible. Switch between both to connect your natural-language intent to the resulting app.' },
          prompts: [],
          imageKeys: ['image-04'],
        },
      ],
    },
    {
      id: 'enhance-theme',
      title: { en: 'Enhance the app with a theme switch' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'Continue the same conversation and ask the harness to add a complete light/dark theme experience.' }],
        markdown: { en: enhanceAppStep },
        highlight: { en: 'Treat every enhancement as a testable change: request one capability, watch what changes, and verify it in Preview before asking for the next feature.' },
        prompts: [{ id: 'lab07-theme-prompt', title: { en: 'Theme enhancement request' }, content: themePrompt }],
        imageKeys: ['image-05', 'image-06', 'image-07'],
      }],
    },
    {
      id: 'save-and-publish',
      title: { en: 'Rename, save, and publish' },
      pages: [{
        id: 'main',
        paragraphs: [{ en: 'Give the app a unique workshop name, save the generated work, and publish the validated version.' }],
        markdown: { en: publishStep },
        highlight: { en: 'Wait for an explicit save and publish confirmation. A preview that looks correct is not the same as a successfully published app.' },
        prompts: [{ id: 'lab07-app-name', title: { en: 'Final application name' }, content: 'Marketing Resource Hub - <Your Alias>' }],
        imageKeys: ['image-08'],
      }],
    },
  ],
}
