# Tourbine site: design direction

Inferred from the logo files in `assets/logos/` (slate `#364152`, cobalt `#004AAD`). The owner can change any line here; the site follows this file.

Dial: ENERGY 2 / RHYTHM 2 / MOTION 2

## Identity

- The logo is a three-blade turbine with one cobalt blade. The page copies that ratio: slate everywhere, cobalt only where a choice is made (primary button, active tab, active stop, step numbers, hotspot icons).
- The hero is a live 360° panorama. The real product is the picture; nothing else on the page competes with it.

## Color

- Background `#0f141c` and surfaces `#18202b` / `#1f2935`: slate from the logo, darkened. Dark because 360° photos read best in a dark frame, the same way photo viewers frame images.
- Cobalt fills use `#2a66d9`: the logo's `#004AAD` lifted so the fill edge holds 3:1 on the dark ground. White text on it is 5.25:1. Hover darkens to the logo's own `#004AAD`.
- On dark backgrounds, cobalt text and links use the tint `#9dbdff` (the logo cobalt is 2.3:1 there). Hotspot icons keep `#004AAD` on their white dots.
- Green `#9be8c4` only for real status: the detected OS and `GET` routes.
- No gradients, glows or blurred orbs. Blur only on the sticky header and the hero card, which both sit over the moving panorama.

## Type

- Inter for everything. Its tall x-height keeps small labels readable over photos and in dense install steps, and its plain shapes leave the panorama as the focal point.
- Monospace only for commands, paths and code.
- Labels in sentence case. No uppercase letter-spaced eyebrows.

## Layout

- RHYTHM 2: sections share one container and spacing scale, with deliberate breaks: the full-bleed hero, the security band, the open-source split panel.
- The Build card is wider than Publish and Run because building rooms is most of the work.
- Steps are numbered only where order is real (Build, Publish, Run; first-run setup).

## Motion

- MOTION 2: the panorama rotates slowly and stops on any interaction or the pause button. Hotspot rings pulse only while the panorama rotates. Sections fade in once.
- Everything stops under `prefers-reduced-motion: reduce`.
