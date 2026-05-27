# Contributing to Egypt Prayer Times

Thank you for considering contributing! This project welcomes issues, feature requests, and pull requests.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/egypt-prayer-times.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Workflow

- Follow the existing code style (ES6 modules, JSDoc for public APIs)
- Keep changes minimal and focused
- Ensure `npm run lint` passes
- Add tests for new logic where applicable
- Update documentation if you change user-facing behavior

## Project Conventions

- **No hardcoded values** — add to `src/shared/config.js`
- **Abstract classes first** — if adding a new feature category, define a base class in `src/shared/base/`
- **Observer pattern** — UI components should subscribe to `PrayerEngine` rather than polling
- **i18n** — all user-facing strings must be added to `src/shared/locales/*/messages.json`

## Submitting Changes

1. Push your branch to your fork
2. Open a Pull Request against `main`
3. Ensure the GitHub Actions build passes
4. Request review from maintainers

## Code of Conduct

Be respectful and constructive. We aim to build a welcoming community.
