export type Locale = 'en' | 'zh' | 'ja' | 'ko' | 'th' | 'hi'

// English is required; every other locale is optional and falls back to English.
export type LocalizedText = { en: string } & Partial<Record<Exclude<Locale, 'en'>, string>>

export type LabIconName = 'sparkles' | 'database' | 'file' | 'network' | 'mail' | 'mic'

export interface LabPrompt {
  id: string
  title?: LocalizedText
  content: string
}

export interface LabStepPage {
  id: string
  title?: LocalizedText
  paragraphs: LocalizedText[]
  markdown?: LocalizedText
  highlight?: LocalizedText
  prompt?: string
  prompts?: LabPrompt[]
  imageKeys?: string[]
}

export interface LabStep {
  id: string
  title: LocalizedText
  body?: LocalizedText
  highlight?: LocalizedText
  prompt?: string
  imageKey?: string
  pages?: LabStepPage[]
}

export interface Lab {
  id: string
  number: number
  icon: LabIconName
  duration: number
  title: LocalizedText
  summary: LocalizedText
  outcome: LocalizedText
  objectives: LocalizedText[]
  prerequisites: LocalizedText[]
  steps: LabStep[]
}

export interface ContentModel {
  version: number
  labs: Lab[]
}