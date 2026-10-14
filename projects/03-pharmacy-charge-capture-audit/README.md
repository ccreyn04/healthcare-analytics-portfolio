# Project 3: Pharmacy Charge Capture & Revenue Integrity Audit

**Question:** Do the charges that reach the bill match what pharmacy actually dispensed, and where is revenue being lost or overbilled?

**Context:** A revenue integrity audit that reconciles 4,000 synthetic pharmacy dispense records (July 1 to September 30, 2026) against the charges billed, across inpatient, outpatient pharmacy, and an infusion center. Expected charge = units dispensed x charge master (CDM) unit price, with returns credited. Synthetic and PHI-free. Drug names are generic; codes, prices, and volumes are illustrative.

**Roles this project speaks to:** Revenue Integrity Analyst, Pharmacy Revenue Cycle Analyst, Charge Capture / Coding Analyst, Healthcare Data Analyst.

## Data
`data/dispense_charges.csv`: 4,000 dispense records.

| Field | Meaning |
|---|---|
| dispense_id, dispense_date, setting, unit | Where and when it was dispensed |
| drug, drug_category, cdm_code | Item and its (synthetic) charge master code |
| billing_unit, units_per_dispense | How the item is billed vs how it is dispensed (for example a 1 g vial billed per 250 mg = 4 units) |
| qty_dispensed, returned | Quantity dispensed and whether it was returned to pharmacy |
| expected_charge, billed_charge, variance | What should have been billed, what was billed, and the difference (negative = under-billed) |
| error_type | None, Missing charge, Wrong quantity (unit of measure), Price mismatch (stale CDM), Late charge, Return credit missed |
| days_to_charge | Days from dispense to charge posting |

## Method
1. **Define** expected charge from units and CDM price, and variance as billed minus expected.
2. **Validate** row count, that variance = billed - expected, and that no record has a negative billed charge.
3. **Classify** each variance by cause, then summarize by cause, setting, category, and item.
4. **Separate** under-billing (lost revenue) from over-billing (compliance exposure).

SQL is in `sql/analysis.sql` (PostgreSQL).

## Findings
- **Expected charges were $750,427 and billed charges were $703,132.** Net leakage is **$47,295 (6.3% of expected)**. Under-billing totals $55,556 and over-billing totals $8,261.
- **85.3% of dispenses billed with no error.** The rest split across five error types.
- **Three causes drive most of the lost dollars.** Missing charges (96 records, $21,582), unit-of-measure quantity errors (134 records, $20,349 net), and stale charge master prices (183 records, $13,009).
- **The infusion center and high-cost biologics hold nearly all of the loss.** The infusion center has a 26.1% error rate vs about 11% elsewhere and 81% of net leakage. High-cost biologics account for 96% of it. The top item, Trastuzumab, alone is $24,885.
- **A price update was never loaded into the charge master.** After August 1, 51.8% of dispenses of the four updated biologics billed at the old price.
- **Billing-unit conversion is the quiet error.** Items billed per smaller unit than they are dispensed (such as 10 or 15 billing units per vial) were billed as 1 unit on 111 records.
- **Returns are a compliance risk.** 48 of 183 returned items (26%) were still billed, an over-billing of $7,645 that would need to be refunded.
- **Late charges are a timing problem, not a dollar loss here.** 126 charges posted a median of 10 days after dispense vs about 1 day normally. They add timely-filing risk.

## Recommendations
| # | Action | Target | Suggested owner |
|---|---|---|---|
| 1 | Update CDM prices for the four biologics now, then add a monthly price-change reconciliation between purchasing cost updates and the charge master | Zero stale-price billing | Charge master analyst |
| 2 | Review the billing-unit mapping for every item with more than 1 billing unit per dispense, starting with biologics | Eliminate unit-of-measure under-billing | Pharmacy informatics + revenue integrity |
| 3 | Add a daily dispense-to-charge reconciliation report by setting, with the infusion center first | Missing charges under 1% | Revenue integrity analyst |
| 4 | Audit the return-to-stock credit process and refund the over-billed returns | 100% of returns credited | Pharmacy operations + billing compliance |
| 5 | Set an alert for charges still unposted 3 days after dispense | Late charges under 1% | Revenue integrity analyst |

## Limitations
- Synthetic data built to demonstrate method. Findings show how the audit works, not real leakage rates.
- Expected charge uses one price per item and does not model payer-specific pricing, bundling, or 340B.
- One quarter of data. Billing-unit mappings and prices are illustrative and are not real charge master content.
