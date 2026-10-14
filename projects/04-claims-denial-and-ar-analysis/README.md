# Project 4: Claims Denial & A/R Analysis

**Question:** Where are claims being denied, which denials are preventable, which are worth appealing, and where is A/R aging out?

**Context:** 3,000 synthetic claims for dates of service January 1 to August 31, 2026 across inpatient, outpatient, and pharmacy, with six generic payers. Combines denial root-cause, appeal effectiveness, and A/R aging into one revenue cycle picture. Synthetic and PHI-free. Payers are generic (Commercial A, B, C), not real companies.

**Roles this project speaks to:** Revenue Cycle Analyst, Revenue Integrity Analyst, Coding / Denials Analyst, Prior Authorization Analyst, Healthcare Data Analyst.

## Data
`data/claims.csv`: 3,000 claims.

| Field | Meaning |
|---|---|
| claim_id, service_date, payer, claim_type | Claim identifiers and attributes |
| expected_reimbursement | Expected payment if the claim pays cleanly |
| initial_status | Paid, Denied, or Pending |
| denial_group | Prior authorization, Eligibility / registration, Medical necessity, Coding / billing error, Timely filing, Duplicate claim, Missing documentation |
| denial_area | Front end, Mid cycle, or Back end (where the denial could have been prevented) |
| appealed, appeal_outcome | Whether it was appealed and the result (Overturned, Upheld, Pending) |
| recovered_amount, written_off_amount, outstanding_amount | Dollar outcome |
| ar_days, ar_age_bucket | Days in A/R, and age bucket for balances still open |

## Method
1. **Define** denial rate as denied claims / all claims, and recovery rate as recovered / denied value.
2. **Validate** row count, that each claim has at most one dollar outcome, and that open balances have an age bucket.
3. **Segment** denials by payer, group, and where they originate (front, mid, back end).
4. **Prioritize** appeals by overturn rate x unappealed dollars, and age open A/R by payer.

SQL is in `sql/analysis.sql` (PostgreSQL).

## Findings
- **13.5% of claims are denied initially, and 80.6% pay on first pass.** Denied claims carry $834,497 of expected reimbursement. Only $204,647 (24.5%) has been recovered, and $412,520 (49.4%) has been written off.
- **Commercial B denies the most** (20.9%), then Commercial C (15.8%) and Medicare Advantage (14.3%). Medicare (9.5%) and Medicaid (9.0%) are lowest.
- **Prior authorization is the largest denial group** at $249,596 (30% of denied dollars). Appeals rarely work for it: only 27% are overturned. **Prevention is the lever, not appeals.**
- **45.2% of denied dollars come from the front end** (prior authorization and eligibility / registration), where the fix is registration and authorization controls.
- **Appeal success depends entirely on the denial type.** Coding / billing errors are overturned 84% of the time, missing documentation 83%, duplicates 75%. Medical necessity is 30%, and timely filing is 0%.
- **High-win denials are being left unappealed.** $87,690 of coding, documentation, and duplicate denials were never appealed. At their historical overturn rates that is up to about **$70,989** of recoverable revenue.
- **Timely filing is pure loss.** $39,359 written off, none appealed successfully, and all of it was preventable.
- **A/R is aging unevenly.** 19.1% of open A/R ($111,554) is over 90 days. Commercial C averages **88.1 days in A/R** vs about 47-50 for Medicare, Medicaid, and Commercial A, and Commercial B and Commercial C each hold about $28K over 90 days.

## Recommendations
| # | Action | Target | Suggested owner |
|---|---|---|---|
| 1 | Add authorization and eligibility verification checks before service, with a hard stop for scheduled high-cost services | Cut front-end denials by a third | Patient access + authorization team |
| 2 | Build an appeal work queue ranked by expected recovery (overturn rate x dollars), starting with coding, documentation, and duplicate denials | Appeal rate above 90% for high-win groups | Denials team lead |
| 3 | Add claim scrubber edits for the top coding and documentation denial reasons | Fewer coding denials at the source | Coding / billing analyst |
| 4 | Set a timely-filing alert at day 60 for any unbilled or rejected claim | Zero timely-filing write-offs | Billing supervisor |
| 5 | Open a payer escalation on Commercial C slow-pay and review Commercial B denial patterns with their provider rep | Commercial C A/R days under 60 | Revenue cycle manager |
| 6 | Report denial rate, appeal overturn rate, and A/R over 90 days monthly by payer | Standing KPI view | Analyst |

## Limitations
- Synthetic data built to demonstrate method. Findings show how the analysis works, not real payer behavior.
- "Expected reimbursement" is a single figure per claim, not a modeled contract rate.
- Appeal expected-recovery is an upper-bound estimate that assumes historical overturn rates hold.
- One eight-month window, with no seasonality or payer contract changes modeled.
