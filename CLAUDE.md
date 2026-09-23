# the-measurement-trap

Companion site for *The Measurement Trap*: seven essays on what Indian official
statistics count, when, and what follows from the gaps. Eleventy, static output,
deployed from `_site`.

## Commands

```bash
npm ci
npx eleventy                 # build to _site
npm run serve                # local preview
node scripts/check.mjs       # checks, run by CI after the build
```

`scripts/check.mjs` inspects `_site`, so build before running it.

## A site about measurement should be measured

There was no CI here at all, not even a check that the build still ran. That is
now `.github/workflows/ci.yml`, and the build is the cheapest test the repository
has: a malformed frontmatter block or a broken template fails there rather than
on the deployed page.

The checks cover what breaks without erroring:

- **Frontmatter completeness.** `article.njk` reads `title`, `dek`, `kicker`,
  `author`, `date` and `readtime`. An essay missing one renders with an empty
  kicker and no byline, and looks merely odd rather than broken.
- **Chart accessible names.** Every essay carries two inline SVGs, fourteen in
  all. One without `aria-label`, `aria-labelledby` or `role="img"` is announced
  as nothing at all by a screen reader while looking correct on screen.
- **Cross-links between essays.** A renamed slug leaves the links to it pointing
  nowhere, and Eleventy will not complain.
- **The OpenDyslexic face is shipped, not just its licence.** If the `.woff2`
  files go missing the reading-font toggle falls back silently to the default.

## The claims check out

Spot-verified on 2026-09-22, because a site arguing that numbers are mishandled
has to get its own right:

- **"Ninety-six years between counts"**: the last published caste enumeration
  was the 1931 census, and the next is the 2027 census. Ninety-six years.
- **"Eleven years without a number"**: the consumption expenditure survey ran in
  2011-12, the 2017-18 round was conducted and never released, and the next
  published round was 2022-23, making the published interval eleven years. The
  essay states the suppression explicitly rather than letting the gap imply it.
- **"The custody of six point one"**: the first annual PLFS report, July 2017 to
  June 2018, put unemployment at 6.1 per cent, the highest since the series
  began in 1972-73.

If an essay's central figure changes, change the title with it. The titles are
the claims.

## The js-yaml advisory

`npm audit` reported one high: GHSA-2883-xcg3-v3hh, where `maxTotalMergeKeys`
does not bound CPU use on an empty merge source. It reaches this build through
Eleventy's own `js-yaml` and through `gray-matter`, which parses every essay's
frontmatter.

The exposure here is narrow — the only YAML this build parses is the seven
essays' own frontmatter, written in this repository — but the fix was a patch
release rather than a major, so there was no reason not to take it.
`npm audit fix` took the direct dependency to 4.3.2 and `gray-matter`'s nested
copy to 3.15.2, and the audit is at 0. Verified before and after: the build
writes the same 12 pages, all seven essays reach `_site`, and
`scripts/check.mjs` passes.

## Watch out for

- **The charts are hand-written SVG inside the markdown**, with their numbers
  written as coordinates. There is no data file behind them, so a figure in the
  prose and the shape of the chart beside it can disagree with nothing to catch
  it. Check both when editing either.
- **`chronology.csv` has quoted fields containing commas.** Parse it, do not
  split on commas.
