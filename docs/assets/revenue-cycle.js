(function () {
  const A = window.PortfolioAnalytics;
  const denied = (row) => row.claim_status === "Denied";

  window.PROJECT_CONFIG = {
    dataUrl: window.PROJECT_DATA_URL,
    filters: [
      { key: "payer", label: "Payers" },
      { key: "location", label: "Locations" },
      { key: "service_line", label: "Service Lines" },
      { key: "claim_status", label: "Claim Statuses" }
    ],
    kpis: [
      { label: "Total Claims", value: (rows) => rows.length, format: "count" },
      { label: "Total Charges", value: (rows) => A.sum(rows, "charge_amount"), format: "currency" },
      { label: "Allowed Amount", value: (rows) => A.sum(rows, "allowed_amount"), format: "currency" },
      { label: "Collected Cash", value: (rows) => A.sum(rows, "paid_amount"), format: "currency" },
      {
        label: "Collection Rate",
        value: (rows) => A.percent(A.sum(rows, "paid_amount"), A.sum(rows, "allowed_amount")),
        format: "percentage"
      },
      {
        label: "Denial Rate",
        value: (rows) => A.percent(rows.filter(denied).length, rows.length),
        format: "percentage"
      },
      { label: "Average Days in A/R", value: (rows) => A.average(rows, "days_in_ar"), format: "decimal" },
      {
        label: "Denied Allowed",
        value: (rows) => A.sum(rows.filter(denied), "allowed_amount"),
        format: "currency"
      }
    ],
    charts: [
      {
        title: "Collection Rate by Payer",
        note: "Paid amount divided by allowed amount for the filtered records.",
        groupBy: "payer",
        value: (rows) => A.percent(A.sum(rows, "paid_amount"), A.sum(rows, "allowed_amount")),
        format: "percentage"
      },
      {
        title: "Denied Revenue at Risk by Reason",
        note: "Denied allowed amount prioritizes financial exposure—not volume alone.",
        groupBy: "denial_reason",
        filter: denied,
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
      { key: "charge_amount", label: "Charge", format: "currency2" },
      { key: "allowed_amount", label: "Allowed", format: "currency2" },
      { key: "paid_amount", label: "Paid", format: "currency2" },
      { key: "claim_status", label: "Status" },
      { key: "denial_reason", label: "Denial Reason" },
      { key: "days_in_ar", label: "Days in A/R", format: "count" }
    ]
  };
})();
