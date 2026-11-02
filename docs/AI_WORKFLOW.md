<!-- SETUP QUY TẮC LÀM VIỆC CHO AI -->
# Bakery Web — AI Engineering Rules

## Project context

Build a single-store bakery e-commerce MVP.
Frontend: Next.js App Router + TypeScript.
Backend: NestJS REST API + TypeScript.
Database: PostgreSQL + Prisma.
Package manager: npm workspaces unless the repository has an approved alternative.

## Mandatory review & commit workflow (Bắt buộc tuân thủ)

Mọi task code bắt buộc tuân theo quy trình 3 bước nghiệm thu nghiêm ngặt:
1. **Bước 1 (Pre-Implementation Review)**: Trước khi code, trình bày tóm tắt: những gì sẽ sửa/làm, kỹ thuật/giải pháp áp dụng, và danh sách file tác động. **Chờ người dùng duyệt kế hoạch** mới được code.
2. **Bước 2 (Implementation & Code Review Request)**: Sau khi được duyệt kế hoạch, tiến hành code, chạy lệnh kiểm tra thực tế (lint, typecheck, test, build), tạo file báo cáo tại `docs/reports/` và **yêu cầu người dùng kiểm tra code**. **Tuyệt đối KHÔNG commit code tại bước này.**
3. **Bước 3 (Commit & Proceed)**: Sau khi người dùng kiểm tra và **đồng ý/phê duyệt code**, mới tiến hành commit Git và chuyển sang bước tiếp theo.

## Mandatory workflow rules

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
11. Create a markdown report in `docs/reports/milestone-<XX>/task-<X>.<Y>-<name>.md` upon completing each task.
12. Ensure all verification results in reports are real execution logs from the workspace terminal.

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
- Write code comments, docstrings, and log messages in English only. Do not use any icons or emojis in code or logs. Vietnamese is strictly reserved for Markdown documentation and user communications.
- Add a concise English docstring/comment above every function/method explaining its purpose.
- Use path alias `@/*` for imports instead of relative paths like `../../`.
- Separate interfaces and types into a dedicated `interfaces/` directory inside each module.
- Use definite assignment assertion `!` for DTO class properties (e.g. `email!: string;`).

## Git rules

- Never commit code before user review and approval (strictly adhere to the 3-step review & commit workflow).
- Never discard user changes without asking.
- Do not run destructive database commands without approval.
- Prefer small, reviewable diffs and meaningful commits.
