# The Pundit Place Website

This repository contains the public marketing website for The Pundit Place (TPP).

## Netlify Architecture
The site is built for a portable, GitHub-driven Netlify architecture.
- **Frontend:** Static HTML/CSS/JS.
- **Backend Logic:** Netlify Functions (Node.js) located in `/netlify/functions`.
- **Configuration:** Build and function settings are managed in `netlify.toml`.

## Contact Form
The contact form is powered by a Netlify Function. Ensure the following environment variables are set in your Netlify dashboard:
- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_PORT`
- `CONTACT_EMAIL`

## Deployment
1. Connect this repository to your Netlify account.
2. Netlify will automatically detect the `netlify.toml` and deploy the site.
3. Every push to `main` triggers a new build and deployment.