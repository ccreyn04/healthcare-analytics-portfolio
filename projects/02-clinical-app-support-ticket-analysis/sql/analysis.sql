-- Project 2: Clinical Application Support Ticket Analysis (PostgreSQL)

CREATE TABLE support_tickets (
  ticket_id TEXT PRIMARY KEY, opened_at TIMESTAMP, resolved_at TIMESTAMP, priority TEXT, category TEXT,
  application_area TEXT, root_cause TEXT, resolution_type TEXT, support_tier TEXT, kb_article_available TEXT,
  post_upgrade_week INTEGER, resolution_hours NUMERIC, sla_target_hours INTEGER, sla_met INTEGER, reopened INTEGER
);
-- Load the CSV with pgAdmin: right-click the table > Import/Export Data > select support_tickets.csv, header = on.

-- 0. Validation: row count and bad timestamps
SELECT COUNT(*) AS tickets,
       SUM(CASE WHEN resolved_at < opened_at THEN 1 ELSE 0 END) AS bad_timestamps
FROM support_tickets;

-- 1. SLA by priority
SELECT priority, COUNT(*) AS tickets,
       ROUND(100.0 * AVG(sla_met), 1) AS sla_pct,
       ROUND(CAST(percentile_cont(0.5) WITHIN GROUP (ORDER BY resolution_hours) AS NUMERIC), 1) AS median_hours
FROM support_tickets
GROUP BY priority
ORDER BY priority;

-- 2. Category: volume, SLA, total elapsed hours
SELECT category, COUNT(*) AS tickets,
       ROUND(100.0 * AVG(sla_met), 1) AS sla_pct,
       ROUND(SUM(resolution_hours)) AS total_elapsed_hours
FROM support_tickets
GROUP BY category
ORDER BY sla_pct;

-- 3. Support tier performance
SELECT support_tier, COUNT(*) AS tickets,
       ROUND(100.0 * AVG(sla_met), 1) AS sla_pct,
       ROUND(CAST(percentile_cont(0.5) WITHIN GROUP (ORDER BY resolution_hours) AS NUMERIC), 1) AS median_hours
FROM support_tickets
GROUP BY support_tier
ORDER BY support_tier;

-- 4. Weekly volume and SLA (shows the post-upgrade surge)
SELECT date_trunc('week', opened_at)::date AS week_start, COUNT(*) AS tickets,
       ROUND(100.0 * AVG(sla_met), 1) AS sla_pct
FROM support_tickets
GROUP BY 1
ORDER BY tickets DESC
LIMIT 5;

-- 5. Post-upgrade week vs all other weeks
SELECT post_upgrade_week, COUNT(*) AS tickets, ROUND(100.0 * AVG(sla_met), 1) AS sla_pct
FROM support_tickets
GROUP BY post_upgrade_week;

-- 6. User knowledge gaps and knowledge article coverage
SELECT kb_article_available, COUNT(*) AS tickets, ROUND(SUM(resolution_hours)) AS elapsed_hours
FROM support_tickets
WHERE root_cause = 'User knowledge gap'
GROUP BY kb_article_available;

-- 7. Reopen rate by resolution type
SELECT resolution_type, COUNT(*) AS tickets, ROUND(100.0 * AVG(reopened), 1) AS reopen_pct
FROM support_tickets
GROUP BY resolution_type
ORDER BY reopen_pct DESC;
