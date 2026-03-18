# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do NOT open a public issue.**

Instead, email **ogaplastic@gmail.com** with:

- Description of the vulnerability
- Steps to reproduce
- Potential impact

We will acknowledge receipt within 48 hours and aim to resolve confirmed issues promptly.

## Scope

This is a static website with no backend, no authentication, and no user data storage. The primary security considerations are:

- **No secrets in the repository** — all sensitive values are excluded via `.gitignore`
- **No server-side code** — the site is statically exported and served via GitHub Pages
- **Third-party links** — WhatsApp links open `wa.me` (Meta's domain); Google Maps embeds load from `google.com`
- **Service worker** — caches static assets only; no sensitive data is cached
