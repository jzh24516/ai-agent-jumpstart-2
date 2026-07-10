export type Locale = 'en' | 'zh' | 'ja' | 'ko'

export type LocalizedText = Record<Locale, string>

export type LabIconName = 'sparkles' | 'database' | 'file' | 'network' | 'mail' | 'mic'

export interface LabStepPage {
  id: string
  title?: LocalizedText
  paragraphs: LocalizedText[]
  highlight?: LocalizedText
  prompt?: string
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