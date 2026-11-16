# Gemini API ledger

Every paid call made with the owner's Gemini key, with what it was for and what it cost. The key itself
is never stored in this repo.

- **Budget:** ₹130 (set by the owner, 2026-11-16: ₹80, raised by ₹50 for the desktop covers)
- **Spent:** ₹116.39 ($1.293)
- **Left:** ₹13.61

## How costs are estimated

Costs come from the token counts each response reports (`usageMetadata`), priced conservatively so the
real bill should be at or below these figures:

- Model `gemini-3.1-flash-image`: 1K images (published rate about $0.067 per image), 512px images
  for small uses such as avatars (about $0.045).
- Input tokens at $0.50 per 1M (the higher of the two figures Google publishes for this model).
- Every output token, including image and "thinking" tokens, at the image rate of $60 per 1M.
- ₹90 per US dollar, rounded up.

Free calls (listing models) are not logged.

## Calls

| # | Date (UTC) | Purpose | Model | Tokens in / out | Cost |
|---|---|---|---|---|---|
| 1 | 2026-11-16 14:47 | Case study thumbnail: Crop Guide (style test, kept) | gemini-3.1-flash-image | 203 / 1,379 | ₹7.46 |
| 2 | 2026-11-16 14:48 | Case study thumbnail: Farm Monitoring | gemini-3.1-flash-image | 201 / 1,412 | ₹7.63 |
| 3 | 2026-11-16 14:48 | Case study thumbnail: AI Crop Doctor | gemini-3.1-flash-image | 189 / 1,335 | ₹7.22 |
| 4 | 2026-11-16 14:48 | Case study thumbnail: Cattle Health Check | gemini-3.1-flash-image | 199 / 1,396 | ₹7.55 |
| 5 | 2026-11-16 14:48 | Case study thumbnail: Market Value | gemini-3.1-flash-image | 195 / 1,368 | ₹7.40 |
| 6 | 2026-11-16 14:49 | Case study thumbnail: Cow Dung Check | gemini-3.1-flash-image | 190 / 1,383 | ₹7.48 |
| 7 | 2026-11-16 15:51 | Crop Guide persona portrait: Ramesh (512px) | gemini-3.1-flash-image | 172 / 1,035 | ₹5.60 |
| 8 | 2026-11-16 15:52 | Crop Guide persona portrait: Lakshmi (512px) | gemini-3.1-flash-image | 161 / 1,069 | ₹5.78 |
| 9 | 2026-11-16 15:52 | Crop Guide persona portrait: agronomy lead (512px) | gemini-3.1-flash-image | 162 / 1,004 | ₹5.43 |
| 10 | 2026-11-16 15:52 | Crop Guide Problem-section scene (1K, 16:9) | gemini-3.1-flash-image | 234 / 1,471 | ₹7.95 |
| 11 | 2026-11-16 16:07 | Desktop cover, Crop Guide (3:2 recompose of the phone cover; test, kept) | gemini-3.1-flash-image | 383 / 1,447 | ₹7.83 |
| 12 | 2026-11-16 16:08 | Desktop cover, Farm Monitoring | gemini-3.1-flash-image | 383 / 1,422 | ₹7.70 |
| 13 | 2026-11-16 16:08 | Desktop cover, AI Crop Doctor | gemini-3.1-flash-image | 383 / 1,386 | ₹7.50 |
| 14 | 2026-11-16 16:08 | Desktop cover, Cattle Health Check | gemini-3.1-flash-image | 383 / 1,499 | ₹8.11 |
| 15 | 2026-11-16 16:08 | Desktop cover, Market Value | gemini-3.1-flash-image | 383 / 1,485 | ₹8.04 |
| 16 | 2026-11-16 16:09 | Desktop cover, Cow Dung Check | gemini-3.1-flash-image | 383 / 1,424 | ₹7.71 |
| | | **Total** | | **4,204 / 21,515** | **₹116.39** |

Approvals: calls 1–6 within the ₹80 budget (2026-11-16); calls 7–10 approved by the owner as a plan
estimated at ≈ ₹24 (actual ₹24.76); calls 11–16 approved with a +₹50 budget raise, estimated at ≈ ₹46
(up to ≈ ₹61 with retries; actual ₹46.89, no retries). Recompose calls send the phone cover as a
reference image (~260 input tokens), so the art matches across phone and desktop.

Output:
- `public/case-studies/<slug>/thumb.webp` (1200×670): phone Case Studies cards, and the case study pages'
  "Next case study" card.
- `public/case-studies/crop-guide/persona-{ramesh,lakshmi,agronomist}.webp` (320×320): Crop Guide
  persona cards.
- `public/case-studies/crop-guide/scene-sowing.webp` (1376×768): Crop Guide Problem section.
- `public/case-studies/<slug>/thumb-desk.webp` (1200×805, 3:2): desktop Case Studies cards.
