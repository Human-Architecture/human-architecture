from pathlib import Path
import re

from docx import Document
from docx.enum.style import WD_STYLE_TYPE
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.text import WD_UNDERLINE
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'content' / 'substack' / 'was-ist-human-architecture.md'
OUTPUT = ROOT / 'content' / 'substack' / 'was-ist-human-architecture-substack-medium.docx'

def set_font(run, name='Aptos', size=None, bold=None, italic=None, color=None):
    run.font.name = name
    run._element.rPr.rFonts.set(qn('w:ascii'), name)
    run._element.rPr.rFonts.set(qn('w:hAnsi'), name)
    if size:
        run.font.size = Pt(size)
    if bold is not None:
        run.bold = bold
    if italic is not None:
        run.italic = italic
    if color:
        run.font.color.rgb = RGBColor(*color)

def add_hyperlink(paragraph, label, url):
    part = paragraph.part
    relationship_id = part.relate_to(url, 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink', is_external=True)
    hyperlink = paragraph._p.makeelement(qn('w:hyperlink'))
    hyperlink.set(qn('r:id'), relationship_id)
    run = paragraph.add_run(label)
    run._element.getparent().remove(run._element)
    properties = run._element.get_or_add_rPr()
    color = properties.get_or_add_color()
    color.val = RGBColor(11, 79, 90)
    underline = properties.get_or_add_u()
    underline.val = WD_UNDERLINE.SINGLE
    hyperlink.append(run._element)
    paragraph._p.append(hyperlink)

def add_markdown_text(paragraph, text):
    pattern = re.compile(r'\[([^\]]+)\]\((https?://[^)]+)\)')
    position = 0
    for match in pattern.finditer(text):
        if match.start() > position:
            run = paragraph.add_run(text[position:match.start()])
            set_font(run, size=11)
        add_hyperlink(paragraph, match.group(1), match.group(2))
        position = match.end()
    if position < len(text):
        run = paragraph.add_run(text[position:])
        set_font(run, size=11)

def main():
    source = SOURCE.read_text(encoding='utf-8')
    body = source.split('---', 2)[2].strip()
    lines = body.splitlines()

    doc = Document()
    section = doc.sections[0]
    section.top_margin = Inches(0.8)
    section.bottom_margin = Inches(0.8)
    section.left_margin = Inches(0.9)
    section.right_margin = Inches(0.9)

    normal = doc.styles['Normal']
    normal.font.name = 'Aptos'
    normal._element.rPr.rFonts.set(qn('w:ascii'), 'Aptos')
    normal._element.rPr.rFonts.set(qn('w:hAnsi'), 'Aptos')
    normal.font.size = Pt(11)
    normal.paragraph_format.space_after = Pt(8)
    normal.paragraph_format.line_spacing = 1.18

    subtitle_style = doc.styles.add_style('Article Subtitle', WD_STYLE_TYPE.PARAGRAPH)
    subtitle_style.font.name = 'Aptos'
    subtitle_style._element.rPr.rFonts.set(qn('w:ascii'), 'Aptos')
    subtitle_style._element.rPr.rFonts.set(qn('w:hAnsi'), 'Aptos')
    subtitle_style.font.size = Pt(13)
    subtitle_style.font.italic = True
    subtitle_style.font.color.rgb = RGBColor(75, 75, 75)
    subtitle_style.paragraph_format.space_after = Pt(20)

    title_seen = False
    for raw in lines:
        line = raw.strip()
        if not line:
            continue
        if line.startswith('# '):
            paragraph = doc.add_paragraph(style='Title')
            paragraph.paragraph_format.space_after = Pt(8)
            run = paragraph.add_run(line[2:])
            set_font(run, name='Georgia', size=25, color=(0, 0, 0))
            title_seen = True
        elif line.startswith('## '):
            if title_seen:
                paragraph = doc.add_paragraph(style='Article Subtitle')
                paragraph.add_run(line[3:])
                title_seen = False
            else:
                paragraph = doc.add_paragraph(style='Heading 1')
                paragraph.paragraph_format.space_before = Pt(18)
                paragraph.paragraph_format.space_after = Pt(8)
                run = paragraph.add_run(line[3:])
                set_font(run, name='Georgia', size=17, color=(0, 0, 0))
        elif line.startswith('### '):
            paragraph = doc.add_paragraph(style='Heading 2')
            paragraph.paragraph_format.space_before = Pt(14)
            paragraph.paragraph_format.space_after = Pt(6)
            run = paragraph.add_run(line[4:])
            set_font(run, name='Aptos Display', size=13, bold=True, color=(0, 0, 0))
        elif line.startswith('- '):
            paragraph = doc.add_paragraph(style='List Bullet')
            paragraph.paragraph_format.space_after = Pt(3)
            add_markdown_text(paragraph, line[2:])
        else:
            paragraph = doc.add_paragraph()
            add_markdown_text(paragraph, line)

    for paragraph in doc.paragraphs:
        if paragraph.style.name == 'Title':
            paragraph.alignment = WD_ALIGN_PARAGRAPH.LEFT

    doc.core_properties.title = 'Was ist Human Architecture'
    doc.core_properties.subject = 'Substack and Medium article'
    doc.core_properties.author = 'Human Architecture'
    doc.save(OUTPUT)
    print(OUTPUT)

if __name__ == '__main__':
    main()
