import { useState } from "react";
import type { Project } from "@/types/prototype";

export function useMapState() {
  const [fullscreenMapOpen, setFullscreenMapOpen] = useState(false);
  const [activeMapProject, setActiveMapProject] = useState<Project | null>(null);

  return {
    fullscreenMapOpen,
    setFullscreenMapOpen,
    activeMapProject,
    setActiveMapProject,
  };
}
