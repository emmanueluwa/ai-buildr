import { Prisma } from "@prisma/client";
import { ResumeValues } from "./validation";

export interface EditorFormProps {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
}

export const mealplanDataInclude = {
  LifestyleHealth: true,
  Goal: true,
} satisfies Prisma.MealPlanInclude;

export type MealplanServerData = Prisma.MealPlanGetPayload<{
  include: typeof mealplanDataInclude;
}>;
