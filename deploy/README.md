# Deployment

PlateFind is a static site (React + Vite), built into a small image that
serves the compiled `dist/` with Caddy. The image is built in CI, pushed to
GHCR, and pulled onto a droplet where it sits behind the droplet's own Caddy
instance, which handles the public domain and TLS.

- `Dockerfile` — multi-stage build: `npm run build`, then copy `dist/` into a
  `caddy:2-alpine` image alongside the repo's root `Caddyfile`.
- `Caddyfile` (repo root) — serves the built SPA inside the container on port
  80, with `try_files` falling back to `index.html` for client-side routing.
- `docker-compose.yml` (repo root) — runs that image on the droplet, bound to
  `127.0.0.1:8081` only. It is deliberately not exposed on a public port; the
  droplet's Caddy reverse-proxies to it.
- `deploy/ci-cd.yml` — GitHub Actions workflow template. **Copy it to
  `.github/workflows/deploy.yml`** — it can't be added directly by Claude
  because the GitHub App used here isn't permitted to write to
  `.github/workflows/`.

## 1. GitHub repo configuration

No secrets are needed for the build itself — the app has no server-side
config or API keys (the plate API base URL is a public hardcoded constant).
The workflow only needs credentials to reach the droplet:

Repo → **Settings → Secrets and variables → Actions**:

| Type | Name | Value |
|---|---|---|
| Secret | `DROPLET_HOST` | Droplet IP or hostname |
| Secret | `DROPLET_USER` | SSH user to deploy as (e.g. `deploy`) |
| Secret | `DROPLET_SSH_KEY` | Private key for that user, PEM format, no passphrase |
| Variable | `DEPLOY_PATH` | Absolute path on the droplet holding `docker-compose.yml`, e.g. `/opt/platefind` |

`GITHUB_TOKEN` (pushing the image to `ghcr.io/cade-gray/platefind`) is
provided automatically by Actions — no setup needed, as long as the repo's
**Settings → Actions → General → Workflow permissions** allows
"Read and write permissions" (needed for the `packages: write` push).

## 2. One-time droplet setup

```bash
# Docker + compose plugin, if not already present
curl -fsSL https://get.docker.com | sh

# a non-root user the deploy key logs in as, and that can run docker
adduser deploy
usermod -aG docker deploy

# authorize the CI deploy key
mkdir -p /home/deploy/.ssh
echo "<public half of DROPLET_SSH_KEY>" >> /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh && chmod 600 /home/deploy/.ssh/authorized_keys

# somewhere for compose to live, matching the DEPLOY_PATH variable above
mkdir -p /opt/platefind
```

Copy this repo's `docker-compose.yml` to `/opt/platefind/docker-compose.yml`
on the droplet (`scp` it up once, or `git clone` the repo there — either
works, compose only needs that one file). Then log in to GHCR so `docker
compose pull` can fetch a private image (skip this if the package is public):

```bash
echo <a PAT with read:packages> | docker login ghcr.io -u <github-username> --password-stdin
```

Bring it up once by hand to confirm the image pulls and the container is
healthy:

```bash
cd /opt/platefind
docker compose pull
docker compose up -d
curl -I http://127.0.0.1:8081   # expect 200
```

## 3. Droplet Caddy (reverse proxy + TLS)

If the droplet already runs Caddy for other sites, add a site block to its
existing Caddyfile (typically `/etc/caddy/Caddyfile`) and reload:

```
platefind.app, www.platefind.app {
	reverse_proxy 127.0.0.1:8081
}
```

```bash
caddy reload --config /etc/caddy/Caddyfile
```

Caddy issues and renews the Let's Encrypt certificate automatically on first
request to that domain — no manual TLS setup needed, as long as the
droplet's DNS `A`/`AAAA` records already point at it.

## 4. Ship it

Once the workflow is in place and the two steps above are done, every push
to `main` builds the image, pushes it to GHCR, and SSHes into the droplet to
pull and restart the container. To deploy a specific commit manually instead
of waiting on a push, re-run the workflow from the Actions tab.
