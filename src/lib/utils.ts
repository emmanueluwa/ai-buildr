import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ResumeServerData } from "./types";
import { ResumeValues } from "./validation";

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

export function mapToResumeValues(data: ResumeServerData): ResumeValues {
  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    photo: data.photoUrl || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    jobTitle: data.jobTitle || undefined,
    city: data.city || undefined,
    country: data.country || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
    workExperience: data.WorkExperience.map((experience) => ({
      description: experience.description || undefined,
      position: experience.position || undefined,
      company: experience.company || undefined,
      endDate: experience.endDate?.toISOString().split("T")[0] || undefined,
      startDate: experience.startDate?.toISOString().split("T")[0] || undefined,
    })),
    education: data.Education.map((education) => ({
      position: education.degree || undefined,
      company: education.school || undefined,
      endDate: education.endDate?.toISOString().split("T")[0] || undefined,
      startDate: education.startDate?.toISOString().split("T")[0] || undefined,
    })),
    skills: data.Skills,
    borderStyle: data.borderStyle,
    colorHex: data.colorHex,
    summary: data.summary || undefined,
  };
}
