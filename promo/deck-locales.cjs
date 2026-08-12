const OpenCC = require('opencc-js/cn2t')

const DECK_LOCALES = ['en', 'zh', 'zh-HK', 'zh-TW', 'ja', 'ko', 'th', 'hi']

const LOCALE_LABELS = {
  en: 'EN',
  zh: '简体中文',
  'zh-HK': '廣東話',
  'zh-TW': '繁體中文',
  ja: '日本語',
  ko: '한국어',
  th: 'ไทย',
  hi: 'हिन्दी',
}

const LOCALE_TITLES = {
  en: 'English',
  zh: 'Chinese (Simplified)',
  'zh-HK': 'Chinese (Hong Kong Cantonese)',
  'zh-TW': 'Chinese (Taiwan)',
  ja: 'Japanese',
  ko: 'Korean',
  th: 'Thai',
  hi: 'Hindi',
}

const LANGUAGE_COPY_UPDATES = {
  zh: {
    'c.p3': '8 种语言',
    's4.big': '一键即可在 <b>English、简体中文、廣東話（香港）、繁體中文（台灣）、日本語、한국어、ไทย、हिन्दी</b> 之间切换<b>整个实验体验</b> —— 同一页面、说明、侧栏与界面。',
    's8.s2': '在封面切换 EN / 简体中文 / 廣東話 / 繁體中文 / 日本語 / 한국어 / ไทย / हिन्दी。',
    's10.d4': '八种语言，一个可分享链接。',
  },
  ja: {
    'c.p3': '8 言語',
    's4.big': 'ワンクリックで <b>English・简体中文・廣東話（香港）・繁體中文（台灣）・日本語・한국어・ไทย・हिन्दी</b> を切り替え、<b>ラボ体験全体</b>（同じページ、手順、サイドバー、UI）が切り替わります。',
    's8.s2': '表紙で EN / 简体中文 / 廣東話 / 繁體中文 / 日本語 / 한국어 / ไทย / हिन्दी に切り替え。',
    's10.d4': '8 言語、共有リンク 1 つ。',
  },
  ko: {
    'c.p3': '8개 언어',
    's4.big': '클릭 한 번으로 <b>English, 简体中文, 廣東話(香港), 繁體中文(台灣), 日本語, 한국어, ไทย, हिन्दी</b> 사이에서 <b>랩 경험 전체</b>(같은 페이지, 안내, 사이드바, UI)가 전환됩니다.',
    's8.s2': '표지에서 EN / 简体中文 / 廣東話 / 繁體中文 / 日本語 / 한국어 / ไทย / हिन्दी로 전환.',
    's10.d4': '여덟 개 언어, 하나의 공유 링크.',
  },
  th: {
    'c.p3': '8 ภาษา',
    's4.big': 'คลิกเดียวสลับ<b>ประสบการณ์แล็บทั้งหมด</b> — หน้าเดียวกัน คำแนะนำ แถบข้าง และ UI — ระหว่าง <b>English, 简体中文, 廣東話 (香港), 繁體中文 (台灣), 日本語, 한국어, ไทย, हिन्दी</b>',
    's8.s2': 'สลับเป็น EN / 简体中文 / 廣東話 / 繁體中文 / 日本語 / 한국어 / ไทย / हिन्दी ที่หน้าปก',
    's10.d4': 'แปดภาษา ลิงก์แชร์เดียว',
  },
  hi: {
    'c.p3': '8 भाषाएँ',
    's4.big': 'एक क्लिक <b>पूरे लैब अनुभव</b> को — वही पृष्ठ, निर्देश, साइडबार, और UI — <b>English, 简体中文, 廣東話 (香港), 繁體中文 (台灣), 日本語, 한국어, ไทย, हिन्दी</b> के बीच बदल देता है।',
    's8.s2': 'कवर पर EN / 简体中文 / 廣東話 / 繁體中文 / 日本語 / 한국어 / ไทย / हिन्दी पर स्विच करें।',
    's10.d4': 'आठ भाषाएँ, एक साझा लिंक।',
  },
}

const regionalConverters = {
  'zh-HK': OpenCC.Converter({ from: 'cn', to: 'hk' }),
  'zh-TW': OpenCC.Converter({ from: 'cn', to: 'twp' }),
}

const prepareTranslations = (source) => {
  const translations = Object.fromEntries(
    Object.entries(source).map(([locale, values]) => [locale, { ...values }]),
  )

  for (const [locale, updates] of Object.entries(LANGUAGE_COPY_UPDATES)) {
    translations[locale] = { ...(translations[locale] || {}), ...updates }
  }

  for (const [locale, converter] of Object.entries(regionalConverters)) {
    translations[locale] = Object.fromEntries(
      Object.entries(translations.zh).map(([key, value]) => [key, converter(value)]),
    )
  }

  return translations
}

module.exports = {
  DECK_LOCALES,
  LANGUAGE_COPY_UPDATES,
  LOCALE_LABELS,
  LOCALE_TITLES,
  prepareTranslations,
}