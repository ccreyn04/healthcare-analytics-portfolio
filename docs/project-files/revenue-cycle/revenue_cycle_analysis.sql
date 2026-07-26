-- Project 1: Revenue Cycle Executive Dashboard
-- PostgreSQL-compatible. Synthetic data only; no PHI.

-- Executive KPIs
SELECT
  COUNT(*) AS total_claims,
  SUM(charge_amount) AS total_charges,
  SUM(allowed_amount) AS allowed_amount,
  SUM(paid_amount) AS collected_cash,
  ROUND(100.0 * SUM(paid_amount) / NULLIF(SUM(allowed_amount), 0), 2) AS collection_rate_pct,
  ROUND(100.0 * COUNT(*) FILTER (WHERE claim_status = 'Denied') / COUNT(*), 2) AS denial_rate_pct,
  SUM(allowed_amount) FILTER (WHERE claim_status = 'Denied') AS denied_allowed_amount,
  ROUND(AVG(days_in_ar), 1) AS avg_days_in_ar
FROM revenue_claims;

-- Payer scorecard
SELECT
  payer,
  COUNT(*) AS claims,
  COUNT(*) FILTER (WHERE claim_status = 'Denied') AS denied_claims,
  ROUND(100.0 * COUNT(*) FILTER (WHERE claim_status = 'Denied') / COUNT(*), 2) AS denial_rate_pct,
  SUM(allowed_amount) AS allowed_amount,
  SUM(paid_amount) AS paid_amount,
  ROUND(100.0 * SUM(paid_amount) / NULLIF(SUM(allowed_amount), 0), 2) AS collection_rate_pct,
  ROUND(AVG(days_in_ar), 1) AS avg_days_in_ar
FROM revenue_claims
GROUP BY payer
ORDER BY denied_claims DESC;

-- Monthly performance trend
SELECT
  DATE_TRUNC('month', date_of_service) AS service_month,
  COUNT(*) AS claims,
  ROUND(100.0 * SUM(paid_amount) / NULLIF(SUM(allowed_amount), 0), 2) AS collection_rate_pct,
  ROUND(100.0 * COUNT(*) FILTER (WHERE claim_status = 'Denied') / COUNT(*), 2) AS denial_rate_pct,
  ROUND(AVG(days_in_ar), 1) AS avg_days_in_ar
FROM revenue_claims
GROUP BY 1
ORDER BY 1;
