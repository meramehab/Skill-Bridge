"use client";
import React from "react";
import { useParams } from "next/navigation";
import ProjectDetailsLogicView from "../../../views/logic/ProjectDetailsLogicView";

export default function ProjectDetailsPage() {
  const params = useParams();
  return <ProjectDetailsLogicView projectId={params?.id} />;
}
