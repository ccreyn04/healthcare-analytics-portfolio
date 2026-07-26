(function () {
  const A = window.PortfolioAnalytics;
  const onTime = (row) => row.on_time === "Yes";

  window.PROJECT_CONFIG = {
    dataUrl: window.PROJECT_DATA_URL,
    filters: [
      { key: "location", label: "Locations" },
      { key: "priority", label: "Priorities" },
      { key: "medication", label: "Medications" },
      { key: "controlled_substance", label: "Controlled Statuses" }
    ],
    kpis: [
      { label: "Total Orders", value: (rows) => rows.length, format: "count" },
      { label: "Average Turnaround", value: (rows) => A.average(rows, "turnaround_minutes"), format: (v) => `${A.formats.decimal(v)} min` },
      {
        label: "On-Time Rate",
        value: (rows) => A.percent(rows.filter(onTime).length, rows.length),
        format: "percentage"
      },
      { label: "Late Orders", value: (rows) => rows.filter((row) => !onTime(row)).length, format: "count" },
      {
        label: "STAT On-Time",
        value: (rows) => {
          const stat = rows.filter((row) => row.priority === "STAT");
          return A.percent(stat.filter(onTime).length, stat.length);
        },
        format: "percentage"
      },
      {
        label: "Controlled Orders",
        value: (rows) => rows.filter((row) => row.controlled_substance === "Yes").length,
        format: "count"
      }
    ],
    charts: [
      {
        title: "Average Turnaround by Priority",
        note: "Average minutes from order to completion.",
        groupBy: "priority",
        value: (rows) => A.average(rows, "turnaround_minutes"),
        format: (value) => `${A.formats.decimal(value)} min`
      },
      {
        title: "On-Time Performance by Location",
        note: "Compares workflow reliability across care settings.",
        groupBy: "location",
        value: (rows) => A.percent(rows.filter(onTime).length, rows.length),
        format: "percentage"
      },
      {
        title: "Late Order Rate by Medication",
        note: "Highlights medications with recurring turnaround exceptions.",
        groupBy: "medication",
        value: (rows) => A.percent(rows.filter((row) => !onTime(row)).length, rows.length),
        format: "percentage",
        limit: 10
      }
    ],
    columns: [
      { key: "order_id", label: "Order ID" },
      { key: "order_datetime", label: "Order Date/Time" },
      { key: "location", label: "Location" },
      { key: "medication", label: "Medication" },
      { key: "priority", label: "Priority" },
      { key: "turnaround_minutes", label: "Turnaround", format: (v) => `${A.formats.count(v)} min` },
      { key: "on_time", label: "On Time" },
      { key: "controlled_substance", label: "Controlled" }
    ]
  };
})();
