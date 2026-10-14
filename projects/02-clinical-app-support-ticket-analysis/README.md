# Project 2: Clinical Application Support Ticket Analysis

**Question:** Where is pharmacy application support missing its service targets, what is driving ticket volume, and what would reduce it?

**Context:** An application support analyst's view of a pharmacy clinical system (order verification, dispense prep and labels, automated cabinet interface, barcode scanning, access, worklists). 900 synthetic support tickets from April 1 to September 30, 2026, including a post-upgrade surge in mid-July. Synthetic and PHI-free. No real system names, screenshots, or configuration.

**Roles this project speaks to:** Epic / Clinical Application Analyst, Application Support Analyst, Clinical Systems Analyst, Healthcare Operations Analyst.

## Data
`data/support_tickets.csv`: 900 tickets.

| Field | Meaning |
|---|---|
| ticket_id, opened_at, resolved_at | ID and timestamps |
| priority | P1 critical, P2 high, P3 medium, P4 low |
| category | Order verification queue, Dispense prep & labels, Cabinet interface, Barcode / hardware, Access & security, Reporting / worklists, Downtime / connectivity, Training / how-to |
| application_area | Inpatient pharmacy, Outpatient pharmacy, Pharmacy inventory |
| root_cause | User knowledge gap, Configuration / build, Hardware, Access / provisioning, Interface, Known defect / vendor, Workflow design |
| resolution_type | How it was fixed (training, configuration change, interface fix, vendor fix, and so on) |
| support_tier | L1 service desk, L2 application analyst, L3 vendor |
| kb_article_available | Whether a knowledge article existed (applies to user knowledge gap tickets only) |
| post_upgrade_week | 1 if opened July 13-19, 2026 |
| resolution_hours | Elapsed hours from open to resolved |
| sla_target_hours / sla_met | Assumed targets: P1 4h, P2 8h, P3 24h, P4 72h |
| reopened | 1 if the ticket was reopened |

## Method
1. **Define** SLA as elapsed resolution hours within the priority target (assumed targets).
2. **Validate** row count, that resolved time is after opened time, and that `sla_met` matches hours vs target.
3. **Segment** by priority, category, support tier, root cause, and upgrade week.
4. **Rank** where service is missed and what drives volume.

SQL is in `sql/analysis.sql` (PostgreSQL).

## Findings
- **Overall SLA attainment is 79.7%, and it gets worse as priority gets higher.** P1 is 64.9% and P2 is 71.4%, compared with 85.6% for P4. The tickets that matter most are the ones missing target most often.
- **Cabinet interface is the problem category.** SLA attainment is 53.2% (next lowest is Downtime / connectivity at 68.5%), and it has the most total elapsed ticket-hours of any category (4,116) despite not being the highest volume.
- **Vendor-escalated tickets are where service breaks down.** L3 tickets are 71 of 900 but only 14.1% meet SLA, with a median of 32.4 hours vs about 15 for L1 and L2.
- **The post-upgrade week broke the queue.** July 13-19 brought 71 tickets against a weekly average of 31.9 (about 2.2x), and SLA attainment fell to 59.2% vs 81.4% in other weeks. Cabinet interface, dispense prep, and order verification led the surge.
- **26.8% of tickets are user knowledge gaps** (241 tickets, 4,883 elapsed hours). Only 53 of them (22%) had a knowledge article available. This is the cheapest volume to eliminate.
- **Fixes that are not clean come back.** Vendor fix / workaround tickets reopen 21.9% of the time and configuration changes 18.2%, vs 7.6% overall. Training tickets reopen 2.5%.

## Recommendations
| # | Action | Target | Suggested owner |
|---|---|---|---|
| 1 | Create short tip sheets and knowledge articles for the top how-to ticket topics, and link them in the ticket form | Cut user-knowledge-gap tickets by a third | Application analyst + educator |
| 2 | Add a vendor escalation tracker with daily follow-up on every L3 ticket and a named internal owner | Raise L3 SLA attainment well above 14% | Support lead |
| 3 | Run a regression test of the cabinet interface before every upgrade or interface change, and keep a manual refill backup in the go-live plan | Fewer P1/P2 interface tickets after change | Interface analyst |
| 4 | Staff upgrade weeks as hypercare: extra L2 coverage, floor walkers, and a daily top-issues huddle | Hold SLA attainment above 75% during upgrade weeks | Project coordinator |
| 5 | Require a retest step and closure note before closing configuration and vendor tickets | Bring reopen rate under 10% for those types | Application analysts |

## Limitations
- Synthetic data built to demonstrate method. Findings show how the analysis works, not real support performance.
- SLA targets are assumptions. Real targets vary by organization.
- `resolution_hours` is elapsed calendar time, not hands-on effort, so total hours show where tickets wait, not staff workload.
- One six-month window and one upgrade event, so the post-upgrade pattern is a single observation.
