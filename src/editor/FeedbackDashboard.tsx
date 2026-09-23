import { useEffect, useMemo, useRef, useState } from 'react'
import { BarChart3, Download, LayoutGrid, List, Moon, RefreshCw, Search, Sun, X } from 'lucide-react'
import {
  completionBand,
  countBy,
  filterFeedback,
  labCompletionStats,
  loadWorkshopFeedback,
  summarizeFeedback,
} from '../content/feedbackDashboard'
import type {
  CompletionBand,
  FeedbackDashboardWorkshop,
  FeedbackFilters,
  WorkshopFeedbackRecord,
} from '../content/feedbackDashboard'
import { downloadFeedbackDashboardHtml } from '../content/feedbackDashboardExport'
import type { FeedbackDashboardExportLabels } from '../content/feedbackDashboardExport'
import { localeNames, text } from '../content/ui'
import type { Locale, LocalizedText } from '../content/types'

type Props = {
  workshop: FeedbackDashboardWorkshop
  locale: Locale
  reloadKey: number
  onAuthRequired: () => void
  onClose: () => void
}

type CopyKey =
  | 'title' | 'subtitle' | 'refresh' | 'close' | 'responses' | 'overall' | 'effort' | 'recommend'
  | 'overallScore' | 'effortScore' | 'recommendScore'
  | 'completion' | 'comments' | 'positiveRatings' | 'easyRatings' | 'recommendRate' | 'completeResponses'
  | 'commentedResponses' | 'ratingBreakdown' | 'localeBreakdown' | 'completionBreakdown' | 'labCompletion'
  | 'details' | 'search' | 'clearFilters' | 'showing' | 'submitted' | 'respondent' | 'anonymous'
  | 'scores' | 'progress' | 'noResponses' | 'noMatches' | 'loadFailed' | 'retry' | 'consentedEmail'
  | 'retention' | 'completedLab' | 'allResponses' | 'complete' | 'high' | 'medium' | 'low'
  | 'cards' | 'table' | 'switchToLight' | 'switchToDark' | 'exportHtml' | 'exporting'

const copy: Record<CopyKey, LocalizedText> = {
  title: { en: 'Feedback dashboard', zh: '反馈仪表板', ja: 'フィードバック ダッシュボード', ko: '피드백 대시보드', th: 'แดชบอร์ดความคิดเห็น', hi: 'फ़ीडबैक डैशबोर्ड', vi: 'Dashboard phản hồi' },
  subtitle: { en: 'Workshop-level survey analysis', zh: '研讨会级问卷分析', ja: 'ワークショップ単位のアンケート分析', ko: '워크숍 설문 분석', th: 'การวิเคราะห์แบบสำรวจระดับเวิร์กช็อป', hi: 'वर्कशॉप-स्तरीय सर्वे विश्लेषण', vi: 'Phân tích khảo sát theo workshop' },
  refresh: { en: 'Refresh', zh: '刷新', ja: '更新', ko: '새로 고침', th: 'รีเฟรช', hi: 'रीफ़्रेश', vi: 'Làm mới' },
  close: { en: 'Close dashboard', zh: '关闭仪表板', ja: 'ダッシュボードを閉じる', ko: '대시보드 닫기', th: 'ปิดแดชบอร์ด', hi: 'डैशबोर्ड बंद करें', vi: 'Đóng dashboard' },
  responses: { en: 'Responses', zh: '反馈数量', ja: '回答数', ko: '응답 수', th: 'จำนวนคำตอบ', hi: 'प्रतिक्रियाएँ', vi: 'Phản hồi' },
  overall: { en: 'Avg. overall', zh: '平均整体评分', ja: '総合平均', ko: '전체 평균', th: 'คะแนนรวมเฉลี่ย', hi: 'औसत समग्र', vi: 'Trung bình tổng thể' },
  effort: { en: 'Avg. effort', zh: '平均投入程度', ja: '労力平均', ko: '노력 평균', th: 'ความพยายามเฉลี่ย', hi: 'औसत प्रयास', vi: 'Effort trung bình' },
  recommend: { en: 'Recommend', zh: '推荐率', ja: '推奨率', ko: '추천률', th: 'อัตราแนะนำ', hi: 'अनुशंसा', vi: 'Tỷ lệ giới thiệu' },
  overallScore: { en: 'Overall', zh: '整体评分', ja: '総合評価', ko: '전체 점수', th: 'คะแนนรวม', hi: 'समग्र स्कोर', vi: 'Tổng thể' },
  effortScore: { en: 'Effort', zh: '投入程度', ja: '労力', ko: '노력', th: 'ความพยายาม', hi: 'प्रयास', vi: 'Effort' },
  recommendScore: { en: 'Recommend', zh: '推荐评分', ja: '推奨', ko: '추천 점수', th: 'คะแนนแนะนำ', hi: 'अनुशंसा स्कोर', vi: 'Giới thiệu' },
  completion: { en: 'Avg. completion', zh: '平均完成度', ja: '平均完了率', ko: '평균 완료율', th: 'ความสำเร็จเฉลี่ย', hi: 'औसत पूर्णता', vi: 'Hoàn thành trung bình' },
  comments: { en: 'With comments', zh: '含评论', ja: 'コメントあり', ko: '의견 있음', th: 'มีความคิดเห็น', hi: 'टिप्पणी सहित', vi: 'Có nhận xét' },
  positiveRatings: { en: 'Overall score 4–5', zh: '整体评分 4–5', ja: '総合評価 4–5', ko: '전체 점수 4–5', th: 'คะแนนรวม 4–5', hi: 'समग्र स्कोर 4–5', vi: 'Điểm tổng thể 4–5' },
  easyRatings: { en: 'Effort score 1–2', zh: '投入程度 1–2', ja: '労力 1–2', ko: '노력 점수 1–2', th: 'ความพยายาม 1–2', hi: 'प्रयास स्कोर 1–2', vi: 'Điểm effort 1–2' },
  recommendRate: { en: 'Recommend score 4–5', zh: '推荐评分 4–5', ja: '推奨 4–5', ko: '추천 점수 4–5', th: 'คะแนนแนะนำ 4–5', hi: 'अनुशंसा स्कोर 4–5', vi: 'Điểm giới thiệu 4–5' },
  completeResponses: { en: '100% completion', zh: '100% 完成', ja: '100% 完了', ko: '100% 완료', th: 'เสร็จ 100%', hi: '100% पूर्ण', vi: 'Hoàn thành 100%' },
  commentedResponses: { en: 'Responses with comments', zh: '包含评论的反馈', ja: 'コメント付き回答', ko: '의견이 있는 응답', th: 'คำตอบที่มีความคิดเห็น', hi: 'टिप्पणी वाली प्रतिक्रियाएँ', vi: 'Phản hồi có nhận xét' },
  ratingBreakdown: { en: 'Rating breakdown', zh: '评分分布', ja: '評価分布', ko: '평점 분포', th: 'การกระจายคะแนน', hi: 'रेटिंग विभाजन', vi: 'Phân bổ điểm' },
  localeBreakdown: { en: 'Language', zh: '语言', ja: '言語', ko: '언어', th: 'ภาษา', hi: 'भाषा', vi: 'Ngôn ngữ' },
  completionBreakdown: { en: 'Completion bands', zh: '完成度区间', ja: '完了率帯', ko: '완료 구간', th: 'ช่วงความสำเร็จ', hi: 'पूर्णता श्रेणियाँ', vi: 'Mức độ hoàn thành' },
  labCompletion: { en: 'Lab completion', zh: '实验完成度', ja: 'ラボ完了率', ko: '랩 완료율', th: 'ความสำเร็จของแล็บ', hi: 'लैब पूर्णता', vi: 'Hoàn thành lab' },
  details: { en: 'Survey responses', zh: '问卷反馈明细', ja: 'アンケート回答', ko: '설문 응답', th: 'รายละเอียดคำตอบ', hi: 'सर्वे प्रतिक्रियाएँ', vi: 'Chi tiết phản hồi' },
  search: { en: 'Search comments, email, ID…', zh: '搜索评论、邮箱、ID…', ja: 'コメント、メール、ID を検索…', ko: '의견, 이메일, ID 검색…', th: 'ค้นหาความคิดเห็น อีเมล ID…', hi: 'टिप्पणी, ईमेल, ID खोजें…', vi: 'Tìm nhận xét, email, ID…' },
  clearFilters: { en: 'Clear filters', zh: '清除筛选', ja: 'フィルターを解除', ko: '필터 지우기', th: 'ล้างตัวกรอง', hi: 'फ़िल्टर हटाएँ', vi: 'Xóa bộ lọc' },
  showing: { en: 'Showing {shown} of {total}', zh: '显示 {shown} / {total}', ja: '{total} 件中 {shown} 件', ko: '{total}개 중 {shown}개', th: 'แสดง {shown} จาก {total}', hi: '{total} में से {shown}', vi: 'Hiển thị {shown}/{total}' },
  submitted: { en: 'Submitted', zh: '提交时间', ja: '送信日時', ko: '제출 시간', th: 'ส่งเมื่อ', hi: 'सबमिट किया गया', vi: 'Đã gửi' },
  respondent: { en: 'Respondent', zh: '反馈者', ja: '回答者', ko: '응답자', th: 'ผู้ตอบ', hi: 'प्रतिवादी', vi: 'Người phản hồi' },
  anonymous: { en: 'Anonymous', zh: '匿名', ja: '匿名', ko: '익명', th: 'ไม่ระบุตัวตน', hi: 'अनाम', vi: 'Ẩn danh' },
  scores: { en: 'Scores', zh: '评分', ja: 'スコア', ko: '점수', th: 'คะแนน', hi: 'स्कोर', vi: 'Điểm' },
  progress: { en: 'Progress', zh: '进度', ja: '進捗', ko: '진행률', th: 'ความคืบหน้า', hi: 'प्रगति', vi: 'Tiến độ' },
  noResponses: { en: 'No feedback has been submitted for this workshop yet.', zh: '此研讨会尚未收到反馈。', ja: 'このワークショップにはまだ回答がありません。', ko: '이 워크숍에 제출된 피드백이 없습니다.', th: 'ยังไม่มีความคิดเห็นสำหรับเวิร์กช็อปนี้', hi: 'इस वर्कशॉप के लिए अभी कोई फ़ीडबैक नहीं है।', vi: 'Workshop này chưa có phản hồi.' },
  noMatches: { en: 'No responses match the active filters.', zh: '没有符合当前筛选条件的反馈。', ja: 'フィルターに一致する回答がありません。', ko: '현재 필터와 일치하는 응답이 없습니다.', th: 'ไม่มีคำตอบที่ตรงกับตัวกรอง', hi: 'सक्रिय फ़िल्टर से कोई प्रतिक्रिया मेल नहीं खाती।', vi: 'Không có phản hồi phù hợp bộ lọc.' },
  loadFailed: { en: 'Feedback could not be loaded from Dataverse.', zh: '无法从 Dataverse 加载反馈。', ja: 'Dataverse から回答を読み込めませんでした。', ko: 'Dataverse에서 피드백을 불러올 수 없습니다.', th: 'ไม่สามารถโหลดความคิดเห็นจาก Dataverse', hi: 'Dataverse से फ़ीडबैक लोड नहीं हो सका।', vi: 'Không thể tải phản hồi từ Dataverse.' },
  retry: { en: 'Try again', zh: '重试', ja: '再試行', ko: '다시 시도', th: 'ลองอีกครั้ง', hi: 'फिर प्रयास करें', vi: 'Thử lại' },
  consentedEmail: { en: 'Consented email', zh: '已同意提供的邮箱', ja: '同意済みメール', ko: '동의한 이메일', th: 'อีเมลที่ยินยอม', hi: 'सहमति वाला ईमेल', vi: 'Email đã đồng ý' },
  retention: { en: 'Retention expiry', zh: '保留到期时间', ja: '保持期限', ko: '보존 만료', th: 'วันหมดอายุการเก็บรักษา', hi: 'प्रतिधारण समाप्ति', vi: 'Hết hạn lưu giữ' },
  completedLab: { en: 'Completed {lab}', zh: '已完成 {lab}', ja: '{lab} 完了', ko: '{lab} 완료', th: 'เสร็จ {lab}', hi: '{lab} पूर्ण', vi: 'Đã hoàn thành {lab}' },
  allResponses: { en: 'All responses', zh: '全部反馈', ja: 'すべての回答', ko: '모든 응답', th: 'คำตอบทั้งหมด', hi: 'सभी प्रतिक्रियाएँ', vi: 'Tất cả phản hồi' },
  complete: { en: '100%', zh: '100%', ja: '100%', ko: '100%', th: '100%', hi: '100%', vi: '100%' },
  high: { en: '75–99%', zh: '75–99%', ja: '75–99%', ko: '75–99%', th: '75–99%', hi: '75–99%', vi: '75–99%' },
  medium: { en: '50–74%', zh: '50–74%', ja: '50–74%', ko: '50–74%', th: '50–74%', hi: '50–74%', vi: '50–74%' },
  low: { en: '<50%', zh: '<50%', ja: '<50%', ko: '<50%', th: '<50%', hi: '<50%', vi: '<50%' },
  cards: { en: 'Cards', zh: '卡片', ja: 'カード', ko: '카드', th: 'การ์ด', hi: 'कार्ड', vi: 'Thẻ' },
  table: { en: 'Table', zh: '表格', ja: 'テーブル', ko: '표', th: 'ตาราง', hi: 'तालिका', vi: 'Bảng' },
  switchToLight: { en: 'Switch to light theme', zh: '切换到浅色主题', ja: 'ライト テーマに切り替える', ko: '밝은 테마로 전환', th: 'เปลี่ยนเป็นธีมสว่าง', hi: 'लाइट थीम पर स्विच करें', vi: 'Chuyển sang giao diện sáng' },
  switchToDark: { en: 'Switch to dark theme', zh: '切换到深色主题', ja: 'ダーク テーマに切り替える', ko: '어두운 테마로 전환', th: 'เปลี่ยนเป็นธีมมืด', hi: 'डार्क थीम पर स्विच करें', vi: 'Chuyển sang giao diện tối' },
  exportHtml: { en: 'Export to HTML', zh: '导出为 HTML', ja: 'HTML にエクスポート', ko: 'HTML로 내보내기', th: 'ส่งออกเป็น HTML', hi: 'HTML में निर्यात करें', vi: 'Xuất ra HTML' },
  exporting: { en: 'Exporting…', zh: '正在导出…', ja: 'エクスポート中…', ko: '내보내는 중…', th: 'กำลังส่งออก…', hi: 'निर्यात हो रहा है…', vi: 'Đang xuất…' },
}

const t = (key: CopyKey, locale: Locale) => text(copy[key], locale)
const rounded = (value: number, digits = 1) => value.toFixed(digits)
const percent = (value: number) => `${Math.round(value)}%`
const localeLabel = (locale: Locale) => localeNames[locale] || locale
const labLabel = (labId: string) => `Lab ${Number(labId.replace(/\D/g, '')) || labId}`

const dateLabel = (value: string, locale: Locale) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value || '—' : date.toLocaleString(locale === 'zh' ? 'zh-CN' : locale, { dateStyle: 'medium', timeStyle: 'short' })
}

function Distribution({
  title, values, active, onSelect,
}: {
  title: string
  values: Array<{ key: string; label: string; count: number }>
  active?: string
  onSelect: (key: string) => void
}) {
  const maximum = Math.max(1, ...values.map((item) => item.count))
  return <section className="feedback-panel">
    <h3>{title}</h3>
    <div className="feedback-bars">
      {values.map((item) => <button className={active === item.key ? 'feedback-bar active' : 'feedback-bar'} type="button" key={item.key} onClick={() => onSelect(item.key)}>
        <span className="feedback-bar-label">{item.label}</span>
        <span className="feedback-bar-track"><i style={{ width: `${item.count / maximum * 100}%` }} /></span>
        <strong>{item.count}</strong>
      </button>)}
    </div>
  </section>
}

export default function FeedbackDashboard({ workshop, locale, reloadKey, onAuthRequired, onClose }: Props) {
  const [responses, setResponses] = useState<WorkshopFeedbackRecord[]>([])
  const [filters, setFilters] = useState<FeedbackFilters>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [requestVersion, setRequestVersion] = useState(0)
  const [logoFailed, setLogoFailed] = useState(false)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>(() => {
    try { return localStorage.getItem('jumpstart-feedback-dashboard-view') === 'table' ? 'table' : 'cards' }
    catch { return 'cards' }
  })
  const [dashboardTheme, setDashboardTheme] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem('jumpstart-feedback-dashboard-theme')
      if (stored === 'light' || stored === 'dark') return stored
    } catch { /* Use the app theme when storage is unavailable. */ }
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  })
  const [exporting, setExporting] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => { setLogoFailed(false) }, [workshop.customerLogo])
  useEffect(() => {
    try { localStorage.setItem('jumpstart-feedback-dashboard-view', viewMode) }
    catch { /* View preference remains active for this session. */ }
  }, [viewMode])
  useEffect(() => {
    try { localStorage.setItem('jumpstart-feedback-dashboard-theme', dashboardTheme) }
    catch { /* Theme preference remains active for this session. */ }
  }, [dashboardTheme])

  useEffect(() => {
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  const load = () => setRequestVersion((version) => version + 1)
  useEffect(() => {
    let cancelled = false
    const workshopId = workshop.workshopId?.trim()
    if (!workshopId) { setResponses([]); setLoading(false); setError(true); return }
    setLoading(true)
    setError(false)
    loadWorkshopFeedback(workshopId)
      .then((payload) => { if (!cancelled) setResponses(payload.responses) })
      .catch((loadError) => {
        if (cancelled) return
        setError(true)
        if ((loadError as Error).name === 'AuthRequired') onAuthRequired()
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [onAuthRequired, reloadKey, requestVersion, workshop.workshopId])

  const summary = useMemo(() => summarizeFeedback(responses), [responses])
  const filtered = useMemo(() => filterFeedback(responses, filters), [filters, responses])
  const overallCounts = useMemo(() => countBy(responses, (record) => record.overall), [responses])
  const effortCounts = useMemo(() => countBy(responses, (record) => record.effort), [responses])
  const recommendCounts = useMemo(() => countBy(responses, (record) => record.recommend), [responses])
  const localeCounts = useMemo(() => countBy(responses, (record) => record.locale), [responses])
  const completionCounts = useMemo(() => countBy(responses, (record) => completionBand(record.completionPercent)), [responses])
  const labs = useMemo(() => labCompletionStats(responses), [responses])
  const hasFilters = Object.values(filters).some((value) => value !== undefined && value !== '')

  const setSingleFilter = (next: FeedbackFilters) => setFilters((current) => JSON.stringify(current) === JSON.stringify(next) ? {} : next)
  const ratingValues = (counts: Map<number, number>) => [1, 2, 3, 4, 5].map((score) => ({ key: String(score), label: `${score} ★`, count: counts.get(score) ?? 0 }))
  const completionValues: Array<{ key: CompletionBand; label: string; count: number }> = (['complete', 'high', 'medium', 'low'] as CompletionBand[]).map((band) => ({ key: band, label: t(band, locale), count: completionCounts.get(band) ?? 0 }))
  const showing = t('showing', locale).replace('{shown}', String(filtered.length)).replace('{total}', String(responses.length))
  const engagementName = workshop.name.trim() || workshop.customerName.trim() || t('title', locale)
  const engagementInitial = Array.from(engagementName)[0]?.toLocaleUpperCase(locale === 'zh' ? 'zh-CN' : locale) || '?'
  const exportLabels: FeedbackDashboardExportLabels = {
    documentTitle: t('title', locale), subtitle: t('subtitle', locale), responses: t('responses', locale), overall: t('overall', locale), effort: t('effort', locale), recommend: t('recommend', locale), completion: t('completion', locale), comments: t('comments', locale),
    positiveRatings: t('positiveRatings', locale), easyRatings: t('easyRatings', locale), recommendRate: t('recommendRate', locale), completeResponses: t('completeResponses', locale), commentedResponses: t('commentedResponses', locale), ratingBreakdown: t('ratingBreakdown', locale), completionBreakdown: t('completionBreakdown', locale), localeBreakdown: t('localeBreakdown', locale), labCompletion: t('labCompletion', locale), details: t('details', locale), submitted: t('submitted', locale), respondent: t('respondent', locale), anonymous: t('anonymous', locale), progress: t('progress', locale), retention: t('retention', locale), search: t('search', locale), clearFilters: t('clearFilters', locale), allResponses: t('allResponses', locale), noMatches: t('noMatches', locale), cards: t('cards', locale), table: t('table', locale), lightTheme: t('switchToLight', locale), darkTheme: t('switchToDark', locale), overallScore: t('overallScore', locale), effortScore: t('effortScore', locale), recommendScore: t('recommendScore', locale),
    completionBands: { complete: t('complete', locale), high: t('high', locale), medium: t('medium', locale), low: t('low', locale) },
    localeNames,
  }
  const exportDashboard = async () => {
    setExporting(true)
    try { await downloadFeedbackDashboardHtml({ workshop, records: responses, labels: exportLabels, locale, theme: dashboardTheme, viewMode }) }
    finally { setExporting(false) }
  }

  return <div className="feedback-dashboard-overlay" data-dashboard-theme={dashboardTheme} role="dialog" aria-modal="true" aria-label={t('title', locale)}>
    <div className="feedback-dashboard">
      <header className="feedback-dashboard-head">
        <div className="feedback-dashboard-heading">
          <span className="feedback-dashboard-logo">{workshop.customerLogo && !logoFailed ? <img src={workshop.customerLogo} alt={workshop.customerName || engagementName} onError={() => setLogoFailed(true)} /> : <b>{engagementInitial}</b>}</span>
          <div><span>{t('subtitle', locale)}</span><h2>{engagementName}</h2><small>{[workshop.hostName, workshop.customerName, workshop.workshopStart && workshop.workshopEnd ? `${workshop.workshopStart} – ${workshop.workshopEnd}` : ''].filter(Boolean).join(' · ')}</small></div>
        </div>
        <div className="feedback-dashboard-actions">
          <button type="button" className="ghost-button feedback-action-button feedback-export-button" disabled={loading || exporting} onClick={() => void exportDashboard()} title={t('exportHtml', locale)}><Download size={15} /><span>{t(exporting ? 'exporting' : 'exportHtml', locale)}</span></button>
          <button type="button" className="icon-button" onClick={() => setDashboardTheme((current) => current === 'dark' ? 'light' : 'dark')} aria-label={t(dashboardTheme === 'dark' ? 'switchToLight' : 'switchToDark', locale)} title={t(dashboardTheme === 'dark' ? 'switchToLight' : 'switchToDark', locale)}>{dashboardTheme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button>
          <button type="button" className="ghost-button feedback-action-button" disabled={loading} onClick={load}><RefreshCw size={15} /><span>{t('refresh', locale)}</span></button>
          <button ref={closeButtonRef} type="button" className="icon-button" onClick={onClose} aria-label={t('close', locale)} title={t('close', locale)}><X size={18} /></button>
        </div>
      </header>

      <div className="feedback-dashboard-body">
        {loading && <div className="feedback-dashboard-state"><RefreshCw className="feedback-spin" size={26} /><span>{t('refresh', locale)}…</span></div>}
        {!loading && error && <div className="feedback-dashboard-state error"><strong>{t('loadFailed', locale)}</strong><button type="button" className="copy-button" onClick={load}>{t('retry', locale)}</button></div>}
        {!loading && !error && responses.length === 0 && <div className="feedback-dashboard-state"><BarChart3 size={28} /><strong>{t('noResponses', locale)}</strong></div>}
        {!loading && !error && responses.length > 0 && <>
          <section className="feedback-kpis" aria-label={t('title', locale)}>
            <button type="button" className={!hasFilters ? 'feedback-kpi active' : 'feedback-kpi'} onClick={() => setFilters({})}><span>{t('responses', locale)}</span><strong>{summary.responses}</strong><small>{t('allResponses', locale)}</small></button>
            <button type="button" className={filters.overall === 'positive' ? 'feedback-kpi active' : 'feedback-kpi'} onClick={() => setSingleFilter({ overall: 'positive' })}><span>{t('overall', locale)}</span><strong>{rounded(summary.averageOverall)}</strong><small>{t('positiveRatings', locale)}</small></button>
            <button type="button" className={filters.effort === 'easy' ? 'feedback-kpi active' : 'feedback-kpi'} onClick={() => setSingleFilter({ effort: 'easy' })}><span>{t('effort', locale)}</span><strong>{rounded(summary.averageEffort)}</strong><small>{t('easyRatings', locale)}</small></button>
            <button type="button" className={filters.recommend === 'positive' ? 'feedback-kpi active' : 'feedback-kpi'} onClick={() => setSingleFilter({ recommend: 'positive' })}><span>{t('recommend', locale)}</span><strong>{percent(summary.recommendationRate)}</strong><small>{t('recommendRate', locale)}</small></button>
            <button type="button" className={filters.completion === 'complete' ? 'feedback-kpi active' : 'feedback-kpi'} onClick={() => setSingleFilter({ completion: 'complete' })}><span>{t('completion', locale)}</span><strong>{percent(summary.averageCompletion)}</strong><small>{t('completeResponses', locale)}</small></button>
            <button type="button" className={filters.comments === true ? 'feedback-kpi active' : 'feedback-kpi'} onClick={() => setSingleFilter({ comments: true })}><span>{t('comments', locale)}</span><strong>{percent(summary.commentRate)}</strong><small>{t('commentedResponses', locale)}</small></button>
          </section>

          <div className="feedback-breakdowns">
            <Distribution title={`${t('ratingBreakdown', locale)} · ${t('overallScore', locale)}`} values={ratingValues(overallCounts)} active={typeof filters.overall === 'number' ? String(filters.overall) : undefined} onSelect={(key) => setSingleFilter({ overall: Number(key) })} />
            <Distribution title={`${t('ratingBreakdown', locale)} · ${t('effortScore', locale)}`} values={ratingValues(effortCounts)} active={typeof filters.effort === 'number' ? String(filters.effort) : undefined} onSelect={(key) => setSingleFilter({ effort: Number(key) })} />
            <Distribution title={`${t('ratingBreakdown', locale)} · ${t('recommendScore', locale)}`} values={ratingValues(recommendCounts)} active={typeof filters.recommend === 'number' ? String(filters.recommend) : undefined} onSelect={(key) => setSingleFilter({ recommend: Number(key) })} />
            <Distribution title={t('completionBreakdown', locale)} values={completionValues} active={filters.completion} onSelect={(key) => setSingleFilter({ completion: key as CompletionBand })} />
            <Distribution title={t('localeBreakdown', locale)} values={[...localeCounts.entries()].sort((left, right) => right[1] - left[1]).map(([itemLocale, count]) => ({ key: itemLocale, label: localeLabel(itemLocale), count }))} active={filters.locale} onSelect={(key) => setSingleFilter({ locale: key as Locale })} />
            <Distribution title={t('labCompletion', locale)} values={labs.map((lab) => ({ key: lab.labId, label: `${labLabel(lab.labId)} · ${Math.round(lab.averagePercent)}%`, count: lab.completed }))} active={filters.completedLabId} onSelect={(key) => setSingleFilter({ completedLabId: key })} />
          </div>

          <section className="feedback-details">
            <div className="feedback-details-head"><div><h3>{t('details', locale)}</h3><span>{showing}</span></div><div className="feedback-detail-tools"><div className="feedback-view-switch" role="group" aria-label={t('details', locale)}><button type="button" className={viewMode === 'cards' ? 'active' : ''} aria-pressed={viewMode === 'cards'} onClick={() => setViewMode('cards')}><LayoutGrid size={14} />{t('cards', locale)}</button><button type="button" className={viewMode === 'table' ? 'active' : ''} aria-pressed={viewMode === 'table'} onClick={() => setViewMode('table')}><List size={14} />{t('table', locale)}</button></div><label className="feedback-search"><Search size={15} /><input value={filters.query ?? ''} onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))} placeholder={t('search', locale)} /></label>{hasFilters && <button type="button" className="ghost-button" onClick={() => setFilters({})}>{t('clearFilters', locale)}</button>}</div></div>
            {filtered.length === 0 && <div className="feedback-dashboard-state compact">{t('noMatches', locale)}</div>}
            {viewMode === 'cards' && <div className="feedback-response-list">
              {filtered.map((record) => <article className="feedback-response" key={record.submissionId}>
                <div className="feedback-response-top"><div><span>{t('submitted', locale)}</span><strong>{dateLabel(record.submittedAt, locale)}</strong></div><span className="feedback-locale">{localeLabel(record.locale)}</span></div>
                <div className="feedback-response-metrics"><span><small>{t('overallScore', locale)}</small><b>{record.overall}/5</b></span><span><small>{t('effortScore', locale)}</small><b>{record.effort}/5</b></span><span><small>{t('recommendScore', locale)}</small><b>{record.recommend}/5</b></span><span><small>{t('progress', locale)}</small><b>{record.completionPercent}%</b></span></div>
                <div className="feedback-progress-track"><i style={{ width: `${record.completionPercent}%` }} /></div>
                <p className={record.comments ? 'feedback-comment' : 'feedback-comment empty'}>{record.comments || '—'}</p>
                <div className="feedback-response-meta"><span><b>{t('respondent', locale)}:</b> {record.attendeeEmail || t('anonymous', locale)}</span><span><b>{t('progress', locale)}:</b> {record.completedSteps}/{record.totalSteps}</span><span><b>{t('retention', locale)}:</b> {dateLabel(record.retentionExpiresAt, locale)}</span></div>
                {record.labStatus.length > 0 && <div className="feedback-lab-status">{record.labStatus.map((lab) => <span className={lab.totalSteps > 0 && lab.completedSteps === lab.totalSteps ? 'complete' : ''} key={lab.labId}>{labLabel(lab.labId)} {lab.completedSteps}/{lab.totalSteps}</span>)}</div>}
              </article>)}
            </div>}
            {viewMode === 'table' && filtered.length > 0 && <div className="feedback-table-wrap"><table className="feedback-table"><colgroup><col className="feedback-table-response-col" /><col /><col /><col /><col /></colgroup><thead><tr><th>{t('respondent', locale)}</th><th>{t('overallScore', locale)}</th><th>{t('effortScore', locale)}</th><th>{t('recommendScore', locale)}</th><th>{t('progress', locale)}</th></tr></thead><tbody>{filtered.map((record) => <tr key={record.submissionId}><td><strong className="feedback-table-title">{record.attendeeEmail || t('anonymous', locale)}</strong><span className="feedback-table-description">{record.comments || '—'}</span><small>{dateLabel(record.submittedAt, locale)} · {localeLabel(record.locale)} · {record.submissionId}</small></td><td>{record.overall}/5</td><td>{record.effort}/5</td><td>{record.recommend}/5</td><td><strong>{record.completionPercent}%</strong><small>{record.completedSteps}/{record.totalSteps}</small></td></tr>)}</tbody></table></div>}
          </section>
        </>}
      </div>
    </div>
  </div>
}
