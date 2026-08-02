# Contributing Guide

Thank you for your interest in contributing to **Sanatan Dharma Suite**!

---

## Project Setup

1. **Fork and Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/sanatan-dharma-suite.git
   cd sanatan-dharma-suite
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and configure your credentials:

   ```bash
   cp .env.example .env
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

---

## Branch Naming Convention

Use clear, descriptive branch names prefixed with the task type:

- `feat/feature-name` (New features)
- `fix/bug-description` (Bug fixes)
- `docs/topic-name` (Documentation updates)
- `refactor/component-name` (Code refactoring)
- `test/test-description` (Adding or updating tests)

Example: `feat/vastu-compass-widget`

---

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>(<scope>): <short summary>

[optional body]

[optional footer]
```

### Types:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect code logic (formatting, whitespace)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to build process, tooling, or auxiliary dependencies

Examples:

- `feat(kundli): add D10 Dasamsa divisional chart rendering`
- `fix(analytics): resolve IP hashing salt rotation boundary`

---

## Code Style & Guidelines

- **TypeScript**: Enforce strict typing. Avoid `any` where possible.
- **Formatting**: Format code using Prettier before committing:
  ```bash
  npm run format
  ```
- **Linting**: Run ESLint to verify code quality:
  ```bash
  npm run lint
  ```

---

## Pull Request Checklist

Before submitting a Pull Request (PR), ensure that:

- [ ] The application builds cleanly with `npm run build`.
- [ ] Automated verification tests pass with `node --env-file=.env scripts/verify-e2e-system.js`.
- [ ] No secret API keys or credentials are included in code or commits.
- [ ] New features include updated documentation in `docs/`.
- [ ] PR description includes context, screenshots (if applicable), and related issue references.

---

## Documentation & Testing Rules

- Keep inline JSDoc comments updated for public functions.
- Every architectural change must update the corresponding file in `docs/` (`Architecture.md`, `Database.md`, etc.).
- Maintain unit tests in `src/lib/<module>/__tests__/`.
