# Contributing

This is currently a single-maintainer project. External pull requests are not
accepted yet — focus is on shipping the v1.0 MVP.

If you found a bug or want to discuss a feature, open an issue.

## Local Setup

Prerequisites:

- Node.js 22.x
- pnpm 10.32.1 (`corepack enable && corepack prepare pnpm@10.32.1 --activate`)
- Docker + Docker Compose (for Postgres + Redis in Phase 2)

```sh
git clone https://github.com/acarberk/gymrat.git
cd gymrat
pnpm install
```

## Branching

- `main` is protected. Direct pushes are blocked locally by `.husky/pre-push`.
- Every change goes through a feature branch + PR.
- Branch naming: `feature/<kebab>`, `fix/<kebab>`, `chore/<kebab>`, `docs/<kebab>`, `refactor/<kebab>`.

## Commits

Conventional Commits enforced by commitlint:

```
<type>(<scope>): <subject>
```

Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`, `ci`, `revert`, `build`.

Subjects are lowercase, no period at the end.

## Code Style

Run before committing:

```sh
pnpm lint
pnpm type-check
pnpm test
```

Husky `pre-commit` runs `lint-staged` automatically (eslint + prettier on
changed files). `commit-msg` runs commitlint.

## License

Not chosen yet. Source is publicly readable but reuse is not licensed until a
LICENSE file is added.
