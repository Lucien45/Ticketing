# Contributing to Ticketing

Thank you for your interest in contributing to Ticketing!

Contributions, bug reports, feature requests, and improvements are welcome.

## 📋 Before You Start

Before contributing:

1. Read this document.
2. Check existing issues and pull requests.
3. Make sure your change is relevant to the project.
4. Avoid committing secrets, credentials, API keys, or environment files.

---

## 🛠️ Development Setup

Fork the repository and clone your fork:

```bash
git clone <YOUR_FORK_URL>
cd ticketing
```

Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Configure the required environment variables using the provided `.env.example` files.

---

## 🌿 Branching Strategy

Create a dedicated branch for each change.

Examples:

```bash
git checkout -b feature/ticket-comments
git checkout -b fix/ticket-pagination
git checkout -b refactor/cache-service
git checkout -b docs/update-readme
```

Avoid working directly on the `main` branch.

---

## 💡 Types of Contributions

You can contribute by:

- Fixing bugs
- Adding features
- Improving performance
- Improving security
- Improving documentation
- Adding tests
- Refactoring existing code
- Improving accessibility
- Improving the user interface

---

## 📝 Commit Messages

Use clear and meaningful commit messages.

Recommended format:

```text
type(scope): description
```

Examples:

```text
feat(tickets): add ticket filtering
fix(auth): handle expired JWT
refactor(cache): improve redis invalidation
docs(readme): update installation guide
test(tickets): add ticket service tests
```

Common types:

```text
feat
fix
refactor
test
docs
style
perf
chore
```

---

## 🔀 Pull Requests

Before opening a pull request:

- Make sure the project builds successfully.
- Run the test suite.
- Check for TypeScript errors.
- Check linting.
- Make sure your changes do not expose secrets.
- Update documentation when necessary.

A pull request should clearly explain:

1. What was changed?
2. Why was it changed?
3. How was it tested?
4. Are there any known limitations?

---

## 🧪 Testing

Backend:

```bash
cd backend
npm run test
npm run test:cov
```

Frontend:

```bash
cd frontend
npm run build
```

---

## 🔍 Code Quality

Please try to maintain:

- Clear naming
- Small and focused functions
- Strong TypeScript typing
- Separation of concerns
- Reusable components
- Proper error handling
- DTO validation
- Secure authentication and authorization

Avoid placing business logic directly inside controllers or React components when it belongs in a dedicated service or hook.

---

## 🔐 Security

Never commit:

```text
.env
.env.local
passwords
JWT secrets
database credentials
API keys
private keys
```

If you discover a security vulnerability, do not create a public issue.

Please follow [`SECURITY.md`](SECURITY.md).

---

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT License.