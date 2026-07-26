(function () {
  const A = window.PortfolioAnalytics;
  const approved = (row) => row.outcome === "Approved";
  const active = (row) => row.outcome === "Pending" || row.outcome === "Appealed";

  window.PROJECT_CONFIG = {
    dataUrl: window.PROJECT_DATA_URL,
    filters: [
      { key: "payer", label: "Payers" },
      { key: "drug_class", label: "Drug Classes" },
      { key: "outcome", label: "Outcomes" }
    ],
    kpis: [
      { label: "Total Cases", value: (rows) => rows.length, format: "count" },
      { label: "Approved Cases", value: (rows) => rows.filter(approved).length, format: "count" },
      {
        label: "Approval Share",
        value: (rows) => {
          const nonPending = rows.filter((row) => row.outcome !== "Pending");
          return A.percent(nonPending.filter(approved).length, nonPending.length);
        },
        format: "percentage"
      },
      { label: "Active Backlog", value: (rows) => rows.filter(active).length, format: "count" },
      { label: "Average Decision / Age", value: (rows) => A.average(rows, "days_to_decision"), format: (v) => `${A.formats.decimal(v)} days` },
      { label: "Savings Protected", value: (rows) => A.sum(rows, "estimated_savings"), format: "currency" },
      {
        label: "Pending >10 Days",
        value: (rows) =>
          rows.filter(
            (row) => row.outcome === "Pending" && A.number(row.days_to_decision) > 10
          ).length,
        format: "count"
      }
    ],
    charts: [
      {
        title: "Approval Share by Payer",
        note: "Approved cases divided by non-pending cases, including appeals.",
        groupBy: "payer",
        value: (rows) => {
          const nonPending = rows.filter((row) => row.outcome !== "Pending");
          return A.percent(nonPending.filter(approved).length, nonPending.length);
        },
        format: "percentage"
      },
      {
        title: "Savings Protected by Drug Class",
        note: "Estimated value associated with approved and appealed access work.",
        groupBy: "drug_class",
        value: (rows) => A.sum(rows, "estimated_savings"),
        format: "currency"
      },
      {
        title: "Case Volume by Outcome",
        note: "Displays the current authorization outcome mix.",
        groupBy: "outcome",
        value: (rows) => rows.length,
        format: "count"
      }
    ],
    columns: [
      { key: "pa_id", label: "PA ID" },
      { key: "submission_date", label: "Submission Date" },
      { key: "payer", label: "Payer" },
      { key: "drug_class", label: "Drug Class" },
      { key: "outcome", label: "Outcome" },
      { key: "days_to_decision", label: "Decision / Age", format: (v) => `${A.formats.count(v)} days` },
      { key: "estimated_savings", label: "Estimated Savings", format: "currency2" }
    ]
  };
})();
