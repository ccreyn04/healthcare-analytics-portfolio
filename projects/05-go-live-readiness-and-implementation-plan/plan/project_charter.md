# Project Charter: Inpatient Pharmacy Workflow Go-Live (Synthetic Scenario)

**Project manager / coordinator:** Implementation analyst (role)
**Sponsor:** Director of Pharmacy (role)
**Planned go-live:** Monday, November 9, 2026 (illustrative)
**Hypercare:** 14 days after go-live

## Purpose
Move inpatient pharmacy order verification, dispense prep, dispense tracking, and the automated cabinet interface to the updated workflow with no gaps in medication availability.

## Objectives
1. Pass all Critical and High priority test scripts before go-live.
2. Train and sign off 100% of pharmacy staff who touch the new workflow.
3. Complete one full downtime drill with reconciliation.
4. Keep the on-time medication order rate within 5 points of baseline during hypercare.

## In scope
Order verification, dispense prep, dispense tracking, automated cabinet interface, barcode scanning, downtime and reconciliation, reporting and worklists, staff training, hypercare.

## Out of scope
Outpatient pharmacy workflows, oncology build changes, and new reporting beyond the worklists listed.

## Stakeholders
| Group | Interest | How they are engaged |
|---|---|---|
| Pharmacy technicians and pharmacists | Daily users | Training, super users, floor walkers |
| Nursing units | Medication arrival times | Pre-go-live notice, escalation card |
| Pharmacy leadership | Safety and on-time delivery | Weekly readiness report, go/no-go meeting |
| Application analysts / IS | Build, test, interface | Daily standup during testing |
| Inventory / purchasing | Cabinet par levels, label stock | Weekly check-in |

## Success criteria (go/no-go gates)
Final test pass rate 95% or higher, zero open Critical or High defects, training completion 90% or higher, competency sign-off 90% or higher, no open High risks.

## Key assumptions
Test environment mirrors production; super users are released from regular duties for training; vendor responds to P1 defects within one business day.
