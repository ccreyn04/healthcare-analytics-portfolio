-- Project 4: Claims Denial & A/R Analysis (PostgreSQL)

CREATE TABLE claims (
  claim_id TEXT PRIMARY KEY, service_date DATE, payer TEXT, claim_type TEXT, expected_reimbursement NUMERIC,
  initial_status TEXT, denial_group TEXT, denial_area TEXT, appealed TEXT, appeal_outcome TEXT,
  recovered_amount NUMERIC, written_off_amount NUMERIC, outstanding_amount NUMERIC, ar_days INTEGER, ar_age_bucket TEXT
);
-- Load the CSV with pgAdmin Import/Export (header = on).

-- 0. Validation
SELECT COUNT(*) AS claims,
       SUM(CASE WHEN outstanding_amount > 0 AND ar_age_bucket IS NULL THEN 1 ELSE 0 END) AS open_without_bucket
FROM claims;

-- 1. Headline KPIs
SELECT COUNT(*) AS claims,
       ROUND(100.0 * AVG(CASE WHEN initial_status = 'Denied' THEN 1 ELSE 0 END), 1) AS denial_rate_pct,
       ROUND(100.0 * AVG(CASE WHEN initial_status = 'Paid' THEN 1 ELSE 0 END), 1) AS first_pass_pct,
       ROUND(SUM(CASE WHEN initial_status = 'Denied' THEN expected_reimbursement ELSE 0 END)) AS denied_value,
       ROUND(SUM(recovered_amount)) AS recovered,
       ROUND(SUM(written_off_amount)) AS written_off,
       ROUND(SUM(outstanding_amount)) AS open_ar
FROM claims;

-- 2. Payer view: denial rate, open A/R, average days in A/R
SELECT payer, COUNT(*) AS claims,
       ROUND(100.0 * AVG(CASE WHEN initial_status = 'Denied' THEN 1 ELSE 0 END), 1) AS denial_rate_pct,
       ROUND(SUM(outstanding_amount)) AS open_ar,
       ROUND(AVG(CASE WHEN outstanding_amount > 0 THEN ar_days END), 1) AS avg_ar_days
FROM claims
GROUP BY payer
ORDER BY denial_rate_pct DESC;

-- 3. Denial groups: value, share, appeal rate, overturn rate
SELECT denial_group, COUNT(*) AS denials,
       ROUND(SUM(expected_reimbursement)) AS denied_value,
       ROUND(100.0 * SUM(expected_reimbursement) / SUM(SUM(expected_reimbursement)) OVER (), 1) AS pct_of_denied_value,
       ROUND(100.0 * AVG(CASE WHEN appealed = 'Yes' THEN 1 ELSE 0 END), 1) AS appeal_rate_pct,
       ROUND(100.0 * SUM(CASE WHEN appeal_outcome = 'Overturned' THEN 1 ELSE 0 END)
             / NULLIF(SUM(CASE WHEN appealed = 'Yes' AND appeal_outcome <> 'Pending' THEN 1 ELSE 0 END), 0), 1) AS overturn_rate_pct,
       ROUND(SUM(written_off_amount)) AS written_off
FROM claims
WHERE initial_status = 'Denied'
GROUP BY denial_group
ORDER BY denied_value DESC;

-- 4. Where denials originate
SELECT denial_area, COUNT(*) AS denials, ROUND(SUM(expected_reimbursement)) AS denied_value
FROM claims
WHERE initial_status = 'Denied'
GROUP BY denial_area
ORDER BY denied_value DESC;

-- 5. A/R aging
SELECT ar_age_bucket, ROUND(SUM(outstanding_amount)) AS open_ar
FROM claims
WHERE outstanding_amount > 0
GROUP BY ar_age_bucket
ORDER BY MIN(ar_days);

-- 6. Open A/R over 90 days by payer
SELECT payer, ROUND(SUM(outstanding_amount)) AS over_90_ar
FROM claims
WHERE outstanding_amount > 0 AND ar_days > 90
GROUP BY payer
ORDER BY over_90_ar DESC;

-- 7. Appeal opportunity: unappealed denied dollars x historical overturn rate
WITH rates AS (
  SELECT denial_group,
         SUM(CASE WHEN appeal_outcome = 'Overturned' THEN 1 ELSE 0 END) * 1.0
         / NULLIF(SUM(CASE WHEN appealed = 'Yes' AND appeal_outcome <> 'Pending' THEN 1 ELSE 0 END), 0) AS overturn_rate
  FROM claims WHERE initial_status = 'Denied' GROUP BY denial_group
), na AS (
  SELECT denial_group, SUM(expected_reimbursement) AS unappealed_value
  FROM claims WHERE initial_status = 'Denied' AND appealed = 'No' GROUP BY denial_group
)
SELECT na.denial_group, ROUND(na.unappealed_value) AS unappealed_value,
       ROUND(CAST(rates.overturn_rate AS NUMERIC) * 100, 1) AS overturn_rate_pct,
       ROUND(CAST(na.unappealed_value * rates.overturn_rate AS NUMERIC)) AS expected_recovery
FROM na JOIN rates USING (denial_group)
ORDER BY expected_recovery DESC;
