-- Project 3: Pharmacy Charge Capture & Revenue Integrity Audit (PostgreSQL)

CREATE TABLE dispense_charges (
  dispense_id TEXT PRIMARY KEY, dispense_date DATE, setting TEXT, unit TEXT, drug TEXT, drug_category TEXT,
  cdm_code TEXT, billing_unit TEXT, units_per_dispense INTEGER, qty_dispensed INTEGER, returned INTEGER,
  expected_charge NUMERIC, billed_charge NUMERIC, variance NUMERIC, error_type TEXT, days_to_charge INTEGER
);
-- Load the CSV with pgAdmin Import/Export (header = on).

-- 0. Validation
SELECT COUNT(*) AS records,
       SUM(CASE WHEN ROUND(billed_charge - expected_charge, 2) <> variance THEN 1 ELSE 0 END) AS bad_variance
FROM dispense_charges;

-- 1. Headline reconciliation
SELECT ROUND(SUM(expected_charge)) AS expected,
       ROUND(SUM(billed_charge)) AS billed,
       ROUND(SUM(variance)) AS net_variance,
       ROUND(SUM(CASE WHEN variance < 0 THEN variance ELSE 0 END)) AS under_billed,
       ROUND(SUM(CASE WHEN variance > 0 THEN variance ELSE 0 END)) AS over_billed,
       ROUND(100.0 * AVG(CASE WHEN error_type = 'None' THEN 1 ELSE 0 END), 1) AS error_free_pct
FROM dispense_charges;

-- 2. By error type
SELECT error_type, COUNT(*) AS records, ROUND(SUM(variance)) AS net_variance
FROM dispense_charges
WHERE error_type <> 'None'
GROUP BY error_type
ORDER BY net_variance;

-- 3. By setting
SELECT setting, COUNT(*) AS records,
       ROUND(100.0 * AVG(CASE WHEN error_type <> 'None' THEN 1 ELSE 0 END), 1) AS error_rate_pct,
       ROUND(SUM(variance)) AS net_variance
FROM dispense_charges
GROUP BY setting
ORDER BY net_variance;

-- 4. By drug category
SELECT drug_category, COUNT(*) AS records, ROUND(SUM(variance)) AS net_variance
FROM dispense_charges
GROUP BY drug_category
ORDER BY net_variance;

-- 5. Top items by lost revenue
SELECT drug, ROUND(SUM(variance)) AS net_variance
FROM dispense_charges
GROUP BY drug
ORDER BY net_variance
LIMIT 5;

-- 6. Stale-price check after the August 1 price update (biologics)
SELECT drug, COUNT(*) AS dispenses,
       SUM(CASE WHEN error_type = 'Price mismatch (stale CDM)' THEN 1 ELSE 0 END) AS stale_price_dispenses
FROM dispense_charges
WHERE drug_category = 'High-cost biologic' AND dispense_date >= '2026-08-01'
GROUP BY drug
ORDER BY stale_price_dispenses DESC;

-- 7. Returns not credited
SELECT SUM(returned) AS returns,
       SUM(CASE WHEN error_type = 'Return credit missed' THEN 1 ELSE 0 END) AS credit_missed,
       ROUND(SUM(CASE WHEN error_type = 'Return credit missed' THEN variance ELSE 0 END)) AS over_billed
FROM dispense_charges;

-- 8. Late charges
SELECT COUNT(*) AS late_charges, MAX(days_to_charge) AS max_days
FROM dispense_charges
WHERE error_type = 'Late charge';
