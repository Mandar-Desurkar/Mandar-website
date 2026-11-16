# Gemini API ledger

Every paid call made with the owner's Gemini key, with what it was for and what it cost. The key itself
is never stored in this repo.

- **Budget:** ₹80 (set by the owner, 2026-11-16)
- **Spent:** ₹44.74 ($0.497)
- **Left:** ₹35.26

## How costs are estimated

Costs come from the token counts each response reports (`usageMetadata`), priced conservatively so the
real bill should be at or below these figures:

- Model `gemini-3.1-flash-image`, 1K images (published rate about $0.067 per image).
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
| | | **Total** | | **1,177 / 8,273** | **₹44.74** |

Output: `public/case-studies/<slug>/thumb.webp` (1200×670), used on the phone Case Studies cards.
