export type InvitationLabCopy = {
  title: string
  description: string
}

export type InvitationCopy = {
  documentTitle: string
  description: string
  dateToBeConfirmed: string
  dateRange: string
  switchToDark: string
  switchToLight: string
  fallbackContactName: string
  fallbackContactDetails: string
  eyebrow: string
  title: string
  heroSubtitle: string
  facts: {
    noCost: string
    halfDay: string
    participants: string
    labs: string
    languages: string
    inPerson: string
    coaches: string
  }
  lead: string
  programTitle: string
  costTitle: string
  costItems: readonly [string, string, string]
  audienceTitle: string
  audienceItems: readonly [string, string, string, string]
  logisticsTitle: string
  logisticsItems: readonly [string, string, string, string]
  eligibilityTitle: string
  eligibilityItems: readonly [string, string, string]
  labsTitle: string
  labsIntro: string
  labItems: readonly [InvitationLabCopy, InvitationLabCopy, InvitationLabCopy, InvitationLabCopy, InvitationLabCopy, InvitationLabCopy]
  includedTitle: string
  hostProvides: string
  hostItems: readonly [string, string, string, string]
  customerProvides: string
  customerItems: readonly [string, string, string, string]
  ctaTitle: string
  ctaBody: string
  footer: string
}