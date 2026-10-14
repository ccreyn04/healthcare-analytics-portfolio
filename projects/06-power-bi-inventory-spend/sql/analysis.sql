-- Project 7: Pharmacy Inventory & Spend (PostgreSQL)

CREATE TABLE inventory_fact (month DATE, site TEXT, category TEXT, item TEXT, units_purchased INTEGER,
                             unit_cost NUMERIC, spend NUMERIC, units_expired INTEGER, expired_value NUMERIC, stockout_events INTEGER);
CREATE TABLE budget_by_site_category (site TEXT, category TEXT, monthly_budget NUMERIC);
-- Load each CSV with pgAdmin Import/Export (header = on).

-- 1. Spend vs budget by category (12 months)
SELECT f.category,
       ROUND(SUM(f.spend)) AS spend,
       ROUND(MAX(b.budget_12m)) AS budget,
       ROUND(100.0 * (SUM(f.spend) - MAX(b.budget_12m)) / MAX(b.budget_12m), 1) AS variance_pct
FROM inventory_fact f
JOIN (SELECT category, SUM(monthly_budget) * 12 AS budget_12m
      FROM budget_by_site_category GROUP BY category) b ON b.category = f.category
GROUP BY f.category
ORDER BY variance_pct DESC;

-- 2. Spend vs budget by site and category
SELECT f.site, f.category,
       ROUND(SUM(f.spend)) AS spend,
       ROUND(MAX(b.monthly_budget) * 12) AS budget,
       ROUND(SUM(f.spend) - MAX(b.monthly_budget) * 12) AS variance_dollars
FROM inventory_fact f
JOIN budget_by_site_category b ON b.site = f.site AND b.category = f.category
GROUP BY f.site, f.category
ORDER BY variance_dollars DESC;

-- 3. Waste by site and category
SELECT site, category,
       ROUND(SUM(expired_value)) AS expired_value,
       ROUND(100.0 * SUM(expired_value) / SUM(spend), 2) AS waste_pct
FROM inventory_fact
GROUP BY site, category
ORDER BY expired_value DESC
LIMIT 5;

-- 4. Stockouts by category with share of spend
SELECT category,
       SUM(stockout_events) AS stockouts,
       ROUND(100.0 * SUM(stockout_events) / SUM(SUM(stockout_events)) OVER (), 1) AS pct_of_stockouts,
       ROUND(100.0 * SUM(spend) / SUM(SUM(spend)) OVER (), 1) AS pct_of_spend
FROM inventory_fact
GROUP BY category
ORDER BY stockouts DESC;

-- 5. Monthly biologics spend trend
SELECT month, ROUND(SUM(spend)) AS biologics_spend
FROM inventory_fact
WHERE category = 'High-cost biologics'
GROUP BY month
ORDER BY month;
