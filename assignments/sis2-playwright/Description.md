# SIS 2 | Description

## Objective

Automate representative UI behaviors of https://practicesoftwaretesting.com/ with Playwright and TypeScript. Five suites each contain two independent automated test cases. All tests target Chromium. Each test receives a new browser context; all selectors were chosen using the target application's public Sprint 5 source.

**Scope:** homepage and catalog, login, product search, shopping cart and contact form validation.  
**Out of scope:** checkout and payment, registering accounts, sending real contact requests, external email, admin workflows, cross-browser and performance testing.

The requested presentation describing "AT suites" was not included. The suite grouping below is functional, pending lecturer confirmation.

## Test case list

| ID | Suite | Procedure | Expected result | Method |
| --- | --- | --- | --- | --- |
| SM-01 | Smoke | Open homepage | Home, login and cart navigation visible | Smoke |
| SM-02 | Smoke | Open first catalog product | Product route, title and price visible | Smoke |
| AUTH-01 | Authentication | Log in with documented demo user | User menu visible; sign-in link absent | Positive |
| AUTH-02 | Authentication | Submit nonexistent email and invalid password | Login error visible; still signed out | Negative |
| SEARCH-01 | Search | Search "hammer" | Search caption, result count and products visible | Positive |
| SEARCH-02 | Search | Search "zzzxxyy-no-such-tool-qa-2026" | No-results message and zero product cards | Negative / equivalence partition |
| CART-01 | Cart | Select available product, add to cart | Product in cart, quantity 1, total shown | E2E / functional |
| CART-02 | Cart | Add product, open cart, remove product | Cart item gone and badge count 0 | Regression |
| CONTACT-01 | Contact | Submit empty contact form | Required field errors displayed | Negative / equivalence partition |
| CONTACT-02 | Contact | Fill names, subject and long message with invalid email; submit | Email validation error shown | Negative |

## Test design

- Use observable expected outcomes, not just successful clicks.
- Use stable data-test hooks, with the selector configured in Playwright.
- Test product selection avoids items marked out of stock.
- Shared demo account is overridable via environment variables.
- Negative contact tests do not generate real support tickets.
- Failed tests create traces and screenshots locally.

## Acceptance and evidence

A completed local run should discover 10 test cases in 5 .spec.ts files. Record passed, failed and skipped counts and explain any unresolved failures. Collect screenshots of the AI response, terminal and Playwright HTML report.

**Current status (2026-10-23): Not executed against the live application.** Runtime outcomes must be filled in after actual local execution.
