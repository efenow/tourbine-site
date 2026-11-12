# Tourbine site: design direction

Inferred from the logo files in `assets/logos/` (slate `#364152`, cobalt `#004AAD`), then made more colorful at the owner's request (Nov 2026). The owner can change any line here; the site follows this file.

Dial: ENERGY 2 / RHYTHM 2 / MOTION 2

## Identity

- The logo is a three-blade turbine with one cobalt blade. Cobalt marks every choice: primary buttons, the active tab, the active stop, the Tourbine column edge.
- Cyan is the second accent and marks things to notice: icons, checkmarks, step numbers, media chips and hover edges.
- The hero is a live 360° panorama. The real product is the picture; nothing else on the page competes with it.

## Color

- Background `#0f141c` and surfaces `#18202b` / `#1f2935`: slate from the logo, darkened. Dark because 360° photos read best in a dark frame, the same way photo viewers frame images.
- Cobalt fills use `#2563eb`: the logo's `#004AAD` lifted so it reads bright on dark and its edge holds 3:1. White text on it is 5.17:1. Hover darkens to the logo's own `#004AAD`.
- Cyan `#45d6ff` is 8.6:1 or better on every surface. Step numbers are cyan with dark text (10.8:1).
- Install, Compare and FAQ sit on a deep blue band `#111b2c`, alternating with the slate sections.
- The hero card is blue-tinted glass `rgba(13, 27, 52, 0.8)`. Worst case over a white light, its muted text holds 4.96:1.
- On dark backgrounds, cobalt text and links use the tint `#9dbdff` (the logo cobalt is 2.3:1 there). Hotspot icons keep `#004AAD` on their white dots.
- Green `#9be8c4` and amber `#f5c26b` only for status: the detected OS, `GET` routes, and the comparison verdicts, each paired with an icon.
- No decorative gradients or blurred orbs (owner chose color from the logo over the old violet-to-cyan look). Blur only on the sticky header and the hero card, which both sit over the moving panorama.

## Copy

- Readers are the people who make and share tours, not developers. Use plain words; keep commands, file paths and developer terms inside the install steps and the "install manually" details.
- No audience labels on the page itself.

## Type

- Inter for everything. Its tall x-height keeps small labels readable over photos and in dense install steps, and its plain shapes leave the panorama as the focal point.
- Monospace only for commands, paths and code.
- Labels in sentence case. No uppercase letter-spaced eyebrows.

## Layout

- RHYTHM 2: sections share one container and spacing scale, with deliberate breaks: the full-bleed hero, the security band, the open-source split panel.
- The Build card is wider than Publish and Run because building rooms is most of the work.
- Steps are numbered only where order is real (Build, Publish, Run; first-run setup).
- Comparison: vendor logos in the header, a verdict icon, short answer and detail per cell; on phones one criterion per swipeable card.
- Owner override (antislop audit #16): the closing section with the Tourbine mark and the Install / GitHub buttons stays, by request.

## Motion

- MOTION 2: the panorama rotates slowly and stops on any interaction or the pause button. Hotspot rings pulse only while the panorama rotates. Sections fade in once.
- Everything stops under `prefers-reduced-motion: reduce`.
