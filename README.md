# NeoSquad Website

Website repository for **NEOSQUAD SOLUTIONS PRIVATE LIMITED**.

NeoSquad (NS) brings together services, products, and AI-skilled human
resources. See [Company and brand guide](docs/COMPANY_BRAND.md) for the
vision, brand colors, content direction, and reference websites.

## Folder hierarchy

```text
neosquadsol-com/
|-- docs/
|   `-- COMPANY_BRAND.md       Company vision, branding, and website guidance
|-- public/                   Files served directly by the future website
|   `-- images/
|       |-- company/          Office, company events, and approved company photos
|       |-- logos/            Approved logos, NS monograms, and wordmarks
|       |-- products/         Product screenshots and illustrations
|       |-- services/         Service-related imagery
|       `-- team/             Approved team photos
|-- src/
|   |-- assets/
|   |   `-- icons/            Icons imported by source code
|   |-- components/          Reusable UI components
|   |-- data/                Structured website content
|   |-- pages/               Page implementations
|   `-- styles/
|       |-- brand.css        Shared brand color tokens
|       `-- main.css         Responsive website styles
|-- tests/                   Browser interaction and responsive checks
|-- index.html               Public website
|-- thanks.html              Return page after form processing
|-- package.json             Development and build commands
|-- .gitignore
`-- README.md
```

The website is a responsive, single-page site built with HTML, CSS, JavaScript,
and Vite. Empty folders contain `.gitkeep` files so Git preserves the hierarchy.

## Run locally

Use Node.js 22.12+ or 24+ and npm.

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. Create a production build with
`npm run build`, and inspect it locally with `npm run preview`.
Deploy only the generated `dist` folder, not the repository or company records.

For browser checks, run `npx playwright install chromium` once, then `npm test`.

## Hosting and contact

The website includes services, product exploration, AI-skilled talent, about,
and contact sections. The contact form sends enquiries to FormSubmit, which
processes them and forwards them to `contact@neosquadsol.com`. It includes
required consent, a honeypot, and FormSubmit's default CAPTCHA.

**One-time email activation is required before delivery works.** Submit the
form, complete the CAPTCHA, and activate FormSubmit from its email in the
recipient mailbox. Then send another test and confirm it arrives. See the
activation and testing instructions in the hosting guide. No secret key or
paid hosting plan is required; provider availability and terms apply.

See [Hosting setup](docs/HOSTING_SETUP.md) for local commands, GitHub Pages
deployment, GoDaddy DNS records, HTTPS, and rollback instructions for
**www.neosquadsol.com**. Publishing is automated by
`.github/workflows/deploy-pages.yml` after Pages is enabled.

## Adding images

- Put images in the matching `public/images/` folder; use lowercase,
  hyphen-separated filenames, such as `company/office-exterior.webp`.
- Use approved, web-optimized assets. Prefer WebP or AVIF for photos and SVG
  for logos and icons; keep original design files outside this repository.
- With `public/` configured as the web root, reference a company image as
  `/images/company/office-exterior.webp`, not `/public/images/...`.
- Keep code-imported icons in `src/assets/icons/`; do not duplicate public
  images there. Provide meaningful alternative text when adding images to UI.
- Publish team photos, client logos, or testimonials only with permission.

## Source files and privacy

Company source material is held outside this repository at
`C:\Users\Admin\Documents\TVSDocs_GD\NeoSquad`.
Use only reviewed, public-facing information for website content. Do not copy
banking records, director documents, identity documents, credentials, or
incorporation and tax paperwork into website assets or source control.
