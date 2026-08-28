# Security Policy

## 🔐 Supported Versions

Security fixes are currently provided for the latest version of the project.

| Version | Supported |
| ------- | --------- |
| Latest | ✅ |
| Older versions | ❌ |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability in Ticketing, please **do not report it through a public GitHub issue**.

Publicly disclosing a vulnerability before it has been investigated and fixed may expose users and deployments to unnecessary risk.

Instead, contact the project maintainer privately.

### Security Contact

**Email:** `<YOUR_SECURITY_EMAIL>`

Please replace the placeholder above with the email address you want to use for security reports.

---

## 📋 What to Include

When reporting a vulnerability, please provide as much information as possible:

- Description of the vulnerability
- Affected component
- Steps to reproduce
- Expected behavior
- Actual behavior
- Potential impact
- Proof of concept, if available
- Suggested mitigation, if known

Example:

```text
Component:
Authentication API

Issue:
JWT authentication can potentially be bypassed under specific conditions.

Steps to reproduce:
1. ...
2. ...
3. ...

Impact:
An attacker could potentially access protected resources.
```

---

## ⏱️ Response Process

After receiving a vulnerability report, the maintainer will:

1. Acknowledge the report.
2. Investigate and reproduce the issue.
3. Assess its severity and impact.
4. Develop a fix when necessary.
5. Release the fix.
6. Provide appropriate credit to the reporter, if requested.

Please avoid publicly disclosing the vulnerability until a fix or mitigation is available.

---

## 🛡️ Security Best Practices

When deploying Ticketing:

### Environment Variables

Never expose secrets in the source code.

Use environment variables for:

```text
JWT_SECRET
DB_PASSWORD
REDIS_PASSWORD
API_KEYS
```

Do not commit:

```text
.env
.env.production
.env.local
```

### Authentication

The application should:

- Hash passwords using bcrypt.
- Use strong JWT secrets.
- Validate authentication tokens.
- Implement appropriate token expiration.
- Protect sensitive routes.

### Authorization

Always verify user permissions on the backend.

Do not rely only on frontend route protection.

For example:

```text
USER
  ↓
Can access own tickets

ADMIN
  ↓
Can manage all tickets
```

### Database

Use parameterized queries / ORM mechanisms and avoid constructing SQL queries from untrusted user input.

### API

Validate incoming data using DTOs and appropriate validation rules.

### Production

For production deployments:

- Use HTTPS.
- Use secure environment variables.
- Restrict database access.
- Protect Redis from public access.
- Keep dependencies updated.
- Disable unnecessary debug features.
- Configure appropriate CORS policies.

---

## ⚠️ Responsible Disclosure

Please give the maintainer a reasonable opportunity to investigate and address a security issue before publicly disclosing it.

Thank you for helping keep Ticketing and its users safe.