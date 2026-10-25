# NeoSquad: Company and Brand Guide

## Company identity and vision

- **Company name:** NEOSQUAD SOLUTIONS PRIVATE LIMITED
- **Brand name:** NeoSquad
- **Short name / monogram:** NS
- **Vision supplied by the founder:** Services, products, and AI-skilled human
  resources.

Use **NEOSQUAD SOLUTIONS PRIVATE LIMITED** in all caps whenever the full legal
name appears, including contact details, copyright notices, and metadata.
Keep **NeoSquad** for the short brand name in regular copy; the logo remains
uppercase.

Suggested public-facing positioning, subject to approval:

> NeoSquad brings together technology services, products, and AI-skilled
> talent to help businesses build and grow.

The three pillars below describe the intended website direction, not a claim
that specific offerings, products, or staffing programs are already available.

| Pillar | Website content direction |
| --- | --- |
| Services | Explain approved service offerings, delivery approach, and customer value. |
| Products | Introduce approved products, their benefits, and availability. Clearly label anything planned or in development. |
| AI-skilled talent | Describe how people with AI skills support customers and delivery. Confirm engagement models before publishing them. |

## Sources and references

- **Local company information:** `C:\Users\Admin\Documents\TVSDocs_GD\NeoSquad`
- **Brand color source:** `C:\Users\Admin\Documents\TVSDocs_GD\NeoSquad\Docs\neosquad_logo_signage.html`
- **Reference website - ClientScapes:** <http://clientscapes.com/>
- **Additional reference website - Live Connections:** <https://liveconnections.in/>

The ClientScapes reference emphasizes talent and staffing services, including
identifying, qualifying, managing, and retaining talent and meeting changing
project demands. Use it as a reference for clear business-to-business service
and talent messaging, not as a source of copied text, images, branding, or
customer claims. NeoSquad's direction also includes products and AI-skilled
people.

Live Connections is an additional reference for the talent and recruitment
side of the website, including job discovery and location-based browsing.
Treat these as inspiration, not committed NeoSquad features; add job listings
only when real openings and an approved recruitment process are available.
Keep NeoSquad's own brand colors and its services, products, and AI-skilled
talent positioning. Do not copy either reference site's content or assets.

The local directory contains private business records as well as branding.
Review sources locally and publish only approved company information. Do not
upload legal, tax, banking, or director documents to the website repository.
The paths above identify source material; they are not links for website visitors.

## Brand colors

The following values are taken directly from the signage HTML.

| Role | Hex | Source / intended use |
| --- | --- | --- |
| Neo orange | `#F25022` | `N` in the monogram and `NEO` in the wordmark; brand highlights |
| Squad blue | `#00A4EF` | `S` in the monogram and `SQUAD` in the wordmark; brand accents |
| Light blue | `#E0F2FE` | Monogram background; soft section backgrounds |
| White | `#FFFFFF` | Main background |
| Border gray | `#CBD5E1` | Borders and dividers |
| Text gray | `#595959` | Body text and supporting information |

Shared CSS custom properties are defined in `src/styles/brand.css`. Import
that stylesheet from the future application's global entry point.

### Visual direction

- Preserve the orange `NEO` / blue `SQUAD` wordmark and orange `N` / blue `S`
  monogram treatment.
- Use a clean white base, restrained light-blue panels, and subtle gray borders.
- The signage uses Segoe UI, Tahoma, Geneva, and sans-serif for general text,
  and Georgia / serif for the NS monogram.
- Use `#595959` for readable text on white or light-blue backgrounds.
- The orange and blue are brand accents, not automatically accessible text or
  button colors. Do not assume white text on either accent meets contrast
  requirements; check each foreground/background pair before use.

## Proposed website sections

| Section | Purpose |
| --- | --- |
| Home | Introduce NeoSquad and its three pillars with a clear contact action. |
| About | Present the approved company story, vision, and approach. |
| Services | Explain confirmed service offerings and delivery capabilities. |
| Products | Present approved products, demos, or clearly labeled upcoming work. |
| AI-skilled talent | Explain confirmed talent capabilities and engagement options. |
| Contact | Publish approved business contact details and an enquiry route. |

Do not invent client names, testimonials, certifications, product launches,
performance statistics, or available roles. Confirm offerings and contact
information before publishing.

## Image organization

| Folder | Intended contents |
| --- | --- |
| `public/images/company/` | Approved office, event, and company photographs |
| `public/images/logos/` | Approved NeoSquad logos, monograms, and wordmarks |
| `public/images/services/` | Service illustrations and photographs |
| `public/images/products/` | Approved product screenshots and graphics |
| `public/images/team/` | Team photographs with publication permission |
| `src/assets/icons/` | Icons imported and processed by the eventual application |

These folders are initially empty. The signage is a color and visual
reference, not an automatically approved website asset; prepare an approved
logo-only asset rather than publishing a document containing company details.
