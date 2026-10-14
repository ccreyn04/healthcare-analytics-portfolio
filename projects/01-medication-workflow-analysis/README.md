# Project 1: Medication Order Workflow Analysis

**Question:** Where does the medication order-to-dispense workflow break down, and which fixes would recover the most on-time orders?

**Context:** Built around the inpatient pharmacy flow of *order entered → pharmacist verification → dispense prep → dispense tracking*, the kind of workflow supported by systems like Epic Willow. Everything here is **synthetic and PHI-free**. No real patient data, no Epic screenshots, no proprietary configuration.

**Roles this project speaks to:** Epic / Clinical Application Analyst, Clinical Systems Analyst, Healthcare Operations Analyst, Healthcare Data Analyst.

## Data
`data/medication_orders.csv`: 1,500 synthetic inpatient medication orders, August 1-30, 2026.

| Field | Meaning |
|---|---|
| order_id | Unique order ID |
| order_time / verify_time / dispense_time | Timestamps for each workflow step |
| unit | Med-Surg, ICU, Emergency, Women & Infants, Oncology |
| shift | Day (07-15), Evening (15-23), Night (23-07) |
| med_category | Antibiotic, Analgesic, Anticoagulant, IV Fluid / Electrolyte, Insulin, Hazardous / Chemo |
| priority | STAT or Routine |
| exception_type | None, Order clarification needed, Automated cabinet stockout / refill, Dispense prep scan missing, Dispense tracking not updated, Override pull |
| verify_minutes / dispense_minutes / total_minutes | Time in each step and combined |
| target_minutes / within_target | Assumed targets: STAT 30 min, Routine 60 min, from order to dispense |

## Method
1. **Define** on-time as total order-to-dispense time within target (STAT 30 min, Routine 60 min; assumed targets).
2. **Validate** row count, timestamp order (order < verify < dispense), and that total = verify + dispense.
3. **Segment** by priority, shift, unit, and exception type.
4. **Isolate** the effect of workflow exceptions on lateness.

SQL is in `sql/analysis.sql` (PostgreSQL). Headline numbers were also cross-checked in Python.

## Findings
- **Overall on-time rate is 85.3%** (STAT 92.1%, Routine 83.7%). Median order-to-dispense is 37.9 min (STAT 17.0, Routine 41.3).
- **Night shift is the biggest gap.** Night on-time is **66.3%** vs 90.2% on Day and 87.2% on Evening. Night median is 50.0 min vs 35.6 on Day, and night has the highest exception rate (14.5%).
- **Oncology lags by unit** at 70.7% on-time (median 47.9 min, exception rate 15.2%). ICU has a similar exception rate (15.9%) but still runs 88.2% on-time, so the issue is not exceptions alone. Oncology's slower verification step matters too.
- **Exceptions are 9.9% of orders but a heavy drag.** On-time drops from 88.8% (no exception) to 52.7% (exception).
- **Two exception types do most of the damage.** Cabinet stockout / refill (39 orders, 17.9% on-time, median 70.3 min) and order clarification (37 orders, 35.1% on-time, median 60.5 min) account for **56 of the 70 late orders that had an exception**.
- Scan-missing (31) and tracking-not-updated (26) cost less time (+8 to +12 min each) but are workflow-compliance signals worth training on.

## Recommendations
| # | Action | Target | Suggested owner |
|---|---|---|---|
| 1 | Review night-shift staffing and verification coverage; test an added verifier overlap during peak night order volume | Night on-time from 66% to 80%+ | Pharmacy operations lead |
| 2 | Review cabinet par levels and refill triggers for the highest-volume medications | Cut stockout exceptions in half | Inventory / cabinet analyst |
| 3 | Clean up frequently clarified order sets, starting with Oncology | Fewer clarification exceptions | Pharmacist lead + order set owner |
| 4 | Refresher training on dispense prep scanning and dispense tracking | Near-zero scan/tracking exceptions | Super users / educator |
| 5 | Report on-time %, exception rate, and median time weekly by shift and unit | Standing KPI view | Analyst |

## Limitations
- Synthetic data built to demonstrate method. Findings show how the analysis works, not real hospital performance.
- On-time targets (30/60 min) are assumptions. Real targets vary by policy.
- One month of data, no clinical outcomes, and associations are not proof of cause.
