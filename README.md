# Ghostframe

*Repeat photography for LTPBR stream monitoring — named for the ghost-overlay
trick that lines up each repeat shot against its baseline.*

A single-file, offline-capable web app for **repeat photography** on LTPBR
(Low-Tech Process-Based Restoration) stream monitoring. Open it on a phone and
it gives the field crew a framing-assisted camera for re-shooting the same view
over time.

**Live app:** https://ohjoehaber.github.io/ltpbr-repeat-photo/
*(camera + orientation sensors require HTTPS — this URL works, opening the file
locally does not)*

## Features
- Live rear-camera viewfinder (`getUserMedia`, environment-facing)
- Rule-of-thirds grid + artificial horizon line that shifts/rotates with tilt
- Compass readout (`webkitCompassHeading` on iOS, `alpha` fallback), compass
  rose, and an optional target-heading tick per station
- Level indicator that turns green within ~5° of level
- GPS lat/lon/accuracy (`watchPosition`)
- Ghost slider — fade a station's saved baseline photo over the live view to
  match framing
- Sites (name, structure type BDA/PALS/reference reach, watershed) and photo
  stations (code, target heading, placement note)
- Capture **baseline** vs **repeat** photos with metadata (timestamp, GPS,
  heading, tilt/level)
- Gallery + export of all photo metadata as **CSV** and **JSON**
- Persists locally and works offline once loaded

## Storage note
Lightweight catalog data (sites, stations, photo metadata, settings) lives in
`localStorage`. Photo image bytes are stored in **IndexedDB** instead of
`localStorage` — a phone JPEG is 1–3 MB and would blow the ~5 MB `localStorage`
quota after a couple of shots. Everything stays on the device; nothing is
uploaded.

## iOS note
Motion/orientation sensors require a user gesture. The **Start camera &
sensors** button triggers `DeviceOrientationEvent.requestPermission()` on the
first tap — allow the prompt or the compass/tilt readouts stay blank.

## Hosting / editing workflow
Hosted on GitHub Pages. To push an edit and have it go live automatically:

```bash
git add -A
git commit -m "describe the change"
git push
```

Pages redeploys within ~1 minute. Hard-refresh on the phone to bypass cache.
