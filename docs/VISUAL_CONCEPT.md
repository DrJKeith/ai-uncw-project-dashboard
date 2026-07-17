# Accepted Visual Concept

**Status:** Accepted and implemented

**Concept name:** The Leadership Briefing Ledger

## Design idea

The dashboard should feel like a carefully edited institutional briefing that happens to be interactive: open white space, strong editorial typography, thin rules, compact evidence labels, and one restrained teal attention device. It should not resemble a sales dashboard or a dense project-management tool. The overview title is “AI@UNCW Project Dashboard,” and the identity statement is “The AI Hub Orchestrates and GAABS Supports AI Builders.”

The interface uses no official UNCW seal, logo, or invented brand mark. The identity is a plain text lockup: “AI Hub / GAABS.”

## Desktop composition

- **Canvas:** True white background, 1440px design viewport, 1240px maximum content width.
- **Header:** 72px quiet header with text identity at left, primary navigation centered/right, and an “About this record” link.
- **Overview first viewport:** Editorial 7/5 split under the page title “AI@UNCW Project Dashboard.” Executive summary and update metadata occupy the larger left column. A narrow right ledger lists current priorities.
- **Attention rail:** Full-width horizontal band below the summary, using a left rule and semantic label rather than a rounded card.
- **Lower rhythm:** Recent accomplishments as open rows; identity statement and provenance note as a dark navy closing band.
- **Detail pages:** Structured lists and tables with generous row height, sticky column headers where useful, and a right-side detail drawer on large screens.
- **Roadmap:** Three vertical bands labeled Now, Next, Later, aligned to a shared time/provenance grid.
- **Risks and decisions:** Split action surface. Risks use severity rails; decisions use a clear action-request column. Informational updates sit below under “For awareness.”
- **Archive:** Editorial report index with dates in a narrow left column and summaries/change records to the right.

## Mobile composition

- 390px reference viewport with a compact text header and labeled menu button.
- “As of,” reporting period, and source basis remain directly below the title.
- Content follows the desktop priority order: summary, attention item, priorities, recent accomplishments, identity statement.
- Tables become labeled record stacks; no essential content depends on horizontal scrolling.
- The Now / Next / Later roadmap becomes three stacked sections.
- Filter controls open in a full-width sheet with explicit Apply and Clear actions.
- Footer contact stays visible and readable, not fixed over content.

## Design tokens

### Color

| Token | Value | Role |
|---|---:|---|
| Canvas | `#FFFFFF` | Primary background; true white |
| Navy 900 | `#102A43` | Primary text and dark institutional band |
| Navy 700 | `#264A66` | Secondary headings and controls |
| Teal 700 | `#0F6F70` | Links, focus, active navigation |
| Teal 100 | `#DCEEEE` | Selected and informational surface |
| Gold 600 | `#A86B12` | High-attention accent; not decorative |
| Red 700 | `#A53A36` | Critical severity |
| Gray 700 | `#485866` | Secondary body text |
| Gray 300 | `#CBD4DB` | Borders and rules |
| Gray 100 | `#F4F7F8` | Table header and subtle band |

All semantic combinations must meet WCAG AA. Status and severity always include text and a shape or rule, never color alone.

### Typography

- **Display/editorial:** Source Serif 4 or a metrics-compatible open fallback; used for page titles and executive summary emphasis.
- **UI and body:** Inter or a system sans-serif fallback; used for navigation, controls, labels, tables, and body text.
- **Desktop scale:** 48/54 page title, 28/34 section heading, 20/30 lead, 16/26 body, 14/20 UI, 12/18 metadata.
- **Mobile scale:** 34/40 page title, 24/30 section heading, 18/27 lead, 16/25 body, 14/20 UI.
- Labels use sentence case; no all-caps paragraphs or letter-spaced decorative captions.

### Spacing and geometry

- 4px base scale with primary steps at 8, 12, 16, 24, 32, 48, 64, and 96px.
- 1px rules define sections and rows.
- Corners are mostly square; 4px radius on inputs and buttons, 8px only on the mobile filter sheet.
- Shadows are reserved for overlays and the mobile menu, not content containers.
- Minimum interactive target is 44px.

## Component families

- Text identity lockup.
- Primary navigation with underline selected state.
- Source context line: As of / Reporting period / Source basis.
- Status label with text plus geometric marker.
- Attention rail with semantic severity treatment.
- Open record row and expandable detail.
- Filter bar and mobile filter sheet.
- Workstream index and detail ledger.
- Now / Next / Later roadmap band.
- Risk row with severity rail.
- Decision request row and subordinate awareness row.
- Report archive row and snapshot/change list.
- Empty state with plain explanation and next manual action.
- Print header and provenance footer.

## Interaction and motion

- Underline and subtle background shifts communicate hover/selected states.
- Expand/collapse uses a 160ms height/opacity transition; disabled under `prefers-reduced-motion`.
- Keyboard focus uses a 3px teal outline with 2px offset.
- Deep-linked records receive temporary teal background emphasis, not animation.
- No auto-rotating content, parallax, animated counters, or decorative motion.

## Status treatment

Statuses use a small shape before the complete text label:

- Completed: filled teal square.
- Active: teal vertical bar.
- Scheduled: outlined navy square.
- Waiting: amber pause bars.
- Needs verification: amber outlined diamond.
- Proposed: gray outlined circle.
- Closed: gray horizontal rule.
- Superseded: gray double rule.

These are interface markers, not badges or decorative pills.

## Empty and staging states

The production dashboard empty state says: “No approved progress report has been incorporated.” It offers no demo metrics or invented work.

Ambiguous imported content is visible only in the local review artifact, labeled “Needs review.” It never appears in the supervisor dashboard until an approved proposal resolves it.

## Public implementation evidence

The public repository includes only sanitized browser captures of the implemented interface:

1. [Desktop overview](../design/implementation/desktop-overview.png).
2. [Desktop accomplishments](../design/implementation/desktop-accomplishments.png).
3. [Mobile overview](../design/implementation/mobile-overview.png).
4. [Mobile report detail](../design/implementation/mobile-reports.png).

Unapproved concept mockups, extraction notes, and report-population specimens remain local and are ignored by Git. They are intentionally excluded from the public repository.

The implementation captures use a 1440px desktop viewport and a 390px mobile viewport. Roadmap, Risks, and Decisions are separate navigable pages in the application.

## Concept review notes

- **Hierarchy:** The desktop overview gives summary and priorities the largest share of the first viewport, with one attention rail below.
- **Container model:** Open rows, rules, bands, and tables replace decorative card grids.
- **Source discipline:** Empty-state copy and provenance remain visible; specimen data is labeled as non-production.
- **Typography:** Editorial serif headings establish briefing character while sans-serif chrome keeps controls compact.
- **Responsive behavior:** Mobile preserves information order and converts table anatomy into labeled record stacks.
- **Accessibility signal:** Controls are visibly labeled, focus treatment is explicit, and status/severity use text with color.

The implementation was checked at 1440px desktop and 390px mobile widths. Keyboard navigation, source labels, filters, deep links, mobile navigation, horizontal overflow, console errors, and production builds were verified before publication.

## Implementation outcome

The accepted decisions were:

1. Use the institutionally restrained “Leadership Briefing Ledger” direction.
2. Preserve the two-minute overview hierarchy.
3. Prefer open tables and structured lists over card grids.
4. Use the white, navy, and teal palette without inventing official brand assets.

Privacy-driven implementation differences are intentional: named activity-ledger details and internal decision requests are excluded from the public dataset.

The production dataset contains only the approved public-safe July 17 summary.
