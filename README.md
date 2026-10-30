# Olivia Dean concert invitation

Live site: https://rilcura.github.io/olivia-dean-concert-invitation/

Source: https://github.com/rilcura/olivia-dean-concert-invitation

A personal, responsive concert-invitation microsite with vinyl-inspired artwork.

**Stack:** HTML, CSS, browser JavaScript, YouTube IFrame API, FormSubmit, and GitHub Pages.

## Project scope

The implementation combines responsive layout, keyboard-triggered interactions, confirmation state, optional music controls, and a third-party email submission flow. This is a personal frontend experiment, not an event-booking or ticketing service.

The playful NO interaction eventually removes the decline control. This behavior is unsuitable as a reusable consent or registration pattern. A general-purpose version should retain an equally accessible decline action.

## Current behavior

The invitation uses personalized content. The date and city are supplied by the invitation sender, not verified event listings. No venue or time is assumed. Accepting displays a confirmation and submits an email notification through FormSubmit.

## Preview and deploy

Open index.html directly, or serve the repository root with any static server. With Python installed, run `python -m http.server 8000` and open `http://localhost:8000`. Upload index.html, style.css and script.js to Netlify Drop, GitHub Pages, Cloudflare Pages, or any static host. No build or environment variables are needed. Google Fonts are optional; system fonts work offline.

## Interaction and accessibility

Each press of NO changes its label and relocates it inside a reserved central play area, avoiding all other content. Press 20 hides NO and its hint and returns focus to the enlarged, centered YES. Enter and Space work too. Resize keeps it within its play area. Reduced motion removes the fade and uses an instant relocation. YES focuses the friendly confirmation heading. There are exactly two invitation buttons; a secondary music toggle controls background sound. A YES response is sent to FormSubmit for delivery to the invitation sender. A local submission flag prevents repeat sends from the same browser. Reload resets the invitation display but preserves that flag.

## Music

The official YouTube player embeds the supplied performance of Olivia Dean's A Couple Minutes (video euYe6W7d-rI). It attempts playback on load and retries on the first click/key activation if blocked. The video is visually hidden and excluded from keyboard navigation. A small play/pause music toggle remains visible. Volume starts at 50 percent. No two-minute cutoff is applied: A Couple Minutes is the song title. Browser policies, YouTube availability, consent screens and user settings can prevent autoplay. A YouTube link remains available if embedding fails. Serving over HTTP/HTTPS is recommended: local file pages can lack the referrer required by YouTube. Google Fonts and YouTube contact their respective services; no recording is downloaded or bundled.

Hosted publicly on GitHub Pages from the main branch root. Commit and push changes to update the site.

## Mobile verification

Phone-specific typography, safe-area spacing and 48px controls support narrow screens. Decorative art and the hidden music embed cannot create horizontal page overflow. Desktop browser previews checked at 320 x 568, 390 x 844 and 844 x 390 CSS pixels, including NO relocation and YES confirmation at 320px. These are responsive viewport checks, not physical iPhone/Android device certification. Small screens and landscape scroll vertically to reach all content.
After press 20, YES enlarges and centers in the reserved action area. Reduced motion skips the entrance animation.

## YES email notification

Recipient: randzellcura@gmail.com, through https://formsubmit.co/ajax/randzellcura@gmail.com. This third-party form service requires one-time activation using the recipient's emailed Activate Form link. The GitHub Pages domain was activated on 17 October 2026. A clearly labelled verification test was accepted by FormSubmit and verified in the recipient's Gmail inbox. The request contains only the invitation, YES response and submission timestamp. It does not verify who clicked. The UI distinguishes pending activation, accepted submission and failure; accepted does not guarantee inbox delivery. A retry is available after failure. Browser-local duplicate prevention is not server-side abuse protection. No private API key is included. Static copies retain this configured recipient and depend on FormSubmit availability and site-specific activation.

## Final browser check, 17 October 2026

Live GitHub Pages content checked in 320 x 568 and 390 x 844 browser viewports. Verified changing NO labels, central containment, final disappearance of NO and hint, enlarged YES, confirmation, music play/pause/resume, and a clearly labelled browser-test email received in the destination inbox. The page requests audible autoplay; the test browser blocked it until interaction, so autoplay is not guaranteed on iOS, Android, or other browsers. Physical-device testing was not performed. A deliberate music pause is respected. Email requests allow up to 60 seconds for the provider; delivery still depends on that external service. ?notification_test=1 sends labelled test messages without storing a normal RSVP flag. Share the normal URL without that parameter.

## Reuse and next steps

Before reusing the source, replace personalized text, the event details, the FormSubmit destination, the submission flag, and the embedded music selection. The configured email endpoint sends real messages, including in test mode. Previewing the layout does not require pressing YES.

Keep the provider activation, delivery-status, and duplicate-prevention limitations described above. Future improvements include a persistent decline action, separate configuration, automated interaction tests, and a reusable sample with fictional content. No screenshots or new test results are asserted by this documentation update.
