# Project 5: Go-Live Readiness & Implementation Plan

**Question:** Is a pharmacy system go-live ready, and if not, what exactly has to close before it is?

**Context:** A synthetic implementation scenario for a pharmacy workflow go-live: 119 test scripts across 7 workflows, a defect log, a staff training/competency tracker, and a risk log. The deliverable is a **go/no-go readiness assessment** with explicit gates, the way an implementation coordinator would present it. Synthetic and PHI-free.

**Roles this project speaks to:** Implementation Analyst/Specialist, Healthcare Project Coordinator/Manager, Epic / Clinical Application Analyst, Healthcare Operations Analyst.

## Data (`data/`)
| File | Rows | What it holds |
|---|---|---|
| test_scripts.csv | 119 | Script ID, workflow, priority, round 1 result, final result, tester role, last run date |
| defects.csv | 13 | Defect ID, linked script, workflow, severity, status, days open |
| training_tracker.csv | 60 | Staff ID, role, shift, training completed, competency sign-off |
| risk_log.csv | 8 | Risk, likelihood, impact, owner role, mitigation, status |

Workflows tested: Order verification, Dispense prep, Dispense tracking, Automated cabinet interface, Barcode scanning, Downtime & reconciliation, Reporting & worklists.

## Implementation plan (`plan/`)
This project covers both sides of an implementation: the plan and the readiness report.
| File | What it is |
|---|---|
| plan/project_charter.md | Purpose, objectives, scope, stakeholders, success criteria, assumptions |
| plan/raci.csv | Who is Responsible, Accountable, Consulted, Informed for 10 activities |
| plan/timeline.csv | 12 tasks from kickoff to closeout with owners, dependencies, and critical path (July 6 to Nov 27, 2026) |
| plan/communication_and_hypercare_plan.md | Who hears what and when, plus the 14-day hypercare plan |

The readiness gates below come straight from the charter's success criteria. The assessment reflects test, defect, training, and risk status as of September 28, 2026 (illustrative), ahead of the November 4 go/no-go meeting.

## Readiness gates (assumed criteria)
| Gate | Threshold | Result | Status |
|---|---|---|---|
| Final test script pass rate | 95% or higher | 94.96% (113 of 119) | Missed by one script |
| Open Critical or High defects | 0 | 0 | Met |
| Training completion | 90% or higher | 93.3% (56 of 60) | Met |
| Competency sign-off | 90% or higher | 88.3% (53 of 60) | Missed |
| High-rated risks open | 0 | 2 High-likelihood risks open (4 open total) | Missed |

## Findings
- **Round 1 pass rate was 86.6%, final is 94.96%.** Retesting after fixes recovered most failures.
- **The remaining gaps cluster in two workflows.** Downtime & reconciliation finishes at 82.4% pass and Order verification at 88.2%. The other five workflows are at 94% or higher.
- **Six scripts have not passed.** Three have open Medium defects, one Critical-priority downtime script (TS-086) is fixed but waiting on retest, and two (TS-007, TS-110) were Blocked in round 1 and never cleared.
- **No open Critical or High defects**, which is the most important gate to clear.
- **Cabinet interface finished at 100% but needed fixes to get there** (88.2% first-round pass), and it is still a High-likelihood open risk, so it should get a full regression retest before go-live.
- **Competency sign-off is the weak spot, not training.** Super users are lowest at 83.3% sign-off (night shift is next at 85.7%), and super users are the people floor staff will call on during go-live.

## Recommendation: **Conditional Go**
Proceed only if these close before the go-live date:
1. Retest TS-086 and fix or retest the three downtime and order verification scripts with open defects.
2. Unblock and run TS-007 and TS-110.
3. Run one full downtime drill with reconciliation (Risk R-03).
4. Complete competency sign-offs, super users first. One more sign-off clears the 90% gate.
5. Run a regression retest of the cabinet interface (Risk R-01).
6. Publish the one-page escalation contact card (Risk R-08).

If steps 1 and 3 cannot be completed, recommend delaying go-live. Downtime readiness is a patient-safety dependency.

## Limitations
- Synthetic scenario. It demonstrates readiness reporting, not a real implementation.
- Gate thresholds are assumed. Real projects set them with stakeholders.
- Tester assignments and dates are illustrative.
