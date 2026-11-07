# Deploying techfahm.com (cPanel)

techfahm.com runs on GoDaddy cPanel shared hosting (LiteSpeed/Apache, no Node).
Deploys are automatic and need **no FTP password or server secret**.

```
push to main
  └─ GitHub Actions  .github/workflows/production.yml
       npm ci → lint → build (no base path) → sanity check
       └─ force-push /out to branch `production`
cPanel cron (every 5 min)
  └─ ~/techfahm-deploy/cpanel-deploy.sh   (copy of deploy/cpanel-deploy.sh)
       git fetch production → if changed: copy into ~/public_html
       removes only files the previous build had and the new one doesn't
       log: ~/techfahm-deploy/deploy.log
```

The GitHub Pages preview (`pages.yml`, `/Techfahm`, noindex) keeps running separately.

## Things in public_html that are NOT this site — never delete
| Path | What |
|---|---|
| `public_html/techfahm.ca/` | addon domain techfahm.ca |
| `public_html/turkiyemakinesi.com/` | addon domain turkiyemakinesi.com (static site) |
| `public_html/logo-banner/` | logo image (possibly used in email signatures) |
| `public_html/.well-known/acme-challenge/` | SSL certificate validation |

khurshidaria.com lives in `~/khurshidaria/` (outside public_html).
Because the addon sites sit inside public_html, `public/.htaccess` scopes every rule and header to the
techfahm.com host (`TF_SITE` env + an early `RewriteRule ^ - [L]` for other hosts). Keep it that way.

## Old WordPress site
Moved (not deleted) to `~/wordpress-backup-2026-11-07/` on the server; its database is untouched.
A full cPanel account backup (`backup-11.7.2026_*.tar.gz`) is in the home folder, and GoDaddy keeps
its own daily backups (Hosting → Backups).

Roll back to WordPress: move the files from `~/wordpress-backup-2026-11-07/` back into `public_html`
(including its `.htaccess`) and disable the cron job.

## Contact form and 404 (the only PHP)
`public/contact.php` receives the form (JSON POST from `contact-form.tsx`) and emails info@techfahm.com
with PHP `mail()`. The sender is the hosting account's own address and Reply-To is the visitor, because
techfahm.com mail runs on Microsoft 365 with strict SPF/DMARC (`-all`, `p=quarantine`) — sending "as"
@techfahm.com from the web server would be rejected. If enquiries land in Junk, mark one "Not junk".
cPanel → Email Routing for techfahm.com must stay on **Remote Mail Exchanger** (set 2026-11-07); on "Local" the
form's emails get stuck in an old mailbox on the GoDaddy server instead of reaching Outlook.
Protection: POST only, same-site Origin, honeypot, 3-second minimum, 5 per IP per hour, length limits.
`public/404.php` serves `404.html` with a real 404 status (the host ignores `ErrorDocument`).
On the GitHub Pages preview (no PHP) the form opens the visitor's email app instead.
Search-engine verification codes go in repository variables `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION`.

## Manual redeploy
Actions → "Build production (techfahm.com)" → Run workflow. The server picks it up within 5 minutes.
To force a copy on the server (cPanel Terminal): `FORCE=1 bash ~/techfahm-deploy/cpanel-deploy.sh`.
