# SmartGrow

SmartGrow is a high-performance B2B hydroponics marketplace and farm management platform built with React 19, Vite, TypeScript, Turborepo, Tailwind CSS, and ShadCN UI.

figma - https://www.figma.com/design/3xsVlS6rt5l267WRalJMkV/smartgrow-workplace?node-id=3199-10161&t=mZCeKnhz3VZTvi40-0

## Getting Started & Documentation

1. [Contributor & Setup Guide](docs/CONTRIBUTING.md) — Environment setup, monorepo architecture, atomic design structure, ShadCN primitives, Axios, TanStack Query, and pre-commit hooks.
2. [Design & UI Guide](docs/design-guide.md) — Global design tokens, brand colors, universal button hierarchy, view transitions, and `Application*` component guidelines.
3. [Web Application Entry](apps/web/src/App.tsx) — Root application, route definitions, and TanStack Query client.
4. [Global Styles & Design Tokens](packages/ui/src/styles/globals.css) — Single source of truth for themes, OKLCH green colors, and button utilities.
5. [Axios Client](apps/web/src/utils/axios.ts) — API client with automatic 401 token refresh queue and credentials.
6. [Pre-Commit Hook](.husky/pre-commit) — Git validation script executing `npm i`, `lint-staged`, `typecheck`, and `build`.
7. [Deployment Guide](docs/DEPLOYMENT.md) — Step-by-step instructions for deploying to AWS EC2 with Nginx, HTTPS (Let's Encrypt), and GitHub Actions CD.
