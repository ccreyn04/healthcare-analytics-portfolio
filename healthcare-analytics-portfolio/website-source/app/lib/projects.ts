export type ProjectKind =
  | "revenue-cycle"
  | "claims-denials"
  | "pharmacy-operations"
  | "prior-authorization";

export type ProjectConfig = {
  slug: ProjectKind;
  number: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  lead: string;
  question: string;
  evidence: string[];
  tools: string[];
  preview: string;
  dataPath: string;
  methodology: string[];
  findings: string[];
  recommendations: string[];
  limitations: string[];
  downloads: {
    label: string;
    description: string;
    href: string;
  }[];
};

export const projects: Record<ProjectKind, ProjectConfig> = {
  "revenue-cycle": {
    slug: "revenue-cycle",
    number: "01",
    title: "Revenue Cycle Executive Dashboard",
    shortTitle: "Revenue Cycle",
    eyebrow: "Financial performance and reimbursement",
    lead:
      "A six-month claims analysis designed to show where cash capture, payer variation, denial friction, and accounts-receivable risk require leadership attention.",
    question:
      "How can a healthcare organization quickly identify where claims performance and reimbursement risk require operational attention?",
    evidence: [
      "2,000 synthetic claims across six payers, five locations, and six service lines.",
      "Interactive filters for payer, location, service line, and claim status.",
      "KPI logic for charges, allowed amount, payments, collection rate, denials, and A/R.",
      "Formula-driven Excel workbook, PostgreSQL query pack, and searchable row-level evidence.",
    ],
    tools: ["SQL", "Excel", "KPI design", "Revenue cycle", "Data storytelling"],
    preview: "/dashboards/revenue-cycle-dashboard.png",
    dataPath: "/data/revenue_cycle_claims.csv",
    methodology: [
      "Defined each financial and operational KPI before examining the data.",
      "Validated record counts, dates, categorical values, and numeric fields.",
      "Segmented performance by payer, service line, location, claim status, and month.",
      "Separated volume, rate, dollars, and aging so priorities were not based on counts alone.",
      "Converted findings into an accountable 30/60/90-day operating recommendation.",
    ],
    findings: [
      "The portfolio sample contains $5.68M in charges, $3.20M in allowed value, and $2.10M in collected cash.",
      "Overall collection performance is 65.6% against allowed amount.",
      "349 denied claims represent $531,071 in denied allowed value.",
      "Payer collection and denial performance varies materially, supporting payer-specific scorecards.",
    ],
    recommendations: [
      "Create a weekly payer scorecard combining denial rate, collection rate, A/R, and denied dollars.",
      "Prioritize high-dollar denied workqueues rather than using claim volume alone.",
      "Implement pre-bill edits for recurring authorization, eligibility, documentation, and coding defects.",
      "Assign owners and measurable targets for denial prevention and aging reduction.",
    ],
    limitations: [
      "The dataset is synthetic and does not represent a real hospital or payer contract.",
      "The data does not include provider, staffing, patient, contract, or clinical-acuity detail.",
      "Allowed and paid amounts are simulated and should not be treated as guaranteed recoveries.",
      "A production build would require governed definitions, access controls, scheduled refreshes, and source-system reconciliation.",
    ],
    downloads: [
      {
        label: "Download dashboard image",
        description: "Executive dashboard PNG for LinkedIn or interview follow-up.",
        href: "/dashboards/revenue-cycle-dashboard.png",
      },
      {
        label: "Download project dataset",
        description: "2,000 synthetic, PHI-free claims in CSV format.",
        href: "/project-files/revenue-cycle/revenue_cycle_claims.csv",
      },
      {
        label: "Download SQL analysis",
        description: "PostgreSQL queries for executive KPIs, payer performance, and trends.",
        href: "/project-files/revenue-cycle/revenue_cycle_analysis.sql",
      },
      {
        label: "Download Excel workbook",
        description: "Formula-driven dashboards, charts, raw data, and data dictionary.",
        href: "/downloads/Cierra_Healthcare_Analytics_Portfolio_Workbook.xlsx",
      },
    ],
  },
  "claims-denials": {
    slug: "claims-denials",
    number: "02",
    title: "Claims Denial Root-Cause Analysis",
    shortTitle: "Claims Denials",
    eyebrow: "Revenue integrity and prevention",
    lead:
      "A focused revenue-integrity case study that ranks denials by financial exposure, frequency, payer, service line, and A/R aging.",
    question:
      "Which denial drivers should be addressed first when both financial impact and operational preventability matter?",
    evidence: [
      "349 denied claims isolated from the complete 2,000-claim source dataset.",
      "Interactive filters for payer, location, service line, and denial reason.",
      "Separate views of denial count, rate, denied allowed value, and aging.",
      "Searchable evidence table plus reusable denial-analysis SQL.",
    ],
    tools: ["SQL", "Root-cause analysis", "Revenue integrity", "Excel", "Risk prioritization"],
    preview: "/dashboards/claims-denial-dashboard.png",
    dataPath: "/data/revenue_cycle_claims.csv",
    methodology: [
      "Isolated denied claims while retaining the full sample as the denominator for rates.",
      "Reconciled denial counts and dollars back to the executive revenue-cycle totals.",
      "Ranked reasons using both frequency and denied allowed value.",
      "Compared payer and service-line exposure while retaining A/R aging context.",
      "Mapped repeatable causes to practical prevention ownership.",
    ],
    findings: [
      "The overall denial rate is 17.5%, representing 349 claims.",
      "Medical Necessity is the highest-dollar denial category at approximately $87,983.",
      "Denied claims average 86.5 days in A/R, with 169 claims older than 90 days.",
      "Pharmacy contributes 113 denied claims, linking frontline medication workflows to revenue integrity.",
    ],
    recommendations: [
      "Use a two-axis priority matrix: denied dollars at risk and repeatable preventability.",
      "Develop denial-specific playbooks for medical necessity, coding, authorization, COB, and documentation.",
      "Track first-pass prevention separately from back-end recovery.",
      "Review denied claims over 90 A/R days weekly with named owners and disposition reasons.",
    ],
    limitations: [
      "The synthetic data does not contain payer policy text, contract terms, or appeal outcomes.",
      "Denied allowed value measures exposure, not guaranteed collectible cash.",
      "The sample does not attribute errors to an individual, team, or real organization.",
      "A production analysis would add denial codes, root-cause ownership, appeal status, and recovery dates.",
    ],
    downloads: [
      {
        label: "Download dashboard image",
        description: "Denial-analysis PNG for LinkedIn or interview follow-up.",
        href: "/dashboards/claims-denial-dashboard.png",
      },
      {
        label: "Download source dataset",
        description: "Full claims CSV used for denominator-based denial rates.",
        href: "/project-files/claims-denials/revenue_cycle_claims.csv",
      },
      {
        label: "Download SQL analysis",
        description: "Denial-reason, payer-rate, and service-line queries.",
        href: "/project-files/claims-denials/claims_denial_analysis.sql",
      },
      {
        label: "Download Excel workbook",
        description: "Denial scorecard, formula logic, charts, and raw data.",
        href: "/downloads/Cierra_Healthcare_Analytics_Portfolio_Workbook.xlsx",
      },
    ],
  },
  "pharmacy-operations": {
    slug: "pharmacy-operations",
    number: "03",
    title: "Pharmacy Operations Dashboard",
    shortTitle: "Pharmacy Operations",
    eyebrow: "Turnaround, reliability, and workflow",
    lead:
      "An operational-performance case study measuring medication turnaround, on-time reliability, priority queues, location variation, and recurring workflow exceptions.",
    question:
      "Where are medication-order turnaround and on-time performance strong, and where should pharmacy leadership investigate workflow bottlenecks?",
    evidence: [
      "1,200 synthetic medication orders across five care locations.",
      "Interactive filters for location, priority, medication, and controlled-substance status.",
      "KPIs for turnaround, on-time performance, late volume, STAT reliability, and exceptions.",
      "Searchable order evidence plus a PostgreSQL query pack.",
    ],
    tools: ["Pharmacy operations", "Workflow analysis", "SQL", "Excel", "Performance improvement"],
    preview: "/dashboards/pharmacy-operations-dashboard.png",
    dataPath: "/data/pharmacy_operations.csv",
    methodology: [
      "Defined priority-specific operational measures before analysis.",
      "Validated order timestamps, locations, priority values, medications, and completion flags.",
      "Compared volume, average turnaround, on-time rate, and late-order count.",
      "Segmented exceptions by priority, location, medication, and controlled-substance status.",
      "Separated scheduled-order improvement opportunities from STAT reliability.",
    ],
    findings: [
      "Overall on-time performance is 92.1% with average turnaround of 57.5 minutes.",
      "STAT orders achieve 94.8% on-time performance.",
      "Scheduled orders have the weakest on-time rate at 80.2%.",
      "Women & Children has the lowest location-level on-time rate; Outpatient Infusion performs best.",
    ],
    recommendations: [
      "Create a daily late-order exception report by location, priority, and medication.",
      "Review scheduled-order batching, due-time logic, and staffing overlap before changing STAT workflows.",
      "Use a standardized turnaround definition separating order-entry delay from pharmacy processing time.",
      "Set location-specific targets and require documented root causes for recurring exceptions.",
    ],
    limitations: [
      "The data is synthetic and does not represent a real medication-order system.",
      "No staffing, acuity, clinical urgency, preparation complexity, or delivery-route fields are included.",
      "On-time status uses simulated targets and should not be interpreted as a clinical standard.",
      "A production build would reconcile Epic, dispensing, preparation, and delivery timestamps.",
    ],
    downloads: [
      {
        label: "Download dashboard image",
        description: "Pharmacy-operations PNG for LinkedIn or interview follow-up.",
        href: "/dashboards/pharmacy-operations-dashboard.png",
      },
      {
        label: "Download project dataset",
        description: "1,200 synthetic, PHI-free medication orders.",
        href: "/project-files/pharmacy-operations/pharmacy_operations.csv",
      },
      {
        label: "Download SQL analysis",
        description: "Overall, priority, and location-performance queries.",
        href: "/project-files/pharmacy-operations/pharmacy_operations_analysis.sql",
      },
      {
        label: "Download Excel workbook",
        description: "Pharmacy dashboard, summary formulas, charts, and raw data.",
        href: "/downloads/Cierra_Healthcare_Analytics_Portfolio_Workbook.xlsx",
      },
    ],
  },
  "prior-authorization": {
    slug: "prior-authorization",
    number: "04",
    title: "Prior Authorization Access Dashboard",
    shortTitle: "Prior Authorization",
    eyebrow: "Patient access and payer strategy",
    lead:
      "A patient-access and reimbursement case study tracking approvals, appeals, pending workload, case age, payer variation, therapy mix, and simulated savings protected.",
    question:
      "How can a pharmacy access team prioritize authorization work to reduce delay, improve approval performance, and protect high-cost therapy access?",
    evidence: [
      "700 synthetic authorization cases spanning five payers and eight drug classes.",
      "Interactive filters for payer, drug class, outcome, and case-age bucket.",
      "KPIs for approval share, active backlog, aging, decision time, and simulated value protected.",
      "Searchable case evidence plus reusable PostgreSQL analysis.",
    ],
    tools: ["Prior authorization", "Patient access", "SQL", "Excel", "Payer analytics"],
    preview: "/dashboards/prior-authorization-dashboard.png",
    dataPath: "/data/prior_authorizations.csv",
    methodology: [
      "Defined approved, denied, pending, and appealed outcomes explicitly.",
      "Calculated approval share against all non-pending cases, including active appeals.",
      "Segmented access performance by payer, drug class, outcome, and age bucket.",
      "Separated closed-case decision time from active-case aging in the narrative.",
      "Combined clinical-access urgency with simulated financial impact for prioritization.",
    ],
    findings: [
      "Approved cases represent 67.7% of all non-pending cases.",
      "The active backlog contains 149 pending or appealed cases.",
      "There are 41 pending cases older than 10 days.",
      "Total simulated savings protected is approximately $2.36M, with meaningful payer variation.",
    ],
    recommendations: [
      "Age active cases into 0-5, 6-10, and 11+ day workqueues with escalating ownership.",
      "Create payer- and drug-class-specific documentation checklists for high-cost therapies.",
      "Measure approval share, appeal overturns, time-to-therapy, and abandoned cases separately.",
      "Prioritize high-value cases using clinical urgency, age, and potential financial impact—not value alone.",
    ],
    limitations: [
      "The data is synthetic and does not represent actual payer or patient outcomes.",
      "Estimated savings is simulated portfolio value and not guaranteed revenue or patient savings.",
      "The sample does not include clinical urgency, documentation completeness, or abandonment.",
      "A production build would add payer rules, submission channel, owner, timestamps, and final appeal disposition.",
    ],
    downloads: [
      {
        label: "Download dashboard image",
        description: "Prior-authorization PNG for LinkedIn or interview follow-up.",
        href: "/dashboards/prior-authorization-dashboard.png",
      },
      {
        label: "Download project dataset",
        description: "700 synthetic authorization cases in CSV format.",
        href: "/project-files/prior-authorization/prior_authorizations.csv",
      },
      {
        label: "Download SQL analysis",
        description: "Access KPIs, payer performance, and drug-class value queries.",
        href: "/project-files/prior-authorization/prior_authorization_analysis.sql",
      },
      {
        label: "Download Excel workbook",
        description: "Access dashboard, formula logic, charts, and raw data.",
        href: "/downloads/Cierra_Healthcare_Analytics_Portfolio_Workbook.xlsx",
      },
    ],
  },
};

export const projectOrder: ProjectKind[] = [
  "revenue-cycle",
  "claims-denials",
  "pharmacy-operations",
  "prior-authorization",
];
