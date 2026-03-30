# Landing Page — Belt for Martial Arts

Full technical and commercial specification for the Belt landing page. This document serves as a complete briefing for implementation.

---

## 1. Commercial Objective

Convince **martial arts gym owners** to adopt Belt as their WhatsApp-based management assistant. Target audience:

- Runs 1-5 gym locations
- Uses WhatsApp as the primary communication channel with instructors
- Struggles with manual attendance tracking (notebook, spreadsheet)
- Values speed and practicality ("mat mentality")
- Distrusts complex software — needs to see it's simple

**Conversion**: WhatsApp button with pre-filled message. No sign-up, no form, no checkout. The funnel is: read the page → click WhatsApp → talk to sales team.

---

## 2. Technical Architecture

### 2.1 Stack

| Layer    | Technology                                                            |
| -------- | --------------------------------------------------------------------- |
| Markup   | Semantic HTML5 (single page + `/sobre` route)                         |
| Styling  | Pure CSS3 (custom properties, flexbox, grid)                          |
| Behavior | Minimal vanilla JS (language toggle, region detection, smooth scroll) |
| Fonts    | Google Fonts — **Inter** (body) + **Space Grotesk** (headings)        |
| Hosting  | Any static server (Netlify, Vercel, GitHub Pages, S3)                 |
| Build    | None — files served directly                                          |

### 2.2 File Structure

```
belt-landing/
  index.html           ← main page (single page)
  sobre.html           ← /sobre (MallBerg Solucoes company page)
  css/
    styles.css         ← global styles + responsive
  js/
    i18n.js            ← translation dictionary + switching logic
    main.js            ← language detection, scroll, interactions
  assets/
    logo-belt.svg      ← Belt logo
    flags/
      br.svg           ← Brazil flag
      us.svg           ← USA flag
      es.svg           ← Spain flag
    icons/
      whatsapp.svg
      check.svg
      chart.svg
      mic.svg
      bell.svg
    mockups/
      phone-attendance.png   ← WhatsApp conversation mockup (attendance)
      phone-report.png       ← WhatsApp conversation mockup (report)
```

### 2.3 Color Palette

| Token                   | Hex       | Usage                                  |
| ----------------------- | --------- | -------------------------------------- |
| `--color-bg`            | `#ffffff` | Main background                        |
| `--color-bg-alt`        | `#e2daff` | Alternating section backgrounds, cards |
| `--color-primary`       | `#7a51e0` | Buttons, links, accents, CTA           |
| `--color-text`          | `#000000` | Main text                              |
| `--color-primary-dark`  | `#5a35b8` | Button hover                           |
| `--color-primary-light` | `#f3efff` | Subtle badge backgrounds               |

### 2.4 Typography

| Element         | Font          | Weight | Size (desktop / mobile) |
| --------------- | ------------- | ------ | ----------------------- |
| H1 (hero)       | Space Grotesk | 700    | 48px / 32px             |
| H2 (sections)   | Space Grotesk | 600    | 36px / 26px             |
| H3 (cards)      | Space Grotesk | 600    | 22px / 18px             |
| Body            | Inter         | 400    | 18px / 16px             |
| Body bold       | Inter         | 600    | 18px / 16px             |
| Small / caption | Inter         | 400    | 14px / 13px             |

Google Fonts import:

```
Inter:wght@400;600&family=Space+Grotesk:wght@600;700
```

---

## 3. Internationalization (i18n)

### 3.1 Languages

| Code | Language            | Flag     |
| ---- | ------------------- | -------- |
| `pt` | Portuguese (Brazil) | `br.svg` |
| `en` | English             | `us.svg` |
| `es` | Spanish             | `es.svg` |

### 3.2 Initial Language Detection

Priority order:

1. Query param `?lang=pt|en|es`
2. `localStorage.getItem('belt-lang')`
3. `navigator.language` or `navigator.languages[0]`:
   - Starts with `pt` → `pt`
   - Starts with `es` → `es`
   - Anything else → `en`

### 3.3 Language Toggle

- Position: top-right corner of header, next to navigation
- Format: circular button showing the active language's flag. On click, opens dropdown with all 3 options (flag + code: "PT", "EN", "ES")
- On switch, saves to `localStorage` and updates all page text without reload (`data-i18n="key"` attributes on elements, JS replaces `textContent`)
- Smooth transition: `opacity 0.2s` on body when switching

### 3.4 Translation Strategy

File `i18n.js` exports object:

```javascript
const translations = {
  pt: {
    "hero.title": "Presenca por WhatsApp. Simples assim.",
    "hero.subtitle": "Seus instrutores enviam os nomes dos alunos no WhatsApp. O Belt faz o resto.",
    "cta.whatsapp": "Comecar a usar o Belt",
    // ... all keys
  },
  en: {
    "hero.title": "Attendance via WhatsApp. That simple.",
    "hero.subtitle": "Your instructors send student names on WhatsApp. Belt does the rest.",
    "cta.whatsapp": "Start using Belt",
    // ...
  },
  es: { ... }
};
```

Every translatable element gets `data-i18n="hero.title"`. JS iterates all and applies the text.

---

## 4. Page Structure (index.html)

### 4.1 Header (fixed at top)

- Belt logo (left)
- Navigation: anchor links to sections (How It Works, Features, Pricing, Contact)
- Language toggle (right)
- Mobile: hamburger menu with slide-in panel

### 4.2 Hero Section

**Intent**: create immediate identification ("this is for me").

| Element     | Content (PT)                                                                   | Content (EN)                                                           |
| ----------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| H1          | "Presenca por WhatsApp. Simples assim."                                        | "Attendance via WhatsApp. That simple."                                |
| Subtitle    | "Seus instrutores enviam os nomes dos alunos no WhatsApp. O Belt faz o resto." | "Your instructors send student names on WhatsApp. Belt does the rest." |
| Primary CTA | WhatsApp button: "Comecar a usar o Belt"                                       | "Start using Belt"                                                     |
| Visual      | Phone mockup with WhatsApp conversation showing attendance being recorded      |

Layout: text on left, mockup on right (desktop). Stacked on mobile.

Background: subtle gradient from `#ffffff` to `#e2daff`.

### 4.3 "How It Works" Section (3 steps)

**Intent**: eliminate the "it must be complicated" objection.

3 horizontal cards (stacked on mobile):

| Step | Icon        | Title (EN)                   | Description (EN)                                                                                         |
| ---- | ----------- | ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| 1    | `mic.svg`   | "Instructor sends a message" | "Text or voice with the names of students who came to train. No app, no login — straight from WhatsApp." |
| 2    | `check.svg` | "Belt records attendance"    | "AI identifies the names, checks for duplicates, and logs everything automatically."                     |
| 3    | `chart.svg` | "You track the data"         | "Automatic weekly reports. Frequency, trends, missing students — all in your WhatsApp."                  |

### 4.4 "Features" Section (feature grid)

**Intent**: show depth without complexity.

2x3 grid (desktop) / stack (mobile) with cards:

| Feature          | Icon        | Title (EN)            | Description (EN)                                                                                       |
| ---------------- | ----------- | --------------------- | ------------------------------------------------------------------------------------------------------ |
| Text attendance  | `check.svg` | "Attendance by text"  | "Send 'Joao, Maria, Pedro' and done. Recognizes nicknames, partial last names, and messy lists."       |
| Audio attendance | `mic.svg`   | "Attendance by voice" | "Record a voice message saying the names. Belt transcribes and logs automatically."                    |
| Auto reports     | `chart.svg` | "Automatic reports"   | "Every Sunday you get a weekly summary: who came, who didn't, attendance per student."                 |
| Quick commands   | `#`         | "Quick commands"      | "Send #a to see monthly attendance or #h for help. Fast and direct."                                   |
| Student notes    | `bell.svg`  | "Student notes"       | "Log observations: 'Pedro promoted to blue belt', 'Ana knee injury'. Everything stays in the history." |
| Smart queries    | `?`         | "Ask anything"        | "'How many classes did Joao attend this month?' — Belt queries the data and answers instantly."        |

### 4.5 "Why Belt?" Section

**Intent**: attack specific pain points of martial arts gym owners.

Layout: before/after list or pain points with solutions.

| Pain (EN)                       | Belt Solution (EN)                                 |
| ------------------------------- | -------------------------------------------------- |
| "Notebook attendance gets lost" | "All digital, automatic, with permanent history"   |
| "Instructor forgets to log"     | "Just send a WhatsApp — no extra app to open"      |
| "I don't know who's missing"    | "Weekly report shows who hasn't shown up"          |
| "Spreadsheets are complicated"  | "Zero spreadsheets. Zero computer. Just WhatsApp." |

### 4.6 "Pricing" Section (simple)

**Intent**: transparency, no surprises.

- Single centered card with `--color-bg-alt` background
- Title: "Simple and transparent"
- Price: placeholder `[TO BE DEFINED]` (sales team defines)
- Inclusions list: "Unlimited instructors", "Unlimited students", "Weekly reports", "WhatsApp support"
- CTA: WhatsApp button

### 4.7 Final CTA Section

- Background `--color-primary` with white text
- Title: "Ready to ditch the attendance notebook?"
- Subtitle: "Start now. No contract, no credit card."
- Large centered WhatsApp button

### 4.8 Footer

- Belt logo (light version for dark background)
- Link to `/sobre` (MallBerg Solucoes)
- Text: "Belt is a MallBerg Solucoes product"
- Copyright: "(c) 2026 MallBerg Solucoes. All rights reserved."
- Background: `--color-text` (#000) with white text

---

## 5. /sobre Page (sobre.html)

- Header and footer identical to `index.html`
- Content: simple section with title "About MallBerg Solucoes"
- Body: lorem ipsum placeholder (company will fill in later)
- Same i18n system (keys `sobre.title`, `sobre.content`)
- White background, centered layout with `max-width: 720px`

---

## 6. WhatsApp Button

### 6.1 Fixed CTA (floating)

- Position: bottom-right corner, fixed (`position: fixed`)
- Green WhatsApp icon (#25D366) with shadow
- Always visible (all sections)

### 6.2 Link

```
https://wa.me/447463576016?text=MESSAGE
```

**Number**: `447463576016` (UK)

**Pre-filled messages by language**:

| Language | Message                                                      |
| -------- | ------------------------------------------------------------ |
| PT       | `Ola! Vi seu site e gostaria de comecar a usar o Belt`       |
| EN       | `Hello! I saw your website and I'd like to start using Belt` |
| ES       | `Hola! Vi su sitio web y me gustaria empezar a usar Belt`    |

JS updates the `href` of the `<a>` element when the language is switched.

### 6.3 Inline CTAs (within sections)

Same link, same logic. Style: button with `--color-primary` background, white text, WhatsApp icon on the left. Border-radius: 8px. Padding: 16px 32px.

---

## 7. Responsiveness

| Breakpoint | Behavior                                                |
| ---------- | ------------------------------------------------------- |
| >= 1024px  | Desktop: side-by-side hero, 2x3 grid, horizontal header |
| 768-1023px | Tablet: 2x2 grid, stacked hero, hamburger header        |
| < 768px    | Mobile: all stacked, full-width cards, smaller font     |

Mobile-first approach. `min-width` media queries for desktop.

---

## 8. Performance & SEO

- No JS framework — pure vanilla, < 20KB total JS
- Single CSS file, < 15KB
- Images: SVG for icons/logo, WebP for mockups with PNG fallback
- Open Graph meta tags (title, description, image) per language
- `<html lang="pt">` updated dynamically
- `<meta name="description">` updated per language
- Structured data (JSON-LD) with `Organization` and `Product`
- SVG favicon

---

## 9. Accessibility

- Minimum WCAG AA contrast on all color combinations
- `aria-label` on language and WhatsApp buttons
- Skip-to-content link
- Visible focus on all interactive elements
- Alt text on images/mockups
- Semantic HTML: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`

---

## 10. Translated Content (i18n Key Summary)

Main keys for the translation dictionary:

```
hero.title
hero.subtitle
hero.cta
howItWorks.title
howItWorks.step1.title
howItWorks.step1.desc
howItWorks.step2.title
howItWorks.step2.desc
howItWorks.step3.title
howItWorks.step3.desc
features.title
features.[attendance|audio|reports|commands|notes|queries].title
features.[attendance|audio|reports|commands|notes|queries].desc
whyBelt.title
whyBelt.pain[1-4]
whyBelt.solution[1-4]
pricing.title
pricing.subtitle
pricing.includes.[1-4]
pricing.cta
finalCta.title
finalCta.subtitle
finalCta.button
footer.product
footer.copyright
footer.about
sobre.title
sobre.content
nav.howItWorks
nav.features
nav.pricing
nav.contact
nav.about
whatsapp.message
```
