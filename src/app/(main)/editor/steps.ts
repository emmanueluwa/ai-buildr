import { EditorFormProps } from "@/lib/types";
import GeneralInfoForm from "./forms/GeneralInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import WorkExperienceForm from "./forms/WorkExperienceForm";

export const steps: {
  title: string;
  component: React.ComponentType<EditorFormProps>;
  key: string;
}[] = [
  { title: "General", component: GeneralInfoForm, key: "general-info" },
  { title: "Personal", component: PersonalInfoForm, key: "personal-info" },
  {
    title: "WorkExperience",
    component: WorkExperienceForm,
    key: "workexp-info",
  },
];
