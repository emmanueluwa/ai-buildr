import { Prisma } from "@prisma/client";
import { MealplanValues } from "./validation";

export interface EditorFormProps {
  resumeData: MealplanValues;
  setResumeData: (data: MealplanValues) => void;
}

export const mealplanDataInclude = {
  LifestyleHealth: true,
  Goal: true,
} satisfies Prisma.MealPlanInclude;

export type MealplanServerData = Prisma.MealPlanGetPayload<{
  include: typeof mealplanDataInclude;
}>;
