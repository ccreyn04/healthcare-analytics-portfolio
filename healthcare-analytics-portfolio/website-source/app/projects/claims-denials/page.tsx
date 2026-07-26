import type { Metadata } from "next";
import { ProjectDetail } from "@/app/components/ProjectDetail";

export const metadata: Metadata = {
  title: "Claims Denial Root-Cause Analysis | Cierra Reynolds",
  description:
    "Interactive claims denial case study ranking root causes by rate, financial exposure, payer, service line, and aging.",
};

export default function ClaimsDenialsPage() {
  return <ProjectDetail kind="claims-denials" />;
}
