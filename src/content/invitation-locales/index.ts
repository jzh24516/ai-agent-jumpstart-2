import type { Locale } from '../types'
import { enInvitation } from './en'
import { hiInvitation } from './hi'
import { jaInvitation } from './ja'
import { koInvitation } from './ko'
import { thInvitation } from './th'
import type { InvitationCopy } from './types'
import { viInvitation } from './vi'
import { zhHKInvitation, zhInvitation, zhTWInvitation } from './zh'

export const invitationCopies: Record<Locale, InvitationCopy> = {
  en: enInvitation,
  zh: zhInvitation,
  'zh-HK': zhHKInvitation,
  'zh-TW': zhTWInvitation,
  ja: jaInvitation,
  ko: koInvitation,
  th: thInvitation,
  hi: hiInvitation,
  vi: viInvitation,
}