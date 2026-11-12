# Personal portfolio

A local, dependency-free HTML/CSS/JavaScript portfolio. Open with a static web server:

```sh
cd /Users/ethanbaek/Documents/Projects/Landing-Page
python3 -m http.server 4173 --bind 127.0.0.1
```

Preview: http://127.0.0.1:4173. Refresh after edits. No package install, API keys, or build step is required.

## Current direction

Minimal copy, cream (`#FDFBF7`), ink charcoal (`#1E2229`), burnt orange (`#CC5A37`), and sandstone (`#F2ECE4`). A restrained orange ripple animates the introduction. Stronger rust accents highlight navigation, project artwork, links, and primary actions while cream remains the dominant background. The right-side rail stays in view and highlights the current section; it becomes a compact vertical dot rail on narrow screens. System reduced-motion preferences stop ambient animation automatically. There are no play/pause controls or stored motion preferences.

Professional experience is brief, with photo slots for AVEVA and Headstarter. Coaching, clubs, and athletics form a separate compact group. Project artwork uses the portfolio’s cream, sandstone, charcoal, and burnt-orange palette. The musicweb. illustration is an understated, unlabeled network. Experience image areas display unmodified company logos downloaded from AVEVA’s and Headstarter’s own websites; source URLs are recorded in `images/companies/SOURCES.md`. Panels and page styling retain the portfolio palette. Project details have unobtrusive previous/next links at both screen edges, cycling in both directions, with the home link retained. Personal photos drift along a floating arc; scrolling over them adds momentum without intercepting native page scrolling. Touch swipes and focused Left/Right arrow keys also work. Animation runs only while the gallery is visible and the tab is active. Reduced-motion users can browse with the same inputs without automatic drifting.

## Add photos and an AVEVA logo

`images/personal/` is intentionally empty apart from `.gitkeep`. Add your images, then edit `assets/js/photos.js`:

```js
window.PORTFOLIO_MEDIA = {
  photos: [
    { src: 'images/personal/ski-day.jpg', alt: 'Describe what is in the photograph', caption: 'A day in the Cascades', position: '50% 50%' }
  ],
  aveva: {
    teamPhoto: 'images/personal/aveva-team.jpg',
    teamAlt: 'Describe the AVEVA team photograph',
    teamPosition: '50% 50%',
    logo: 'images/personal/aveva-logo.svg'
  },
  headstarter: {
    photo: 'images/personal/headstarter.jpg',
    alt: 'Describe the Headstarter photograph',
    position: '50% 50%'
  }
};
```

Use the team photo, the logo, or both. Empty values retain the downloaded company logo and text company name; no “coming soon” text appears. An invalid photo path retains the company logo. The `position` values adjust the crop without editing the source image. Photos share a muted finish and warm frame; logos preserve their original colors. Files must live under `images/personal/`; JPG, PNG, WebP, AVIF, and SVG are accepted. Use only assets you intend to make public with the site.

There are no résumé links or PDFs in the served site. Both prior PDFs were preserved outside the checkout in `/Users/ethanbaek/Documents/Projects/.portfolio-private/resumes/`. Experience descriptions follow the supplied résumé, with metrics removed at the user’s request. ProAcademy coaching was supplied directly by the user. Hands On copy follows the current extension implementation.

## Contact and project links

Contact uses the existing Formspree endpoint. Browser validation runs before submission; form delivery still depends on that Formspree account. No test message has been sent. Existing social and project destinations are retained. The musicweb. public deployment may be older than the local implementation. Hands On links to source, not an unpublished Store listing. The clinical project links to its repository.

No work has been committed, pushed, or deployed. The original license and legacy assets are preserved.

## Replace project illustrations with screenshots

Add a screenshot to `images/projects/`, then edit the matching entry in `assets/js/photos.js`:

```js
projects: {
  musicweb: {
    screenshot: 'images/projects/musicweb-home.webp',
    alt: 'musicweb artist discovery interface',
    position: '50% 50%'
  },
  'hands-on': { screenshot: '', alt: '', position: '50% 50%' },
  'clinical-trials': { screenshot: '', alt: '', position: '50% 50%' }
}
```

The same image replaces the illustration on the homepage card and the project detail page. PNG, JPG, WebP, and AVIF are supported. Use the root-relative file path shown above, even for detail pages; the loader handles the directory difference. Screenshots fit inside the preview area without cropping or recoloring. Empty entries or missing files keep the current artwork. No screenshots are supplied by default. Refresh after editing the config.
