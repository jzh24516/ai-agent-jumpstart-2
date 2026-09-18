import type { Lab07LocalePack } from './locales.ts'

export const lab07Hi: Lab07LocalePack = {
  title: 'Copilot Studio Apps (Preview) में MRM ऐप बनाएं',
  summary: 'Copilot Studio Apps (Preview) में GitHub Copilot harness का उपयोग करके प्राकृतिक भाषा से एक आधुनिक Marketing Resource Management (MRM) ऐप बनाएं, जनरेट किए गए Code की समीक्षा करें, उसे बेहतर बनाएं और Publish करें।',
  outcome: 'Marketing Resource Hub - <Your Alias> नाम का एक Published managed app, जिसमें budget planning, expense tracking, marketing tactics, resource management और light/dark theme switch शामिल हैं।',
  objectives: [
    'Copilot Studio Apps (Preview) खोलें और GitHub Copilot harness का उपयोग करके नया ऐप बनाएं।',
    'विस्तृत natural-language अनुरोध से Marketing Resource Management ऐप जनरेट करें और प्रगति को real time में देखें।',
    'Preview और Code modes की तुलना करें, light/dark theme enhancement जोड़ें, फिर ऐप को Save और Publish करें।',
  ],
  prerequisites: [
    'ऐसा Copilot Studio environment जिसमें आपके Maker account के लिए Apps (Preview) और GitHub Copilot harness सक्षम हों।',
    'उस environment में ऐप बनाने और Publish करने की अनुमति। Preview का उपयोग Copilot Credits खर्च कर सकता है और Preview terms के अधीन है।',
  ],
  stepTitles: {
    'open-apps-preview': 'Copilot Studio Apps (Preview) खोलें',
    'describe-mrm-app': 'MRM ऐप का वर्णन करें',
    'build-and-explore': 'बिल्ड देखें और Preview तथा Code का अन्वेषण करें',
    'enhance-theme': 'Theme switch के साथ ऐप को बेहतर बनाएं',
    'save-and-publish': 'नाम बदलें, Save करें और Publish करें',
  },
  pageTitles: {
    'build-and-explore/watch-generation': 'ऐप को आकार लेते हुए देखें',
    'build-and-explore/preview-and-code': 'Preview और Code modes का अन्वेषण करें',
  },
  paragraphs: {
    'open-apps-preview/main': ['Copilot Studio के Home page से शुरुआत करें, या जब आपके tenant में Apps entry दिखाई न दे तो सीधे Preview URL का उपयोग करें।'],
    'describe-mrm-app/main': ['एक परिणाम-केंद्रित prompt से harness को ऐप का दायरा, उपयोगकर्ता और चार मुख्य business capabilities बताएं।'],
    'build-and-explore/watch-generation': ['देखें कि GitHub Copilot harness आपकी requirements को समझकर उन्हें एक working, modern application में कैसे बदलता है।'],
    'build-and-explore/preview-and-code': ['Preview में जनरेट किए गए ऐप का परीक्षण करें, फिर Code mode में देखें कि working experience कैसे बनता और update होता है।'],
    'enhance-theme/main': ['उसी conversation को जारी रखें और harness से पूरा light/dark theme experience जोड़ने को कहें।'],
    'save-and-publish/main': ['ऐप को workshop के लिए एक unique नाम दें, जनरेट किए गए कार्य को Save करें और validated version को Publish करें।'],
  },
  markdown: {
    'open-apps-preview/main': `## Copilot Studio Apps (Preview) खोलें
1. **Copilot Studio** खोलें और पुष्टि करें कि आप facilitator द्वारा दिए गए environment में काम कर रहे हैं।
2. **Home** page पर **Apps (Preview)** ढूंढें और चुनें।
3. यदि Apps entry दिखाई नहीं देती है, तो Preview को नए tab में सीधे खोलें: **https://aka.ms/app-studio/preview**
4. **GitHub Copilot harness** का उपयोग करके नया ऐप बनाने का विकल्प चुनें।
5. इस browser tab को lab के बाकी हिस्से के लिए खुला रखें।

> **Preview नोट:** Experience, labels और placement बदल सकते हैं। यदि UI इन निर्देशों से अलग हो, तो सबसे निकट समान विकल्प चुनें।`,
    'describe-mrm-app/main': `## Marketing Resource Management ऐप का वर्णन करें
1. Natural-language input में नीचे दिया गया ऐप अनुरोध paste करें।
2. अनुरोध submit करें।
3. यदि Copilot Studio clarifying questions पूछे, तो पहला version इन चार क्षेत्रों पर केंद्रित रखें:
   - **Budget और planning** — campaigns की योजना बनाएं और marketing budget आवंटित करें।
   - **Expense tracking** — planned और actual खर्च record करें।
   - **Marketing tactics** — campaigns, activities, channels और deliverables व्यवस्थित करें।
   - **Time और resource management** — owners, effort, dates और status assign करें।
4. Build approve करने से पहले प्रस्तावित plan और assumptions की समीक्षा करें।
5. Build शुरू करें और conversation खुली रखें ताकि बाद में ऐप को refine कर सकें।

Business outcome और users जितने स्पष्ट होंगे, जनरेट की गई information architecture और experience उतने ही उपयोगी होंगे।`,
    'build-and-explore/watch-generation': `## GitHub Copilot harness द्वारा ऐप को बनते हुए देखें
1. जब Copilot Studio आपके अनुरोध को समझकर ऐप बना रहा हो, तब progress messages देखते रहें।
2. देखें कि यह MRM scenario को pages, navigation, components, interactions और data concepts में कैसे विभाजित करता है।
3. पहले complete version के लिए लगभग **10–15 मिनट** दें। Build time बदल सकता है।
4. Generation चल रही हो, तब page refresh या close न करें।
5. यदि harness किसी connection, table या अन्य resource की approval मांगे, तो स्वीकार करने से पहले request पढ़ें।
6. Generation पूरी होने पर पुष्टि करें कि दाईं ओर के Preview area में modern application दिखाई दे रही है।

Generation iterative होती है। उपयोगी पहला version केवल शुरुआत है, final design नहीं।

## जनरेट किए गए ऐप का स्वतंत्र रूप से अन्वेषण करें
पहला version तैयार होने पर, end user की तरह जनरेट किए गए ऐप में कहीं भी click करके उसे explore करें:

- Navigation का उपयोग करके MRM work areas के बीच जाएं।
- उपलब्ध marketing resource records को filter और sort करें।
- किसी record को चुनें और उसके detail form तक drill down करें।
- नया marketing plan या budget बनाएं और generated fields तथा experience की समीक्षा करें।
- अलग-अलग प्रकार के marketing resource records edit करें और पुष्टि करें कि बदलाव ऐप में दिखाई दे रहे हैं।
- Main views पर लौटें और अन्य उपलब्ध actions को explore करना जारी रखें।

केवल workshop या sample data का उपयोग करें। लक्ष्य Code देखने से पहले generated application की navigation, forms, filtering और record-management experience को समझना है।`,
    'build-and-explore/preview-and-code': `## Preview और Code modes का अन्वेषण करें
1. **Preview** में generated experience देखें और मुख्य MRM क्षेत्रों को खोजें:
   - Budget और planning
   - Expense tracking
   - Marketing tactics
   - Time और resource management
2. Primary interactions आजमाएं और उपलब्ध empty, loading और populated states देखें।
3. **Code** mode पर switch करें और देखें कि application runtime में कैसे generate होती है।
4. Harness जब बदलाव लागू कर रहा हो, तब **Preview** और **Code** के बीच switch करें और देखें कि source तथा rendered experience synchronized रहते हैं।
5. **Preview** पर लौटें और पुष्टि करें कि ऐप desktop तथा narrow widths दोनों पर उपयोग योग्य है।

इस lab में generated source को manually edit करने की आवश्यकता नहीं है। उद्देश्य यह समझना है कि natural-language changes working application code में कैसे बदलती हैं।`,
    'enhance-theme/main': `## Light/dark theme switch जोड़ें
1. Natural-language conversation पर वापस जाएं।
2. नीचे दिया गया enhancement request paste करें।
3. अनुरोध submit करें और देखें कि harness प्रभावित UI और Code की पहचान कैसे करता है।
4. Update पूरा होने पर **Preview** में नया theme control ढूंढें।
5. Light और dark themes के बीच switch करें और पुष्टि करें कि text, navigation, forms, charts और status colors पढ़ने योग्य रहें।
6. **Code** पर switch करके generated changes देखें, फिर final test के लिए **Preview** पर लौटें।

भविष्य के enhancements के लिए भी यही iterative approach उपयोग करें। पहले नए experiences मांगें, फिर जब ऐप को live business data चाहिए हो तब approved connections और data tables जोड़ें।`,
    'save-and-publish/main': `## नाम बदलें, Save करें और Publish करें
1. App details या rename command खोलें।
2. Application का नाम **Marketing Resource Hub - <Your Alias>** रखें।
3. **Save** चुनें और save operation पूरा होने की प्रतीक्षा करें।
4. Final Preview की समीक्षा करें और पुष्टि करें कि चारों MRM areas तथा theme switch अभी भी काम करते हैं।
5. **Publish** चुनें (या यदि Preview experience में label **Save and publish** है तो वही चुनें)।
6. Page छोड़ने से पहले success confirmation की प्रतीक्षा करें।
7. Copilot Studio से Published app फिर से खोलें और Published name तथा experience की पुष्टि करें।

Publish करने से current saved version आपके environment द्वारा supported channels और permissions के माध्यम से उपलब्ध हो जाता है। Preview और trial capabilities tenant के अनुसार बदल सकती हैं।`,
  },
  highlights: {
    'open-apps-preview/main': 'यदि Home page पर Apps न मिले, तो https://aka.ms/app-studio/preview सीधे खोलें। यह Preview experience है, इसलिए labels और layout बदल सकते हैं।',
    'describe-mrm-app/main': 'पहला build केंद्रित रखें। केवल उन्हीं plans और resources को approve करें जिन्हें आप समझते हैं, फिर छोटे, testable requests के साथ experience को refine करें।',
    'build-and-explore/watch-generation': 'पहले complete version में सामान्यतः लगभग 10–15 मिनट लगते हैं। Session खुला रखें और progress messages से समझें कि harness क्या बना रहा है।',
    'build-and-explore/preview-and-code': 'Preview user experience को validate करता है; Code mode generated implementation को दिखाता है। दोनों के बीच switch करके अपनी natural-language intent को final app से जोड़ें।',
    'enhance-theme/main': 'हर enhancement को testable change की तरह लें: एक capability request करें, देखें क्या बदलता है और अगले feature से पहले Preview में verify करें।',
    'save-and-publish/main': 'स्पष्ट Save और Publish confirmation की प्रतीक्षा करें। सही दिखने वाला Preview, सफलतापूर्वक Published app के बराबर नहीं होता।',
  },
  promptTitles: {
    'lab07-preview-url': 'Apps (Preview) का direct URL',
    'lab07-mrm-app-prompt': 'MRM ऐप अनुरोध',
    'lab07-theme-prompt': 'Theme switch enhancement अनुरोध',
    'lab07-app-name': 'Final ऐप नाम',
  },
}
