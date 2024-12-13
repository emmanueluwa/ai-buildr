import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MealplanServerData } from "./types";
import { MealplanValues } from "./validation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fileReplacer(key: unknown, value: unknown) {
  return value instanceof File
    ? {
        name: value.name,
        size: value.size,
        type: value.type,
        lastModified: value.lastModified,
      }
    : value;
}

export function mapToMealplanValues(data: MealplanServerData): MealplanValues {
  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    photo: data.photoUrl || undefined,
    name: data.name || undefined,
    breed: data.breed || undefined,
    age: data.age || undefined,
    weight: data.weight || undefined,
    sex: data.sex || undefined,
    lifestyleHealth: data.LifestyleHealth.map((lifestyle) => ({
      activity: lifestyle.activity || undefined,
      health: lifestyle.health || undefined,
      diet: lifestyle.diet || undefined,
      description: lifestyle.description || undefined,
    })),
    goal: data.Goal.map((goal) => ({
      goal: goal.goal || undefined,
      budget: goal.budget || undefined,
      preferred_source: goal.preferred_source || undefined,
    })),
    feedingPreferences: data.FeedingPreferences,
    borderStyle: data.borderStyle,
    colorHex: data.colorHex,
    summary: data.summary || undefined,
  };
}
