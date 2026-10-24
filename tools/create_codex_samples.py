from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "codex"
OUTPUT.mkdir(parents=True, exist_ok=True)

INK = HexColor("#0d2e37")
MUTED = HexColor("#52666b")
PAPER = HexColor("#fbf7ef")
SAND = HexColor("#c6a675")
GREEN = HexColor("#39745f")
RED = HexColor("#a24a3d")
LINE = HexColor("#d8c9b1")


def draw_wrapped(c, text, x, y, width, font, size, leading, color=INK):
    c.setFillColor(color)
    c.setFont(font, size)
    words = text.split()
    line = ""
    for word in words:
        candidate = (line + " " + word).strip()
        if stringWidth(candidate, font, size) <= width:
            line = candidate
        else:
            c.drawString(x, y, line)
            y -= leading
            line = word
    if line:
        c.drawString(x, y, line)
        y -= leading
    return y


def base(c, kicker, title, subtitle, page_number, total_pages):
    width, height = A4
    c.setFillColor(PAPER)
    c.rect(0, 0, width, height, fill=1, stroke=0)
    c.setFillColor(INK)
    c.rect(0, height - 15 * mm, width, 15 * mm, fill=1, stroke=0)
    c.setFillColor(PAPER)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(18 * mm, height - 9.5 * mm, "MIHIRA CEREMONIA · THE CODEX")
    c.setFillColor(SAND)
    c.drawRightString(width - 18 * mm, height - 9.5 * mm, "SAMPLE · NOT PERSONALISED")
    y = height - 33 * mm
    c.setFillColor(SAND)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(18 * mm, y, kicker)
    y -= 12 * mm
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 24)
    for line in title.split("\n"):
        c.drawString(18 * mm, y, line)
        y -= 9 * mm
    y -= 2 * mm
    y = draw_wrapped(c, subtitle, 18 * mm, y, width - 36 * mm, "Helvetica", 10, 5 * mm, MUTED)
    c.setStrokeColor(LINE)
    c.line(18 * mm, 22 * mm, width - 18 * mm, 22 * mm)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7)
    c.drawString(18 * mm, 15 * mm, "Illustrative structure only · No personal data · No prediction or diagnosis")
    c.drawRightString(width - 18 * mm, 15 * mm, f"{page_number} / {total_pages}")
    return y - 4 * mm


def box(c, x, y, width, height, label, body, accent=INK):
    c.setFillColor(HexColor("#fffdf8"))
    c.setStrokeColor(LINE)
    c.roundRect(x, y - height, width, height, 3 * mm, fill=1, stroke=1)
    c.setFillColor(accent)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(x + 7 * mm, y - 9 * mm, label)
    draw_wrapped(c, body, x + 7 * mm, y - 17 * mm, width - 14 * mm, "Helvetica", 9.5, 4.8 * mm, INK)


def footer_note(c, text):
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Oblique", 8)
    draw_wrapped(c, text, 18 * mm, 34 * mm, A4[0] - 36 * mm, "Helvetica-Oblique", 8, 4.2 * mm, MUTED)


def yearly_page(c, total_pages):
    y = base(c, "CODEX 2027 · MONTHLY RETURN POINT", "MARCH · MAKE ROOM\nFOR A CLEAR YES", "Beispiel / Example: a short monthly orientation that can be returned to without needing a full forecast.", 1, total_pages)
    box(c, 18 * mm, y, 82 * mm, 38 * mm, "MONTHLY FOCUS · MONATSFOKUS", "Clarity before speed. Check the conditions that make one decision genuinely workable.", SAND)
    box(c, 110 * mm, y, 82 * mm, 38 * mm, "ONE QUESTION · EINE FRAGE", "What becomes simpler when you name the capacity you actually have?", INK)
    y -= 50 * mm
    box(c, 18 * mm, y, 82 * mm, 52 * mm, "DO · WAS HILFT", "• Check time, energy and existing commitments.\n• Make one request more specific.\n• Leave room between decision and action.", GREEN)
    box(c, 110 * mm, y, 82 * mm, 52 * mm, "DON'T · WAS NICHT HILFT", "• Turn pressure into a promise.\n• Read urgency as proof of direction.\n• Add a commitment before the frame is clear.", RED)
    footer_note(c, "This is a sample of form and tone. Codex 2027 offers personal orientation and reflection prompts; it does not predict events or replace professional advice.")
    c.showPage()


def sample_page(c, page_number, kicker, title, subtitle, blocks, note):
    y = base(c, kicker, title, subtitle, page_number, 7)
    top = y
    for index, (label, body, accent) in enumerate(blocks):
        column = index % 2
        row = index // 2
        x = 18 * mm + column * 92 * mm
        yy = top - row * 50 * mm
        box(c, x, yy, 82 * mm, 38 * mm, label, body, accent)
    footer_note(c, note)
    c.showPage()


def build():
    c = canvas.Canvas(str(OUTPUT / "codex-2027-monatsuebersicht-beispiel.pdf"), pagesize=A4, pageCompression=1)
    c.setTitle("Codex 2027 - Sample Monthly Overview")
    c.setAuthor("Mihira Ceremonia - The Codex")
    yearly_page(c, 1)
    c.save()

    c = canvas.Canvas(str(OUTPUT / "codex-beispielseiten.pdf"), pagesize=A4, pageCompression=1)
    c.setTitle("The Codex - Sample Pages")
    c.setAuthor("Mihira Ceremonia - The Codex")
    yearly_page(c, 7)
    sample_page(c, 2, "CURRENT SKY · SAMPLE", "WHAT IS PRESENT\nRIGHT NOW?", "Beispiel / Example: a concise written reflection that puts one current symbolic theme in context.", [
        ("CURRENT THEME · AKTUELLES THEMA", "A change in rhythm may be asking for attention before a new commitment is made.", SAND),
        ("CHART REFERENCE · CHART-BEZUG", "Selected current transits are considered in relation to relevant natal placements.", INK),
        ("REFLECTION · REFLEXION", "Where do you need more information, and where do you simply need a quieter pace?", GREEN),
        ("SCOPE · RAHMEN", "One or two symbolic themes. No event forecast, diagnosis or deterministic advice.", RED),
    ], "A Current Sky sample shows the structure only. A personal version is written from the agreed birth information and current question.")
    sample_page(c, 3, "PERSONAL PATTERN · SAMPLE", "ONE RECURRING QUESTION.\nA PRECISE FRAME.", "Beispiel / Example: a focused exploration of one theme in relationship, expression or direction.", [
        ("FOCUS · FOKUS", "The theme is not 'everything at once'; it is one recurring situation you can recognise in lived experience.", SAND),
        ("OBSERVATION · BEOBACHTUNG", "The reading may connect selected placements, aspects and house themes without reducing a person to them.", INK),
        ("REFLECTION QUESTION · PRÜFFRAGE", "When does discernment support you - and when does it postpone a necessary conversation?", GREEN),
        ("SCOPE · RAHMEN", "A 3-4 page symbolic perspective. No diagnosis, prediction or complete Codex assessment.", RED),
    ], "Any interpretation remains an invitation to observation. Lived experience and choice always have priority.")
    sample_page(c, 4, "ASTROLOGICAL FOUNDATIONS · SAMPLE", "MORE THAN\nA SUN SIGN.", "Beispiel / Example: an introductory map of selected natal foundations and one current context.", [
        ("FOUNDATIONS · GRUNDLAGEN", "Sun, Moon and Ascendant where birth time permits; selected placements and houses.", SAND),
        ("CENTRAL THREAD · ROTE FADEN", "A careful synthesis of one chart theme rather than a claim to explain the whole person.", INK),
        ("RETURN QUESTION · RÜCKFRAGE", "Which conditions help you make room for both stability and change?", GREEN),
        ("SCOPE · RAHMEN", "A 4-6 page introductory reading. No full Codex, diagnosis or deterministic prediction.", RED),
    ], "When the birth time is unknown, the scope is adjusted and uncertain elements are not presented as certain.")
    sample_page(c, 5, "CODEX INTRODUCTION · SAMPLE", "ONE QUESTION.\nA FIRST MIRROR.", "Beispiel / Example: a contained written starting point for one concrete question.", [
        ("QUESTION · FRAGE", "What needs to be clarified before you decide whether to continue, pause or ask for more information?", SAND),
        ("PERSPECTIVE · PERSPEKTIVE", "A selected symbolic reference is translated into plain language and held alongside your own context.", INK),
        ("THREE PROMPTS · DREI IMPULSE", "1. What is known?  2. What is assumed?  3. What would a workable next step look like?", GREEN),
        ("SCOPE · RAHMEN", "One written PDF with reflection prompts. No live conversation included.", RED),
    ], "The final focus, source material, delivery and price are confirmed before any deeper Codex work begins.")
    sample_page(c, 6, "PERSONAL CODEX · SAMPLE", "SEVERAL PERSPECTIVES.\nONE COHERENT THREAD.", "Beispiel / Example: a wider written exploration followed by one focused conversation.", [
        ("YOUR CONTEXT · DEIN KONTEXT", "Several connected questions are gathered before the reading begins, so the scope stays clear.", SAND),
        ("SYNTHESIS · VERBINDUNG", "Selected symbolic perspectives are set beside lived patterns, not above them.", INK),
        ("CONVERSATION · GESPRÄCH", "A 45-minute call is used to clarify questions and translate the written material into everyday choices.", GREEN),
        ("SCOPE · RAHMEN", "Personal written PDF plus one focused conversation. Focus agreed before booking.", RED),
    ], "This sample is intentionally anonymous. A personal Codex is not a clinical assessment or a fixed description of a person.")
    sample_page(c, 7, "CODEX IN CONTEXT · SAMPLE", "SEE THE CONTEXT.\nCHOOSE THE NEXT STEP.", "Beispiel / Example: a wider frame for a transition, role, relationship or connected life situation.", [
        ("CONTEXT · KONTEXT", "What is changing, what is staying, and where does the question actually sit in the wider picture?", SAND),
        ("CONNECTIONS · VERBINDUNGEN", "The written work links relevant themes without making claims about other people or predicting outcomes.", INK),
        ("INTEGRATION · INTEGRATION", "A 60-minute conversation turns the written reflection into a small, practical next-step map.", GREEN),
        ("SCOPE · RAHMEN", "30-minute scoping call, written exploration and 60-minute integration conversation.", RED),
    ], "The wider frame is agreed in advance. For relationship work, the participation and consent of all involved people is essential.")
    c.save()


if __name__ == "__main__":
    build()
