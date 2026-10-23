# Prompt

**AI tool:** ChatGPT, GPT-6

## Main project brief

I used the following detailed QA-engineer brief from the earlier conversation as the specification for the project. This was an AI-suggested prompt that I accepted, not a separate message that I typed verbatim.

> Act as a QA automation engineer. Generate a Playwright test suite using TypeScript for https://practicesoftwaretesting.com/.
>
> Create five independent suites covering smoke tests, authentication, product search, shopping cart, and contact form. Each suite should contain two test cases, including both positive and negative scenarios where appropriate.
>
> Requirements:
> - Use @playwright/test.
> - Prefer accessible role-based locators and stable test IDs.
> - Do not use arbitrary fixed timeouts.
> - Use web-first assertions.
> - Keep tests independent and repeatable.
> - Avoid hardcoding credentials in source files.
> - Handle test data and cleanup appropriately.
> - Include meaningful test descriptions and assertions.
> - Do not invent UI selectors or claim tests have passed.
> - Mark any unverified assumptions for manual checking.
>
> Provide the TypeScript implementation, required configuration, execution commands, and a brief explanation of the test design.
