-- Project 3: Pharmacy Operations Dashboard
-- PostgreSQL-compatible. Synthetic data only; no PHI.

-- Overall operations KPIs
SELECT COUNT(*) total_orders, ROUND(AVG(turnaround_minutes),1) avg_turnaround_minutes,
  ROUND(100.0*COUNT(*) FILTER(WHERE on_time='Yes')/COUNT(*),2) on_time_rate_pct,
  COUNT(*) FILTER(WHERE on_time='No') late_orders,
  COUNT(*) FILTER(WHERE controlled_substance='Yes') controlled_substance_orders
FROM pharmacy_operations;

-- Priority performance
SELECT priority, COUNT(*) orders, ROUND(AVG(turnaround_minutes),1) avg_turnaround_minutes,
  ROUND(100.0*COUNT(*) FILTER(WHERE on_time='Yes')/COUNT(*),2) on_time_rate_pct
FROM pharmacy_operations GROUP BY priority ORDER BY avg_turnaround_minutes;

-- Location exceptions
SELECT location, COUNT(*) orders, COUNT(*) FILTER(WHERE on_time='No') late_orders,
  ROUND(100.0*COUNT(*) FILTER(WHERE on_time='Yes')/COUNT(*),2) on_time_rate_pct
FROM pharmacy_operations GROUP BY location ORDER BY on_time_rate_pct;
