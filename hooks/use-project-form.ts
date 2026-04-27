import { useMemo, useState } from "react";
import { LOCATION_DATA, myProjectCategories } from "@/lib/seed-data";
import {
  EMPTY_USER_PROJECT_FORM,
  formatProjectLocation,
  inferContinentFromCountry,
  type UserProjectForm,
} from "@/lib/prototype-constants";

export function useProjectForm() {
  const [projectForm, setProjectForm] = useState<UserProjectForm>(EMPTY_USER_PROJECT_FORM);

  const projectCountryOptions = useMemo(() => {
    const countries = Object.values(LOCATION_DATA).flatMap((continentCountries) => Object.keys(continentCountries));
    return Array.from(new Set(countries)).sort();
  }, []);

  const projectContinent = useMemo(() => inferContinentFromCountry(projectForm.country), [projectForm.country]);

  const projectCountryData = useMemo(() => {
    if (!projectForm.country || !projectContinent) return null;
    return LOCATION_DATA[projectContinent]?.[projectForm.country] ?? null;
  }, [projectForm.country, projectContinent]);

  const projectRegionOptions = useMemo(() => {
    if (!projectCountryData) return [];
    return projectCountryData.regions.map((region) => region.name);
  }, [projectCountryData]);

  const projectRegionData = useMemo(() => {
    if (!projectCountryData || !projectForm.region) return null;
    return projectCountryData.regions.find((region) => region.name === projectForm.region) ?? null;
  }, [projectCountryData, projectForm.region]);

  const projectCityOptions = useMemo(() => projectRegionData?.cities ?? [], [projectRegionData]);
  const projectRegionLabel = projectCountryData?.regionLabel || "State / Province / Region";
  const projectCityLabel = projectCountryData?.cityLabel || "City";
  const derivedProjectLocation = useMemo(
    () => formatProjectLocation(projectForm.city, projectForm.region, projectForm.country, projectContinent),
    [projectForm.city, projectForm.country, projectForm.region, projectContinent]
  );

  const projectFormReady =
    projectForm.title.trim() !== "" &&
    projectForm.country !== "" &&
    projectForm.region !== "" &&
    projectForm.city !== "" &&
    projectContinent !== "" &&
    projectForm.description.trim() !== "";

  const setProjectCategory = (category: string) => {
    if (!myProjectCategories.includes(category as UserProjectForm["category"])) return;
    setProjectForm((prev) => ({ ...prev, category: category as UserProjectForm["category"] }));
  };

  const toggleProjectNeededSkill = (skillId: string) => {
    setProjectForm((prev) => {
      const exists = prev.neededSkillIds.includes(skillId);
      return {
        ...prev,
        neededSkillIds: exists
          ? prev.neededSkillIds.filter((id) => id !== skillId)
          : [...prev.neededSkillIds, skillId],
      };
    });
  };

  const resetProjectForm = () => setProjectForm(EMPTY_USER_PROJECT_FORM);

  return {
    projectForm,
    setProjectForm,
    setProjectCategory,
    toggleProjectNeededSkill,
    resetProjectForm,
    projectCountryOptions,
    projectContinent,
    projectRegionOptions,
    projectCityOptions,
    projectRegionLabel,
    projectCityLabel,
    derivedProjectLocation,
    projectFormReady,
  };
}
