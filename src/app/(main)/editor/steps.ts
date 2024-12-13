import { EditorFormProps } from "@/lib/types";
import GeneralInfoForm from "./forms/GeneralInfoForm";
import BackgroundInfoForm from "./forms/BackgroundInfoForm";
import LifestyleHealthForm from "./forms/LifestyleHealth";
import FeedingPreferencesForm from "./forms/FeedingPreferenceForm";
import SummaryForm from "./forms/SummaryForm";
import GoalForm from "./forms/GoalForm";

export const steps: {
  title: string;
  component: React.ComponentType<EditorFormProps>;
  key: string;
}[] = [
  { title: "General", component: GeneralInfoForm, key: "general-info" },
  {
    title: "Background",
    component: BackgroundInfoForm,
    key: "background-info",
  },
  {
    title: "Lifestyle Health",
    component: LifestyleHealthForm,
    key: "lifestyle-info",
  },
  {
    title: "Goal",
    component: GoalForm,
    key: "goal",
  },
  {
    title: "Feeding Preferences",
    component: FeedingPreferencesForm,
    key: "feedingPreferences",
  },
  { title: "Summary", component: SummaryForm, key: "summary" },
];
