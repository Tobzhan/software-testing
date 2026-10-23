# Review

## Initial result

ChatGPT helped produce the initial Playwright project with five suites and ten cases. I chose to keep the project small, with one spec file per area, because that makes each test easier to understand and run independently.

This document distinguishes **source-based review** from **browser execution**. The tests were checked against the public Toolshop source, but I still need to run them locally.

## Changes in the revised project

| Area | Change | Reason |
| --- | --- | --- |
| Login error test | Check that the message contains "invalid email or password", rather than just checking that any error appears. | An unrelated server error should not pass the negative-login test. |
| Contact form | Blur the message field before submitting the invalid-email case. | The Angular form validates the message field on blur, so the timing matters. |
| Locators | Use the site's `data-test` attributes and configure Playwright's `testIdAttribute` accordingly. | More stable than locating by positions in the DOM. |
| Cart | Pick an in-stock product instead of relying on one fixed product ID. | Test data on a public demonstration site can change. |
| Assertions | Check actual UI state after an action, such as cart count or user menu. | Clicking a button alone does not establish that the action succeeded. |
| Contact submission | Test validation without sending actual messages. | Avoids unnecessarily submitting repeated requests to a public service. |

These are changes to the project, not evidence that the browser tests pass. The remove button in the cart is still located through a CSS class because the inspected markup does not have a dedicated `data-test` hook for that control.