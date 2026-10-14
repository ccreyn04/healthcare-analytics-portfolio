# DAX Measures

Create each one with **Home > New measure** and paste the formula.

```DAX
Total Spend = SUM(inventory_fact[spend])

Units Purchased = SUM(inventory_fact[units_purchased])

Avg Unit Cost = DIVIDE([Total Spend], [Units Purchased])

Budget (Period) =
SUM(budget_by_site_category[monthly_budget]) * DISTINCTCOUNT(inventory_fact[month])

Budget Variance $ = [Total Spend] - [Budget (Period)]

Budget Variance % = DIVIDE([Budget Variance $], [Budget (Period)])

Expired Value = SUM(inventory_fact[expired_value])

Waste % = DIVIDE([Expired Value], [Total Spend])

Stockout Events = SUM(inventory_fact[stockout_events])
```

**How to explain them in an interview**
- *Budget (Period)* multiplies the monthly budget by the number of months in the current filter, so it stays correct whether you are looking at one month or the full year.
- *Budget Variance %* uses DIVIDE so it returns blank instead of an error when the budget is zero.
- *Waste %* is expired value divided by spend, so it compares fairly across big and small sites.
