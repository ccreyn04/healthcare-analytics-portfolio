-- Project 4: Prior Authorization Access Dashboard
-- PostgreSQL-compatible. Synthetic data only; no PHI.

-- Overall access KPIs
SELECT COUNT(*) total_cases, COUNT(*) FILTER(WHERE outcome='Approved') approved_cases,
  ROUND(100.0*COUNT(*) FILTER(WHERE outcome='Approved')/NULLIF(COUNT(*) FILTER(WHERE outcome<>'Pending'),0),2) approval_share_nonpending_pct,
  COUNT(*) FILTER(WHERE outcome IN ('Pending','Appealed')) active_backlog,
  ROUND(AVG(days_to_decision),1) avg_decision_or_case_age_days,
  SUM(estimated_savings) estimated_savings_protected,
  COUNT(*) FILTER(WHERE outcome='Pending' AND days_to_decision>10) pending_over_10_days
FROM prior_authorizations;

-- Payer performance
SELECT payer, COUNT(*) cases, COUNT(*) FILTER(WHERE outcome='Approved') approved,
  COUNT(*) FILTER(WHERE outcome='Pending') pending, COUNT(*) FILTER(WHERE outcome='Appealed') appealed,
  ROUND(100.0*COUNT(*) FILTER(WHERE outcome='Approved')/NULLIF(COUNT(*) FILTER(WHERE outcome<>'Pending'),0),2) approval_share_nonpending_pct,
  ROUND(AVG(days_to_decision),1) avg_days, SUM(estimated_savings) savings_protected
FROM prior_authorizations GROUP BY payer ORDER BY approval_share_nonpending_pct DESC;

-- Drug-class value
SELECT drug_class, COUNT(*) cases, SUM(estimated_savings) savings_protected,
  ROUND(AVG(days_to_decision),1) avg_days
FROM prior_authorizations GROUP BY drug_class ORDER BY savings_protected DESC;
