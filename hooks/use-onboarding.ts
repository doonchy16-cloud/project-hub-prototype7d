import { useMemo, useState, type ChangeEvent } from "react";
import { useLocalStorageState } from "@/hooks/use-local-storage-state";
import { AVATAR_PRESETS, LOCATION_DATA } from "@/lib/seed-data";
import { EMPTY_MATCHING_PROFILE } from "@/lib/prototype-constants";
import { deriveInitials, presetFromId } from "@/lib/prototype-utils";
import type { MatchingProfile, PlanKey } from "@/types/prototype";

export function useOnboarding() {
  const [fullName, setFullName] = useLocalStorageState("prototype7:fullName", "");
  const [email, setEmail] = useLocalStorageState("prototype7:email", "");
  const [phone, setPhone] = useLocalStorageState("prototype7:phone", "");
  const [matchingProfile, setMatchingProfile] = useLocalStorageState<MatchingProfile>("prototype7:matchingProfile", EMPTY_MATCHING_PROFILE);
  const [avatarType, setAvatarType] = useLocalStorageState<"preset" | "upload">("prototype7:avatarType", "preset");
  const [selectedAvatarPresetId, setSelectedAvatarPresetId] = useLocalStorageState("prototype7:selectedAvatarPresetId", AVATAR_PRESETS[0]?.id ?? "");
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useLocalStorageState<string | undefined>("prototype7:uploadedAvatarUrl", undefined);
  const [selectedContinent, setSelectedContinent] = useLocalStorageState("prototype7:selectedContinent", "");
  const [selectedCountry, setSelectedCountry] = useLocalStorageState("prototype7:selectedCountry", "");
  const [selectedRegion, setSelectedRegion] = useLocalStorageState("prototype7:selectedRegion", "");
  const [selectedCity, setSelectedCity] = useLocalStorageState("prototype7:selectedCity", "");
  const [selectedPlan, setSelectedPlan] = useLocalStorageState<PlanKey | "">("prototype7:selectedPlan", "");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  const normalizedMatchingProfile = useMemo<MatchingProfile>(() => {
    const profile = matchingProfile && typeof matchingProfile === "object" ? matchingProfile : EMPTY_MATCHING_PROFILE;

    return {
      ...EMPTY_MATCHING_PROFILE,
      ...profile,
      skillsOfferedIds: Array.isArray(profile.skillsOfferedIds) ? profile.skillsOfferedIds : [],
    };
  }, [matchingProfile]);

  const selectedPreset = presetFromId(selectedAvatarPresetId);

  const currentUser = useMemo(() => {
    const initials = deriveInitials(fullName || email || "User");
    return {
      id: "current-user",
      fullName: fullName || "Prototype user",
      email,
      phone,
      avatarLabel: avatarType === "preset" ? selectedPreset?.emoji || initials : initials,
      avatarGradient:
        avatarType === "preset"
          ? selectedPreset?.gradient || "from-slate-400 to-slate-600"
          : "from-sky-500 to-indigo-600",
      avatarUploadUrl: avatarType === "upload" ? uploadedAvatarUrl : undefined,
      online: true,
    };
  }, [avatarType, email, fullName, phone, selectedPreset, uploadedAvatarUrl]);

  const countriesForSelectedContinent = useMemo(() => {
    if (!selectedContinent || !LOCATION_DATA[selectedContinent]) return [];
    return Object.keys(LOCATION_DATA[selectedContinent]).sort();
  }, [selectedContinent]);

  const selectedCountryData = useMemo(() => {
    if (!selectedContinent || !selectedCountry) return null;
    return LOCATION_DATA[selectedContinent]?.[selectedCountry] ?? null;
  }, [selectedContinent, selectedCountry]);

  const regionsForSelectedCountry = useMemo(() => {
    if (!selectedCountryData) return [];
    return selectedCountryData.regions.map((region) => region.name);
  }, [selectedCountryData]);

  const selectedRegionData = useMemo(() => {
    if (!selectedCountryData || !selectedRegion) return null;
    return selectedCountryData.regions.find((region) => region.name === selectedRegion) ?? null;
  }, [selectedCountryData, selectedRegion]);

  const citiesForSelectedRegion = useMemo(() => selectedRegionData?.cities ?? [], [selectedRegionData]);
  const regionLabel = selectedCountryData?.regionLabel || "State / Province / Region";
  const cityLabel = selectedCountryData?.cityLabel || "City";

  const currentLocation = useMemo(() => {
    if (!selectedCity || !selectedRegion || !selectedCountry || !selectedContinent) return "";
    return `${selectedCity}, ${selectedRegion}, ${selectedCountry}, ${selectedContinent}`;
  }, [selectedCity, selectedRegion, selectedCountry, selectedContinent]);

  const signInProfileReady =
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    selectedContinent !== "" &&
    selectedCountry !== "" &&
    selectedRegion !== "" &&
    selectedCity !== "" &&
    ((avatarType === "preset" && !!selectedAvatarPresetId) || (avatarType === "upload" && !!uploadedAvatarUrl));

  const planLabel = useMemo(() => {
    if (selectedPlan === "starter") return "Starter Plan - $1";
    if (selectedPlan === "pro") return "Pro Plan - $10/month";
    if (selectedPlan === "skip") return "Skip for now - prototype access";
    return "No plan selected";
  }, [selectedPlan]);

  const updateMatchingProfile = <Key extends keyof MatchingProfile>(key: Key, value: MatchingProfile[Key]) => {
    setMatchingProfile((prev) => {
      const profile = prev && typeof prev === "object" ? prev : EMPTY_MATCHING_PROFILE;
      return { ...EMPTY_MATCHING_PROFILE, ...profile, [key]: value };
    });
  };

  const toggleUserSkill = (skillId: string) => {
    setMatchingProfile((prev) => {
      const profile = prev && typeof prev === "object" ? prev : EMPTY_MATCHING_PROFILE;
      const skillsOfferedIds = Array.isArray(profile.skillsOfferedIds) ? profile.skillsOfferedIds : [];
      const exists = skillsOfferedIds.includes(skillId);
      return {
        ...EMPTY_MATCHING_PROFILE,
        ...profile,
        skillsOfferedIds: exists
          ? skillsOfferedIds.filter((id) => id !== skillId)
          : [...skillsOfferedIds, skillId],
      };
    });
  };

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setUploadedAvatarUrl(reader.result);
        setAvatarType("upload");
      }
    };
    reader.readAsDataURL(file);
  };

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    phone,
    setPhone,
    matchingProfile: normalizedMatchingProfile,
    setMatchingProfile,
    updateMatchingProfile,
    toggleUserSkill,
    avatarType,
    setAvatarType,
    selectedAvatarPresetId,
    setSelectedAvatarPresetId,
    uploadedAvatarUrl,
    setUploadedAvatarUrl,
    selectedContinent,
    setSelectedContinent,
    selectedCountry,
    setSelectedCountry,
    selectedRegion,
    setSelectedRegion,
    selectedCity,
    setSelectedCity,
    selectedPlan,
    setSelectedPlan,
    cardName,
    setCardName,
    cardNumber,
    setCardNumber,
    expiry,
    setExpiry,
    cvc,
    setCvc,
    billingAddress,
    setBillingAddress,
    selectedPreset,
    currentUser,
    countriesForSelectedContinent,
    regionsForSelectedCountry,
    citiesForSelectedRegion,
    regionLabel,
    cityLabel,
    currentLocation,
    signInProfileReady,
    planLabel,
    handleAvatarUpload,
  };
}
