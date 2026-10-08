# Week 4: Money Transfer Test Documentation

**Software Testing and Debugging | KBTU 2026**  
**Feature:** Transfer between own accounts  
**Basis:** Week 3 money-transfer brief and my Week 3 test-design homework  
**Execution status:** Design only; tests have not been run

## 1\. Test plan

**Scope in:** Whole-tenge transfer amounts from 100 to 500,000 KZT; the 1,000,000 KZT daily limit and midnight reset in Almaty time; SMS confirmation for amounts above 100,000 KZT; code expiry after 120 seconds; cancellation after three incorrect codes; amount-error precedence when both the amount and daily limit are invalid.

**Scope out:** Fees, external-bank transfers, performance, accessibility, localization, cross-platform compatibility, and security penetration testing. Behavior not specified in the brief is recorded as a requirement gap, not assumed to be correct or incorrect.

**Approach:** Black-box equivalence partitions and boundary values for amount, decision-table tests for validation order and daily limit, and state-transition tests for SMS. Execute each case from an independently reset fixture. Retest fixed defects and run regression before release.

**Environment and data:** A QA build with access to Transfers > Between my accounts; a dedicated customer account and a recipient deposit; a test SMS gateway; and a controllable clock for time tests. The test team must provision the fixtures below and record the actual build/device before execution. The deck does not provide a real app URL, version, or test credentials.

**Entry criteria:** (1) QA build deployed and accessible; (2) transfer smoke test passes; (3) customer account, recipient deposit, balances and daily counters can be reset independently; (4) test gateway exposes the current six-digit OTP; (5) test clock can be controlled for time-based cases; (6) brief and known gaps shared with the team.

**Exit criteria:** All 12 planned cases executed; every failure or blocked case has a recorded disposition; no unresolved critical or high-severity defects without release-owner sign-off; regression passes; requirement coverage gaps (including invalid amount formats and undefined SMS behaviors) are reviewed and explicitly accepted or assigned for further testing; remaining risks are included in the completion report. Meeting these criteria cannot be claimed before execution.

**Top product risks:** (1) A transfer is executed or debited twice following SMS retries; (2) incorrect amount or cumulative-limit checks allow unauthorized transfers; (3) SMS expiry, failed attempts, or midnight reset uses incorrect state/time semantics.

### Test data conventions

The following are **fixtures to create**, not real existing accounts or observed results.

* **Customer:** `QA-CUST-01`, logged in; **source account:** `QA-SRC-1024`; **recipient:** own deposit `QA-DEP-4417`. No fees are specified; balances below ignore any fees.
* Before **every test**, reset source balance to **1,000,000 KZT**, recipient balance to **0 KZT**, daily spent amount to the value given in that case, and pending transfers to none. Prior-day spending can be seeded independently of current source balance.
* SMS test stub sends the valid code **`123456`**. Codes **`654321`**, **`222222`**, and **`333333`** are configured as incorrect. The stub is test infrastructure, **not** a product requirement about what code is generated.
* Unless stated otherwise, daily spent is **0 KZT**. All times are **Asia/Almaty**. Time-sensitive cases require a controllable clock.
* For navigation, sign in as `QA-CUST-01`, open **Transfers > Between my accounts**, choose `QA-SRC-1024` as source and `QA-DEP-4417` as destination. Exact menu labels may need adjustment to the real build before execution.
* **Status for every case:** Not run. These are expected results, not observed outcomes.

## 2\. Test cases (12)

### TR-AMT-001 | Below the minimum

**Requirement:** REQ-1 | **Technique:** Boundary value (99/100)  
**Preconditions:** Default fixture; daily spent 0.  
**Input:** 99 KZT.  
**Steps:** 1. Open the transfer form and select the fixture accounts. 2. Enter `99`. 3. Press Continue.  
**Expected:** An amount-validation error is displayed; no SMS prompt or completed transfer; source balance remains 1,000,000 KZT.  
**Postcondition:** No transfer executed. **Status:** Not run.

### TR-AMT-002 | Minimum allowed amount

**Requirement:** REQ-1, REQ-3 | **Technique:** Boundary value  
**Preconditions:** Default fixture; daily spent 0.  
**Input:** 100 KZT.  
**Steps:** 1. Open the transfer form and select the fixture accounts. 2. Enter `100`. 3. Press Continue.  
**Expected:** Transfer executes without an SMS challenge; source balance 999,900 KZT; destination balance 100 KZT; daily spent 100 KZT.  
**Postcondition:** One completed transfer. **Status:** Not run.

### TR-AMT-003 | SMS threshold itself

**Requirement:** REQ-1, REQ-3 | **Technique:** Boundary value  
**Preconditions:** Default fixture; daily spent 0.  
**Input:** 100,000 KZT.  
**Steps:** 1. Open the transfer form and select the fixture accounts. 2. Enter `100000`. 3. Press Continue.  
**Expected:** Transfer executes without SMS; source balance 900,000 KZT; destination balance 100,000 KZT; daily spent 100,000 KZT.  
**Postcondition:** One completed transfer. **Status:** Not run.

### TR-AMT-004 | Just above the SMS threshold

**Requirement:** REQ-1, REQ-3 | **Technique:** Boundary value  
**Preconditions:** Default fixture; daily spent 0; SMS stub active.  
**Input:** 100,001 KZT.  
**Steps:** 1. Open the transfer form and select the fixture accounts. 2. Enter `100001`. 3. Press Continue.  
**Expected:** Six-digit SMS confirmation is requested, using the configured test code `123456`; source remains at 1,000,000 KZT and destination at 0 KZT before confirmation. **Do not assert daily-limit accounting for pending transfers, as that is not specified.**  
**Postcondition:** Transfer waiting for confirmation. **Status:** Not run.

### TR-AMT-005 | Above the maximum

**Requirement:** REQ-1 | **Technique:** Boundary value (500,000/500,001)  
**Preconditions:** Default fixture; daily spent 0.  
**Input:** 500,001 KZT.  
**Steps:** 1. Open the transfer form and select the fixture accounts. 2. Enter `500001`. 3. Press Continue.  
**Expected:** Amount-validation error; no SMS challenge or execution; both account balances unchanged.  
**Postcondition:** No transfer executed. **Status:** Not run.

### TR-DAY-001 | Cumulative limit exceeded

**Requirement:** REQ-2 | **Technique:** Decision table  
**Preconditions:** Default accounts; daily spent **900,000 KZT**.  
**Input:** 200,000 KZT (would total 1,100,000).  
**Steps:** 1. Open the transfer form and select the fixture accounts. 2. Enter `200000`. 3. Press Continue.  
**Expected:** Daily-limit error; no SMS confirmation or execution; account balances unchanged.  
**Postcondition:** No additional completed transfer. **Status:** Not run.

### TR-DAY-002 | Cumulative limit exactly reached

**Requirement:** REQ-2, REQ-3 | **Technique:** Boundary value / decision table  
**Preconditions:** Default accounts; daily spent **900,000 KZT**.  
**Input:** 100,000 KZT (would total exactly 1,000,000).  
**Steps:** 1. Open the transfer form and select the fixture accounts. 2. Enter `100000`. 3. Press Continue.  
**Expected:** Accepted with no SMS; source balance 900,000 KZT; destination balance 100,000 KZT; daily spent exactly 1,000,000 KZT.  
**Postcondition:** One completed transfer. **Status:** Not run.

### TR-DAY-003 | Midnight reset, Almaty time

**Requirement:** REQ-2 | **Technique:** Time-boundary test  
**Preconditions:** Fixture balance 1,000,000 KZT; daily spent **1,000,000 KZT** on 8 October; controlled clock initially **2026-10-08 23:59:55 Asia/Almaty**.  
**Input:** 100 KZT on both sides of midnight.  
**Steps:** 1. At 23:59:55, enter `100` and press Continue. 2. Verify the daily-limit rejection. 3. Advance the test clock to **2026-10-09 00:00:05 Asia/Almaty**. 4. Start a **new** transfer of `100` between the same accounts and press Continue.  
**Expected:** First transfer rejected because the daily total is already 1,000,000 KZT; second executes without SMS after the daily limit resets; source balance ends at 999,900 KZT and destination at 100 KZT; new-day spent amount 100 KZT.  
**Postcondition:** Only the second transfer executed. **Status:** Not run.

### TR-PRIO-001 | Amount and daily limit both invalid

**Requirement:** REQ-6 | **Technique:** Decision table  
**Preconditions:** Default accounts; daily spent **900,000 KZT**.  
**Input:** 600,000 KZT (also exceeds the per-transfer maximum).  
**Steps:** 1. Open the transfer form and select the fixture accounts. 2. Enter `600000`. 3. Press Continue.  
**Expected:** The **amount error**, not the daily-limit error, is displayed; no SMS or transfer; account balances unchanged.  
**Postcondition:** No transfer executed. **Status:** Not run.

### TR-OTP-001 | Upper valid amount, two wrong codes then correct

**Requirement:** REQ-1, REQ-3, REQ-5 | **Technique:** State transition / amount boundary  
**Preconditions:** Default fixture; daily spent 0; SMS stub set to valid `123456`.  
**Input:** 500,000 KZT; wrong `654321`, wrong `222222`, correct `123456`, all before expiry.  
**Steps:** 1. Submit a transfer of `500000` using the fixture accounts. 2. Enter `654321` and confirm. 3. Enter `222222` and confirm. 4. Enter `123456` and confirm before 120 seconds elapse.  
**Expected:** Six-digit SMS requested; each wrong entry leaves the transfer waiting, with attempt counts 2 then 3; the correct third entry confirms and executes **once**; source balance 500,000 KZT; destination balance 500,000 KZT; daily spent 500,000 KZT.  
**Postcondition:** Confirmed, one completed transfer. **Status:** Not run.

### TR-OTP-002 | Three wrong SMS codes cancel transfer

**Requirement:** REQ-5 | **Technique:** State transition  
**Preconditions:** Default fixture; daily spent 0; SMS stub set to valid `123456`.  
**Input:** 200,000 KZT; wrong codes `654321`, `222222`, `333333` before expiry.  
**Steps:** 1. Submit a transfer of `200000`. 2. Enter `654321` and confirm. 3. Enter `222222` and confirm. 4. Enter `333333` and confirm.  
**Expected:** Following the third wrong code, transfer state becomes **Cancelled**; no transfer is executed; account balances remain unchanged. The daily-limit effect of cancelled transfers is **not** asserted because the brief does not define it.  
**Postcondition:** Transfer cancelled. **Status:** Not run.

### TR-OTP-003 | Code expires after 120 seconds

**Requirement:** REQ-4 | **Technique:** State transition / time boundary  
**Preconditions:** Default fixture; daily spent 0; SMS stub and controllable clock enabled.  
**Input:** 200,000 KZT; wait more than 120 seconds (advance test clock by **121 seconds** after the expiry timer has started).  
**Steps:** 1. Submit a transfer of `200000`. 2. Record the test system's OTP start time. 3. Advance the clock by 121 seconds from that start time. 4. Observe the transfer status.  
**Expected:** OTP expires and the transfer is cancelled; no debit or credit occurs. Exact behavior at **120.000 seconds** is unconfirmed and excluded.  
**Postcondition:** Transfer expired/cancelled. **Status:** Not run.

## 3\. Requirements traceability

|ID|Requirement from Week 3 brief|Test cases|Coverage / gap|
|-|-|-|-|
|REQ-1|Amount 100–500,000 KZT, whole tenge only|TR-AMT-001 to 005; TR-OTP-001; TR-PRIO-001|**Partial**: important bounds covered; invalid decimals/empty/text and some 3-value neighbors not tested in this set|
|REQ-2|Daily limit 1,000,000 KZT across transfers; resets at midnight Almaty time|TR-DAY-001 to 003; TR-PRIO-001|Covered for over/equal limit and midnight reset; crossing-midnight pending SMS is undefined|
|REQ-3|Transfer above 100,000 KZT requires six-digit SMS code|TR-AMT-002 to 004; TR-DAY-002; TR-OTP-001|Covered at threshold and during OTP confirmation|
|REQ-4|SMS code valid for 120 seconds|TR-OTP-003|**Partial**: expiry after 121 s covered; whether exactly 120 s is valid and timer start event not defined|
|REQ-5|Three wrong SMS codes cancel the transfer|TR-OTP-001, TR-OTP-002|Covered for two wrong then correct, and three wrong|
|REQ-6|If both amount and daily limit fail, show amount error|TR-PRIO-001|Covered|
|GAP-1|Insufficient balance behavior|None|**No requirement supplied**; cannot derive expected rejection/message; analyst clarification needed|
|GAP-2|Do pending/expired/cancelled transfers count towards daily limit?|None|**Undefined**; avoid asserting counter behavior until clarified|
|GAP-3|Resend SMS code and wrong-attempt reset|None|**Undefined**|
|GAP-4|Duplicate confirmation; entry after Confirmed/Expired/Cancelled|None|**Undefined**; potential double-debit risk|
|GAP-5|SMS submitted before midnight and confirmed after midnight|None|**Undefined**|

This is a **design coverage** matrix, not a pass-rate report. No test has been executed.

## 4\. SMS release checklist

* \[ ] Transfers of **100,000 KZT** do not request SMS.
* \[ ] Transfers of **100,001 KZT** request SMS.
* \[ ] The required OTP has **six digits**.
* \[ ] An unconfirmed transfer has not yet debited the source account.
* \[ ] A correct code on the first attempt confirms the transfer.
* \[ ] One wrong code keeps the transfer pending for a second attempt.
* \[ ] Two wrong codes keep the transfer pending for a third attempt.
* \[ ] A correct code on the third attempt confirms the transfer.
* \[ ] A third incorrect code cancels the transfer.
* \[ ] An unconfirmed transfer expires once **more than 120 seconds** have passed.
* \[ ] After expiry or cancellation, no transfer has executed.
* \[ ] Undefined post-confirmation, resend, and midnight behaviors are listed for product-owner review before release.

Checklist is **not executed**. The last item is a requirements review, not a claim that a particular undefined behavior must occur.

## 5\. Defect reports (mock examples, not observed)

These are intentionally **fictional defects for the assignment**. Expected results come from the brief, while actual results below describe the *hypothetical buggy implementation*. No build was tested, so the environment, reproducibility counts, logs and screenshots must not be presented as verified evidence.

### DEF-M01 | Transfers: 500,001 KZT progresses past amount validation

* **Environment:** Hypothetical QA build, version/device **MISSING**; test fixture `QA-CUST-01`.
* **Preconditions:** Source balance 1,000,000 KZT; daily spent 0; destination `QA-DEP-4417`.
* **Steps:** 1. Open Transfers > Between my accounts. 2. Select source `QA-SRC-1024` and destination `QA-DEP-4417`. 3. Enter `500001`. 4. Press Continue.
* **Expected:** Amount is rejected because it exceeds 500,000 KZT; no SMS or execution.
* **Actual (mock):** The app proceeds to the SMS confirmation screen for 500,001 KZT rather than showing an amount error.
* **Reproducibility:** **Not measured; mock scenario**.
* **Severity / priority:** **High / High (proposed)**. Invalid amount reaches a later validation stage.
* **Evidence needed:** Screen recording of amount entry and result; build version; API request ID if available.
* **Trace:** REQ-1; TR-AMT-005.

### DEF-M02 | Transfers: daily cap exceeded after confirming 200,000 KZT

* **Environment:** Hypothetical QA build, version/device **MISSING**; test SMS stub.
* **Preconditions:** Source balance 1,000,000 KZT; daily spent **900,000 KZT**; OTP stub returns `123456`.
* **Steps (mock scenario):** 1. Open Transfers > Between my accounts. 2. Select `QA-SRC-1024` and `QA-DEP-4417`. 3. Enter `200000`. 4. Press Continue. 5. On the incorrectly displayed SMS screen, enter `123456` and confirm. 6. Open transfer history and inspect the daily spent total.
* **Expected:** Daily-limit error; transfer must not execute because 900,000 + 200,000 = 1,100,000 KZT.
* **Actual (mock):** Instead of a daily-limit error, the SMS screen appears. After confirmation, the transfer is completed and the daily total becomes 1,100,000 KZT.
* **Reproducibility:** **Not measured; mock scenario**.
* **Severity / priority:** **Critical / High (proposed)**. Exceeds the defined financial cap.
* **Evidence needed:** Daily-counter snapshot before/after, account statement, server request ID and logs, build details.
* **Trace:** REQ-2; TR-DAY-001.

### DEF-M03 | SMS: third incorrect code leaves the transfer pending

* **Environment:** Hypothetical QA build, version/device **MISSING**; test SMS stub.
* **Preconditions:** Source balance 1,000,000 KZT; daily spent 0; valid OTP `123456`.
* **Steps:** 1. Open Transfers > Between my accounts. 2. Select `QA-SRC-1024` and `QA-DEP-4417`. 3. Submit `200000`. 4. Enter wrong code `654321` and confirm. 5. Enter wrong code `222222` and confirm. 6. Enter wrong code `333333` and confirm. 7. Inspect the transfer status.
* **Expected:** Third wrong code cancels the transfer; no debit occurs.
* **Actual (mock):** The SMS screen remains active and transfer status stays Waiting after the third wrong code.
* **Reproducibility:** **Not measured; mock scenario**.
* **Severity / priority:** **High / High (proposed)**. Attempt limit is not enforced.
* **Evidence needed:** Video of all attempts, server-side OTP-attempt counter, request IDs and logs, build details.
* **Trace:** REQ-5; TR-OTP-002.

## 6\. AI appendix (Level 1 disclosure)

**AI tool:** ChatGPT. I used AI to structure the Week 4 documentation from the lecture materials and my Week 3 test design.

### Prompts and follow-up instructions

**Actual requests:** I asked it prompt/review section and show corresponding revisions. The prompts below are a verbatim conversation transcript.

**Initial prompt:**

> Using the Week 4 Software Testing slides, the Week 3 money-transfer brief, and my Week 3 homework, prepare the Week 4 documentation pack in Markdown. Include a short test plan with measurable entry/exit criteria, 12 independently runnable test cases, a requirement traceability matrix, an SMS release checklist of no more than 12 items, and three clearly identified mock bug reports. Reuse the Week 3 amount boundaries, decision rules and OTP state transitions. Give every test an ID, concrete preconditions, exact input, steps, expected result and requirement reference. Do not invent answers where requirements are missing. Mark tests Not run and distinguish simulated defects from observed ones.

**Review prompt:**

> Review the draft against the slides and the money-transfer brief. Check traceability, boundary values, missing requirements and whether somebody else could follow every test and defect report. Fix any vague or conditional reproduction steps. Do not claim full requirement coverage when only a subset of boundary and invalid-input cases is included. Keep the original AI response unchanged and summarize what you corrected and why.

### Review and changes

|Item reviewed|Result and reason|
|-|-|
|Requirements|Kept the stated amount, daily-limit and SMS rules; left unspecified behavior (insufficient funds, resend, exact OTP expiry boundary and post-expiry actions) as explicit gaps rather than assumptions.|
|Test cases|Checked that all 12 have IDs, fixtures, concrete test data, actions and expected outcomes, and remain marked **Not run**.|
|Coverage|Kept the REQ-1 coverage marked **Partial** because non-integer, empty and text amounts, plus several 3-value boundary neighbors, are not among the 12 selected tests.|
|Exit criteria|**Changed:** removed the implication that every detail of every requirement already has a passing test. The plan now requires gaps to be reviewed and explicitly accepted or assigned.|
|Defect DEF-M02|**Changed:** replaced a conditional SMS step with a specific hypothetical path and aligned its mock actual result with that path, making the example more reproducible.|
|Defect evidence|Verified that DEF-M01 to DEF-M03 are labeled **mock**, with no invented build information, real screenshots or reproduction counts.|

**Remaining limitations:** The three defects are scenarios for documentation practice, not observed bugs. Test accounts, menu paths, test gateway and test clock are proposed fixtures; they must be verified in a real environment before execution. The raw AI draft and the reviewed document should both be kept with the submission to make the changes visible.

