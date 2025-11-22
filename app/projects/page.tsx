import { ProjectsPageClient } from "@/components/projects-page-client"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects Dashboard",
  description: "Manage and track your project progress",
}

export default function ProjectsPage() {
  return <ProjectsPageClient />
}