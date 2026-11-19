# software-testing
Repository containing tasks related to software testing course in Master Degree KBTU

## SIS 2 Playwright CI

[![Playwright Tests](https://github.com/Tobzhan/software-testing/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/Tobzhan/software-testing/actions/workflows/playwright.yml)

The project uses GitHub Actions because the repository is already on GitHub and Actions can run the test matrix, store artifacts, and display the `main` status badge without a separate CI server.

[Playwright Tests](.github/workflows/playwright.yml) runs on every push and pull request. It uses Node.js 22, restores the npm cache from the SIS 2 lockfile, runs `npm ci`, and installs Chromium with its system dependencies. Four parallel shards cover the complete Playwright suite. The merge job combines their blob reports into a single HTML report and JUnit XML file, including when a test fails.

CI rejects `test.only`, allows two retries, and records a trace on the first retry. The workflow uses the public demo credentials from `.env.example`. Set the repository's `BASE_URL` Actions variable to override the default Toolshop URL.

| Artifact | Contents | Retention |
| --- | --- | --- |
| `playwright-report` | Combined HTML report | 14 days |
| `junit-report` | Combined JUnit XML | 14 days |
| `test-results-1` through `test-results-4` | Shard JUnit XML and any recorded traces, screenshots, and videos | 14 days |
| `blob-report-1` through `blob-report-4` | Intermediate reports used by the merge job | 1 day |

### GitHub Actions timing

| Configuration | Total workflow time | Playwright test step (slowest shard) | Run |
| --- | ---: | ---: | --- |
| 1 shard + report merge | 62 s | 15 s | [Single-shard run](https://github.com/Tobzhan/software-testing/actions/runs/44565102220) |
| 4 shards + report merge | 59 s | 9 s | [Four-shard run](https://github.com/Tobzhan/software-testing/actions/runs/44565257640) |

Each row is one successful GitHub Actions run using the same ten tests and a restored npm cache. The test step dropped by 6 seconds, and total time dropped by 3 seconds. Runner setup and report merging accounted for most of the workflow time.

Two temporary verification runs show that CI [rejects a focused test](https://github.com/Tobzhan/software-testing/actions/runs/44565409422) and [publishes a trace and merged reports after a failing assertion](https://github.com/Tobzhan/software-testing/actions/runs/44565454124).

### Run locally

With Node.js 22 in Bash or WSL, run from the repository root.

```bash
cd assignments/sis2-playwright
set -a
source ./.env.example
set +a
npm ci
npx playwright install --with-deps chromium
npx playwright test
npx playwright show-report
```

Use `CI=true npx playwright test` to exercise the CI settings. To inspect a failure from GitHub, download its `test-results-*` artifact and open the extracted `trace.zip` with `npx playwright show-trace path/to/trace.zip`.

### LLM usage for SIS 2
Used model chatgpt 6.2 sol. Main purpose understand what is happening in repository and identify structure. Check if tests are still relevant and passing since last time. Create a plan for implementing ci pipeline for running playwright tests in github actions runner. The pipeline implemented without assisting. Helped to identify bugs and irrelevances in code. 
