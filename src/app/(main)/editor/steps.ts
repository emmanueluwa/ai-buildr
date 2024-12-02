import GeneralInfoForm from "./forms/GeneralInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";

export const steps: {
  title: string;
  component: React.ComponentType;
  key: string;
}[] = [
  { title: "General", component: GeneralInfoForm, key: "general-info" },
  { title: "Personal", component: PersonalInfoForm, key: "personal-info" },
];
