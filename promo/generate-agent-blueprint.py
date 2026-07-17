"""Render six localized Copilot Studio Agent Platform Blueprint infographics.

The asset is intentionally a bitmap: it is presentation-ready when embedded in
the self-contained HTML deck, and it has no runtime dependency on page CSS.
"""

from __future__ import annotations

import json
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = Path(__file__).resolve().parent / "img"
LABS_PATH = ROOT / "public" / "content" / "labs.json"
W, H = 2400, 1350

FONTS = {
    "en": (r"C:\Windows\Fonts\segoeui.ttf", r"C:\Windows\Fonts\segoeuib.ttf"),
    "zh": (r"C:\Windows\Fonts\msyh.ttc", r"C:\Windows\Fonts\msyhbd.ttc"),
    "ja": (r"C:\Windows\Fonts\YuGothM.ttc", r"C:\Windows\Fonts\YuGothB.ttc"),
    "ko": (r"C:\Windows\Fonts\malgun.ttf", r"C:\Windows\Fonts\malgunbd.ttf"),
    "th": (r"C:\Windows\Fonts\LeelawUI.ttf", r"C:\Windows\Fonts\LeelaUIb.ttf"),
    "hi": (r"C:\Windows\Fonts\Nirmala.ttc", r"C:\Windows\Fonts\Nirmala.ttc"),
}


def f(locale: str, size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    path = FONTS[locale][1 if bold else 0]
    try:
        return ImageFont.truetype(path, size, layout_engine=ImageFont.Layout.RAQM)
    except Exception:
        return ImageFont.truetype(path, size)


def c(value: str, alpha: int = 255) -> tuple[int, int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[index:index + 2], 16) for index in (0, 2, 4)) + (alpha,)


def blend(hex_fg: str, hex_bg: str, t: float) -> tuple[int, int, int, int]:
    fg = c(hex_fg)
    bg = c(hex_bg)
    return tuple(int(bg[i] + (fg[i] - bg[i]) * t) for i in range(3)) + (255,)


def translate(locale: str, values: dict[str, str]) -> str:
    return values.get(locale) or values["en"]


def wrap(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, width: int) -> list[str]:
    words = text.split(" ")
    lines, current = [], ""
    for word in words:
        trial = word if not current else f"{current} {word}"
        if draw.textbbox((0, 0), trial, font=font)[2] <= width or not current:
            current = trial
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_wrapped(draw: ImageDraw.ImageDraw, text: str, xy: tuple[int, int], width: int,
                 font: ImageFont.FreeTypeFont, fill: tuple[int, int, int, int], gap: int = 4,
                 max_lines: int | None = None) -> int:
    x, y = xy
    lines = wrap(draw, text, font, width)
    if max_lines and len(lines) > max_lines:
        lines = lines[:max_lines]
        if not lines[-1].endswith("…"):
            lines[-1] = lines[-1].rstrip(".") + "…"
    for line in lines:
        draw.text((x, y), line, font=font, fill=fill)
        y += font.size + gap
    return y


def round_rect(draw: ImageDraw.ImageDraw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


TEXT = {
    "en": {
        "eyebrow": "COPILOT STUDIO · AGENT PLATFORM BLUEPRINT",
        "heading": "FROM LAB TO BUSINESS VALUE",
        "subheading": "Six learning missions reveal how a composable agent platform moves from trusted answers to autonomous, real-time engagement.",
        "legend": "READ EACH MISSION TOP TO BOTTOM  ·  USE CASE  →  AGENT MODE  →  ARCHITECTURE  →  KNOWLEDGE & TOOLS  →  BUSINESS VALUE",
        "use_case": "USE CASE",
        "mode": "AGENT MODE",
        "architecture": "ARCHITECTURE",
        "tools": "KNOWLEDGE & TOOLS",
        "value": "BUSINESS VALUE",
        "footer": "ONE PLATFORM  ·  SIX AGENT PATTERNS  ·  COMPOUNDING VALUE",
        "footer_copy": "Knowledge + actions + orchestration + workflows + voice create durable Copilot Studio innovation.",
        "node_user": "User need",
        "node_agent": "Agent",
        "node_knowledge": "Knowledge",
        "node_data": "Business data",
        "node_review": "Review",
        "node_specialist": "Specialist",
        "node_workflow": "Workflow",
        "node_voice": "Voice",
    },
    "zh": {
        "eyebrow": "COPILOT STUDIO · AGENT 平台蓝图",
        "heading": "从实验到业务价值",
        "subheading": "六项学习任务展示可组合 Agent 平台如何从可信回答走向自主、实时的互动体验。",
        "legend": "自上而下阅读每项任务  ·  用例  →  Agent 模式  →  架构  →  知识与工具  →  业务价值",
        "use_case": "用例", "mode": "AGENT 模式", "architecture": "架构", "tools": "知识与工具", "value": "业务价值",
        "footer": "一个平台  ·  六种 AGENT 模式  ·  价值持续叠加",
        "footer_copy": "知识 + 操作 + 编排 + 工作流 + 语音，构建持久的 Copilot Studio 创新。",
        "node_user": "用户需求", "node_agent": "Agent", "node_knowledge": "知识", "node_data": "业务数据", "node_review": "审查", "node_specialist": "专家", "node_workflow": "工作流", "node_voice": "语音",
    },
    "ja": {
        "eyebrow": "COPILOT STUDIO · AGENT プラットフォーム設計図",
        "heading": "ラボからビジネス価値へ",
        "subheading": "6 つの学習ミッションが、構成可能な Agent プラットフォームを信頼できる回答から自律的・リアルタイムな体験へ導きます。",
        "legend": "各ミッションを上から下へ読む  ·  ユースケース  →  AGENT モード  →  アーキテクチャ  →  ナレッジとツール  →  ビジネス価値",
        "use_case": "ユースケース", "mode": "AGENT モード", "architecture": "アーキテクチャ", "tools": "ナレッジとツール", "value": "ビジネス価値",
        "footer": "一つのプラットフォーム  ·  6 つの AGENT パターン  ·  積み上がる価値",
        "footer_copy": "ナレッジ + アクション + オーケストレーション + ワークフロー + 音声が、持続する Copilot Studio イノベーションを実現します。",
        "node_user": "ユーザーの課題", "node_agent": "Agent", "node_knowledge": "ナレッジ", "node_data": "業務データ", "node_review": "レビュー", "node_specialist": "専門 Agent", "node_workflow": "ワークフロー", "node_voice": "音声",
    },
    "ko": {
        "eyebrow": "COPILOT STUDIO · AGENT 플랫폼 블루프린트",
        "heading": "랩에서 비즈니스 가치로",
        "subheading": "6개의 학습 미션은 구성 가능한 Agent 플랫폼이 신뢰할 수 있는 답변에서 자율적이고 실시간인 참여로 발전하는 과정을 보여 줍니다.",
        "legend": "각 미션을 위에서 아래로 읽기  ·  사용 사례  →  AGENT 모드  →  아키텍처  →  지식 및 도구  →  비즈니스 가치",
        "use_case": "사용 사례", "mode": "AGENT 모드", "architecture": "아키텍처", "tools": "지식 및 도구", "value": "비즈니스 가치",
        "footer": "하나의 플랫폼  ·  6가지 AGENT 패턴  ·  누적되는 가치",
        "footer_copy": "지식 + 작업 + 오케스트레이션 + 워크플로 + 음성이 지속 가능한 Copilot Studio 혁신을 만듭니다.",
        "node_user": "사용자 요구", "node_agent": "Agent", "node_knowledge": "지식", "node_data": "비즈니스 데이터", "node_review": "검토", "node_specialist": "전문 Agent", "node_workflow": "워크플로", "node_voice": "음성",
    },
    "th": {
        "eyebrow": "COPILOT STUDIO · AGENT PLATFORM BLUEPRINT",
        "heading": "จากแล็บสู่คุณค่าทางธุรกิจ",
        "subheading": "6 ภารกิจการเรียนรู้แสดงให้เห็นว่าแพลตฟอร์ม Agent ที่ประกอบได้พาจากคำตอบที่เชื่อถือได้ไปสู่การมีส่วนร่วมแบบอัตโนมัติและเรียลไทม์อย่างไร",
        "legend": "อ่านแต่ละภารกิจจากบนลงล่าง  ·  กรณีใช้งาน  →  โหมด AGENT  →  สถาปัตยกรรม  →  ความรู้และเครื่องมือ  →  คุณค่าทางธุรกิจ",
        "use_case": "กรณีใช้งาน", "mode": "โหมด AGENT", "architecture": "สถาปัตยกรรม", "tools": "ความรู้และเครื่องมือ", "value": "คุณค่าทางธุรกิจ",
        "footer": "หนึ่งแพลตฟอร์ม  ·  6 รูปแบบ AGENT  ·  คุณค่าที่เพิ่มต่อเนื่อง",
        "footer_copy": "ความรู้ + การดำเนินการ + การประสานงาน + เวิร์กโฟลว์ + เสียง สร้างนวัตกรรม Copilot Studio ที่ยั่งยืน",
        "node_user": "ความต้องการผู้ใช้", "node_agent": "Agent", "node_knowledge": "ความรู้", "node_data": "ข้อมูลธุรกิจ", "node_review": "ตรวจทาน", "node_specialist": "Agent เฉพาะทาง", "node_workflow": "เวิร์กโฟลว์", "node_voice": "เสียง",
    },
    "hi": {
        "eyebrow": "COPILOT STUDIO · AGENT PLATFORM BLUEPRINT",
        "heading": "लैब से व्यावसायिक मूल्य तक",
        "subheading": "छह सीखने के मिशन दिखाते हैं कि एक संयोज्य Agent प्लेटफ़ॉर्म विश्वसनीय उत्तरों से स्वायत्त, रीयल-टाइम सहभागिता तक कैसे पहुंचता है।",
        "legend": "हर मिशन को ऊपर से नीचे पढ़ें  ·  उपयोग मामला  →  AGENT मोड  →  आर्किटेक्चर  →  ज्ञान और उपकरण  →  व्यावसायिक मूल्य",
        "use_case": "उपयोग मामला", "mode": "AGENT मोड", "architecture": "आर्किटेक्चर", "tools": "ज्ञान और उपकरण", "value": "व्यावसायिक मूल्य",
        "footer": "एक प्लेटफ़ॉर्म  ·  छह AGENT पैटर्न  ·  बढ़ता हुआ मूल्य",
        "footer_copy": "ज्ञान + क्रियाएं + ऑर्केस्ट्रेशन + वर्कफ़्लो + आवाज़ स्थायी Copilot Studio नवाचार बनाते हैं।",
        "node_user": "उपयोगकर्ता आवश्यकता", "node_agent": "Agent", "node_knowledge": "ज्ञान", "node_data": "व्यावसायिक डेटा", "node_review": "समीक्षा", "node_specialist": "विशेषज्ञ Agent", "node_workflow": "वर्कफ़्लो", "node_voice": "आवाज़",
    },
}


def loc(en: str, zh: str, ja: str, ko: str, th: str, hi: str) -> dict[str, str]:
    return {"en": en, "zh": zh, "ja": ja, "ko": ko, "th": th, "hi": hi}


# Horizontal layer labels (left rail) — one row per layer, columns are labs.
ROW_LABELS = {
    "en": ["AGENT STYLE", "CONVERSATION TYPE", "CURRENT ARCHITECTURE", "KNOWLEDGE & TOOLS", "BUSINESS VALUE"],
    "zh": ["AGENT 风格", "会话类型", "当前架构", "知识与工具", "业务价值"],
    "ja": ["AGENT スタイル", "会話タイプ", "現在のアーキテクチャ", "ナレッジとツール", "ビジネス価値"],
    "ko": ["AGENT 스타일", "대화 유형", "현재 아키텍처", "지식 및 도구", "비즈니스 가치"],
    "th": ["สไตล์ AGENT", "ประเภทการสนทนา", "สถาปัตยกรรมปัจจุบัน", "ความรู้และเครื่องมือ", "คุณค่าทางธุรกิจ"],
    "hi": ["AGENT शैली", "वार्तालाप प्रकार", "वर्तमान आर्किटेक्चर", "ज्ञान और उपकरण", "व्यावसायिक मूल्य"],
}

# Agent style per lab (row 1).
STYLES = {
    1: loc("Conversational", "会话型", "会話型", "대화형", "สนทนา", "संवादी"),
    2: loc("Conversational", "会话型", "会話型", "대화형", "สนทนา", "संवादी"),
    3: loc("Conversational", "会话型", "会話型", "대화형", "สนทนา", "संवादी"),
    4: loc("Multi-agent", "多 Agent", "マルチ Agent", "멀티 Agent", "หลาย Agent", "मल्टी-Agent"),
    5: loc("Autonomous", "自主型", "自律型", "자율형", "อัตโนมัติ", "स्वायत्त"),
    6: loc("Conversational", "会话型", "会話型", "대화형", "สนทนา", "संवादी"),
}

# Conversation type / channel per lab (row 2).
CHANNELS = {
    1: loc("Digital · Q&A", "数字 · 问答", "デジタル · Q&A", "디지털 · Q&A", "ดิจิทัล · ถาม-ตอบ", "डिजिटल · Q&A"),
    2: loc("Digital · Customer 360", "数字 · 客户 360", "デジタル · Customer 360", "디지털 · 고객 360", "ดิจิทัล · ลูกค้า 360", "डिजिटल · Customer 360"),
    3: loc("Digital · Human-in-loop", "数字 · 人工参与", "デジタル · 人間参加", "디지털 · 사람 검토", "ดิจิทัล · มีมนุษย์ตรวจ", "डिजिटल · मानव समीक्षा"),
    4: loc("Digital · Multichannel", "数字 · 多渠道", "デジタル · マルチチャネル", "디지털 · 멀티채널", "ดิจิทัล · หลายช่องทาง", "डिजिटल · मल्टीचैनल"),
    5: loc("Automated · Background", "自动化 · 后台", "自動化 · バックグラウンド", "자동화 · 백그라운드", "อัตโนมัติ · เบื้องหลัง", "स्वचालित · पृष्ठभूमि"),
    6: loc("Voice · Real-time", "语音 · 实时", "音声 · リアルタイム", "음성 · 실시간", "เสียง · เรียลไทม์", "आवाज़ · रीयल-टाइम"),
}


SPECS = [
    {
        "number": "01", "color": "#1673D1", "icon": "shield", "lab": 1,
        "usecase": loc("Trusted multilingual Q&A", "可信多语言问答", "信頼できる多言語 Q&A", "신뢰할 수 있는 다국어 Q&A", "ถาม-ตอบหลายภาษาที่เชื่อถือได้", "विश्वसनीय बहुभाषी Q&A"),
        "mode": loc("CONVERSATIONAL · DIGITAL", "会话型 · 数字", "会話型 · デジタル", "대화형 · 디지털", "สนทนา · ดิจิทัล", "संवादी · डिजिटल"),
        "nodes": ["node_user", "node_agent", "node_knowledge"],
        "tools": ["Microsoft.com", "Microsoft Learn MCP", "Instructions"],
        "value": loc("Trusted answers with citations — a reusable foundation for every next agent.", "带引用的可信回答，为后续每个 Agent 奠定可复用基础。", "引用付きの信頼できる回答。次の Agent すべてに再利用できる土台。", "인용 기반의 신뢰할 수 있는 답변. 다음 모든 Agent의 재사용 가능한 기반.", "คำตอบที่เชื่อถือได้พร้อมการอ้างอิง เป็นรากฐานที่ใช้ซ้ำได้สำหรับ Agent ถัดไปทุกตัว", "उद्धरणों के साथ विश्वसनीय उत्तर — हर अगले Agent के लिए पुन: उपयोग योग्य आधार।"),
    },
    {
        "number": "02", "color": "#168454", "icon": "database", "lab": 2,
        "usecase": loc("Account-aware customer 360", "感知账户的客户 360", "アカウント認識型 Customer 360", "계정 인식 Customer 360", "Customer 360 ที่เข้าใจบัญชีลูกค้า", "खाता-संदर्भित Customer 360"),
        "mode": loc("CONVERSATIONAL · CONTEXT-AWARE", "会话型 · 上下文感知", "会話型 · コンテキスト認識", "대화형 · 컨텍스트 인식", "สนทนา · เข้าใจบริบท", "संवादी · संदर्भ-सक्षम"),
        "nodes": ["node_user", "node_agent", "node_data"],
        "tools": ["Dataverse MCP", "Skills", "Memory", "CoWork"],
        "value": loc("Customer context and Big Bets travel with the conversation — faster account action.", "客户上下文和 Big Bets 随对话流动，更快推动账户行动。", "顧客コンテキストと Big Bets が会話と共に動き、アカウント対応を高速化。", "고객 컨텍스트와 Big Bets가 대화와 함께 이동해 계정 조치를 빠르게 만듭니다.", "บริบทลูกค้าและ Big Bets ติดตามไปกับบทสนทนา เพื่อดำเนินการกับบัญชีได้เร็วขึ้น", "ग्राहक संदर्भ और Big Bets बातचीत के साथ चलते हैं — तेज़ खाता कार्रवाई।"),
    },
    {
        "number": "03", "color": "#6B43C9", "icon": "document", "lab": 3,
        "usecase": loc("Evidence-based proposal generation", "基于证据的提案生成", "根拠ベースの提案生成", "근거 기반 제안 생성", "การสร้างข้อเสนอที่อิงหลักฐาน", "साक्ष्य-आधारित प्रस्ताव निर्माण"),
        "mode": loc("CONVERSATIONAL · HUMAN-IN-LOOP", "会话型 · 人工参与", "会話型 · 人間参加型", "대화형 · 사람 검토", "สนทนา · มีมนุษย์ตรวจทาน", "संवादी · मानव समीक्षा सहित"),
        "nodes": ["node_user", "node_agent", "node_review"],
        "tools": ["RFP workbook", "Skills", "MCP tools", "Excel / Word"],
        "value": loc("Faster proposals with traceable evidence, confidence signals, and review gates.", "通过可追溯证据、置信度信号和审查关口，加速生成提案。", "追跡可能な根拠、信頼度シグナル、レビュー ゲートで提案を高速化。", "추적 가능한 근거, 신뢰도 신호, 검토 게이트로 더 빠른 제안서 작성.", "ข้อเสนอที่เร็วขึ้นด้วยหลักฐานที่ตรวจสอบย้อนกลับได้ สัญญาณความเชื่อมั่น และจุดตรวจทาน", "ट्रेस करने योग्य साक्ष्य, विश्वास संकेतों और समीक्षा गेट के साथ तेज़ प्रस्ताव।"),
    },
    {
        "number": "04", "color": "#F28A16", "icon": "network", "lab": 4,
        "usecase": loc("Connected IT service experience", "连接的 IT 服务体验", "接続された IT サービス体験", "연결된 IT 서비스 경험", "ประสบการณ์บริการ IT ที่เชื่อมต่อ", "कनेक्टेड IT सेवा अनुभव"),
        "mode": loc("MULTI-AGENT · DIGITAL", "多 Agent · 数字", "マルチ AGENT · デジタル", "멀티 AGENT · 디지털", "หลาย AGENT · ดิจิทัล", "मल्टी-AGENT · डिजिटल"),
        "nodes": ["node_user", "node_agent", "node_specialist"],
        "tools": ["ServiceNow KB", "Incident actions", "Teams", "M365 Copilot"],
        "value": loc("Route work to the right expert while preserving privacy, safety, and channel reach.", "将工作路由给合适的专家，同时保护隐私、安全并覆盖多个渠道。", "適切な専門家へルーティングし、プライバシー、安全性、チャネル到達性を維持。", "프라이버시·안전·채널 도달성을 지키며 올바른 전문가에게 업무를 라우팅합니다.", "ส่งงานไปยังผู้เชี่ยวชาญที่เหมาะสม พร้อมรักษาความเป็นส่วนตัว ความปลอดภัย และการเข้าถึงหลายช่องทาง", "गोपनीयता, सुरक्षा और चैनल पहुंच बनाए रखते हुए काम को सही विशेषज्ञ तक रूट करें।"),
    },
    {
        "number": "05", "color": "#D95167", "icon": "workflow", "lab": 5,
        "usecase": loc("Email operations at scale", "规模化邮件运营", "大規模なメール運用", "대규모 이메일 운영", "การดำเนินงานอีเมลในวงกว้าง", "पैमाने पर ईमेल संचालन"),
        "mode": loc("AUTONOMOUS WORKFLOW · DIGITAL", "自主工作流 · 数字", "自律ワークフロー · デジタル", "자율 워크플로 · 디지털", "เวิร์กโฟลว์อัตโนมัติ · ดิจิทัล", "स्वायत्त वर्कफ़्लो · डिजिटल"),
        "nodes": ["node_user", "node_workflow", "node_specialist"],
        "tools": ["Outlook trigger", "Classify", "Agents", "Monitor"],
        "value": loc("Classify, route, and personalize responses without losing operational control.", "在不失去运营控制的前提下，对回复进行分类、路由和个性化。", "運用の制御を失わずに、応答を分類、ルーティング、パーソナライズ。", "운영 통제력을 잃지 않고 응답을 분류, 라우팅, 개인화합니다.", "จัดประเภท ส่งต่อ และปรับแต่งการตอบกลับ โดยไม่สูญเสียการควบคุมการปฏิบัติงาน", "ऑपरेशनल नियंत्रण खोए बिना प्रतिक्रियाओं को वर्गीकृत, रूट और वैयक्तिकृत करें।"),
    },
    {
        "number": "06", "color": "#167D9E", "icon": "voice", "lab": 6,
        "usecase": loc("Real-time multilingual voice", "实时多语言语音", "リアルタイム多言語音声", "실시간 다국어 음성", "เสียงหลายภาษาแบบเรียลไทม์", "रीयल-टाइम बहुभाषी आवाज़"),
        "mode": loc("CONVERSATIONAL · VOICE", "会话型 · 语音", "会話型 · 音声", "대화형 · 음성", "สนทนา · เสียง", "संवादी · आवाज़"),
        "nodes": ["node_user", "node_voice", "node_agent"],
        "tools": ["Real-time voice", "Knowledge", "Tools", "Child agents"],
        "value": loc("Create natural, inclusive moments of help that feel immediate and human.", "创造自然、包容、即时且有人情味的帮助体验。", "即時で自然かつ包摂的な、人間らしい支援体験を生み出します。", "즉각적이고 인간적으로 느껴지는 자연스럽고 포용적인 도움 경험을 만듭니다.", "สร้างช่วงเวลาการช่วยเหลือที่เป็นธรรมชาติ ครอบคลุม ฉับไว และเป็นมนุษย์", "ऐसे प्राकृतिक, समावेशी सहायता क्षण बनाएं जो तात्कालिक और मानवीय लगें।"),
    },
]


def icon(draw: ImageDraw.ImageDraw, name: str, x: int, y: int, color: tuple[int, int, int, int]):
    width = 6
    if name == "shield":
        draw.polygon([(x, y - 30), (x + 26, y - 18), (x + 20, y + 24), (x, y + 40), (x - 20, y + 24), (x - 26, y - 18)], outline=color, width=width)
        draw.line((x - 12, y + 3, x - 2, y + 13, x + 15, y - 9), fill=color, width=width)
    elif name == "database":
        for offset in (-22, 0, 22):
            draw.ellipse((x - 30, y + offset - 10, x + 30, y + offset + 10), outline=color, width=width)
            if offset != 22:
                draw.line((x - 30, y + offset, x - 30, y + offset + 22), fill=color, width=width)
                draw.line((x + 30, y + offset, x + 30, y + offset + 22), fill=color, width=width)
    elif name == "document":
        draw.rounded_rectangle((x - 27, y - 35, x + 27, y + 35), 8, outline=color, width=width)
        draw.line((x - 14, y - 10, x + 14, y - 10), fill=color, width=width)
        draw.line((x - 14, y + 5, x + 14, y + 5), fill=color, width=width)
        draw.line((x - 14, y + 20, x + 4, y + 20), fill=color, width=width)
    elif name == "network":
        points = [(x, y - 30), (x - 30, y + 22), (x + 30, y + 22)]
        for px, py in points:
            draw.ellipse((px - 9, py - 9, px + 9, py + 9), outline=color, width=width)
        draw.line((x, y - 20, x - 23, y + 12), fill=color, width=width)
        draw.line((x, y - 20, x + 23, y + 12), fill=color, width=width)
        draw.line((x - 21, y + 22, x + 21, y + 22), fill=color, width=width)
    elif name == "workflow":
        draw.ellipse((x - 38, y - 12, x - 14, y + 12), outline=color, width=width)
        draw.ellipse((x + 14, y - 34, x + 38, y - 10), outline=color, width=width)
        draw.ellipse((x + 14, y + 10, x + 38, y + 34), outline=color, width=width)
        draw.line((x - 14, y, x + 13, y - 20), fill=color, width=width)
        draw.line((x - 14, y, x + 13, y + 20), fill=color, width=width)
    elif name == "voice":
        for idx, height in enumerate((18, 38, 58, 38, 18)):
            px = x - 28 + idx * 14
            draw.line((px, y - height / 2, px, y + height / 2), fill=color, width=width)


def text_lines(draw, text, font, width, max_lines=2):
    lines = wrap(draw, text, font, width)
    if max_lines and len(lines) > max_lines:
        lines = lines[:max_lines]
        if not lines[-1].endswith("…"):
            lines[-1] = lines[-1].rstrip(".") + "…"
    return lines


def draw_center(draw, text, cx, cy, width, font, fill, gap=2, max_lines=2):
    lines = text_lines(draw, text, font, width, max_lines)
    total = len(lines) * font.size + (len(lines) - 1) * gap
    y = cy - total / 2
    for line in lines:
        draw.text((cx, y), line, font=font, fill=fill, anchor="ma")
        y += font.size + gap


def node_box(draw, box, label, color, locale):
    x1, y1, x2, y2 = box
    round_rect(draw, box, 11, c("#1B1834"), c("#39335A"), 1)
    draw.rounded_rectangle((x1, y1, x1 + 5, y2), 2, fill=color)
    draw_center(draw, label, (x1 + 20 + x2) / 2, (y1 + y2) / 2, x2 - x1 - 40, f(locale, 18, True), c("#EDEBF8"), gap=1, max_lines=2)


def vchevron(draw, cx, cy, color):
    draw.line((cx, cy - 9, cx, cy + 1), fill=color, width=3)
    draw.polygon([(cx, cy + 9), (cx - 6, cy + 1), (cx + 6, cy + 1)], fill=color)


LAB_COLORS = {1: "#38BDF8", 2: "#34D399", 3: "#A78BFA", 4: "#FBBF24", 5: "#F472B6", 6: "#22D3EE"}
ROW_COLORS = ["#A78BFA", "#F472B6", "#22D3EE", "#34D399", "#FBBF24"]


def render(locale, labs):
    image = Image.new("RGBA", (W, H), c("#100E1B"))
    draw = ImageDraw.Draw(image)

    # Restrained vertical wash — calm, editorial dark stage (no busy grid).
    for gy in range(H):
        t = gy / H
        r = int(0x14 + (0x0E - 0x14) * t)
        g = int(0x12 + (0x0C - 0x12) * t)
        b = int(0x24 + (0x18 - 0x24) * t)
        draw.line((0, gy, W, gy), fill=(r, g, b, 255))

    # A single soft brand glow, low intensity, for depth only.
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((300, -520, 2100, 420), fill=c("#6D5AE0", 34))
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    image.alpha_composite(glow)
    draw = ImageDraw.Draw(image)

    MX = 60
    # Header.
    round_rect(draw, (MX, 42, W - MX, 196), 22, c("#171430", 235), c("#2C2748"), 1)
    round_rect(draw, (MX + 28, 70, MX + 122, 164), 18, c("#7C5CFF"))
    draw.polygon([(MX + 75, 88), (MX + 100, 100), (MX + 94, 136), (MX + 75, 150), (MX + 56, 136), (MX + 50, 100)], outline=c("#FFFFFF"), width=4)
    draw.line((MX + 64, 116, MX + 72, 126, MX + 89, 105), fill=c("#FFFFFF"), width=4)
    draw.text((MX + 150, 68), TEXT[locale]["eyebrow"], font=f(locale, 19, True), fill=c("#7FD8F0"))
    draw.text((MX + 150, 98), TEXT[locale]["heading"], font=f(locale, 47, True), fill=c("#FFFFFF"))
    draw_wrapped(draw, TEXT[locale]["subheading"], (MX + 150, 156), 1560, f(locale, 18), c("#B7B3CE"), gap=1, max_lines=1)
    round_rect(draw, (W - MX - 356, 84, W - MX - 28, 154), 34, c("#1C1838"), c("#3E5B86"), 1)
    draw.text((W - MX - 192, 119), "6 LABS  ·  6 PATTERNS", font=f(locale, 16, True), fill=c("#9FD3EA"), anchor="mm")

    # Matrix geometry: left label rail + six lab columns.
    rail_w = 196
    gx0 = MX + rail_w + 16
    gx1 = W - MX
    n = 6
    col_gap = 18
    colw = (gx1 - gx0 - (n - 1) * col_gap) / n
    col_x = [gx0 + i * (colw + col_gap) for i in range(n)]

    head_y0, head_y1 = 210, 316
    row_defs = [("style", 108), ("type", 96), ("arch", 236), ("tools", 176), ("value", 208)]
    row_gap = 16
    rows_y0 = 332
    band_bottom = rows_y0 + sum(h for _, h in row_defs) + (len(row_defs) - 1) * row_gap

    # Soft column tint groups every layer under its lab — pre-blended, no hard borders.
    for spec, x in zip(SPECS, col_x):
        round_rect(draw, (x - 9, head_y0 - 10, x + colw + 9, band_bottom + 10), 20, blend(LAB_COLORS[spec["lab"]], "#100E1B", 0.12), None)

    # Column headers (the strong colour lives here).
    for spec, x in zip(SPECS, col_x):
        color = c(LAB_COLORS[spec["lab"]])
        round_rect(draw, (x, head_y0, x + colw, head_y1), 15, c("#1A1636"), c("#332C54"), 1)
        round_rect(draw, (x, head_y0, x + colw, head_y0 + 8), 15, color)
        draw.rectangle((x, head_y0 + 4, x + colw, head_y0 + 8), fill=color)
        round_rect(draw, (x + 16, head_y0 + 26, x + 66, head_y0 + 76), 12, color)
        draw.text((x + 41, head_y0 + 51), spec["number"], font=f(locale, 22, True), fill=c("#100E1B"), anchor="mm")
        title = labs[spec["lab"] - 1]["title"].get(locale) or labs[spec["lab"] - 1]["title"]["en"]
        draw_center(draw, title, (x + 78 + x + colw - 16) / 2, head_y0 + 53, colw - 98, f(locale, 21, True), c("#F4F2FC"), gap=2, max_lines=2)

    # Row bands.
    row_labels = ROW_LABELS[locale]
    y = rows_y0
    for r_idx, (kind, h) in enumerate(row_defs):
        rc = c(ROW_COLORS[r_idx])
        # Rail label.
        draw.rounded_rectangle((MX, y + 18, MX + 5, y + h - 18), 2, fill=rc)
        draw_wrapped(draw, row_labels[r_idx], (MX + 22, y + h / 2 - 22), rail_w - 36, f(locale, 20, True), c("#E7E5F4"), gap=3, max_lines=3)

        for spec, x in zip(SPECS, col_x):
            color = c(LAB_COLORS[spec["lab"]])
            round_rect(draw, (x, y, x + colw, y + h), 14, c("#16132B", 240), c("#2C2747"), 1)
            cx = x + colw / 2
            cy = y + h / 2

            if kind == "style":
                icon(draw, spec["icon"], int(x + 52), int(cy), color)
                draw_center(draw, translate(locale, STYLES[spec["lab"]]), (x + 100 + x + colw - 16) / 2, cy, colw - 116, f(locale, 24, True), color, gap=2, max_lines=2)
            elif kind == "type":
                round_rect(draw, (x + 18, cy - 26, x + colw - 18, cy + 26), 15, c("#201B3C"), c("#3A3358"), 1)
                draw_center(draw, translate(locale, CHANNELS[spec["lab"]]), cx, cy, colw - 46, f(locale, 19, True), c("#DFDCEF"), gap=1, max_lines=2)
            elif kind == "arch":
                keys = spec["nodes"]
                node_h = 50
                gap_a = 20
                total = len(keys) * node_h + (len(keys) - 1) * gap_a
                ny = y + (h - total) / 2
                for i, key in enumerate(keys):
                    node_box(draw, (x + 18, ny, x + colw - 18, ny + node_h), TEXT[locale][key], color, locale)
                    if i < len(keys) - 1:
                        vchevron(draw, cx, ny + node_h + gap_a / 2, color)
                    ny += node_h + gap_a
            elif kind == "tools":
                cxp, cyp = x + 18, y + 22
                line_font = f(locale, 16, True)
                for tool in spec["tools"]:
                    tw = draw.textbbox((0, 0), tool, font=line_font)[2] + 26
                    if cxp + tw > x + colw - 18:
                        cxp, cyp = x + 18, cyp + 44
                    round_rect(draw, (cxp, cyp, cxp + tw, cyp + 34), 16, c("#1E1A38"), color, 1)
                    draw.text((cxp + tw / 2, cyp + 17), tool, font=line_font, fill=color, anchor="mm")
                    cxp += tw + 9
            elif kind == "value":
                draw.rounded_rectangle((x + 18, y + 20, x + 23, y + h - 20), 2, fill=color)
                draw_wrapped(draw, translate(locale, spec["value"]), (x + 34, y + 22), colw - 52, f(locale, 17), c("#E2DFF1"), gap=4, max_lines=6)
        y += h + row_gap

    # Footer outcome rail.
    fy0 = band_bottom + 16
    round_rect(draw, (MX, fy0, W - MX, H - 34), 20, c("#171430", 240), c("#332C58"), 1)
    draw.text((MX + 36, fy0 + 24), TEXT[locale]["footer"], font=f(locale, 20, True), fill=c("#7FD8F0"))
    draw_wrapped(draw, TEXT[locale]["footer_copy"], (MX + 36, fy0 + 58), 1380, f(locale, 19, True), c("#EFEDFB"), gap=1, max_lines=2)
    outcome_chips = [("KNOWLEDGE", "#38BDF8"), ("ACTIONS", "#34D399"), ("ORCHESTRATION", "#A78BFA"), ("WORKFLOWS", "#F472B6"), ("VOICE", "#22D3EE")]
    chip_x = W - MX - 792
    for label, color in outcome_chips:
        label_font = f("en", 14, True)
        width = draw.textbbox((0, 0), label, font=label_font)[2] + 30
        round_rect(draw, (chip_x, fy0 + 26, chip_x + width, fy0 + 62), 18, c("#1C1838"), c(color), 1)
        draw.text((chip_x + width / 2, fy0 + 44), label, font=label_font, fill=c(color), anchor="mm")
        chip_x += width + 11

    # Hairline outer frame.
    draw.rounded_rectangle((16, 16, W - 16, H - 16), radius=30, outline=c("#2A2546"), width=1)
    return image.convert("RGB")


def main():
    data = json.loads(LABS_PATH.read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for locale in FONTS:
        out = OUT_DIR / f"agent-platform-blueprint-{locale}.webp"
        render(locale, data["labs"]).save(out, "WEBP", quality=92, method=6)
        print(f"Wrote {out.name}")


if __name__ == "__main__":
    main()