import { z } from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));

export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
});

export type GeneralInfoValues = z.infer<typeof generalInfoSchema>;

export const backgroundInfoSchema = z.object({
  photo: z
    .custom<File | undefined>()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "Must be an image",
    )
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 4,
      "File must be less than 4MB",
    ),
  name: optionalString,
  breed: optionalString,
  age: optionalString,
  weight: optionalString,
  sex: optionalString,
});

export type BackgroundInfoValues = z.infer<typeof backgroundInfoSchema>;

export const lifestyleHealthSchema = z.object({
  lifestyleHealth: z
    .array(
      z.object({
        activity: optionalString,
        health: optionalString,
        diet: optionalString,
        description: optionalString,
      }),
    )
    .optional(),
});

export type LifestyleHealthValues = z.infer<typeof lifestyleHealthSchema>;

//reach into schema for type of inner object
export type LifestyleHealth = NonNullable<
  z.infer<typeof lifestyleHealthSchema>["lifestyleHealth"]
>[number];

export const goalSchema = z.object({
  goal: z
    .array(
      z.object({
        goal: optionalString,
        budget: optionalString,
        preferred_source: optionalString,
      }),
    )
    .optional(),
});

export type GoalValues = z.infer<typeof goalSchema>;

export const feedingPreferencesSchema = z.object({
  feedingPreferences: z.array(z.string().trim()).optional(),
});

export type FeedingPreferencesValues = z.infer<typeof feedingPreferencesSchema>;

export const summarySchema = z.object({
  summary: optionalString,
});

export type SummaryValues = z.infer<typeof summarySchema>;

export const mealplanSchema = z.object({
  ...generalInfoSchema.shape,
  ...backgroundInfoSchema.shape,
  ...lifestyleHealthSchema.shape,
  ...goalSchema.shape,
  ...feedingPreferencesSchema.shape,
  ...summarySchema.shape,
  colorHex: optionalString,
  borderStyle: optionalString,
});

export type MealplanValues = Omit<z.infer<typeof mealplanSchema>, "photo"> & {
  id?: string;
  photo?: File | string | null;
};

export const generateWorkExperienceSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Required")
    .min(20, "Must be at least 20 characters"),
});

export type GenerateWorkExperienceInput = z.infer<
  typeof generateWorkExperienceSchema
>;

export const generateSummarySchema = z.object({
  jobTitle: optionalString,
  ...backgroundInfoSchema.shape,
  ...lifestyleHealthSchema.shape,
  ...goalSchema.shape,
  ...feedingPreferencesSchema.shape,
  ...summarySchema.shape,
});

export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>;
