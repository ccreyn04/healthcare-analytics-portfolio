-- Project 2: Claims Denial Root-Cause Analysis
-- PostgreSQL-compatible. Synthetic data only; no PHI.

-- Denial reason ranking: count and dollars at risk
SELECT denial_reason, COUNT(*) denied_claims, SUM(allowed_amount) denied_allowed_amount,
  ROUND(AVG(days_in_ar),1) avg_denied_days_in_ar
FROM revenue_claims
WHERE claim_status='Denied'
GROUP BY denial_reason
ORDER BY denied_allowed_amount DESC;

-- Denial rate by payer
SELECT payer, COUNT(*) total_claims, COUNT(*) FILTER(WHERE claim_status='Denied') denied_claims,
  ROUND(100.0*COUNT(*) FILTER(WHERE claim_status='Denied')/COUNT(*),2) denial_rate_pct,
  SUM(allowed_amount) FILTER(WHERE claim_status='Denied') denied_allowed_amount
FROM revenue_claims GROUP BY payer ORDER BY denial_rate_pct DESC;

-- Service-line exposure
SELECT service_line, COUNT(*) FILTER(WHERE claim_status='Denied') denied_claims,
  SUM(allowed_amount) FILTER(WHERE claim_status='Denied') denied_allowed_amount
FROM revenue_claims GROUP BY service_line ORDER BY denied_allowed_amount DESC;
