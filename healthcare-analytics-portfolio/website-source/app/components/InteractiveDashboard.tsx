"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProjectKind } from "@/app/lib/projects";

type Row = Record<string, string>;
type FilterDefinition = { key: string; label: string };
type Metric = { label: string; value: string; note?: string };
type BarDatum = { label: string; value: number; display: string };
type TrendSeries = { name: string; color: string; values: number[] };

const PAGE_SIZE = 12;

const dashboardDefinitions: Record<
  ProjectKind,
  {
    filters: FilterDefinition[];
    columns: { key: string; label: string }[];
  }
> = {
  "revenue-cycle": {
    filters: [
      { key: "payer", label: "Payer" },
      { key: "location", label: "Location" },
      { key: "service_line", label: "Service line" },
      { key: "claim_status", label: "Claim status" },
    ],
    columns: [
      { key: "claim_id", label: "Claim ID" },
      { key: "date_of_service", label: "Service date" },
      { key: "payer", label: "Payer" },
      { key: "location", label: "Location" },
      { key: "service_line", label: "Service line" },
      { key: "allowed_amount", label: "Allowed" },
      { key: "paid_amount", label: "Paid" },
      { key: "claim_status", label: "Status" },
      { key: "days_in_ar", label: "Days A/R" },
    ],
  },
  "claims-denials": {
    filters: [
      { key: "payer", label: "Payer" },
      { key: "location", label: "Location" },
      { key: "service_line", label: "Service line" },
      { key: "denial_reason", label: "Denial reason" },
    ],
    columns: [
      { key: "claim_id", label: "Claim ID" },
      { key: "date_of_service", label: "Service date" },
      { key: "payer", label: "Payer" },
      { key: "service_line", label: "Service line" },
      { key: "denial_reason", label: "Denial reason" },
      { key: "allowed_amount", label: "Denied allowed" },
      { key: "days_in_ar", label: "Days A/R" },
    ],
  },
  "pharmacy-operations": {
    filters: [
      { key: "location", label: "Location" },
      { key: "priority", label: "Priority" },
      { key: "medication", label: "Medication" },
      { key: "controlled_substance", label: "Controlled substance" },
    ],
    columns: [
      { key: "order_id", label: "Order ID" },
      { key: "order_datetime", label: "Order date" },
      { key: "location", label: "Location" },
      { key: "medication", label: "Medication" },
      { key: "priority", label: "Priority" },
      { key: "turnaround_minutes", label: "Turnaround" },
      { key: "on_time", label: "On time" },
      { key: "controlled_substance", label: "Controlled" },
    ],
  },
  "prior-authorization": {
    filters: [
      { key: "payer", label: "Payer" },
      { key: "drug_class", label: "Drug class" },
      { key: "outcome", label: "Outcome" },
      { key: "age_bucket", label: "Case age" },
    ],
    columns: [
      { key: "pa_id", label: "PA ID" },
      { key: "submission_date", label: "Submitted" },
      { key: "payer", label: "Payer" },
      { key: "drug_class", label: "Drug class" },
      { key: "outcome", label: "Outcome" },
      { key: "days_to_decision", label: "Days / age" },
      { key: "estimated_savings", label: "Est. savings" },
    ],
  },
};

function parseCsv(text: string): Row[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [headers, ...body] = rows;
  return body.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])),
  );
}

const number = (value: string) => Number(value || 0);
const currency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
const percent = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(Number.isFinite(value) ? value : 0);
const decimal = (value: number, digits = 1) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(Number.isFinite(value) ? value : 0);
const count = (value: number) => new Intl.NumberFormat("en-US").format(value);
const average = (values: number[]) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

function ageBucket(row: Row) {
  const days = number(row.days_to_decision);
  if (days <= 5) return "0-5 days";
  if (days <= 10) return "6-10 days";
  return "11+ days";
}

function groupRows(rows: Row[], key: string) {
  const groups = new Map<string, Row[]>();
  rows.forEach((row) => {
    const label = row[key] || "Not specified";
    groups.set(label, [...(groups.get(label) ?? []), row]);
  });
  return groups;
}

function monthKey(value: string) {
  const date = new Date(value.replace(" ", "T"));
  return {
    key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
    label: date.toLocaleString("en-US", { month: "short", year: "numeric" }),
  };
}

function formatCell(key: string, value: string) {
  if (/(amount|paid|charge|allowed|savings)/i.test(key)) return currency(number(value));
  if (/(date|datetime)/i.test(key)) return value.slice(0, 10);
  if (key === "turnaround_minutes") return `${value} min`;
  return value || "—";
}

function BarChart({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle: string;
  data: BarDatum[];
}) {
  const maximum = Math.max(...data.map((item) => item.value), 1);
  return (
    <article className="chart-card">
      <div className="chart-heading">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <div className="bar-chart">
        {data.map((item) => (
          <div className="bar-row" key={item.label}>
            <span className="bar-label" title={item.label}>
              {item.label}
            </span>
            <div className="bar-track" aria-hidden="true">
              <span style={{ width: `${Math.max((item.value / maximum) * 100, 1.5)}%` }} />
            </div>
            <strong>{item.display}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function TrendChart({
  title,
  labels,
  series,
}: {
  title: string;
  labels: string[];
  series: TrendSeries[];
}) {
  const width = 640;
  const height = 250;
  const left = 46;
  const right = 18;
  const top = 24;
  const bottom = 44;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const x = (index: number) =>
    labels.length <= 1 ? left + chartWidth / 2 : left + (index / (labels.length - 1)) * chartWidth;
  const y = (value: number) => top + (1 - Math.max(0, Math.min(1, value))) * chartHeight;
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <article className="chart-card chart-wide">
      <div className="chart-heading chart-heading-inline">
        <div>
          <h3>{title}</h3>
          <p>Rates recalculate as filters change.</p>
        </div>
        <div className="chart-legend">
          {series.map((item) => (
            <span key={item.name}>
              <i style={{ background: item.color }} /> {item.name}
            </span>
          ))}
        </div>
      </div>
      <svg className="trend-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={left}
              x2={width - right}
              y1={y(tick)}
              y2={y(tick)}
              stroke="#dce5e9"
              strokeWidth="1"
            />
            <text x={left - 8} y={y(tick) + 4} textAnchor="end">
              {percent(tick)}
            </text>
          </g>
        ))}
        {series.map((item) => {
          const points = item.values.map((value, index) => `${x(index)},${y(value)}`).join(" ");
          return (
            <g key={item.name}>
              <polyline
                points={points}
                fill="none"
                stroke={item.color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {item.values.map((value, index) => (
                <circle
                  cx={x(index)}
                  cy={y(value)}
                  fill="#fff"
                  key={`${item.name}-${labels[index]}`}
                  r="4"
                  stroke={item.color}
                  strokeWidth="3"
                />
              ))}
            </g>
          );
        })}
        {labels.map((label, index) => (
          <text x={x(index)} y={height - 13} textAnchor="middle" key={label}>
            {label.replace(" 2026", "")}
          </text>
        ))}
      </svg>
    </article>
  );
}

function applyFilters(
  rows: Row[],
  filters: Record<string, string>,
  definitions: FilterDefinition[],
  excludeKeys: string[] = [],
) {
  return rows.filter((row) =>
    definitions.every(({ key }) => {
      if (excludeKeys.includes(key) || !filters[key]) return true;
      if (key === "age_bucket") return ageBucket(row) === filters[key];
      return row[key] === filters[key];
    }),
  );
}

export function InteractiveDashboard({
  kind,
  dataPath,
}: {
  kind: ProjectKind;
  dataPath: string;
}) {
  const definition = dashboardDefinitions[kind];
  const [rows, setRows] = useState<Row[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;
    fetch(dataPath)
      .then((response) => {
        if (!response.ok) throw new Error("Dataset could not be loaded.");
        return response.text();
      })
      .then((text) => {
        if (!active) return;
        setRows(parseCsv(text));
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [dataPath]);

  const options = useMemo(
    () =>
      Object.fromEntries(
        definition.filters.map(({ key }) => {
          if (key === "age_bucket") return [key, ["0-5 days", "6-10 days", "11+ days"]];
          return [
            key,
            [...new Set(rows.map((row) => row[key]).filter(Boolean))].sort((a, b) =>
              a.localeCompare(b),
            ),
          ];
        }),
      ) as Record<string, string[]>,
    [definition.filters, rows],
  );

  const baseRows = useMemo(
    () =>
      applyFilters(
        rows,
        filters,
        definition.filters,
        kind === "claims-denials" ? ["denial_reason"] : [],
      ),
    [definition.filters, filters, kind, rows],
  );

  const filteredRows = useMemo(() => {
    const selected = applyFilters(rows, filters, definition.filters);
    if (kind === "claims-denials") {
      return selected.filter((row) => row.claim_status === "Denied");
    }
    return selected;
  }, [definition.filters, filters, kind, rows]);

  const metrics = useMemo<Metric[]>(() => {
    if (kind === "revenue-cycle") {
      const allowed = sum(filteredRows.map((row) => number(row.allowed_amount)));
      const paid = sum(filteredRows.map((row) => number(row.paid_amount)));
      const denied = filteredRows.filter((row) => row.claim_status === "Denied");
      return [
        { label: "Claims", value: count(filteredRows.length) },
        {
          label: "Total charges",
          value: currency(sum(filteredRows.map((row) => number(row.charge_amount)))),
        },
        { label: "Allowed amount", value: currency(allowed) },
        { label: "Collected cash", value: currency(paid) },
        { label: "Collection rate", value: percent(allowed ? paid / allowed : 0) },
        { label: "Denial rate", value: percent(filteredRows.length ? denied.length / filteredRows.length : 0) },
        {
          label: "Denied allowed",
          value: currency(sum(denied.map((row) => number(row.allowed_amount)))),
        },
        {
          label: "Average A/R",
          value: `${decimal(average(filteredRows.map((row) => number(row.days_in_ar))))} days`,
        },
      ];
    }
    if (kind === "claims-denials") {
      return [
        { label: "Denied claims", value: count(filteredRows.length) },
        {
          label: "Denial rate",
          value: percent(baseRows.length ? filteredRows.length / baseRows.length : 0),
          note: "against selected full-claim denominator",
        },
        {
          label: "Denied allowed",
          value: currency(sum(filteredRows.map((row) => number(row.allowed_amount)))),
        },
        {
          label: "Avg denied A/R",
          value: `${decimal(average(filteredRows.map((row) => number(row.days_in_ar))))} days`,
        },
        {
          label: "Denied >90 days",
          value: count(filteredRows.filter((row) => number(row.days_in_ar) > 90).length),
        },
      ];
    }
    if (kind === "pharmacy-operations") {
      const onTime = filteredRows.filter((row) => row.on_time === "Yes");
      const stat = filteredRows.filter((row) => row.priority === "STAT");
      const scheduled = filteredRows.filter((row) => row.priority === "Scheduled");
      return [
        { label: "Orders", value: count(filteredRows.length) },
        {
          label: "Avg turnaround",
          value: `${decimal(average(filteredRows.map((row) => number(row.turnaround_minutes))))} min`,
        },
        {
          label: "On-time rate",
          value: percent(filteredRows.length ? onTime.length / filteredRows.length : 0),
        },
        { label: "Late orders", value: count(filteredRows.length - onTime.length) },
        {
          label: "STAT on time",
          value: percent(stat.length ? stat.filter((row) => row.on_time === "Yes").length / stat.length : 0),
        },
        {
          label: "Scheduled on time",
          value: percent(
            scheduled.length
              ? scheduled.filter((row) => row.on_time === "Yes").length / scheduled.length
              : 0,
          ),
        },
        {
          label: "Controlled orders",
          value: count(filteredRows.filter((row) => row.controlled_substance === "Yes").length),
        },
      ];
    }
    const approved = filteredRows.filter((row) => row.outcome === "Approved");
    const nonPending = filteredRows.filter((row) => row.outcome !== "Pending");
    const active = filteredRows.filter((row) => ["Pending", "Appealed"].includes(row.outcome));
    return [
      { label: "Cases", value: count(filteredRows.length) },
      { label: "Approved cases", value: count(approved.length) },
      {
        label: "Approval share",
        value: percent(nonPending.length ? approved.length / nonPending.length : 0),
        note: "approved ÷ all non-pending cases",
      },
      { label: "Active backlog", value: count(active.length) },
      {
        label: "Avg decision / age",
        value: `${decimal(average(filteredRows.map((row) => number(row.days_to_decision))))} days`,
      },
      {
        label: "Savings protected",
        value: currency(sum(filteredRows.map((row) => number(row.estimated_savings)))),
      },
      {
        label: "Pending >10 days",
        value: count(
          filteredRows.filter(
            (row) => row.outcome === "Pending" && number(row.days_to_decision) > 10,
          ).length,
        ),
      },
    ];
  }, [baseRows, filteredRows, kind]);

  const charts = useMemo(() => {
    if (kind === "revenue-cycle") {
      const payer = [...groupRows(filteredRows, "payer")]
        .map(([label, group]) => {
          const allowed = sum(group.map((row) => number(row.allowed_amount)));
          const value = allowed ? sum(group.map((row) => number(row.paid_amount))) / allowed : 0;
          return { label, value, display: percent(value) };
        })
        .sort((a, b) => b.value - a.value);
      const denials = filteredRows.filter((row) => row.claim_status === "Denied");
      const reason = [...groupRows(denials, "denial_reason")]
        .map(([label, group]) => {
          const value = sum(group.map((row) => number(row.allowed_amount)));
          return { label, value, display: currency(value) };
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);
      const monthly = new Map<string, { label: string; rows: Row[] }>();
      filteredRows.forEach((row) => {
        const month = monthKey(row.date_of_service);
        const existing = monthly.get(month.key);
        monthly.set(month.key, { label: month.label, rows: [...(existing?.rows ?? []), row] });
      });
      const ordered = [...monthly].sort(([a], [b]) => a.localeCompare(b));
      return {
        bars: [
          { title: "Collection rate by payer", subtitle: "Paid ÷ allowed", data: payer },
          { title: "Denied value by reason", subtitle: "Allowed dollars at risk", data: reason },
        ],
        trend: {
          title: "Monthly performance trend",
          labels: ordered.map(([, value]) => value.label),
          series: [
            {
              name: "Collection rate",
              color: "#0f7281",
              values: ordered.map(([, value]) => {
                const allowed = sum(value.rows.map((row) => number(row.allowed_amount)));
                return allowed ? sum(value.rows.map((row) => number(row.paid_amount))) / allowed : 0;
              }),
            },
            {
              name: "Denial rate",
              color: "#ef7a2d",
              values: ordered.map(([, value]) =>
                value.rows.length
                  ? value.rows.filter((row) => row.claim_status === "Denied").length / value.rows.length
                  : 0,
              ),
            },
          ],
        },
      };
    }

    if (kind === "claims-denials") {
      const makeDollarBars = (key: string) =>
        [...groupRows(filteredRows, key)]
          .map(([label, group]) => {
            const value = sum(group.map((row) => number(row.allowed_amount)));
            return { label, value, display: currency(value) };
          })
          .sort((a, b) => b.value - a.value)
          .slice(0, 8);
      return {
        bars: [
          {
            title: "Denied value by reason",
            subtitle: "Financial exposure, not claim count alone",
            data: makeDollarBars("denial_reason"),
          },
          {
            title: "Denied value by payer",
            subtitle: "Selected denied allowed amount",
            data: makeDollarBars("payer"),
          },
          {
            title: "Denied value by service line",
            subtitle: "Operational concentration",
            data: makeDollarBars("service_line"),
          },
        ],
      };
    }

    if (kind === "pharmacy-operations") {
      const rateBars = (key: string, matcher: (row: Row) => boolean) =>
        [...groupRows(filteredRows, key)]
          .map(([label, group]) => {
            const value = group.length ? group.filter(matcher).length / group.length : 0;
            return { label, value, display: percent(value) };
          })
          .sort((a, b) => b.value - a.value);
      const turnaround = [...groupRows(filteredRows, "priority")]
        .map(([label, group]) => {
          const value = average(group.map((row) => number(row.turnaround_minutes)));
          return { label, value, display: `${decimal(value)} min` };
        })
        .sort((a, b) => a.value - b.value);
      const lateMedication = rateBars("medication", (row) => row.on_time === "No")
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);
      return {
        bars: [
          {
            title: "On-time rate by location",
            subtitle: "Higher is stronger",
            data: rateBars("location", (row) => row.on_time === "Yes"),
          },
          {
            title: "Average turnaround by priority",
            subtitle: "Minutes from order to completion",
            data: turnaround,
          },
          {
            title: "Late-order rate by medication",
            subtitle: "Top eight exception rates",
            data: lateMedication,
          },
        ],
      };
    }

    const outcome = [...groupRows(filteredRows, "outcome")]
      .map(([label, group]) => ({ label, value: group.length, display: count(group.length) }))
      .sort((a, b) => b.value - a.value);
    const payer = [...groupRows(filteredRows, "payer")]
      .map(([label, group]) => {
        const nonPending = group.filter((row) => row.outcome !== "Pending");
        const value = nonPending.length
          ? group.filter((row) => row.outcome === "Approved").length / nonPending.length
          : 0;
        return { label, value, display: percent(value) };
      })
      .sort((a, b) => b.value - a.value);
    const savings = [...groupRows(filteredRows, "drug_class")]
      .map(([label, group]) => {
        const value = sum(group.map((row) => number(row.estimated_savings)));
        return { label, value, display: currency(value) };
      })
      .sort((a, b) => b.value - a.value);
    return {
      bars: [
        { title: "Outcome mix", subtitle: "Cases by current disposition", data: outcome },
        { title: "Approval share by payer", subtitle: "Approved ÷ non-pending", data: payer },
        { title: "Savings protected by drug class", subtitle: "Simulated portfolio value", data: savings },
      ],
    };
  }, [filteredRows, kind]);

  const searchedRows = useMemo(() => {
    if (!search.trim()) return filteredRows;
    const needle = search.toLowerCase();
    return filteredRows.filter((row) =>
      Object.values(row).some((value) => value.toLowerCase().includes(needle)),
    );
  }, [filteredRows, search]);

  const pageCount = Math.max(1, Math.ceil(searchedRows.length / PAGE_SIZE));
  const pageRows = searchedRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (status === "loading") {
    return <div className="dashboard-state">Loading the full project dataset…</div>;
  }
  if (status === "error") {
    return (
      <div className="dashboard-state dashboard-error">
        The interactive dataset could not be loaded. The downloadable files remain available below.
      </div>
    );
  }

  return (
    <div className="interactive-dashboard">
      <div className="dashboard-toolbar">
        <div>
          <span className="section-label">Interactive evidence</span>
          <h2>Filter the full analysis</h2>
          <p>
            Showing {count(filteredRows.length)} of {count(rows.length)} source records.
          </p>
        </div>
        <button
          className="button button-quiet"
          onClick={() => setFilters({})}
          type="button"
        >
          Reset filters
        </button>
      </div>

      <div className="filter-grid">
        {definition.filters.map(({ key, label }) => (
          <label key={key}>
            <span>{label}</span>
            <select
              onChange={(event) => {
                setFilters((current) => ({ ...current, [key]: event.target.value }));
                setPage(1);
              }}
              value={filters[key] ?? ""}
            >
              <option value="">All {label.toLowerCase()}s</option>
              {options[key]?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="kpi-grid">
        {metrics.map((metric) => (
          <article className="kpi-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            {metric.note && <small>{metric.note}</small>}
          </article>
        ))}
      </div>

      <div className="charts-grid">
        {charts.bars.map((chart) => (
          <BarChart
            data={chart.data}
            key={chart.title}
            subtitle={chart.subtitle}
            title={chart.title}
          />
        ))}
        {"trend" in charts && charts.trend && (
          <TrendChart
            labels={charts.trend.labels}
            series={charts.trend.series}
            title={charts.trend.title}
          />
        )}
      </div>

      <section className="evidence-table" aria-labelledby="evidence-heading">
        <div className="evidence-heading">
          <div>
            <span className="section-label">Row-level audit trail</span>
            <h3 id="evidence-heading">Searchable source evidence</h3>
          </div>
          <label>
            <span className="sr-only">Search records</span>
            <input
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search the filtered records"
              type="search"
              value={search}
            />
          </label>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {definition.columns.map((column) => (
                  <th key={column.key} scope="col">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, rowIndex) => (
                <tr key={row.claim_id ?? row.order_id ?? row.pa_id ?? rowIndex}>
                  {definition.columns.map((column) => (
                    <td key={column.key}>{formatCell(column.key, row[column.key])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-pager">
          <span>
            {count(searchedRows.length)} matching records · Page {page} of {pageCount}
          </span>
          <div>
            <button
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              type="button"
            >
              Previous
            </button>
            <button
              disabled={page >= pageCount}
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
