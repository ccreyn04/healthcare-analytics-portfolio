import type { Metadata } from "next";
import { ProjectDetail } from "@/app/components/ProjectDetail";

export const metadata: Metadata = {
  title: "Prior Authorization Access Dashboard | Cierra Reynolds",
  description:
    "Interactive prior authorization case study covering approvals, active backlog, aging, payer variation, and simulated savings protected.",
};

export default function PriorAuthorizationPage() {
  return <ProjectDetail kind="prior-authorization" />;
}
