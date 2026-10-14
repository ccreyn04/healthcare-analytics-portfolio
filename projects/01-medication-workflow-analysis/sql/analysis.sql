-- Project 5: Medication Order Workflow Analysis (PostgreSQL)

CREATE TABLE medication_orders (
  order_id          TEXT PRIMARY KEY,
  order_time        TIMESTAMP,
  verify_time       TIMESTAMP,
  dispense_time     TIMESTAMP,
  unit              TEXT,
  shift             TEXT,
  med_category      TEXT,
  priority          TEXT,
  exception_type    TEXT,
  verify_minutes    NUMERIC,
  dispense_minutes  NUMERIC,
  total_minutes     NUMERIC,
  target_minutes    INTEGER,
  within_target     INTEGER
);
-- Load the CSV with pgAdmin: right-click the table > Import/Export Data > select medication_orders.csv, header = on.

-- 0. Validation: row count and timestamp order
SELECT COUNT(*) AS orders,
       SUM(CASE WHEN order_time <= verify_time AND verify_time <= dispense_time THEN 0 ELSE 1 END) AS bad_timestamps
FROM medication_orders;

-- 1. Headline KPIs by priority
SELECT priority,
       COUNT(*) AS orders,
       ROUND(100.0 * AVG(within_target), 1) AS on_time_pct,
       ROUND(CAST(percentile_cont(0.5) WITHIN GROUP (ORDER BY total_minutes) AS NUMERIC), 1) AS median_minutes
FROM medication_orders
GROUP BY priority;

-- 2. By shift
SELECT shift,
       COUNT(*) AS orders,
       ROUND(100.0 * AVG(within_target), 1) AS on_time_pct,
       ROUND(100.0 * AVG(CASE WHEN exception_type <> 'None' THEN 1 ELSE 0 END), 1) AS exception_rate_pct,
       ROUND(CAST(percentile_cont(0.5) WITHIN GROUP (ORDER BY total_minutes) AS NUMERIC), 1) AS median_minutes
FROM medication_orders
GROUP BY shift
ORDER BY on_time_pct;

-- 3. By unit
SELECT unit,
       COUNT(*) AS orders,
       ROUND(100.0 * AVG(within_target), 1) AS on_time_pct,
       ROUND(100.0 * AVG(CASE WHEN exception_type <> 'None' THEN 1 ELSE 0 END), 1) AS exception_rate_pct,
       ROUND(CAST(percentile_cont(0.5) WITHIN GROUP (ORDER BY total_minutes) AS NUMERIC), 1) AS median_minutes
FROM medication_orders
GROUP BY unit
ORDER BY on_time_pct;

-- 4. Exception vs no exception
SELECT CASE WHEN exception_type = 'None' THEN 'No exception' ELSE 'Exception' END AS group_name,
       COUNT(*) AS orders,
       ROUND(100.0 * AVG(within_target), 1) AS on_time_pct
FROM medication_orders
GROUP BY 1;

-- 5. Exception types ranked by late orders
SELECT exception_type,
       COUNT(*) AS orders,
       SUM(1 - within_target) AS late_orders,
       ROUND(100.0 * AVG(within_target), 1) AS on_time_pct,
       ROUND(CAST(percentile_cont(0.5) WITHIN GROUP (ORDER BY total_minutes) AS NUMERIC), 1) AS median_minutes
FROM medication_orders
WHERE exception_type <> 'None'
GROUP BY exception_type
ORDER BY late_orders DESC;

-- 6. Share of all late orders that had an exception
SELECT SUM(1 - within_target) AS late_orders,
       SUM(CASE WHEN exception_type <> 'None' THEN 1 - within_target ELSE 0 END) AS late_with_exception
FROM medication_orders;
