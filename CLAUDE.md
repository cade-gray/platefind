# PlateFind

A single-page React 19 + Vite + Tailwind v4 app for tracking US license plates spotted
by state. No router, no backend: progress lives in `localStorage` and `public/sw.js`
caches the app shell so the board opens with no signal.

## Commands

| Task | Command |
| --- | --- |
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Typecheck + build | `npm run build` (`tsc -b && vite build`) |
| Regenerate map data | `node scripts/build-map-data.mjs` |

`npm run build` is the typecheck — there is no separate `tsc --noEmit` script. Run
lint and build before opening a PR; CI runs both on every pull request.

## Pull requests

When the work came from a GitHub issue, open the PR yourself rather than handing
back a "Create PR" link, and put `Closes #N` on its own line in the PR body. That
keyword is what links the PR to the issue and closes it on merge — a link in a
comment does not, and neither does naming the issue in the title.

## Deployment

Merging a PR into `main` builds `Dockerfile` (Vite build -> nginx), pushes
`ghcr.io/cade-gray/platefind`, and redeploys via `docker compose` at
`/srv/platefind` on the VPS. The container listens on 80 and is published on host
port 3005.

Two nginx rules in `nginx.conf` matter and should not be dropped: `/assets/` is
immutable-cached (Vite hashes those filenames), while `/sw.js` is explicitly
uncacheable — a stale service worker pins users to an old build permanently.

## Editing workflows

`.github/workflows/**` cannot be modified with the default Claude GitHub App token;
it has no `workflows` write scope. Those edits require the `CLAUDE_GH_PAT` secret
(a PAT carrying the `workflow` scope) to be set on the repo.
