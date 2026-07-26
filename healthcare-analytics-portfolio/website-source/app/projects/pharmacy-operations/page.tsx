import type { Metadata } from "next";
import { ProjectDetail } from "@/app/components/ProjectDetail";

export const metadata: Metadata = {
  title: "Pharmacy Operations Dashboard | Cierra Reynolds",
  description:
    "Interactive pharmacy operations case study covering turnaround, on-time reliability, workflow exceptions, and location performance.",
};

export default function PharmacyOperationsPage() {
  return <ProjectDetail kind="pharmacy-operations" />;
}
