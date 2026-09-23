import type { FeedbackDashboardWorkshop, WorkshopFeedbackRecord } from './feedbackDashboard'
import type { Locale } from './types'

export type FeedbackDashboardExportLabels = {
  documentTitle: string
  subtitle: string
  responses: string
  overall: string
  effort: string
  recommend: string
  completion: string
  comments: string
  positiveRatings: string
  easyRatings: string
  recommendRate: string
  completeResponses: string
  commentedResponses: string
  ratingBreakdown: string
  completionBreakdown: string
  localeBreakdown: string
  labCompletion: string
  details: string
  submitted: string
  respondent: string
  anonymous: string
  progress: string
  retention: string
  search: string
  clearFilters: string
  allResponses: string
  noMatches: string
  cards: string
  table: string
  lightTheme: string
  darkTheme: string
  overallScore: string
  effortScore: string
  recommendScore: string
  completionBands: Record<'complete' | 'high' | 'medium' | 'low', string>
  localeNames: Record<string, string>
}

type BuildOptions = {
  workshop: FeedbackDashboardWorkshop
  records: WorkshopFeedbackRecord[]
  labels: FeedbackDashboardExportLabels
  locale: Locale
  theme: 'light' | 'dark'
  viewMode: 'cards' | 'table'
}

const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')

const safeJson = (value: unknown) => JSON.stringify(value)
  .replaceAll('<', '\\u003c')
  .replaceAll('\u2028', '\\u2028')
  .replaceAll('\u2029', '\\u2029')

const blobToDataUrl = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(String(reader.result))
  reader.onerror = () => reject(reader.error)
  reader.readAsDataURL(blob)
})

const inlineLogo = async (source: string): Promise<string> => {
  const value = source.trim()
  if (!value) return ''
  if (/^data:image\//i.test(value)) return value
  if (!/^https?:\/\//i.test(value)) return ''
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 3000)
  try {
    const response = await fetch(value, { mode: 'cors', signal: controller.signal })
    if (!response.ok) return ''
    const blob = await response.blob()
    return blob.type.toLowerCase().startsWith('image/') ? await blobToDataUrl(blob) : ''
  } catch {
    return ''
  } finally {
    window.clearTimeout(timeout)
  }
}

const slug = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export async function buildFeedbackDashboardHtml(options: BuildOptions): Promise<{ html: string; filename: string }> {
  const { workshop, records, labels, locale, theme, viewMode } = options
  const logo = await inlineLogo(workshop.customerLogo)
  const engagementName = workshop.name.trim() || workshop.customerName.trim() || labels.documentTitle
  const initial = Array.from(engagementName)[0]?.toLocaleUpperCase(locale === 'zh' ? 'zh-CN' : locale) || '?'
  const logoMarkup = logo
    ? `<img src="${escapeHtml(logo)}" alt="${escapeHtml(workshop.customerName || engagementName)}">`
    : `<span>${escapeHtml(initial)}</span>`
  const metadata = [workshop.hostName, workshop.customerName, workshop.workshopStart && workshop.workshopEnd ? `${workshop.workshopStart} - ${workshop.workshopEnd}` : ''].filter(Boolean).join(' · ')
  const documentTitle = `${engagementName} - ${labels.documentTitle}`
  const payload = safeJson({ records, labels, locale, viewMode })

  const html = `<!doctype html>
<html lang="${escapeHtml(locale === 'zh' ? 'zh-CN' : locale)}" data-theme="${theme}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(documentTitle)}</title>
<style>
:root{color-scheme:light;--bg:#f5f7fb;--surface:#fff;--soft:#f0f3f8;--border:#d7dce5;--text:#20242c;--muted:#626a78;--accent:#6750a4;--accent-soft:#ede8f8;--success:#16794a;--danger:#b42318;--shadow:0 18px 54px rgba(30,35,48,.12);--heading:#251b3f;--action-bg:#fff;--action-fg:#352a49;--action-border:#c8bedb;--action-hover:#f3effb;--primary-bg:#6750a4;--primary-fg:#fff;--primary-hover:#57418f}
html[data-theme="dark"]{color-scheme:dark;--bg:#242424;--surface:#2d2d2d;--soft:#383838;--border:#4b4b4b;--text:#f0f0f0;--muted:#aaa;--accent:#b9a7ee;--accent-soft:#403856;--success:#6dd89d;--danger:#ff8b82;--shadow:0 18px 54px rgba(0,0,0,.35);--heading:#f6f3ff;--action-bg:#353535;--action-fg:#f0f0f0;--action-border:#575757;--action-hover:#403856;--primary-bg:#a892e3;--primary-fg:#211833;--primary-hover:#b9a7ee}
*{box-sizing:border-box}body{margin:0;color:var(--text);background:var(--bg);font-family:"Segoe UI",Aptos,sans-serif}.shell{max-width:1500px;margin:auto;min-height:100vh}.head{position:sticky;top:0;z-index:5;display:flex;justify-content:space-between;align-items:center;gap:18px;padding:14px 20px;background:color-mix(in srgb,var(--surface) 94%,transparent);border-bottom:1px solid var(--border);backdrop-filter:blur(12px)}.brand{min-width:0;display:flex;align-items:center;gap:13px}.mark{width:48px;height:48px;display:grid;place-items:center;flex:0 0 auto;overflow:hidden;color:var(--accent);background:var(--accent-soft);border:1px solid var(--border);border-radius:9px;font-size:20px;font-weight:800}.mark img{width:100%;height:100%;object-fit:contain}.brand div{min-width:0}.brand small,.brand span{display:block;overflow:hidden;color:var(--muted);font-size:11px;text-overflow:ellipsis;white-space:nowrap}.brand h1{margin:2px 0;font-size:21px;line-height:1.15;letter-spacing:0}.tools,.seg{display:flex;align-items:center;gap:6px}.tools button,.seg button,.clear{min-height:38px;padding:0 12px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:7px;cursor:pointer;font:inherit;font-size:12px;font-weight:700}.seg button.active,.tools button:hover,.clear:hover{color:var(--accent);border-color:var(--accent)}main{padding:18px}.kpis{display:grid;grid-template-columns:repeat(6,minmax(130px,1fr));gap:10px}.kpi{min-height:112px;padding:14px;text-align:left;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:8px;cursor:pointer}.kpi.active{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}.kpi span,.kpi small{display:block;color:var(--muted);font-size:11px}.kpi span{text-transform:uppercase;font-weight:800}.kpi strong{display:block;margin:7px 0;font-size:30px}.breakdowns{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:12px}.panel{padding:14px;background:var(--surface);border:1px solid var(--border);border-radius:8px}.panel h2{margin:0 0 10px;font-size:13px}.bars{display:flex;flex-direction:column;gap:6px}.bar{display:grid;grid-template-columns:minmax(72px,auto) 1fr 28px;align-items:center;gap:8px;width:100%;padding:4px;text-align:left;color:var(--text);background:transparent;border:1px solid transparent;border-radius:6px;cursor:pointer}.bar.active,.bar:hover{color:var(--accent);background:var(--accent-soft)}.bar .label{overflow:hidden;font-size:11.5px;font-weight:650;text-overflow:ellipsis;white-space:nowrap}.track,.progress-track{overflow:hidden;background:var(--soft);border-radius:999px}.track{height:7px}.track i,.progress-track i{display:block;height:100%;background:linear-gradient(90deg,#6750a4,#d14a8c,#168aa2)}.bar b{font-size:11px;text-align:right}.details{margin-top:14px;border-top:1px solid var(--border)}.details-head{position:sticky;top:77px;z-index:4;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 0;background:var(--bg)}.details-head h2{margin:0;font-size:16px}.details-head small{color:var(--muted)}.detail-tools{display:flex;align-items:center;gap:7px}.search{display:flex;align-items:center;width:min(330px,38vw);height:38px;padding:0 10px;background:var(--surface);border:1px solid var(--border);border-radius:7px}.search input{width:100%;color:var(--text);background:transparent;border:0;font:inherit;font-size:12px}.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.card{padding:14px;background:var(--surface);border:1px solid var(--border);border-radius:8px}.top{display:flex;justify-content:space-between;gap:8px}.top small,.meta{color:var(--muted);font-size:10.5px}.locale{padding:4px 7px;color:var(--accent);background:var(--accent-soft);border-radius:5px;font-size:10px;font-weight:800}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin-top:10px}.metric{padding:7px;background:var(--soft);border-radius:5px}.metric small,.metric b{display:block}.metric small{color:var(--muted);font-size:9px}.metric b{margin-top:2px;font-size:13px}.progress-track{height:5px;margin-top:8px}.comment{min-height:40px;margin:10px 0;font-size:12px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.meta{display:flex;flex-wrap:wrap;gap:5px 12px}.labs{display:flex;flex-wrap:wrap;gap:4px;margin-top:9px}.labs span{padding:3px 6px;color:var(--muted);background:var(--soft);border:1px solid var(--border);border-radius:4px;font-size:9.5px}.labs span.complete{color:var(--success)}.table-wrap{overflow:hidden;border:1px solid var(--border);border-radius:8px;background:var(--surface)}table{width:100%;table-layout:fixed;border-collapse:collapse}th{padding:9px;color:var(--muted);background:var(--soft);font-size:10px;text-align:left;text-transform:uppercase}td{padding:10px 9px;vertical-align:top;border-top:1px solid var(--border);font-size:11.5px;white-space:normal;overflow-wrap:anywhere}.item-title{font-weight:750}.item-description{margin-top:4px;color:var(--muted);line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere}.item-meta{margin-top:5px;color:var(--muted);font-size:10px}.empty{padding:40px;color:var(--muted);text-align:center}.hidden{display:none!important}
.brand h1{color:var(--heading);font-size:22px;font-weight:760}.tools button,.seg button{color:var(--action-fg);background:var(--action-bg);border-color:var(--action-border);box-shadow:0 2px 7px rgba(37,27,63,.08)}.tools button:hover,.seg button:hover{color:var(--accent);background:var(--action-hover);border-color:var(--accent)}.tools>button{color:var(--primary-fg);background:var(--primary-bg);border-color:var(--primary-bg);box-shadow:0 5px 14px color-mix(in srgb,var(--primary-bg) 28%,transparent)}.tools>button:hover{color:var(--primary-fg);background:var(--primary-hover);border-color:var(--primary-hover)}.seg button.active{color:var(--accent);background:var(--accent-soft);border-color:var(--accent)}
@media(max-width:1050px){.kpis{grid-template-columns:repeat(3,1fr)}.breakdowns{grid-template-columns:repeat(2,1fr)}}@media(max-width:700px){.head{align-items:flex-start;padding:11px;background:var(--surface)}.brand span{display:none}.tools{flex-wrap:wrap;justify-content:flex-end}.tools button{width:38px;padding:0;font-size:0}.tools #cardsBtn::before{content:"▦";font-size:17px}.tools #tableBtn::before{content:"☷";font-size:18px}.tools #themeBtn::before{content:"◐";font-size:17px}main{padding:11px}.kpis{grid-template-columns:repeat(2,1fr)}.breakdowns,.cards{grid-template-columns:1fr}.details-head{top:70px;align-items:stretch;flex-direction:column}.detail-tools{align-items:stretch;flex-wrap:wrap}.search{width:100%;flex:1}.table-wrap{overflow-x:auto}table{min-width:680px}}
</style>
</head>
<body>
<div class="shell">
<header class="head"><div class="brand"><div class="mark">${logoMarkup}</div><div><small>${escapeHtml(labels.subtitle)}</small><h1>${escapeHtml(engagementName)}</h1><span>${escapeHtml(metadata)}</span></div></div><div class="tools"><div class="seg"><button id="cardsBtn">${escapeHtml(labels.cards)}</button><button id="tableBtn">${escapeHtml(labels.table)}</button></div><button id="themeBtn">${escapeHtml(theme === 'dark' ? labels.lightTheme : labels.darkTheme)}</button></div></header>
<main><section id="kpis" class="kpis"></section><section id="breakdowns" class="breakdowns"></section><section class="details"><div class="details-head"><div><h2>${escapeHtml(labels.details)}</h2><small id="showing"></small></div><div class="detail-tools"><label class="search"><input id="search" placeholder="${escapeHtml(labels.search)}"></label><button id="clear" class="clear hidden">${escapeHtml(labels.clearFilters)}</button></div></div><div id="records"></div></section></main>
</div>
<script>
const DATA=${payload};
const records=DATA.records,labels=DATA.labels,locale=DATA.locale;
let viewMode=DATA.viewMode,filter={},query="";
const esc=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const avg=selector=>records.length?records.reduce((sum,item)=>sum+selector(item),0)/records.length:0;
const pct=value=>Math.round(value)+"%";
const band=value=>value>=100?"complete":value>=75?"high":value>=50?"medium":"low";
const labLabel=id=>"Lab "+(Number(String(id).replace(/\\D/g,""))||id);
const dateLabel=value=>{const date=new Date(value);return Number.isNaN(date.getTime())?(value||"—"):date.toLocaleString(locale==="zh"?"zh-CN":locale,{dateStyle:"medium",timeStyle:"short"})};
const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);
const setFilter=next=>{filter=same(filter,next)?{}:next;render()};
const filtered=()=>records.filter(item=>{if(filter.overall!==undefined&&(filter.overall==="positive"?item.overall<4:item.overall!==filter.overall))return false;if(filter.effort!==undefined&&(filter.effort==="easy"?item.effort>2:item.effort!==filter.effort))return false;if(filter.recommend!==undefined&&(filter.recommend==="positive"?item.recommend<4:item.recommend!==filter.recommend))return false;if(filter.completion&&band(item.completionPercent)!==filter.completion)return false;if(filter.locale&&item.locale!==filter.locale)return false;if(filter.comments!==undefined&&Boolean(item.comments)!==filter.comments)return false;if(filter.completedLabId&&!item.labStatus.some(lab=>lab.labId===filter.completedLabId&&lab.totalSteps>0&&lab.completedSteps===lab.totalSteps))return false;if(query&&!([item.submissionId,item.attendeeEmail,item.comments,item.locale].join(" ").toLocaleLowerCase().includes(query)))return false;return true});
const countBy=selector=>{const map=new Map();records.forEach(item=>{const key=selector(item);map.set(key,(map.get(key)||0)+1)});return map};
const kpi=(key,label,value,description,filterValue)=>'<button class="kpi '+(same(filter,filterValue)?'active':'')+'" data-kpi="'+key+'"><span>'+esc(label)+'</span><strong>'+esc(value)+'</strong><small>'+esc(description)+'</small></button>';
const bars=(title,values,type)=>'<section class="panel"><h2>'+esc(title)+'</h2><div class="bars">'+values.map(value=>'<button class="bar '+(same(filter,{[type]:value.key})?'active':'')+'" data-bar-type="'+type+'" data-bar-key="'+esc(value.key)+'"><span class="label">'+esc(value.label)+'</span><span class="track"><i style="width:'+value.count/Math.max(1,...values.map(item=>item.count))*100+'%"></i></span><b>'+value.count+'</b></button>').join('')+'</div></section>';
const labStats=()=>{const map=new Map();records.forEach(item=>item.labStatus.forEach(lab=>{const current=map.get(lab.labId)||{labId:lab.labId,completed:0,responses:0,total:0};current.responses++;if(lab.totalSteps&&lab.completedSteps===lab.totalSteps)current.completed++;current.total+=lab.totalSteps?lab.completedSteps/lab.totalSteps*100:0;map.set(lab.labId,current)}));return[...map.values()].sort((a,b)=>a.labId.localeCompare(b.labId))};
function renderKpis(){const positive=records.filter(item=>item.recommend>=4).length/records.length*100||0,commented=records.filter(item=>item.comments).length/records.length*100||0;document.getElementById("kpis").innerHTML=[kpi("all",labels.responses,records.length,labels.allResponses,{}),kpi("overall",labels.overall,avg(item=>item.overall).toFixed(1),labels.positiveRatings,{overall:"positive"}),kpi("effort",labels.effort,avg(item=>item.effort).toFixed(1),labels.easyRatings,{effort:"easy"}),kpi("recommend",labels.recommend,pct(positive),labels.recommendRate,{recommend:"positive"}),kpi("completion",labels.completion,pct(avg(item=>item.completionPercent)),labels.completeResponses,{completion:"complete"}),kpi("comments",labels.comments,pct(commented),labels.commentedResponses,{comments:true})].join("");document.querySelectorAll("[data-kpi]").forEach(button=>button.onclick=()=>{const key=button.dataset.kpi;setFilter(key==="all"?{}:key==="overall"?{overall:"positive"}:key==="effort"?{effort:"easy"}:key==="recommend"?{recommend:"positive"}:key==="completion"?{completion:"complete"}:{comments:true})})}
function renderBreakdowns(){const rating=type=>{const counts=countBy(item=>item[type]);return[1,2,3,4,5].map(score=>({key:String(score),label:score+" ★",count:counts.get(score)||0}))};const completionCounts=countBy(item=>band(item.completionPercent));const localeCounts=countBy(item=>item.locale);const panels=[bars(labels.ratingBreakdown+" · "+labels.overallScore,rating("overall"),"overall"),bars(labels.ratingBreakdown+" · "+labels.effortScore,rating("effort"),"effort"),bars(labels.ratingBreakdown+" · "+labels.recommendScore,rating("recommend"),"recommend"),bars(labels.completionBreakdown,["complete","high","medium","low"].map(key=>({key,label:labels.completionBands[key],count:completionCounts.get(key)||0})),"completion"),bars(labels.localeBreakdown,[...localeCounts.entries()].sort((a,b)=>b[1]-a[1]).map(([key,count])=>({key,label:labels.localeNames[key]||key,count})),"locale"),bars(labels.labCompletion,labStats().map(item=>({key:item.labId,label:labLabel(item.labId)+" · "+Math.round(item.total/item.responses)+"%",count:item.completed})),"completedLabId")];document.getElementById("breakdowns").innerHTML=panels.join("");document.querySelectorAll("[data-bar-type]").forEach(button=>button.onclick=()=>{const type=button.dataset.barType,key=button.dataset.barKey;setFilter({[type]:["overall","effort","recommend"].includes(type)?Number(key):key})})}
const recordCard=item=>'<article class="card"><div class="top"><div><small>'+esc(labels.submitted)+'</small><b>'+esc(dateLabel(item.submittedAt))+'</b></div><span class="locale">'+esc(labels.localeNames[item.locale]||item.locale)+'</span></div><div class="metrics"><span class="metric"><small>'+esc(labels.overallScore)+'</small><b>'+item.overall+'/5</b></span><span class="metric"><small>'+esc(labels.effortScore)+'</small><b>'+item.effort+'/5</b></span><span class="metric"><small>'+esc(labels.recommendScore)+'</small><b>'+item.recommend+'/5</b></span><span class="metric"><small>'+esc(labels.progress)+'</small><b>'+item.completionPercent+'%</b></span></div><div class="progress-track"><i style="width:'+item.completionPercent+'%"></i></div><p class="comment">'+esc(item.comments||'—')+'</p><div class="meta"><span><b>'+esc(labels.respondent)+':</b> '+esc(item.attendeeEmail||labels.anonymous)+'</span><span><b>'+esc(labels.progress)+':</b> '+item.completedSteps+'/'+item.totalSteps+'</span><span><b>'+esc(labels.retention)+':</b> '+esc(dateLabel(item.retentionExpiresAt))+'</span></div><div class="labs">'+item.labStatus.map(lab=>'<span class="'+(lab.totalSteps&&lab.completedSteps===lab.totalSteps?'complete':'')+'">'+esc(labLabel(lab.labId))+' '+lab.completedSteps+'/'+lab.totalSteps+'</span>').join('')+'</div></article>';
const recordRow=item=>'<tr><td><div class="item-title">'+esc(item.attendeeEmail||labels.anonymous)+'</div><div class="item-description">'+esc(item.comments||'—')+'</div><div class="item-meta">'+esc(dateLabel(item.submittedAt))+' · '+esc(labels.localeNames[item.locale]||item.locale)+' · '+esc(item.submissionId)+'</div></td><td>'+item.overall+'/5</td><td>'+item.effort+'/5</td><td>'+item.recommend+'/5</td><td>'+item.completionPercent+'%<div class="item-meta">'+item.completedSteps+'/'+item.totalSteps+'</div></td></tr>';
function renderRecords(){const items=filtered(),target=document.getElementById("records");document.getElementById("showing").textContent=items.length+' / '+records.length;document.getElementById("clear").classList.toggle("hidden",!Object.keys(filter).length&&!query);if(!items.length){target.innerHTML='<div class="empty">'+esc(labels.noMatches)+'</div>';return}target.innerHTML=viewMode==="cards"?'<div class="cards">'+items.map(recordCard).join('')+'</div>':'<div class="table-wrap"><table><colgroup><col style="width:52%"><col style="width:10%"><col style="width:10%"><col style="width:12%"><col style="width:16%"></colgroup><thead><tr><th>'+esc(labels.respondent)+'</th><th>'+esc(labels.overallScore)+'</th><th>'+esc(labels.effortScore)+'</th><th>'+esc(labels.recommendScore)+'</th><th>'+esc(labels.progress)+'</th></tr></thead><tbody>'+items.map(recordRow).join('')+'</tbody></table></div>'}
function render(){renderKpis();renderBreakdowns();renderRecords();document.getElementById("cardsBtn").classList.toggle("active",viewMode==="cards");document.getElementById("tableBtn").classList.toggle("active",viewMode==="table")}
document.getElementById("search").oninput=event=>{query=event.target.value.trim().toLocaleLowerCase();renderRecords()};document.getElementById("clear").onclick=()=>{filter={};query="";document.getElementById("search").value="";render()};document.getElementById("cardsBtn").onclick=()=>{viewMode="cards";render()};document.getElementById("tableBtn").onclick=()=>{viewMode="table";render()};document.getElementById("themeBtn").onclick=()=>{const root=document.documentElement,next=root.dataset.theme==="dark"?"light":"dark";root.dataset.theme=next;document.getElementById("themeBtn").textContent=next==="dark"?labels.lightTheme:labels.darkTheme};render();
</script>
</body></html>`

  return { html, filename: `${slug(engagementName) || 'workshop'}-feedback-dashboard.html` }
}

export async function downloadFeedbackDashboardHtml(options: BuildOptions): Promise<string> {
  const { html, filename } = await buildFeedbackDashboardHtml(options)
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
  return filename
}
