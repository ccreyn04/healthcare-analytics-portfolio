-- Project 6: Go-Live Readiness Tracker (PostgreSQL)

CREATE TABLE test_scripts (script_id TEXT PRIMARY KEY, workflow TEXT, priority TEXT, round1_status TEXT,
                           final_status TEXT, tester_role TEXT, last_run DATE);
CREATE TABLE defects (defect_id TEXT PRIMARY KEY, script_id TEXT, workflow TEXT, severity TEXT, status TEXT, days_open INTEGER);
CREATE TABLE training_tracker (staff_id TEXT PRIMARY KEY, role TEXT, shift TEXT, training_completed INTEGER, competency_signoff INTEGER);
-- Load each CSV with pgAdmin Import/Export (header = on).

-- 1. Pass rate: round 1 vs final
SELECT COUNT(*) AS scripts,
       ROUND(100.0 * AVG(CASE WHEN round1_status = 'Pass' THEN 1 ELSE 0 END), 2) AS round1_pass_pct,
       ROUND(100.0 * AVG(CASE WHEN final_status  = 'Pass' THEN 1 ELSE 0 END), 2) AS final_pass_pct
FROM test_scripts;

-- 2. Pass rate by workflow
SELECT workflow, COUNT(*) AS scripts,
       ROUND(100.0 * AVG(CASE WHEN round1_status = 'Pass' THEN 1 ELSE 0 END), 1) AS round1_pass_pct,
       ROUND(100.0 * AVG(CASE WHEN final_status  = 'Pass' THEN 1 ELSE 0 END), 1) AS final_pass_pct
FROM test_scripts
GROUP BY workflow
ORDER BY final_pass_pct;

-- 3. Scripts that have not passed
SELECT script_id, workflow, priority, round1_status, final_status
FROM test_scripts
WHERE final_status <> 'Pass'
ORDER BY CASE priority WHEN 'Critical' THEN 1 WHEN 'High' THEN 2 ELSE 3 END, workflow;

-- 4. Open defects by severity
SELECT severity, status, COUNT(*) AS defects, ROUND(AVG(days_open), 1) AS avg_days_open
FROM defects
WHERE status IN ('Open', 'In progress', 'Fixed - pending retest')
GROUP BY severity, status
ORDER BY severity, status;

-- 5. Training completion and sign-off by role
SELECT role, COUNT(*) AS staff,
       ROUND(100.0 * AVG(training_completed), 1) AS training_pct,
       ROUND(100.0 * AVG(competency_signoff), 1) AS signoff_pct
FROM training_tracker
GROUP BY role
ORDER BY signoff_pct;

-- 6. Gate summary
WITH s AS (SELECT 100.0 * AVG(CASE WHEN final_status = 'Pass' THEN 1 ELSE 0 END) AS pass_pct FROM test_scripts),
     d AS (SELECT COUNT(*) AS open_crit_high FROM defects
           WHERE severity IN ('Critical', 'High') AND status IN ('Open', 'In progress')),
     t AS (SELECT 100.0 * AVG(training_completed) AS train_pct, 100.0 * AVG(competency_signoff) AS signoff_pct FROM training_tracker)
SELECT ROUND(s.pass_pct, 2) AS pass_pct, (s.pass_pct >= 95) AS pass_gate_met,
       d.open_crit_high,      (d.open_crit_high = 0)     AS defect_gate_met,
       ROUND(t.train_pct, 1) AS train_pct, (t.train_pct >= 90)   AS training_gate_met,
       ROUND(t.signoff_pct, 1) AS signoff_pct, (t.signoff_pct >= 90) AS signoff_gate_met
FROM s, d, t;
