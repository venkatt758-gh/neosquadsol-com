# Website setup, hosting, and domain

## Website details

- Public website: `https://www.neosquadsol.com/`
- Company: NEOSQUAD SOLUTIONS PRIVATE LIMITED
- Enquiries: `contact@neosquadsol.com`
- Domain registrar: GoDaddy
- Website hosting: GitHub Pages via GitHub Actions
- Repository: <https://github.com/venkatt758-gh/neosquadsol-com>

The contact form posts directly to FormSubmit, a third-party form processor,
which forwards enquiries to the public contact mailbox. Visitors do not need
an email app. Direct email and telephone links remain available as alternatives.
Website hosting does not create or manage the recipient mailbox.

## Activate the free contact form

1. Confirm that `contact@neosquadsol.com` can receive mail.
2. Open the deployed site's contact section, fill in a clearly labeled test
   enquiry using non-sensitive test content, and check the consent box.
3. Click **Send enquiry** and complete FormSubmit's CAPTCHA if shown.
4. Check the recipient mailbox, including spam, for FormSubmit's activation
   email. Verify its sender and activate the form using that email. Do not
   share mailbox passwords, activation links, or provider archive tokens.
5. After activation, submit a second test enquiry and confirm actual receipt.
   Do not assume the first, pre-activation test was delivered.

FormSubmit documents free unlimited forms and submissions, subject to its
service availability, anti-abuse controls, and terms. There is no account or
API key required for this integration. CAPTCHA remains enabled by default;
do not add `_captcha=false`. An additional hidden `_honey` field helps catch
bots. Required client-side consent and validation improve UX but are not a
server-side security boundary.

The form sends the visitor's name, email, interest, message, and consent to
FormSubmit. The website privacy notice discloses this processing and
FormSubmit's documented 30-day submission retention. Its CAPTCHA and service
may use cookies. Visitors should not send sensitive information.

After processing, FormSubmit redirects to
`https://www.neosquadsol.com/thanks.html`. This is intentionally an absolute
production URL, even for a manual local test. Until domain DNS and HTTPS
are ready, that redirect may not reach the new site. Neither a redirect nor
viewing the thank-you page independently proves inbox delivery.

Automated browser tests intercept form submissions and verify their POST
method, destination, fields, consent, and validation without sending data to
the third party. Live CAPTCHA completion, activation, and receipt require
the mailbox owner's checks above.

Provider documentation: <https://formsubmit.co/documentation>

## Run and check locally

Install Node.js 24 LTS and npm, then run these commands from the repository:

```powershell
npm ci
npm run dev
```

Open the local address printed by Vite. Stop the server with Ctrl+C.
To check and serve the production build:

```powershell
npx playwright install chromium
npm test
npm run build
npm run preview
```

The production files are in `dist`. Only this folder is published. Never
publish the repository root, local company documents, or environment files.

## Enable GitHub Pages

1. Open the repository's **Settings > Pages**.
2. Under **Build and deployment > Source**, choose **GitHub Actions**.
3. Push changes to `main`, or run **Actions > Deploy website to GitHub Pages >
   Run workflow**. The workflow builds, runs browser tests, and deploys `dist`.
4. Confirm the workflow's build and deployment jobs pass.

GitHub Pages must be available for the repository visibility and your GitHub
plan. Do not make a private repository public merely to enable hosting without
reviewing its contents and approving that change.

The production build uses relative asset paths so the temporary GitHub Pages
project URL and the custom domain can both load the website. The canonical
URL and sitemap point to `https://www.neosquadsol.com/`.

## Connect the GoDaddy domain safely

First, optionally verify ownership under your GitHub account's **Settings >
Pages**. GitHub supplies an account-specific TXT name and value. Copy those
exact values into GoDaddy; they cannot be guessed from the domain name.
Keep that verification record after setup.

**Before changing DNS**, add `www.neosquadsol.com` under the repository's
**Settings > Pages > Custom domain**, then save. This reserves the hostname
for your site. With this Actions deployment, a CNAME file alone does not
configure the custom domain; the Pages setting is required.

In **GoDaddy > My Products > neosquadsol.com > DNS > Manage DNS**, record the
current values for rollback, then configure:

| Type | Name / Host | Value / Points to | TTL |
| --- | --- | --- | --- |
| CNAME | `www` | `venkatt758-gh.github.io` | Default or 1 hour |
| A | `@` | `185.199.108.153` | Default or 1 hour |
| A | `@` | `185.199.109.153` | Default or 1 hour |
| A | `@` | `185.199.110.153` | Default or 1 hour |
| A | `@` | `185.199.111.153` | Default or 1 hour |

Replace conflicting **website-only** A records for `@` and the existing
`www` CNAME, rather than adding duplicates. Remove obsolete website AAAA
records if present, or configure GitHub's documented IPv6 records. Check for
GoDaddy forwarding or parked-site settings that override these hostnames.
Do not add a wildcard DNS record. Do not change nameservers.

**Keep all MX records, email-related CNAME records, and SPF, DKIM, DMARC,
domain-verification, and other unrelated TXT records unchanged.** Do not
remove records simply because they are not listed in this table.

At the time of the initial check, the domain used GoDaddy website hosting,
with `www` pointing to the apex domain. Changing these website records
replaces that site's public routing. Do not cancel email services or domain
registration.

GoDaddy passwords, OTPs, recovery codes, and API keys are not needed in chat
or in this repository. The owner can apply these records while signed in.
If troubleshooting is needed, share only DNS record details with account
information hidden.

## HTTPS and public checks

DNS changes may take up to 24 hours. In **Settings > Pages**, wait for the
DNS check and certificate provisioning, then enable **Enforce HTTPS** when
available. GitHub should redirect the apex domain to the configured `www`
custom domain once both are correctly configured.

```powershell
Resolve-DnsName www.neosquadsol.com
Resolve-DnsName neosquadsol.com -Type A
curl.exe -I https://www.neosquadsol.com/
curl.exe -I https://neosquadsol.com/
```

Confirm the new NeoSquad page loads, its logo and styles work, navigation
works on mobile, HTTPS is valid, and an enquiry reaches the FormSubmit
submission flow. After completing activation, submit a test and verify actual
receipt in the contact mailbox separately.

If the new site is unavailable, restore the saved website DNS records while
investigating. Do not change the email records as part of rollback.

## Future updates

Edit website content in `index.html`, interactions in `src/main.js`, and
styles in `src/styles/`. Put approved images in `public/images/`. Run the
checks, commit, and push to `main`; GitHub Actions publishes successful builds.

No analytics, external fonts, or third-party images are loaded by the site.
Product areas are explicitly marked as exploration rather than available
products. Keep claims and availability accurate as the company grows.

Official reference:
<https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site>
