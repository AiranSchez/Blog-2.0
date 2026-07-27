#!/usr/bin/env python3
"""Generate localized JSON Resume files and polished PDF CVs from site data."""

from __future__ import annotations

import html
import json
import urllib.request
from datetime import date
from pathlib import Path
from typing import Any

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "src" / "data"
OUT = ROOT / "public" / "cv"
OUT.mkdir(parents=True, exist_ok=True)

PAPER = colors.HexColor("#f8fafc")
INK = colors.HexColor("#0f172a")
MUTED = colors.HexColor("#52617a")
RULE = colors.HexColor("#dbe3ef")
NAVY = colors.HexColor("#020617")
SURFACE = colors.HexColor("#0b1120")
ACCENT = colors.HexColor("#4727cc")
SIGNAL = colors.HexColor("#60a5fa")
WHITE = colors.white

MONTHS = {
    "es": ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"],
    "en": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    "ja": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
}

NOTO_JP_URL = "https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf"


def esc(value: Any) -> str:
    return html.escape(str(value), quote=True)


def format_month(value: str | None, lang: str, present: str) -> str:
    if not value:
        return present
    year, month = map(int, value.split("-"))
    return f"{year}年{MONTHS[lang][month - 1]}" if lang == "ja" else f"{MONTHS[lang][month - 1]} {year}"


def load_data(lang: str) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    cv = json.loads((DATA / "cv" / f"cv-{lang}.json").read_text())
    experience = json.loads((DATA / "experience" / f"experiences-{lang}.json").read_text())
    experience.sort(key=lambda item: item["startDate"], reverse=True)
    return cv, experience


def make_json_resume(lang: str, cv: dict[str, Any], experience: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "$schema": "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
        "basics": {
            "name": cv["name"],
            "label": cv["headline"],
            "email": cv["email"],
            "url": "https://www.airanschez.tech",
            "summary": cv["summary"],
            "location": {"region": cv["location"]},
            "profiles": [
                {"network": link["label"], "username": "AiranSchez" if link["label"] == "GitHub" else "Airán Sánchez", "url": link["url"]}
                for link in cv["links"]
            ],
        },
        "work": [
            {
                "name": item["company"],
                "position": item["role"],
                "startDate": item["startDate"],
                "endDate": item["endDate"] or "",
                "summary": item["description"],
                "highlights": item["technologies"],
            }
            for item in experience
        ],
        "education": [
            {"institution": "", "area": item["title"], "studyType": item["description"], "startDate": "", "endDate": ""}
            for item in cv["education"]
        ],
        "skills": [
            {"name": item["name"], "level": "", "keywords": item["keywords"]}
            for item in cv["skills"]
        ],
        "publications": [
            {
                "name": cv["talk"]["title"],
                "publisher": cv["talk"]["event"],
                "releaseDate": cv["talk"]["year"],
                "url": cv["talk"]["url"],
                "summary": cv["talk"]["description"],
            }
        ],
        "meta": {
            "canonical": f"https://www.airanschez.tech/{lang}/cv/",
            "version": "v1.0.0",
            "lastModified": date.today().isoformat(),
        },
    }


def styles_for(lang: str) -> dict[str, ParagraphStyle]:
    if lang == "ja":
        font_path = ROOT / "tmp" / "pdfs" / "fonts" / "NotoSansJP-wght.ttf"
        font_path.parent.mkdir(parents=True, exist_ok=True)
        if not font_path.exists():
            urllib.request.urlretrieve(NOTO_JP_URL, font_path)
        if "NotoSansJP" not in pdfmetrics.getRegisteredFontNames():
            pdfmetrics.registerFont(TTFont("NotoSansJP", str(font_path)))
        regular = bold = "NotoSansJP"
    else:
        regular, bold = "Helvetica", "Helvetica-Bold"

    base = getSampleStyleSheet()
    return {
        "name": ParagraphStyle("Name", parent=base["Normal"], fontName=bold, fontSize=32, leading=32, textColor=WHITE, spaceAfter=4),
        "headline": ParagraphStyle("Headline", parent=base["Normal"], fontName=bold, fontSize=10, leading=13, textColor=SIGNAL, uppercase=True),
        "hero": ParagraphStyle("Hero", parent=base["Normal"], fontName=regular, fontSize=9.3, leading=14, textColor=colors.HexColor("#cbd5e1")),
        "contact": ParagraphStyle("Contact", parent=base["Normal"], fontName=regular, fontSize=7.8, leading=11, textColor=colors.HexColor("#dbeafe")),
        "section": ParagraphStyle("Section", parent=base["Normal"], fontName=bold, fontSize=10, leading=12, textColor=ACCENT, spaceAfter=10, uppercase=True, letterSpacing=1.2),
        "company": ParagraphStyle("Company", parent=base["Normal"], fontName=bold, fontSize=7.2, leading=9, textColor=ACCENT, uppercase=True),
        "role": ParagraphStyle("Role", parent=base["Normal"], fontName=bold, fontSize=12.5, leading=15, textColor=INK, spaceBefore=2, spaceAfter=5),
        "period": ParagraphStyle("Period", parent=base["Normal"], fontName=regular, fontSize=7.2, leading=9, textColor=MUTED),
        "body": ParagraphStyle("Body", parent=base["Normal"], fontName=regular, fontSize=8.2, leading=12.2, textColor=MUTED),
        "skill": ParagraphStyle("Skill", parent=base["Normal"], fontName=bold, fontSize=9.2, leading=11, textColor=INK, spaceAfter=3),
        "keywords": ParagraphStyle("Keywords", parent=base["Normal"], fontName=regular, fontSize=7.4, leading=10.5, textColor=MUTED),
        "small": ParagraphStyle("Small", parent=base["Normal"], fontName=regular, fontSize=7.2, leading=10, textColor=MUTED),
        "footer": ParagraphStyle("Footer", parent=base["Normal"], fontName=regular, fontSize=6.8, leading=8, textColor=MUTED, alignment=TA_LEFT),
    }


def experience_flowable(
    item: dict[str, Any],
    lang: str,
    s: dict[str, ParagraphStyle],
    present: str,
    width_mm: float = 153,
):
    period = f"{format_month(item['startDate'], lang, present)} - {format_month(item['endDate'], lang, present)}"
    technologies = "  ·  ".join(item["technologies"][:8])
    return [
        Table([
            [Paragraph(esc(item["company"]), s["company"]), Paragraph(esc(period), s["period"])],
        ], colWidths=[width_mm*0.66*mm, width_mm*0.34*mm], style=TableStyle([
            ("VALIGN", (0,0), (-1,-1), "TOP"),
            ("ALIGN", (1,0), (1,0), "RIGHT"),
            ("LEFTPADDING", (0,0), (-1,-1), 0),
            ("RIGHTPADDING", (0,0), (-1,-1), 0),
            ("TOPPADDING", (0,0), (-1,-1), 0),
            ("BOTTOMPADDING", (0,0), (-1,-1), 0),
        ])),
        Paragraph(esc(item["role"]), s["role"]),
        Paragraph(esc(item["description"]), s["body"]),
        Spacer(1, 4),
        Paragraph(esc(technologies), s["keywords"]),
        Spacer(1, 11),
        Table([[""]], colWidths=[width_mm*mm], rowHeights=[0.35], style=TableStyle([("BACKGROUND", (0,0), (-1,-1), RULE)])),
        Spacer(1, 10),
    ]


class CVDocTemplate(BaseDocTemplate):
    pass


def generate_pdf(lang: str, cv: dict[str, Any], experience: list[dict[str, Any]]) -> Path:
    path = OUT / f"airan-sanchez-cv-{lang}.pdf"
    s = styles_for(lang)
    page_w, page_h = A4
    doc = CVDocTemplate(
        str(path), pagesize=A4, leftMargin=21*mm, rightMargin=21*mm,
        topMargin=18*mm, bottomMargin=17*mm,
        title=f"{cv['name']} - {cv['headline']}", author=cv["name"],
        subject=cv["summary"],
    )

    first_frame = Frame(21*mm, 17*mm, page_w-42*mm, page_h-89*mm, id="first", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    later_frame = Frame(21*mm, 17*mm, page_w-42*mm, page_h-34*mm, id="later", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)

    def first_page(canvas, _doc):
        canvas.saveState()
        canvas.setFillColor(NAVY)
        canvas.rect(0, page_h-64*mm, page_w, 64*mm, fill=1, stroke=0)
        canvas.setFillColor(SURFACE)
        canvas.circle(page_w-18*mm, page_h-10*mm, 42*mm, fill=1, stroke=0)
        canvas.setFillColor(ACCENT)
        canvas.circle(page_w-25*mm, page_h-18*mm, 25*mm, fill=1, stroke=0)
        canvas.setFillColor(PAPER)
        canvas.rect(21*mm, page_h-66*mm, 18*mm, 2*mm, fill=1, stroke=0)
        contact_links = " · ".join([
            f'<link href="{esc(link["url"])}" color="#dbeafe">{esc(link["label"])}</link>'
            for link in cv["links"]
        ])
        name_p = Paragraph(esc(cv["name"]), s["name"])
        name_p.wrapOn(canvas, 108*mm, 16*mm)
        name_p.drawOn(canvas, 21*mm, page_h-28*mm)
        headline_p = Paragraph(esc(cv["headline"].upper()), s["headline"])
        headline_p.wrapOn(canvas, 108*mm, 8*mm)
        headline_p.drawOn(canvas, 21*mm, page_h-36*mm)
        summary_p = Paragraph(esc(cv["summary"]), s["hero"])
        summary_p.wrapOn(canvas, 108*mm, 24*mm)
        summary_p.drawOn(canvas, 21*mm, page_h-58*mm)
        contact_p = Paragraph(
            f'{esc(cv["location"])}<br/>{esc(cv["email"])}<br/>{contact_links}<br/>'
            '<link href="https://www.airanschez.tech" color="#60a5fa">www.airanschez.tech</link>',
            s["contact"],
        )
        contact_p.wrapOn(canvas, 45*mm, 34*mm)
        contact_p.drawOn(canvas, 145*mm, page_h-53*mm)
        canvas.restoreState()

    def later_page(canvas, doc_obj):
        canvas.saveState()
        canvas.setStrokeColor(RULE)
        canvas.line(21*mm, page_h-14*mm, page_w-21*mm, page_h-14*mm)
        canvas.setFillColor(MUTED)
        canvas.setFont(s["footer"].fontName, 7)
        canvas.drawString(21*mm, 10*mm, f"{cv['name']} · {cv['headline']}")
        canvas.drawRightString(page_w-21*mm, 10*mm, str(doc_obj.page))
        canvas.restoreState()

    doc.addPageTemplates([
        PageTemplate(id="first", frames=[first_frame], onPage=first_page),
        PageTemplate(id="later", frames=[later_frame], onPage=later_page),
    ])

    first_experience = []
    for item in experience[:3]:
        first_experience.extend(experience_flowable(item, lang, s, cv["labels"]["present"], width_mm=99))

    skill_blocks = []
    for skill in cv["skills"]:
        skill_blocks.extend([
            Paragraph(esc(skill["name"]), s["skill"]),
            Paragraph(esc(" · ".join(skill["keywords"])), s["keywords"]),
            Spacer(1, 9),
        ])

    first_body = Table([
        [[Paragraph(esc(cv["labels"]["capabilities"]), s["section"]), *skill_blocks],
         [Paragraph(esc(cv["labels"]["experience"]), s["section"]), *first_experience]],
    ], colWidths=[52*mm, 107*mm], style=TableStyle([
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("LEFTPADDING", (0,0), (0,0), 0),
        ("RIGHTPADDING", (0,0), (0,0), 8*mm),
        ("LEFTPADDING", (1,0), (1,0), 8*mm),
        ("RIGHTPADDING", (1,0), (1,0), 0),
        ("TOPPADDING", (0,0), (-1,-1), 0),
        ("BOTTOMPADDING", (0,0), (-1,-1), 0),
        ("LINEBEFORE", (1,0), (1,0), 0.5, RULE),
    ]))

    story = [first_body, NextPageTemplate("later"), PageBreak()]
    story.append(Paragraph(esc(cv["labels"]["experience"]), s["section"]))
    for item in experience[3:]:
        story.append(KeepTogether(experience_flowable(item, lang, s, cv["labels"]["present"])))

    education_flow = [Paragraph(esc(cv["labels"]["education"]), s["section"])]
    for item in cv["education"]:
        education_flow.extend([
            Paragraph(esc(item["title"]), s["skill"]),
            Paragraph(esc(item["description"]), s["body"]),
            Spacer(1, 9),
        ])

    talk = cv["talk"]
    talk_flow = [
        Paragraph(esc(cv["labels"]["talk"]), s["section"]),
        Paragraph(esc(f"{talk['event']} · {talk['year']}"), s["company"]),
        Paragraph(esc(talk["title"]), s["role"]),
        Paragraph(esc(talk["description"]), s["body"]),
        Spacer(1, 6),
        Paragraph(f'<link href="{esc(talk["url"])}" color="#4727cc">YouTube ↗</link>', s["keywords"]),
    ]
    story.extend([
        Spacer(1, 4*mm),
        Table([[education_flow, talk_flow]], colWidths=[77*mm, 77*mm], style=TableStyle([
            ("VALIGN", (0,0), (-1,-1), "TOP"),
            ("BOX", (0,0), (-1,-1), 0.5, RULE),
            ("INNERGRID", (0,0), (-1,-1), 0.5, RULE),
            ("BACKGROUND", (0,0), (-1,-1), PAPER),
            ("LEFTPADDING", (0,0), (-1,-1), 7*mm),
            ("RIGHTPADDING", (0,0), (-1,-1), 7*mm),
            ("TOPPADDING", (0,0), (-1,-1), 7*mm),
            ("BOTTOMPADDING", (0,0), (-1,-1), 7*mm),
        ])),
    ])

    doc.build(story)
    return path


def main() -> None:
    for lang in ("es", "en", "ja"):
        cv, experience = load_data(lang)
        resume = make_json_resume(lang, cv, experience)
        json_path = OUT / f"airan-sanchez-resume-{lang}.json"
        json_path.write_text(json.dumps(resume, ensure_ascii=False, indent=2) + "\n")
        pdf_path = generate_pdf(lang, cv, experience)
        print(f"generated {json_path.relative_to(ROOT)}")
        print(f"generated {pdf_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
