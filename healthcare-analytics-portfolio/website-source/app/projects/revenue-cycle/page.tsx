import type { Metadata } from "next";
import { ProjectDetail } from "@/app/components/ProjectDetail";

export const metadata: Metadata = {
  title: "Revenue Cycle Executive Dashboard | Cierra Reynolds",
  description:
    "Interactive revenue cycle portfolio case study covering cash capture, denials, payer variation, and accounts-receivable risk.",
};

export default function RevenueCyclePage() {
  return <ProjectDetail kind="revenue-cycle" />;
}
