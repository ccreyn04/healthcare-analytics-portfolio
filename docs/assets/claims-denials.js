(function () {
  const A = window.PortfolioAnalytics;

  window.PROJECT_CONFIG = {
    dataUrl: "../project-files/claims-denials/revenue_cycle_claims_sample.csv",
    baseFilter: (row) => row.claim_status === "Denied",
    filters: [
      { key: "payer", label: "Payers" },
      { key: "location", label: "Locations" },
      { key: "service_line", label: "Service Lines" },
      { key: "denial_reason", label: "Denial Reasons" }
    ],
    kpis: [
      { label: "Denied Claims", value: (rows) => rows.length, format: "count" },
      { label: "Denied Allowed", value: (rows) => A.sum(rows, "allowed_amount"), format: "currency" },
      { label: "Average Denied Days in A/R", value: (rows) => A.average(rows, "days_in_ar"), format: "decimal" },
      {
        label: "Denied Claims >90 Days",
        value: (rows) => rows.filter((row) => A.number(row.days_in_ar) > 90).length,
        format: "count"
      }
    ],
    charts: [
      {
        title: "Denied Allowed Amount by Reason",
        note: "Ranks denial causes by the dollars at risk.",
        groupBy: "denial_reason",
        value: (rows) => A.sum(rows, "allowed_amount"),
        format: "currency"
      },
      {
        title: "Denied Allowed Amount by Payer",
        note: "Shows where payer-specific recovery and prevention work is concentrated.",
        groupBy: "payer",
        value: (rows) => A.sum(rows, "allowed_amount"),
        format: "currency"
      },
      {
        title: "Denied Allowed Amount by Service Line",
        note: "Surfaces the service lines with the greatest denied-value exposure.",
        groupBy: "service_line",
        value: (rows) => A.sum(rows, "allowed_amount"),
        format: "currency"
      }
    ],
    columns: [
      { key: "claim_id", label: "Claim ID" },
      { key: "date_of_service", label: "Service Date" },
      { key: "payer", label: "Payer" },
      { key: "location", label: "Location" },
      { key: "service_line", label: "Service Line" },
      { key: "denial_reason", label: "Denial Reason" },
      { key: "allowed_amount", label: "Denied Allowed", format: "currency2" },
      { key: "days_in_ar", label: "Days in A/R", format: "count" }
    ]
  };
})();
