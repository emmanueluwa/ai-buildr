"use server";

import prisma from "@/lib/prisma";
import { resumeSchema, ResumeValues } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { del, put } from "@vercel/blob";
import exp from "constants";
import { access } from "fs";
import path from "path";

export async function saveResume(values: ResumeValues) {
  const { id } = values;

  console.log("received vals", values);

  const { photo, workExperience, education, ...resumeValues } =
    resumeSchema.parse(values);

  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  //   todo: check resume count for non-premium users

  const existingResume = id
    ? await prisma.resume.findUnique({ where: { id, userId } })
    : null;

  if (id && !existingResume) {
    throw new Error("Resume not found");
  }

  //   undefined = no photo uploaded , null = deleting current photo
  let newPhotoUrl: string | undefined | null = undefined;

  if (photo instanceof File) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }

    const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
      //urls not guessable, url needed to find user image
      access: "public",
    });

    newPhotoUrl = blob.url;
  } else if (photo === null) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }
    newPhotoUrl = null;
  }

  //save changes to db
  if (id) {
    return prisma.resume.update({
      where: { id },
      data: {
        ...resumeValues,
        photoUrl: newPhotoUrl,
        WorkExperience: {
          deleteMany: {},
          create: workExperience?.map((experience) => ({
            ...experience,
            startDate: experience.startDate
              ? new Date(experience.startDate)
              : undefined,
            endDate: experience.endDate
              ? new Date(experience.endDate)
              : undefined,
          })),
        },
        Education: {
          deleteMany: {},
          create: education?.map((education) => ({
            ...education,
            startDate: education.startDate
              ? new Date(education.startDate)
              : undefined,
            endDate: education.endDate
              ? new Date(education.endDate)
              : undefined,
          })),
        },
        updatedAt: new Date(),
      },
    });
  } else {
    return prisma.resume.create({
      data: {
        ...resumeValues,
        userId,
        photoUrl: newPhotoUrl,
        WorkExperience: {
          create: workExperience?.map((experience) => ({
            ...experience,
            startDate: experience.startDate
              ? new Date(experience.startDate)
              : undefined,
            endDate: experience.endDate
              ? new Date(experience.endDate)
              : undefined,
          })),
        },
        Education: {
          create: education?.map((education) => ({
            ...education,
            startDate: education.startDate
              ? new Date(education.startDate)
              : undefined,
            endDate: education.endDate
              ? new Date(education.endDate)
              : undefined,
          })),
        },
      },
    });
  }
}
