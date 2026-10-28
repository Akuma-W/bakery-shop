<!-- SETUP QUY TẮC LÀM VIỆC CHO AI -->
# Bakery Web — AI Engineering Rules

## Project context

Build a single-store bakery e-commerce MVP.
Frontend: Next.js App Router + TypeScript.
Backend: NestJS REST API + TypeScript.
Database: PostgreSQL + Prisma.
Package manager: npm workspaces unless the repository has an approved alternative.

## Mandatory workflow

1. Inspect the repository before changing files.
2. Read relevant docs and existing code before proposing changes.
3. For each task, state the goal, assumptions, affected files,
   implementation plan, risks, and verification commands.
4. Wait for approval before destructive operations, dependency
   migrations, secrets changes, or broad architectural changes.
5. Implement one coherent task at a time.
6. Run relevant lint, typecheck, tests, and build commands.
7. Report commands actually executed and their real results.
8. Never claim tests passed if they were not run.
9. Update docs when architecture, APIs, or environment variables change.
10. Stop and report blockers instead of silently inventing requirements.

## Engineering constraints

- Use strict TypeScript. Avoid `any` unless justified and documented.
- Controllers handle HTTP; services handle business rules.
- Validate all incoming data on the backend.
- Never trust prices, discounts, roles, or payment status from the client.
- Calculate totals on the server.
- Use database transactions for order placement and inventory updates.
- Make payment callbacks idempotent and verify provider signatures.
- Customers can access only their own orders.
- Only OWNER can manage products, coupons, and all orders.
- Do not store raw card or banking credentials.
- Do not put secrets in source code or browser bundles.
- Add tests for important business rules and authorization.

## Git rules

- Never commit directly to main during feature work.
- Never discard user changes without asking.
- Do not run destructive database commands without approval.
- Prefer small, reviewable diffs and meaningful commits.
