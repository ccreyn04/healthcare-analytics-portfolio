# Project 6: Pharmacy Inventory & Spend Dashboard (Power BI)

**Question:** Where is pharmacy spend going over budget, where is product being wasted, and where are stockouts hitting?

**Context:** A 12-month, 3-site synthetic pharmacy inventory dataset (October 2025 to September 2026) built as a **Power BI report** with a star-schema model and DAX measures. Synthetic and PHI-free. Drug names are real generic names but prices and volumes are illustrative, not real purchasing data.

**Roles this project speaks to:** Business Intelligence Analyst, Healthcare Data Analyst, Pharmacy Data Analyst, Healthcare Operations Analyst.

## Data (`data/`)
| File | Rows | What it holds |
|---|---|---|
| inventory_fact.csv | 900 | Monthly purchases per site and item: units, unit cost, spend, units expired, expired value, stockout events |
| budget_by_site_category.csv | 15 | Monthly budget per site and category |

3 sites (Central Hospital, North Clinic Pharmacy, East Infusion Center) x 5 categories (Antibiotics, Anticoagulants, Insulins, High-cost biologics, IV fluids & electrolytes) x 5 items x 12 months.

## Model and measures
Star schema: `DimSite` and `DimCategory` filter both the fact table and the budget table. DAX measures are in `powerbi/dax_measures.md`. Step-by-step build instructions are in `powerbi/BUILD-GUIDE.md`.

## Findings
- **Spend is $6.67M against a $6.53M budget, 2.1% over.**
- **High-cost biologics are 73.6% of all spend**, and the overrun is almost entirely there: Central Hospital is 4.3% over and East Infusion Center is 4.0% over. Monthly biologics spend rises from $371.5K in October 2025 to $447.9K in September 2026 (+20.6%) as unit costs climb through the year.
- **Waste is concentrated.** Total expired value is $149.1K (2.24% of spend). **East Infusion Center biologics alone are $110.0K of that (73.8%)**, a 4.15% waste rate vs 0.88% for the same category at Central Hospital.
- **Anticoagulants drive stockouts.** They are 46 of 147 stockout events (31.3%) while making up only 5.8% of spend.

## Recommendations
1. Re-forecast the biologics budget against the price trend, and review contract and purchasing options for the top biologics.
2. At East Infusion Center, order biologics closer to scheduled patient infusions and test sharing stock with Central Hospital to reduce expiry.
3. Review reorder points and par levels for anticoagulants, starting with the highest-volume items.
4. Add Waste % and Stockout Events to the monthly operations review so they are tracked, not discovered.

## Limitations
- Synthetic data. Prices, volumes, and budgets are illustrative.
- Budget is a flat monthly amount per site and category, so seasonality shows up as variance.
- No patient-level or clinical data, so this cannot say whether any purchasing change is clinically appropriate.
